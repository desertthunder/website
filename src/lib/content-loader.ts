/**
 * Blog content loader for Leaflet AT Protocol integration
 *
 * Fetches blog posts from AT Protocol using the Leaflet format.
 */

import type { Loader, LoaderContext } from "astro/loaders";
import { fetchLeafletPosts, extractRkey, type LeafletDocument } from "./leaflet";

/**
 * Creates a Leaflet loader that fetches blog posts from AT Protocol
 *
 * @param handle - The Bluesky handle to fetch posts from
 * @returns A Loader instance for Astro content collections
 */
export function leafletLoader(handle: string): Loader {
  return {
    name: "leaflet-loader",
    async load(context: LoaderContext): Promise<void> {
      const { store, logger } = context;

      logger.info(`Fetching Leaflet posts for ${handle}...`);

      try {
        const records = await fetchLeafletPosts(handle);

        for (const record of records) {
          const doc = record.value as LeafletDocument;
          const rkey = extractRkey(record.uri);

          store.set({
            id: rkey,
            data: {
              id: rkey,
              title: doc.title,
              description: doc.description,
              date: new Date(doc.publishedAt),
              publishedAt: doc.publishedAt,
              atUri: record.uri,
              leafletRkey: rkey,
              tags: doc.tags || [],
            },
            body: JSON.stringify(doc),
            filePath: `leaflet://${record.uri}`,
          });
        }

        logger.info(`Loaded ${records.length} Leaflet posts`);
      } catch (error) {
        logger.error(`Failed to load Leaflet posts: ${error}`);
        logger.warn("empty collection - continuing build");
      }
    },
  };
}
