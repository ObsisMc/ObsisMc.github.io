import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { getPostSlug } from '../utils/slug';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = (await getCollection('blog'))
    .filter(p => p.id.startsWith('zh/'))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  return rss({
    title: '白夜書簡',
    description: 'Systems, Data, Code, and Ideas',
    site: context.site!,
    items: posts.map(post => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.excerpt ?? '',
      link: `/blog/${getPostSlug(post)}/`,
    })),
  });
}
