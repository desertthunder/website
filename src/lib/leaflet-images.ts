/**
 * Leaflet image caching utilities
 *
 * Downloads and caches blob references from AT Protocol during build.
 * Images are stored in public/leaflet-images/ for static serving.
 */

import { AtpAgent } from "@atproto/api";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync, readdirSync } from "fs";
import type { BlockWrapper } from "./leaflet";

/**
 * Cache directory for Leaflet images
 */
const CACHE_DIR = "public/leaflet-images";

/**
 * MIME type to file extension mapping
 */
const MIME_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
  "image/webp": "webp",
  "image/svg+xml": "svg",
};

/**
 * Cached image entry
 */
export type CachedImage = { blobCid: string; filename: string; url: string; mimeType: string };

/**
 * Ensures the cache directory exists
 *
 * Creates public/leaflet-images/ if it doesn't exist.
 */
async function ensureCacheDir(): Promise<void> {
  try {
    await mkdir(CACHE_DIR, { recursive: true });
  } catch (error) {
    console.error("Failed to create cache directory:", error);
    throw error;
  }
}

/**
 * Gets file extension from MIME type
 *
 * @param mimeType - The MIME type of the image
 * @returns File extension (default: jpg)
 */
export const getExtensionForMime = (mimeType: string): string => MIME_EXTENSIONS[mimeType] || "jpg";

/**
 * Checks if an image is already cached
 *
 * @param blobCid - The blob CID to check
 * @returns True if cached, false otherwise
 */
export function isImageCached(blobCid: string): boolean {
  try {
    if (!existsSync(CACHE_DIR)) {
      return false;
    }
    const files = readdirSync(CACHE_DIR);
    return files.some((file: string) => file.startsWith(blobCid));
  } catch {
    return false;
  }
}

/**
 * Gets the cached URL for a blob
 *
 * @param blobCid - The blob CID
 * @param mimeType - Optional MIME type for extension
 * @returns Local URL or empty string if not cached
 */
export function getCachedImageUrl(blobCid: string, mimeType?: string): string {
  try {
    if (!existsSync(CACHE_DIR)) {
      return "";
    }
    const files = readdirSync(CACHE_DIR);
    const cached = files.find((file: string) => file.startsWith(blobCid));

    if (cached) {
      return `/leaflet-images/${cached}`;
    }

    if (mimeType) {
      return `/leaflet-images/${blobCid}.${getExtensionForMime(mimeType)}`;
    }

    return "";
  } catch {
    return "";
  }
}

/**
 * Downloads and caches a single blob
 *
 * Fetches the blob from PDS and saves it to the cache directory.
 *
 * @param pdsUrl - The PDS service URL (e.g., https://bsky.social)
 * @param did - The DID of the repository
 * @param blobCid - The blob CID
 * @param mimeType - The MIME type of the image
 * @returns Cached image entry
 */
export async function cacheBlob(pdsUrl: string, did: string, blobCid: string, mimeType: string): Promise<CachedImage> {
  const extension = getExtensionForMime(mimeType);
  const filename = `${blobCid}.${extension}`;

  if (isImageCached(blobCid)) {
    return { blobCid, filename, url: getCachedImageUrl(blobCid), mimeType };
  }

  try {
    const url = `${pdsUrl}/xrpc/com.atproto.sync.getBlob?did=${encodeURIComponent(did)}&cid=${encodeURIComponent(blobCid)}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch blob: ${response.statusText}`);
    }

    await ensureCacheDir();

    const filepath = join(process.cwd(), CACHE_DIR, filename);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await writeFile(filepath, new Uint8Array(buffer));

    return { blobCid, filename, url: `/leaflet-images/${filename}`, mimeType };
  } catch (error) {
    console.error(`Failed to cache blob ${blobCid}:`, error);
    throw new Error(`Blob cache failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * Resolves the PDS endpoint for a DID
 *
 * @param did - The DID to resolve
 * @returns The PDS service URL
 */
async function resolvePdsEndpoint(did: string): Promise<string> {
  try {
    const response = await fetch(`https://plc.directory/${did}`);
    if (!response.ok) {
      throw new Error(`Failed to resolve DID document: ${response.statusText}`);
    }

    const didDoc = await response.json();
    const service = didDoc.service?.find(
      (s: { type?: string; id?: string }) => s.id?.includes("#atproto_pds") || s.type === "AtprotoPersonalDataServer",
    );

    if (!service?.serviceEndpoint) {
      throw new Error("No PDS endpoint found in DID document");
    }

    return service.serviceEndpoint;
  } catch (error) {
    console.error(`Failed to resolve PDS for DID ${did}:`, error);
    throw error;
  }
}

/**
 * Caches all images from a set of Leaflet records
 *
 * Batch downloads all unique blob references across all documents.
 *
 * @param handle - Bluesky handle for authentication
 * @param records - Array of AT Protocol records
 * @returns Map of blob CID to cached image URLs
 */
export async function cacheLeafletImages(
  handle: string,
  records: Array<{ uri: string; value: { author: string; pages: Array<{ blocks: BlockWrapper[] }> } }>,
): Promise<Map<string, string>> {
  const agent = new AtpAgent({ service: "https://bsky.social" });
  const urlMap = new Map<string, string>();

  try {
    const { data: profile } = await agent.resolveHandle({ handle });
    const did = profile.did;
    const pdsUrl = await resolvePdsEndpoint(did);
    const allBlobs: Array<{ $link: string; mimeType: string }> = [];

    for (const record of records) {
      const blockWrappers = record.value.pages[0]?.blocks || [];

      for (const wrapper of blockWrappers) {
        const block = wrapper.block;
        if (
          block &&
          block.$type === "pub.leaflet.blocks.image" &&
          "image" in block &&
          typeof block.image === "object" &&
          block.image !== null
        ) {
          const rawBlock = block as Record<string, unknown>;
          const rawImage = rawBlock.image as Record<string, unknown>;
          const rawRef = rawImage.ref as { toString: () => string };
          const link = rawRef.toString();
          const mimeType = rawImage.mimeType as string;
          if (link) {
            allBlobs.push({ $link: link, mimeType: mimeType });
          }
        }
      }
    }

    if (allBlobs.length > 0) {
      console.log(`[ImageCache] Found ${allBlobs.length} images to cache from PDS: ${pdsUrl}`);
    }

    const seen = new Set<string>();

    for (const blobRef of allBlobs) {
      if (seen.has(blobRef.$link)) continue;
      seen.add(blobRef.$link);
      if (!urlMap.has(blobRef.$link)) {
        try {
          const cached = await cacheBlob(pdsUrl, did, blobRef.$link, blobRef.mimeType);
          urlMap.set(blobRef.$link, cached.url);
        } catch (error) {
          console.warn(
            `[ImageCache] Failed to cache blob: ${error instanceof Error ? error.message : "Unknown error"}`,
          );
        }
      }
    }

    if (urlMap.size > 0) {
      console.log(`[ImageCache] Successfully cached ${urlMap.size}/${allBlobs.length} images`);
    }
  } catch (error) {
    console.error("Failed to cache Leaflet images:", error);
  }

  return urlMap;
}
