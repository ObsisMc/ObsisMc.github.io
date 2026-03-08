import { defineCollection, z } from 'astro:content';

const postSchema = z.object({
  title: z.string(),
  date: z.coerce.date(),
  tags: z.array(z.string()).optional().default([]),
  excerpt: z.string().optional(),
  path_name: z.string().optional(),
  categories: z.array(z.string()).optional().default([]),
  tag: z.any().optional(),
  draft: z.boolean().optional().default(false),
});

const blog = defineCollection({ type: 'content', schema: postSchema });
const notes = defineCollection({ type: 'content', schema: postSchema });
const drafts = defineCollection({ type: 'content', schema: postSchema });

export const collections = { blog, notes, drafts };
