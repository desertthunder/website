/**
 * AT Protocol Leaflet integration
 *
 * Provides type definitions and fetch logic for Leaflet posts stored in AT Protocol.
 * Leaflet uses the pub.leaflet.document collection to store rich text documents with support for text blocks, headers, lists, images, and embeds.
 */

import { AtpAgent } from "@atproto/api";

/**
 * AT Protocol DID for the Leaflet author
 * Resolved from desertthunder.dev handle
 */
export const LEAFLET_DID = "did:plc:xg2vq45muivyy3xwatcehspu";

/**
 * AT Protocol collection namespace for Leaflet documents
 */
export const LEAFLET_COLLECTION = "pub.leaflet.document";

/**
 * Leaflet document record from AT Protocol
 *
 * @see https://github.com/mary-ext/atcute/blob/b113eafe3b768b6578759b205b0bb9df57c239e0/packages/definitions/leaflet/lexicons/pub/leaflet/document.json
 */
export type LeafletDocument = {
  $type: "pub.leaflet.document";
  title: string;
  author: string;
  description?: string;
  /* at-uri reference to publication record */
  publication?: string;
  /* ISO 8601 datetime */
  publishedAt: string;
  pages: LeafletPage[];
};

/**
 * Page wrapper containing blocks
 *
 * Based on actual AT Protocol responses, the page structure is:
 * { $type: "pub.leaflet.pages.linearDocument", blocks: BlockWrapper[] }
 *
 * Each block is wrapped in a union type:
 * { $type: "pub.leaflet.pages.linearDocument#block", block: { actual block data } }
 */
export type LeafletPage = { $type: string; blocks: BlockWrapper[] };

/**
 * Block wrapper - union type that contains the actual block data
 */
export type BlockWrapper = { $type: "pub.leaflet.pages.linearDocument#block"; block: Block };

/**
 * Union type for all block types in Leaflet documents
 */
export type Block =
  | TextBlock
  | HeaderBlock
  | BlockquoteBlock
  | HorizontalRuleBlock
  | UnorderedListBlock
  | ImageBlock
  | CodeBlock
  | MathBlock
  | WebsiteEmbedBlock
  | BskyPostEmbedBlock
  | WebsiteBlock
  | BskyPostBlock;

/**
 * Rich text block with facets (bold, italic, links)
 */
export type TextBlock = { $type: "pub.leaflet.blocks.text"; plaintext: string; facets?: Facet[] };

/**
 * Heading block at specified level
 */
export type HeaderBlock = {
  $type: "pub.leaflet.blocks.header";
  level: 1 | 2 | 3 | 4 | 5 | 6;
  text?: string;
  plaintext?: string;
  facets?: Feature[];
};

/**
 * Blockquote text
 */
export type BlockquoteBlock = { $type: "pub.leaflet.blocks.blockquote"; text: string };

/**
 * Horizontal rule divider
 */
export type HorizontalRuleBlock = { $type: "pub.leaflet.blocks.hr" | "pub.leaflet.blocks.horizontalRule" };

/**
 * Unordered list items
 */
export type UnorderedListBlock = {
  $type: "pub.leaflet.blocks.ul" | "pub.leaflet.blocks.unorderedList";
  children: Array<{ $type: string; content: TextBlock; children: unknown[] }>;
};

/**
 * Code block with syntax highlighting
 */
export type CodeBlock = {
  $type: "pub.leaflet.blocks.code";
  plaintext: string;
  language?: string;
  syntaxHighlightingTheme?: string;
};

/**
 * Math block for LaTeX equations
 */
export type MathBlock = { $type: "pub.leaflet.blocks.math"; tex: string; caption?: string };

/**
 * Bluesky post embed (alternative type name)
 */
export type BskyPostBlock = {
  $type: "pub.leaflet.blocks.bskyPost";
  uri: string;
  cid: string;
  author: BSkyAuthor;
  record: BSkyRecord;
};

/**
 * Website link embed (alternative type name)
 */
export type WebsiteBlock = {
  $type: "pub.leaflet.blocks.website";
  uri: string;
  title?: string;
  description?: string;
  thumbnail?: WebEmbedThumb;
};

/**
 * Image embedded from blob storage
 */
export type ImageBlock = {
  $type: "pub.leaflet.blocks.image";
  image: { $type: "blob"; ref: { $link: string }; mimeType: string };
  alt: string;
};

type WebEmbedThumb = { $type: "blob"; ref: { $link: string }; mimeType: string };

/**
 * Website link embed
 */
export interface WebsiteEmbedBlock {
  $type: "pub.leaflet.blocks.websiteEmbed";
  uri: string;
  title?: string;
  description?: string;
  thumbnail?: WebEmbedThumb;
}

type BSkyAuthor = { did: string; handle: string; displayName?: string; avatar?: string };
type BSkyRecord = { text: string; createdAt: string };

/**
 * Bluesky post embed
 */
