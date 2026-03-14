import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blogCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({ title: z.string(), date: z.date(), summary: z.string(), tags: z.array(z.string()) }),
});

const bookmarksCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/bookmarks" }),
  schema: z.object({
    title: z.string(),
    url: z.string().url(),
    date: z.coerce.date(),
    categories: z.array(z.string()).default([]),
  }),
});

const projectsCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    repo: z.string().url(),
    link: z.optional(z.string().url()),
    status: z.string(),
    tech: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    date: z.coerce.date(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { blog: blogCollection, bookmarks: bookmarksCollection, projects: projectsCollection };
