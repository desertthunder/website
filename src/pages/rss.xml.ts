import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";

const SITE_TITLE = "Owais Jamil - Desert Thunder";
const SITE_DESCRIPTION = "Personal blog and projects by Owais Jamil";

export async function GET(context: APIContext) {
  const posts = await getCollection("blog");
  const recentPosts = posts.slice(0, 20);

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site || new URL("https://desertthunder.dev"),
    items: recentPosts.map((post) => ({
      title: post.data.title || "Untitled",
      description: post.data.description || "",
      pubDate: new Date(post.data.date),
      link: `/blog/${post.data.leafletRkey}/`,
    })),
    customData: `<language>en-us</language>`,
  });
}

export const prerender = true;
