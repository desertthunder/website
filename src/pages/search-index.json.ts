/**
 * Search index API endpoint
 *
 * Generates search index from content collections.
 * Prerendered at build time, dynamically generated in dev.
 */
import { getCollection } from "astro:content";
import type { APIRoute } from "astro";

/**
 * Strip markdown formatting from content
 */
function stripMarkdown(text: string): string {
  return text
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/`(.+?)`/g, "$1")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

export const GET: APIRoute = async () => {
  const documents = [];

  const blogPosts = await getCollection("blog", ({ data }) => !data.draft);
  for (const post of blogPosts) {
    const text = stripMarkdown(post.body).slice(0, 500);
    documents.push({
      id: `blog:${post.slug}`,
      title: post.data.title,
      description: post.data.description,
      url: `/blog/${post.slug}`,
      type: "blog",
      text,
      tags: post.data.tags || [],
      categories: [],
    });
  }

  const bookmarks = await getCollection("bookmarks");
  for (const bookmark of bookmarks) {
    const text = stripMarkdown(bookmark.body).slice(0, 500);
    documents.push({
      id: `bookmarks:${bookmark.slug}`,
      title: bookmark.data.title,
      description: "",
      url: `/bookmarks/${bookmark.slug}`,
      type: "bookmarks",
      text,
      tags: [],
      categories: bookmark.data.categories || [],
    });
  }

  const projects = await getCollection("projects");
  for (const project of projects) {
    const text = stripMarkdown(project.body).slice(0, 500);
    documents.push({
      id: `projects:${project.slug}`,
      title: project.data.title,
      description: project.data.description,
      url: `/projects/${project.slug}`,
      type: "projects",
      text,
      tags: project.data.tags || [],
      categories: [],
    });
  }

  const pages = await getCollection("pages");
  for (const page of pages) {
    const text = stripMarkdown(page.body).slice(0, 500);
    documents.push({
      id: `pages:${page.slug}`,
      title: page.data.title,
      description: page.data.description,
      url: page.data.path,
      type: "pages",
      text,
      tags: [],
      categories: [],
    });
  }

  return new Response(JSON.stringify(documents), { status: 200, headers: { "Content-Type": "application/json" } });
};

export const prerender = true;
