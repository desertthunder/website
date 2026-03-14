/**
 * AT Protocol Leaflet integration
 *
 * Provides type definitions and fetch logic for Leaflet posts stored in AT Protocol.
 * Leaflet uses the pub.leaflet.document collection to store rich text documents
 * with text blocks, headers, lists, images, embeds, and more.
 *
 * @see https://github.com/mary-ext/atcute/tree/trunk/packages/definitions/leaflet/lexicons
 */

import { AtpAgent } from "@atproto/api";

/**
 * AT Protocol DID for the Leaflet author
 * Resolved from desertthunder.dev handle
 */
export const LEAFLET_DID = "did:plc:xg2vq45muivyy3xwatcehspu";

/**
 * AT Protocol collection namespace for site.standard documents
 * (migrated from pub.leaflet.document)
 */
export const LEAFLET_COLLECTION = "site.standard.document";

/**
 * Site standard document record from AT Protocol
 *
 * The outer wrapper uses site.standard.document, while the inner
 * content uses pub.leaflet.content with pub.leaflet.pages/blocks.
 */
export type LeafletDocument = {
  $type: "site.standard.document";
  title: string;
  description?: string;
  path?: string;
  site?: string;
  publishedAt: string;
  bskyPostRef?: { uri: string; cid: string };
  tags?: string[];
  coverImage?: BlobRef;
  content: LeafletContent;
};

/**
 * Leaflet content wrapper containing pages
 */
export type LeafletContent = {
  $type: "pub.leaflet.content";
  pages: LeafletPage[];
};

/**
 * Page wrapper containing blocks
 */
export type LeafletPage = { $type: string; blocks: BlockWrapper[] };

/**
 * Block wrapper with optional alignment
 */
export type BlockWrapper = {
  $type: "pub.leaflet.pages.linearDocument#block";
  block: Block;
  alignment?: "textAlignLeft" | "textAlignCenter" | "textAlignRight" | "textAlignJustify";
};

/**
 * Union type for all block types in Leaflet documents
 */
export type Block =
  | TextBlock
  | HeaderBlock
  | BlockquoteBlock
  | HorizontalRuleBlock
  | UnorderedListBlock
  | OrderedListBlock
  | ImageBlock
  | CodeBlock
  | MathBlock
  | WebsiteBlock
  | BskyPostBlock
  | ButtonBlock
  | IframeBlock
  | PollBlock
  | PageBlock;

/**
 * Rich text block with facets (bold, italic, links, etc.)
 */
export type TextBlock = {
  $type: "pub.leaflet.blocks.text";
  plaintext: string;
  textSize?: "default" | "small" | "large";
  facets?: Facet[];
};

/**
 * Heading block at specified level
 */
export type HeaderBlock = {
  $type: "pub.leaflet.blocks.header";
  level: 1 | 2 | 3 | 4 | 5 | 6;
  plaintext: string;
  facets?: Facet[];
};

/**
 * Blockquote with rich text
 */
export type BlockquoteBlock = {
  $type: "pub.leaflet.blocks.blockquote";
  plaintext: string;
  facets?: Facet[];
};

/**
 * Horizontal rule divider
 */
export type HorizontalRuleBlock = { $type: "pub.leaflet.blocks.horizontalRule" };

/** List item used in both ordered and unordered lists */
export type ListItem = {
  $type: string;
  content: TextBlock | HeaderBlock | ImageBlock;
  children: ListItem[];
};

/**
 * Unordered list with nested children
 */
export type UnorderedListBlock = {
  $type: "pub.leaflet.blocks.unorderedList";
  children: ListItem[];
};

/**
 * Ordered list with nested children
 */