export type BskyPostEmbedBlock = {
  $type: "pub.leaflet.blocks.bskyPostEmbed";
  uri: string;
  cid: string;
  author: BSkyAuthor;
  record: BSkyRecord;
};

/**
 * Facet for rich text formatting
 *
 * Facets apply formatting to text ranges using byte indices.
 * Multiple features can be applied to the same range.
 */
export type Facet = { index: { byteStart: number; byteEnd: number }; features: Feature[] };

/**
 * Union type for facet features
 */
export type Feature = LinkFeature | BoldFeature | ItalicFeature;

/**
 * Link feature with URI
 */
export type LinkFeature = { $type: "pub.leaflet.richtext.facet#link"; uri: string };

/**
 * Bold text feature
 */
export type BoldFeature = { $type: "pub.leaflet.richtext.facet#bold" };

/**
 * Italic text feature
 */
export type ItalicFeature = { $type: "pub.leaflet.richtext.facet#italic" };

/**
 * AT Protocol record wrapper
 */
export type AtprotoRecord = { uri: string; cid: string; value: LeafletDocument };

const DEFAULT_SERVICE = "https://bsky.social";
/**
 * Fetches all Leaflet posts from AT Protocol
 *
 * Resolves the handle to DID, then lists all records in the
 * pub.leaflet.document collection, sorted newest first.
 *
 * @param handle - The Bluesky handle to fetch posts from
 * @param service - The PDS service URL (defaults to bsky.social)
 * @returns Array of Leaflet document records
 */
export async function fetchLeafletPosts(handle: string, service: string = DEFAULT_SERVICE): Promise<AtprotoRecord[]> {
  const agent = new AtpAgent({ service });

  try {
    const { data: profile } = await agent.resolveHandle({ handle });

    const params = { repo: profile.did, collection: LEAFLET_COLLECTION, limit: 100, reverse: true };
    const { data } = await agent.com.atproto.repo.listRecords(params);

    console.log(`[Leaflet] Fetched ${data.records.length} records from collection "${LEAFLET_COLLECTION}"`);

    const validRecords: AtprotoRecord[] = [];

    for (const record of data.records) {
      if (!isValidAtprotoRecord(record)) {
        const r = record as Record<string, unknown>;
        const valueKeys = Object.keys(r.value || {});
        console.error("[Leaflet] Invalid record structure:", { uri: r.uri, cid: r.cid, valueKeys });
        throw new Error(`Invalid AT Protocol record structure for URI: ${String(r.uri || "unknown")}`);
      }

      if (!isValidLeafletDocument(record.value)) {
        const doc = record.value as Record<string, unknown>;
        console.error("[Leaflet] Invalid Leaflet document:", {
          uri: record.uri,
          title: doc.title,
          $type: doc.$type,
          hasPages: !!doc.pages,
          pagesLength: Array.isArray(doc.pages) ? doc.pages.length : 0,
        });
        throw new Error(
          `Invalid Leaflet document "${String(doc.title || "Untitled")}" (type: ${String(doc.$type || "unknown")}) at URI: ${record.uri}`,
        );
      }

      validRecords.push(record as unknown as AtprotoRecord);
    }

    return validRecords;
  } catch (error) {
    console.error("Failed to fetch Leaflet posts:", error);
    throw new Error(`AT Protocol fetch failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * Type guard for AT Protocol record structure
 */
function isValidAtprotoRecord(record: unknown): record is { uri: string; cid: string; value: Record<string, unknown> } {
  if (typeof record !== "object" || record === null) {
    return false;
  }

  const r = record as Record<string, unknown>;
  return typeof r.uri === "string" && typeof r.cid === "string" && typeof r.value === "object" && r.value !== null;
}

type ValidDoc = {
  $type: string;
  title: string;
  author: string;
  publishedAt: string;
  pages: unknown[];
  description?: string;
};

/**
 * Type guard for Leaflet document structure
 */
function isValidLeafletDocument(value: Record<string, unknown>): value is Record<string, unknown> & ValidDoc {
  if (value.$type !== "pub.leaflet.document") {
    return false;
  }

  if (typeof value.title !== "string" || value.title.length === 0) {
    return false;
  }

  if (typeof value.author !== "string") {
    return false;
  }

  if (typeof value.publishedAt !== "string") {
    return false;
  }

  if (!Array.isArray(value.pages) || value.pages.length === 0) {
    return false;
  }

  const page = value.pages[0] as Record<string, unknown>;
  if (typeof page !== "object" || page === null) {
    return false;
  }

  if (!Array.isArray(page.blocks)) {
    return false;
  }

  return true;
}

/**
 * Extracts the record key (rkey) from an AT Protocol URI
 *
 * @param uri - AT Protocol URI (e.g., "at://did:plc:abc/pub.leaflet.document/rkey")
 * @returns The record key portion of the URI
 */
export function extractRkey(uri: string): string {
  const parts = uri.split("/");
  return parts[parts.length - 1] || "";
}
