import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).optional().default([]),
    excerpt: z.string().optional(),
    path_name: z.string().optional(),
    // Hexo legacy fields — ignored but present in migrated posts
    categories: z.any().optional(),
    tag: z.any().optional(),
  }),
});

export const collections = { blog };