export type OrderedListBlock = {
  $type: "pub.leaflet.blocks.orderedList";
  startIndex?: number;
  children: ListItem[];
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
export type MathBlock = { $type: "pub.leaflet.blocks.math"; tex: string };

/**
 * Image embedded from blob storage
 */
export type ImageBlock = {
  $type: "pub.leaflet.blocks.image";
  image: BlobRef;
  alt?: string;
  aspectRatio?: { width: number; height: number };
};

/**
 * Website link embed
 */
export type WebsiteBlock = {
  $type: "pub.leaflet.blocks.website";
  src: string;
  title?: string;
  description?: string;
  previewImage?: BlobRef;
};

/**
 * Bluesky post embed via strongRef
 */
export type BskyPostBlock = {
  $type: "pub.leaflet.blocks.bskyPost";
  postRef: { uri: string; cid: string };
  clientHost?: string;
};

/**
 * Button block with link
 */
export type ButtonBlock = {
  $type: "pub.leaflet.blocks.button";
  text: string;
  url: string;
};

/**
 * Iframe embed block
 */
export type IframeBlock = {
  $type: "pub.leaflet.blocks.iframe";
  url: string;
  height?: number;
};

/**
 * Poll block referencing a poll definition
 */
export type PollBlock = {
  $type: "pub.leaflet.blocks.poll";
  pollRef: { uri: string; cid: string };
};

/**
 * Page link block referencing another page in the document
 */
export type PageBlock = {
  $type: "pub.leaflet.blocks.page";
  id: string;
};

/** Blob reference type */
export type BlobRef = { $type: "blob"; ref: { $link: string }; mimeType: string; size?: number };

/**
 * Facet for rich text formatting
 *
 * Facets apply formatting to text ranges using byte indices.
 */
export type Facet = { index: { byteStart: number; byteEnd: number }; features: Feature[] };

/**
 * Union type for facet features
 */
export type Feature =
  | LinkFeature
  | BoldFeature
  | ItalicFeature
  | UnderlineFeature
  | StrikethroughFeature
  | CodeFeature
  | HighlightFeature
  | DidMentionFeature
  | AtMentionFeature
  | FootnoteFeature;

export type LinkFeature = { $type: "pub.leaflet.richtext.facet#link"; uri: string };
export type BoldFeature = { $type: "pub.leaflet.richtext.facet#bold" };
export type ItalicFeature = { $type: "pub.leaflet.richtext.facet#italic" };
export type UnderlineFeature = { $type: "pub.leaflet.richtext.facet#underline" };
export type StrikethroughFeature = { $type: "pub.leaflet.richtext.facet#strikethrough" };
export type CodeFeature = { $type: "pub.leaflet.richtext.facet#code" };
export type HighlightFeature = { $type: "pub.leaflet.richtext.facet#highlight" };
export type DidMentionFeature = { $type: "pub.leaflet.richtext.facet#didMention"; did: string };
export type AtMentionFeature = { $type: "pub.leaflet.richtext.facet#atMention"; atURI: string };
export type FootnoteFeature = {
  $type: "pub.leaflet.richtext.facet#footnote";
  footnoteId: string;
  contentPlaintext: string;
  contentFacets?: Facet[];
};

/**
 * AT Protocol record wrapper
 */
export type AtprotoRecord = { uri: string; cid: string; value: LeafletDocument };

const DEFAULT_SERVICE = "https://bsky.social";

/**
 * Fetches all Leaflet posts from AT Protocol
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
  publishedAt: string;
  content: { pages: unknown[] };
  description?: string;
};

/**
 * Type guard for site.standard.document structure
 */
function isValidLeafletDocument(value: Record<string, unknown>): value is Record<string, unknown> & ValidDoc {
  if (value.$type !== "site.standard.document") {
    return false;
  }

  if (typeof value.title !== "string" || value.title.length === 0) {
    return false;
  }

  if (typeof value.publishedAt !== "string") {
    return false;
  }

  const content = value.content as Record<string, unknown> | undefined;
  if (!content || typeof content !== "object") {
    return false;
  }

  if (!Array.isArray(content.pages) || content.pages.length === 0) {
    return false;
  }

  const page = content.pages[0] as Record<string, unknown>;
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
 */
export function extractRkey(uri: string): string {
  const parts = uri.split("/");
  return parts[parts.length - 1] || "";
}
