/**
 * RSS feed for `~/blog/` at `/blog/feed.xml`. The `site` (from SITE.url) is
 * required; without it this endpoint throws at build time — by design.
 */
import { getCollection } from "astro:content";
import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { SITE } from "../../site.config.ts";

export async function GET(context: APIContext) {
  const posts = await getCollection("blog");
  const sorted = [...posts].sort((a, b) => b.data.published.getTime() - a.data.published.getTime());
  return rss({
    title: `~/blog — ${SITE.name}`,
    description: `Articles & notes by ${SITE.name}.`,
    site: context.site ?? "",
    items: sorted.map((post) => ({
      title: post.data.title,
      description: post.data.summary,
      pubDate: post.data.published,
      link: `/blog/${post.id}/`,
    })),
  });
}
