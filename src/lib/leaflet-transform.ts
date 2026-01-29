/**
 * Leaflet content transformation utilities
 *
 * Converts AT Protocol Leaflet document blocks to HTML format for rendering in Astro.
 * Handles rich text facets, images, embeds, and all block types defined in the Leaflet Lexicon.
 */

import { marked } from "marked";
import type {
  LeafletDocument,
  Block,
  BlockWrapper,
  TextBlock,
  HeaderBlock,
  BlockquoteBlock,
  HorizontalRuleBlock,
  UnorderedListBlock,
  ImageBlock,
  WebsiteEmbedBlock,
  BskyPostEmbedBlock,
  Facet,
} from "./leaflet";

/**
 * Transforms a complete Leaflet document to HTML
 *
 * @param document - The Leaflet document to transform
 * @param atUri - The AT Protocol URI for this document
 * @returns HTML string ready for rendering
 */
export async function transformLeafletToMarkdown(document: LeafletDocument, _atUri: string): Promise<string> {
  let blocks: BlockWrapper[] = [];
  if (document.pages && document.pages.length > 0) {
    const page = document.pages[0];
    blocks = page.blocks || [];
  }

  console.debug(`[LeafletTransform] Transforming "${document.title}": ${blocks.length} block wrappers`);

  const markdown = transformBlocks(blocks);
  console.debug(`[LeafletTransform] Markdown: "${markdown}"`);

  const html = await marked.parse(markdown);
  console.debug(`[LeafletTransform] HTML: "${html.slice(0, 200)}"`);
  return html;
}

/**
 * Transforms an array of blocks to markdown
 *
 * Iterates through block wrappers, extracts the actual block,
 * and converts each to markdown format, preserving structure and hierarchy.
 */
function transformBlocks(blocks: BlockWrapper[]): string {
  console.debug(`[LeafletTransform] transformBlocks: ${blocks.length} block wrappers`);
  const results = blocks.map((wrapper, i) => {
    const block = wrapper.block;
    const result = transformBlock(block);
    console.debug(`[LeafletTransform] Block ${i} ($type=${block.$type}): "${result.slice(0, 50)}"`);
    return result;
  });
  return results.join("\n\n");
}

/**
 * Transforms a single block to markdown
 *
 * Dispatches to the appropriate transformer based on block type.
 */
function transformBlock(block: Block): string {
  const blockData = JSON.stringify(block);
  console.debug(`[LeafletTransform] Block $type=${block.$type}, data=${blockData.slice(0, 200)}`);

  switch (block.$type) {
    case "pub.leaflet.blocks.text":
      return transformTextBlock(block as TextBlock);
    case "pub.leaflet.blocks.header":
      return transformHeaderBlock(block as HeaderBlock);
    case "pub.leaflet.blocks.blockquote":
      return transformBlockquoteBlock(block as BlockquoteBlock);
    case "pub.leaflet.blocks.hr":
      return transformHorizontalRuleBlock(block as HorizontalRuleBlock);
    case "pub.leaflet.blocks.ul":
      return transformUnorderedListBlock(block as UnorderedListBlock);
    case "pub.leaflet.blocks.image":
      return transformImageBlock(block as ImageBlock);
    case "pub.leaflet.blocks.websiteEmbed":
      return transformWebsiteEmbedBlock(block as WebsiteEmbedBlock);
    case "pub.leaflet.blocks.bskyPostEmbed":
      return transformBskyPostEmbedBlock(block as BskyPostEmbedBlock);
    default:
      console.warn(`Unknown block type: ${(block as { $type: string }).$type}`);
      return "";
  }
}

/**
 * Transforms a text block with optional rich text facets
 *
 * Applies bold, italic, and link formatting to the plaintext
 * based on facet features using byte indices.
 */
function transformTextBlock(block: TextBlock): string {
  let text = block.plaintext;

  if (block.facets && block.facets.length > 0) {
    text = applyFacets(text, block.facets);
  }

  return text;
}

/**
 * Applies facet formatting to text
 *
 * Sorts facets by byte start position descending to avoid
 * index shifting issues when applying multiple formats.
 *
 * Formats:
 * - Links: [text](uri)
 * - Bold: **text**
 * - Italic: *text*
 */
