/**
 * Hybrid RSS feed endpoint
 *
 * Generates RSS feed from both local and Leaflet posts.
 * Prerendered at build time, dynamically generated in dev.
 */
import rss from "@astrojs/rss";
import { loadHybridBlog } from "$lib/content-loader";
import type { APIContext } from "astro";

const SITE_TITLE = "Owais Jamil - Desert Thunder";
const SITE_DESCRIPTION = "Personal blog and projects by Owais Jamil";

export async function GET(context: APIContext) {
  const posts = await loadHybridBlog("desertthunder.dev");
  const recentPosts = posts.slice(0, 20);

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site || new URL("https://desertthunder.dev"),
    items: recentPosts.map((post) => ({
      title: post.title || "Untitled",
      description: post.description || "",
      pubDate: new Date(post.date),
      link: `/blog/${post.slug}/`,
    })),
    customData: `<language>en-us</language>`,
  });
}

export const prerender = true;
