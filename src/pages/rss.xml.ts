import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE } from '../config';
import { getPosts, postSlug } from '../lib/posts';
import { withBase } from '../lib/urls';

export async function GET(context: APIContext) {
  const posts = await getPosts();
  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishDate,
      link: withBase(`/posts/${postSlug(post)}/`),
      categories: post.data.tags,
    })),
    customData: '<language>zh-CN</language>',
  });
}