export function applyFacets(text: string, facets: Facet[]): string {
  const sorted = [...facets].sort((a, b) => b.index.byteStart - a.index.byteStart);
  let result = text;

  for (const facet of sorted) {
    const { byteStart, byteEnd } = facet.index;

    const start = byteToCharIndex(text, byteStart);
    const end = byteToCharIndex(text, byteEnd);
    const slice = result.slice(start, end);
    for (const feature of facet.features) {
      switch (feature.$type) {
        case "pub.leaflet.richtext.facet#link":
          result = result.slice(0, start) + `[${slice}](${feature.uri})` + result.slice(end);
          break;
        case "pub.leaflet.richtext.facet#bold":
          result = result.slice(0, start) + `**${slice}**` + result.slice(end);
          break;
        case "pub.leaflet.richtext.facet#italic":
          result = result.slice(0, start) + `*${slice}*` + result.slice(end);
          break;
      }
    }
  }

  return result;
}

/**
 * Converts byte index to character index
 *
 * JavaScript strings are UTF-16, so we need to handle multi-byte characters correctly when slicing.
 */
function byteToCharIndex(str: string, byteIndex: number): number {
  let charIndex = 0;
  let byteCount = 0;

  while (byteCount < byteIndex && charIndex < str.length) {
    const code = str.charCodeAt(charIndex);
    byteCount += code < 0x80 ? 1 : code < 0x800 ? 2 : 3;
    charIndex++;
  }

  return charIndex;
}

/**
 * Transforms header block to markdown
 *
 * Uses # prefix repeated by level (1-6).
 */
function transformHeaderBlock(block: HeaderBlock): string {
  const hashes = "#".repeat(block.level);
  const text = block.text || block.plaintext || "";
  return `${hashes} ${text}`;
}

/**
 * Transforms blockquote to markdown
 *
 * Uses > prefix for quoted text.
 */
function transformBlockquoteBlock(block: BlockquoteBlock): string {
  return `> ${block.text}`;
}

/**
 * Transforms horizontal rule to markdown
 *
 * Uses --- for horizontal rules.
 */
function transformHorizontalRuleBlock(_block: HorizontalRuleBlock): string {
  return "---";
}

/**
 * Transforms unordered list to markdown
 *
 * Uses - prefix for each list item.
 */
function transformUnorderedListBlock(block: UnorderedListBlock): string {
  return block.items.map((item) => `- ${item}`).join("\n");
}

/**
 * Transforms image block to markdown
 *
 * Creates markdown image reference with cached blob URL.
 * Images are downloaded and cached during build.
 *
 * @todo: Implement blob downloading and caching
 */
function transformImageBlock(block: ImageBlock): string {
  const blobRef = block.image.ref as unknown as Record<string, unknown>;
  const blobCid = blobRef.$link as string | undefined;

  if (!blobCid) {
    console.warn("[LeafletTransform] Image block missing blob ref:", block);
    return "";
  }

  const alt = block.alt || "";
  const extension = getMimeTypeExtension(block.image.mimeType);
  const cachedUrl = `/leaflet-images/${blobCid}.${extension}`;
  return `![${alt}](${cachedUrl})`;
}

/**
 * Transforms website embed to markdown
 *
 * Creates link with optional title and description.
 */
function transformWebsiteEmbedBlock(block: WebsiteEmbedBlock): string {
  const lines: string[] = [];

  lines.push(`🔗 ${block.uri}`);

  if (block.title) {
    lines.push(`**${block.title}**`);
  }

  if (block.description) {
    lines.push(block.description);
  }

  return lines.join("\n");
}

/**
 * Transforms Bluesky post embed to markdown
 *
 * Creates blockquote with author info and link to post.
 */
function transformBskyPostEmbedBlock(block: BskyPostEmbedBlock): string {
  const handle = block.author.handle;
  const displayName = block.author.displayName || handle;
  const postUri = block.uri;
  const text = block.record.text;

  return `> **${displayName}** (@${handle})\n>\n> ${text}\n>\n> [View post](${postUri})`;
}

/**
 * Gets file extension from MIME type
 */
function getMimeTypeExtension(mimeType: string): string {
  const extensions: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "image/webp": "webp",
  };

  return extensions[mimeType] || "jpg";
}
