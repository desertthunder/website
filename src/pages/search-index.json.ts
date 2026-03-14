/**
 * Generates a static JSON search index at build time.
 *
 * Indexes blog posts (from Leaflet/AT Protocol), projects, bookmarks,
 * and work experience so they can be searched client-side.
 */

import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import experienceData from "../content/data/experience.json";

export type SearchEntry = {
  type: "blog" | "project" | "bookmark" | "experience";
  title: string;
  description: string;
  url: string;
  body: string;
  date?: string;
  tags?: string[];
};

/** Strip HTML tags and collapse whitespace */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

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
  for (const project of projects) {
    entries.push({
      type: "project",
      title: project.data.title,
      description: project.data.description,
      url: `/projects/${project.id}`,
      body: project.body ? stripHtml(project.body) : "",
      tags: project.data.tags,
    });
  }

  const bookmarks = await getCollection("bookmarks");
  for (const bookmark of bookmarks) {
    entries.push({
      type: "bookmark",
      title: bookmark.data.title,
      description: "",
      url: `/bookmarks/${bookmark.id}`,
      body: bookmark.body ? stripHtml(bookmark.body) : "",
      tags: bookmark.data.tags,
    });
  }

  for (const job of experienceData.experience) {
    const j = job as Record<string, unknown>;
    const highlights = (j.highlights as string[]) || [];
    entries.push({
      type: "experience",
      title: `${j.role} at ${j.company || j.name}`,
      description: (j.description as string) || "",
      url: "/experience",
      body: highlights.join(" "),
      tags: (j.technologies as string[]) || [],
    });
  }

  return new Response(JSON.stringify(entries), { headers: { "Content-Type": "application/json" } });
};

export const prerender = true;
