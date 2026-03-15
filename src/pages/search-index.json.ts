/**
 * Generates a static JSON search index at build time.
 *
 * Indexes blog posts (from Leaflet/AT Protocol), projects, bookmarks,
 * and work experience so they can be searched client-side.
 */

import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import experienceData from "$/content/data/experience.json";
import { stripHtml } from "$/lib/clean-utils";

type EntryKind = "blog" | "project" | "bookmark" | "experience";

export type SearchEntry = {
  type: EntryKind;
  title: string;
  description: string;
  url: string;
  body: string;
  date?: string;
  tags?: string[];
};

/** Extract plaintext from Leaflet blocks */
function extractLeafletText(doc: Record<string, unknown>): string {
  const parts: string[] = [];
  const content = doc.content as { pages?: Array<{ blocks?: Array<{ block?: Record<string, unknown> }> }> } | undefined;
  const pages = content?.pages ?? [];
  for (const page of pages) {
    for (const wrapper of page.blocks ?? []) {
      const block = wrapper.block;
      if (!block) continue;
      const plaintext = block.plaintext as string | undefined;
      if (plaintext) parts.push(plaintext);

      const children = block.children as Array<{ content?: { plaintext?: string }; children?: unknown[] }> | undefined;
      if (children) {
        const walk = (items: Array<{ content?: { plaintext?: string }; children?: unknown[] }>) => {
          for (const item of items) {
            if (item.content?.plaintext) parts.push(item.content.plaintext);
            if (Array.isArray(item.children)) walk(item.children as typeof items);
          }
        };
        walk(children);
      }
    }
  }
  return parts.join(" ");
}

export const GET: APIRoute = async () => {
  const entries: SearchEntry[] = [];

  const blogPosts = await getCollection("blog");
  for (const post of blogPosts) {
    const doc = JSON.parse(post.body || "{}");
    const body = extractLeafletText(doc);
    entries.push({
      type: "blog",
      title: post.data.title,
      description: post.data.description || "",
      url: `/blog/${post.id}`,
      body,
      date: post.data.publishedAt,
      tags: post.data.tags,
    });
  }

  const projects = await getCollection("projects");
  for (const { id, data, body } of projects) {
    const { title, description, tags } = data;
    entries.push({ type: "project", title, description, url: `/projects/${id}`, body: stripHtml(body), tags });
  }

  const bookmarks = await getCollection("bookmarks");
  for (const { body, data, id } of bookmarks) {
    const { title, tags } = data;
    entries.push({ type: "bookmark", title, description: "", url: `/bookmarks/${id}`, body: stripHtml(body), tags });
  }

  for (const j of experienceData.experience) {
    const body = ((j.highlights as string[]) ?? []).join(" ");
    const tags = j.technologies ?? [];
    const title = `${j.role} at ${j.company}`;
    const description = j.description ?? "";
    entries.push({ type: "experience", title, url: "/experience", description, body, tags });
  }

  return new Response(JSON.stringify(entries), { headers: { "Content-Type": "application/json" } });
};

export const prerender = true;
