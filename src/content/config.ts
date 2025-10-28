import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const bookmarks = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    url: z.string().url(),
    date: z.coerce.date(),
    categories: z.array(z.string()).default([]),
  }),
});

const pages = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    permalink: z.string().optional(),
  }),
});

export const collections = {
  blog,
  bookmarks,
  pages,
};
