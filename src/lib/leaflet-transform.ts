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
  CodeBlock,
  MathBlock,
  WebsiteEmbedBlock,
  BskyPostEmbedBlock,
  WebsiteBlock,
  BskyPostBlock,
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

  const markdown = transformBlocks(blocks);
  const html = await marked.parse(markdown);
  return html;
}

/**
 * Transforms an array of blocks to markdown
 *
 * Iterates through block wrappers, extracts the actual block,
 * and converts each to markdown format, preserving structure and hierarchy.
 */
function transformBlocks(blocks: BlockWrapper[]): string {
  const results = blocks.map((wrapper) => {
    const block = wrapper.block;
    return transformBlock(block);
  });
  return results.join("\n\n");
}

/**
 * Transforms a single block to markdown
 *
 * Dispatches to the appropriate transformer based on block type.
 */
function transformBlock(block: Block): string {
  switch (block.$type) {
    case "pub.leaflet.blocks.text":
      return transformTextBlock(block as TextBlock);
    case "pub.leaflet.blocks.header":
      return transformHeaderBlock(block as HeaderBlock);
    case "pub.leaflet.blocks.blockquote":
      return transformBlockquoteBlock(block as BlockquoteBlock);
    case "pub.leaflet.blocks.hr":
    case "pub.leaflet.blocks.horizontalRule":
      return transformHorizontalRuleBlock(block as HorizontalRuleBlock);
    case "pub.leaflet.blocks.ul":
    case "pub.leaflet.blocks.unorderedList":
      return transformUnorderedListBlock(block as UnorderedListBlock);
    case "pub.leaflet.blocks.image":
      return transformImageBlock(block as ImageBlock);
    case "pub.leaflet.blocks.code":
      return transformCodeBlock(block as CodeBlock);
    case "pub.leaflet.blocks.math":
      return transformMathBlock(block as MathBlock);
    case "pub.leaflet.blocks.websiteEmbed":
    case "pub.leaflet.blocks.website":
      return transformWebsiteEmbedBlock(block as WebsiteEmbedBlock);
    case "pub.leaflet.blocks.bskyPostEmbed":
    case "pub.leaflet.blocks.bskyPost":
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
  if (!block.children || !Array.isArray(block.children)) {
    console.warn("[LeafletTransform] UnorderedListBlock missing children:", block);
    return "";
  }

  return block.children
    .map((child) => {
      if (child.content && child.content.plaintext) {
        return `- ${child.content.plaintext}`;
      }
      return "";
    })
    .filter(Boolean)
    .join("\n");
}

/**
 * Transforms code block to markdown
 *
 * Creates fenced code block with optional language.
 */
function transformCodeBlock(block: CodeBlock): string {
  if (!block.plaintext) {
    console.warn("[LeafletTransform] CodeBlock missing plaintext:", block);
    return "";
  }

  const language = block.language || "";

  return "```" + language + "\n" + block.plaintext + "\n```";
}

/**
 * Transforms math block to markdown
 *
 * Creates LaTeX math block with optional caption.
 */
function transformMathBlock(block: MathBlock): string {
  if (!block.tex) {
    console.warn("[LeafletTransform] MathBlock missing tex:", block);
    return "";
  }

  const caption = block.caption || "";

  let result = "$$" + "\n" + block.tex + "\n" + "$$";

  if (caption) {
    result += "\n*" + caption + "*";
  }

  return result;
}

/**
 * Transforms image block to markdown
 *
 * Creates markdown image reference with cached blob URL.
 * Images are downloaded and cached during build.
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
 *
 * @todo: make this match design system
 */
function transformWebsiteEmbedBlock(block: WebsiteEmbedBlock | WebsiteBlock): string {
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
 *
 * @todo: make this match design system
 */
function transformBskyPostEmbedBlock(block: BskyPostEmbedBlock | BskyPostBlock): string {
  if (!block.author || !block.author.handle) {
    console.warn("[LeafletTransform] BskyPostEmbedBlock missing author:", block);
    return `📱 [Bluesky Post](${block.uri})`;
  }

  const handle = block.author.handle;
  const displayName = block.author.displayName || handle;
  const postUri = block.uri;
  const text = block.record?.text || "";

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
