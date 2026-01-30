/**
 * Hybrid blog content loader
 *
 * Merges local markdown blog posts with Leaflet posts from AT Protocol at build time.
 * Handles deduplication, sorting, and transformation.
 */

import { getCollection } from "astro:content";
import { fetchLeafletPosts, extractRkey, type AtprotoRecord } from "./leaflet";
import { transformLeafletToMarkdown } from "./leaflet-transform";
import { cacheLeafletImages } from "./leaflet-images";

/**
 * Hybrid blog post representation
 *
 * Combines fields from local posts and Leaflet posts into a unified interface for rendering in templates.
 */
export interface HybridPost {
  slug: string;
  title: string;
  description: string;
  date: Date;
  tags: string[];
  source: "local" | "leaflet";
  atUri?: string;
  leafletRkey?: string;
  content?: string;
}

/**
 * Loads and merges blog posts from all sources
 *
 * Fetches local posts from Astro content collection and Leaflet posts
 * from AT Protocol, then merges and sorts by date.
 *
 * @param handle - Bluesky handle for fetching Leaflet posts
 * @returns Unified blog posts sorted by date (newest first)
 */
export async function loadHybridBlog(handle: string): Promise<HybridPost[]> {
  const [localPosts, leafletRecords] = await Promise.all([
    getLocalPosts(),
    fetchLeafletPosts(handle).catch((error) => {
      console.warn("Failed to fetch Leaflet posts, continuing with local posts only:", error);
      return [] as AtprotoRecord[];
    }),
  ]);

  if (leafletRecords.length > 0) {
    await cacheLeafletImages(handle, leafletRecords);
  }

  const transformedLeaflet = await Promise.all(leafletRecords.map(transformRecordToHybridPost));
  const merged = deduplicatePosts([...localPosts, ...transformedLeaflet]);
  return merged.sort((a, b) => b.date.getTime() - a.date.getTime());
}

/**
 * Fetches local blog posts from Astro content collection
 *
 * Filters out draft posts and maps to HybridPost format.
 */
async function getLocalPosts(): Promise<HybridPost[]> {
  const posts = await getCollection("blog");

  return posts
    .filter((post) => !post.data.draft)
    .map((post) => ({
      slug: post.slug,
      title: post.data.title,
      description: post.data.description,
      date: post.data.date,
      tags: post.data.tags,
      source: (post.data.source as "local" | "leaflet") || "local",
      atUri: post.data.atUri,
      leafletRkey: post.data.leafletRkey,
    }));
}

/**
 * Transforms an AT Protocol record to HybridPost format
 *
 * Converts Leaflet document metadata and adds derived fields.
 *
 * @throws Error if the record cannot be transformed
 */
async function transformRecordToHybridPost(record: AtprotoRecord): Promise<HybridPost> {
  const doc = record.value;
  const rkey = extractRkey(record.uri);

  if (!doc.title) {
    throw new Error(`Leaflet document missing title at URI: ${record.uri}`);
  }

  if (!doc.publishedAt) {
    throw new Error(`Leaflet document "${doc.title}" missing publishedAt`);
  }

  const publishedDate = new Date(doc.publishedAt);
  if (isNaN(publishedDate.getTime())) {
    throw new Error(`Leaflet document "${doc.title}" has invalid publishedAt: ${doc.publishedAt}`);
  }

  if (!doc.pages || doc.pages.length === 0) {
    throw new Error(`Leaflet document "${doc.title}" has no pages`);
  }

  const content = await transformLeafletToMarkdown(doc, record.uri);
  const textToScan = `${doc.title} ${doc.description || ""}`;
  const tags = extractHashtags(textToScan);

  return {
    slug: `leaflet/${rkey}`,
    title: doc.title,
    description: doc.description || "",
    date: publishedDate,
    tags,
    source: "leaflet",
    atUri: record.uri,
    leafletRkey: rkey,
    content,
  };
}

/**
 * Deduplicates posts preferring local versions
 *
 * If a post exists in both sources with matching title and date
 * (within 24 hours), keeps the local version.
 *
 * @param posts - Posts to deduplicate
 * @returns Deduplicated posts
 */
function deduplicatePosts(posts: HybridPost[]): HybridPost[] {
  const seen = new Map<string, HybridPost>();

  for (const post of posts) {
    const key = `${post.title.toLowerCase()}-${post.date.toISOString().split("T")[0]}`;
    const existing = seen.get(key);

    if (!existing) {
      seen.set(key, post);
    } else if (post.source === "local" && existing.source === "leaflet") {
      seen.set(key, post);
    }
  }

  return Array.from(seen.values());
}

/**
 * Extracts hashtags from text for tag generation
 *
 * Parses hashtags like #javascript from the provided text
 * and returns them as a cleaned array without the # prefix.
 *
 * @param text - Text to extract hashtags from
 * @returns Array of hashtag names without the # prefix
 */
function extractHashtags(text: string): string[] {
  const hashtagRegex = /#(\w+)/g;
  const hashtags = new Set<string>();
  let match;

  while ((match = hashtagRegex.exec(text)) !== null) {
    const tag = match[1].toLowerCase();
    if (tag.length > 0) {
      hashtags.add(tag);
    }
  }

  return Array.from(hashtags);
}

/**
 * Loads a single Leaflet post by rkey
 *
 * Fetches the post from AT Protocol and transforms to HybridPost format.
 * Useful for generating individual post pages.
 *
 * @param handle - Bluesky handle
 * @param rkey - Record key of the post
 * @returns The post or null if not found
 */
export async function loadLeafletPost(handle: string, rkey: string): Promise<HybridPost | null> {
  try {
    const records = await fetchLeafletPosts(handle);
    const record = records.find((r) => extractRkey(r.uri) === rkey);

    if (!record) {
      return null;
    }

    return transformRecordToHybridPost(record);
  } catch (error) {
    console.error(`Failed to load Leaflet post ${rkey}:`, error);
    return null;
  }
}
