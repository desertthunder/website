import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const bookmarks = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    url: z.string().url(),
    date: z.coerce.date(),
    categories: z.array(z.string()).default([]),
  }),
});

const projects = defineCollection({
  type: "content",
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

const pages = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    path: z.string(),
    showInNav: z.boolean().default(false),
    navLabel: z.string().optional(),
    navOrder: z.number().optional(),
    ogImage: z.string().optional(),
  }),
});

export const collections = { blog, bookmarks, projects, pages };
