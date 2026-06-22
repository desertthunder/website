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
  UnorderedListBlock,
  OrderedListBlock,
  ImageBlock,
  CodeBlock,
  MathBlock,
  WebsiteBlock,
  BskyPostBlock,
  ButtonBlock,
  IframeBlock,
  ListItem,
  Facet,
} from "./leaflet";

type Footnote = {
  id: string;
  safeId: string;
  refLabel: string;
  contentPlaintext: string;
  contentFacets?: Facet[];
  url?: string;
};

type FootnoteMap = Map<string, Footnote>;

type ParsedMarkdownFootnote = { id: string; url: string; title?: string };

/**
 * Transforms a complete Leaflet document to HTML
 */
export async function transformLeafletToMarkdown(document: LeafletDocument, _atUri: string): Promise<string> {
  let blocks: BlockWrapper[] = [];
  const pages = document.content?.pages;
  if (pages && pages.length > 0) {
    const page = pages[0];
    blocks = page.blocks || [];
  }

  const footnotes = extractFootnotes(blocks);
  const markdown = transformBlocks(blocks, footnotes);
  const html = await marked.parse(markdown);
  return html + (await renderFootnotes(footnotes));
}

/**
 * Transforms an array of blocks to markdown
 */
function transformBlocks(blocks: BlockWrapper[], footnotes: FootnoteMap): string {
  const results = blocks.map((wrapper) => {
    const block = wrapper.block;
    return transformBlock(block, footnotes);
  });
  return results.join("\n\n");
}

/**
 * Transforms a single block to markdown based on its $type
 */
function transformBlock(block: Block, footnotes: FootnoteMap): string {
  switch (block.$type) {
    case "pub.leaflet.blocks.text":
      return transformTextBlock(block as TextBlock, footnotes);
    case "pub.leaflet.blocks.header":
      return transformHeaderBlock(block as HeaderBlock, footnotes);
    case "pub.leaflet.blocks.blockquote":
      return transformBlockquoteBlock(block as BlockquoteBlock, footnotes);
    case "pub.leaflet.blocks.horizontalRule":
      return "---";
    case "pub.leaflet.blocks.unorderedList":
      return transformUnorderedListBlock(block as UnorderedListBlock, footnotes);
    case "pub.leaflet.blocks.orderedList":
      return transformOrderedListBlock(block as OrderedListBlock, footnotes);
    case "pub.leaflet.blocks.image":
      return transformImageBlock(block as ImageBlock);
    case "pub.leaflet.blocks.code":
      return transformCodeBlock(block as CodeBlock);
    case "pub.leaflet.blocks.math":
      return transformMathBlock(block as MathBlock);
    case "pub.leaflet.blocks.website":
      return transformWebsiteBlock(block as WebsiteBlock);
    case "pub.leaflet.blocks.bskyPost":
      return transformBskyPostBlock(block as BskyPostBlock);
    case "pub.leaflet.blocks.button":
      return transformButtonBlock(block as ButtonBlock);
    case "pub.leaflet.blocks.iframe":
      return transformIframeBlock(block as IframeBlock);
    case "pub.leaflet.blocks.poll":
      return "";
    case "pub.leaflet.blocks.page":
      return "";
    default:
      console.warn(`Unknown block type: ${(block as { $type: string }).$type}`);
      return "";
  }
}

/**
 * Transforms a text block with optional rich text facets
 */
function transformTextBlock(block: TextBlock, footnotes: FootnoteMap = new Map()): string {
  if (isMarkdownFootnoteDefinitions(block.plaintext)) {
    return "";
  }

  let text = block.plaintext;

  if (block.facets && block.facets.length > 0) {
    text = applyFacets(text, block.facets, footnotes);
  }

  return applyFootnoteRefs(text, footnotes);
}

/**
 * Applies facet formatting to text
 *
 * Sorts facets by byte start position descending to avoid
 * index shifting issues when applying multiple formats.
 */
export function applyFacets(text: string, facets: Facet[], footnotes: FootnoteMap = new Map()): string {
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
        case "pub.leaflet.richtext.facet#underline":
          result = result.slice(0, start) + `<u>${slice}</u>` + result.slice(end);
          break;
        case "pub.leaflet.richtext.facet#strikethrough":
          result = result.slice(0, start) + `~~${slice}~~` + result.slice(end);
          break;
        case "pub.leaflet.richtext.facet#code":
          result = result.slice(0, start) + "`" + slice + "`" + result.slice(end);
          break;
        case "pub.leaflet.richtext.facet#highlight":
          result = result.slice(0, start) + `<mark>${slice}</mark>` + result.slice(end);
          break;
        case "pub.leaflet.richtext.facet#didMention":
          result = result.slice(0, start) + `[${slice}](https://bsky.app/profile/${feature.did})` + result.slice(end);
          break;
        case "pub.leaflet.richtext.facet#atMention":
          result = result.slice(0, start) + `[${slice}](${feature.atURI})` + result.slice(end);
          break;
        case "pub.leaflet.richtext.facet#footnote":
          {
            const footnote = footnotes.get(feature.footnoteId);
            const label = footnote ? escapeHtml(footnote.refLabel) : escapeHtml(slice || "*");
            const marker = footnote
              ? `<sup id="fnref-${footnote.safeId}" class="footnote-ref"><a href="#fn-${footnote.safeId}" aria-label="Footnote ${label}">${label}</a></sup>`
              : `<sup title="${escapeHtml(feature.contentPlaintext)}" class="footnote-ref">${label}</sup>`;
            result = result.slice(0, start) + marker + result.slice(end);
          }
          break;
      }
    }
  }

  return result;
}

/**
 * Converts byte index to character index for UTF-8/UTF-16 conversion
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

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function extractFootnotes(blocks: BlockWrapper[]): FootnoteMap {
  const footnotes: Footnote[] = [];
  const seen = new Set<string>();

  for (const wrapper of blocks) {
    collectFootnotes(wrapper.block, footnotes, seen);
  }

  return new Map(footnotes.map((footnote) => [footnote.id, footnote]));
}

function collectFootnotes(block: Block, footnotes: Footnote[], seen: Set<string>): void {
  if (block.$type === "pub.leaflet.blocks.text" && isMarkdownFootnoteDefinitions((block as TextBlock).plaintext)) {
    for (const footnote of parseMarkdownFootnotes((block as TextBlock).plaintext)) {
      if (seen.has(footnote.id)) {
        continue;
      }

      seen.add(footnote.id);
      footnotes.push({
        id: footnote.id,
        safeId: slugifyFootnoteId(footnote.id),
        refLabel: footnote.id,
        contentPlaintext: footnote.title || footnote.url,
        url: footnote.url,
      });
    }
  }

  const facets = getBlockFacets(block);
  for (const facet of facets) {
    for (const feature of facet.features) {
      if (feature.$type !== "pub.leaflet.richtext.facet#footnote" || seen.has(feature.footnoteId)) {
        continue;
      }

      seen.add(feature.footnoteId);
      footnotes.push({
        id: feature.footnoteId,
        safeId: slugifyFootnoteId(feature.footnoteId),
        refLabel: String(footnotes.length + 1),
        contentPlaintext: feature.contentPlaintext,
        contentFacets: feature.contentFacets,
      });
    }
  }

  if (block.$type === "pub.leaflet.blocks.unorderedList" || block.$type === "pub.leaflet.blocks.orderedList") {
    for (const child of (block as UnorderedListBlock | OrderedListBlock).children || []) {
      collectListItemFootnotes(child, footnotes, seen);
    }
  }
}

function collectListItemFootnotes(item: ListItem, footnotes: Footnote[], seen: Set<string>): void {
  if (item.content) {
    collectFootnotes(item.content, footnotes, seen);
  }

  for (const child of item.children || []) {
    collectListItemFootnotes(child, footnotes, seen);
  }
}

function getBlockFacets(block: Block): Facet[] {
  if (
    block.$type === "pub.leaflet.blocks.text" ||
    block.$type === "pub.leaflet.blocks.header" ||
    block.$type === "pub.leaflet.blocks.blockquote"
  ) {
    return (block as TextBlock | HeaderBlock | BlockquoteBlock).facets || [];
  }

  return [];
}

function parseMarkdownFootnotes(text: string): ParsedMarkdownFootnote[] {
  return text
    .split("\n")
    .map((line) => line.match(/^\[\^([^\]]+)\]:\s+(\S+)(?:\s+"([^"]+)")?\s*$/))
    .filter((match): match is RegExpMatchArray => match !== null)
    .map((match) => ({ id: match[1], url: match[2], title: match[3] }));
}

function isMarkdownFootnoteDefinitions(text: string): boolean {
  const lines = text.split("\n").filter((line) => line.trim().length > 0);
  return lines.length > 0 && lines.every((line) => /^\[\^[^\]]+\]:\s+\S+/.test(line));
}

function applyFootnoteRefs(text: string, footnotes: FootnoteMap): string {
  if (footnotes.size === 0) {
    return text;
  }

  return text.replace(/\[\^([^\]]+)\]/g, (match, id: string) => {
    if (!footnotes.has(id)) {
      return match;
    }

    const footnote = footnotes.get(id);
    if (!footnote) {
      return match;
    }

    const label = escapeHtml(footnote.refLabel);
    return `<sup id="fnref-${footnote.safeId}" class="footnote-ref"><a href="#fn-${footnote.safeId}" aria-label="Footnote ${label}">${label}</a></sup>`;
  });
}

async function renderFootnotes(footnotes: FootnoteMap): Promise<string> {
  if (footnotes.size === 0) {
    return "";
  }

  const items = await Promise.all(
    [...footnotes.values()].map(async (footnote) => {
      const contentHtml = await renderFootnoteContent(footnote);
      return `<li id="fn-${footnote.safeId}">${contentHtml} <a href="#fnref-${footnote.safeId}" class="footnote-backref" aria-label="Back to reference">↩</a></li>`;
    }),
  );

  return `<section class="footnotes" aria-label="Footnotes"><ol>${items.join("")}</ol></section>`;
}

async function renderFootnoteContent(footnote: Footnote): Promise<string> {
  if (footnote.url) {
    return `<a href="${escapeHtml(footnote.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(footnote.contentPlaintext)}</a>`;
  }

  const contentMarkdown = footnote.contentFacets?.length
    ? applyFacets(footnote.contentPlaintext, footnote.contentFacets)
    : escapeHtml(footnote.contentPlaintext);
  return marked.parseInline(contentMarkdown);
}

function slugifyFootnoteId(id: string): string {
  return id.toLowerCase().replace(/[^a-z0-9_-]+/g, "-");
}

/**
 * Transforms header block to markdown with rich text
 */
function transformHeaderBlock(block: HeaderBlock, footnotes: FootnoteMap = new Map()): string {
  const hashes = "#".repeat(block.level);
  let text = block.plaintext || "";
  if (block.facets && block.facets.length > 0) {
    text = applyFacets(text, block.facets, footnotes);
  }
  return `${hashes} ${applyFootnoteRefs(text, footnotes)}`;
}

/**
 * Transforms blockquote to markdown with rich text
 */
function transformBlockquoteBlock(block: BlockquoteBlock, footnotes: FootnoteMap = new Map()): string {
  let text = block.plaintext || "";
  if (block.facets && block.facets.length > 0) {
    text = applyFacets(text, block.facets, footnotes);
  }
  return `> ${applyFootnoteRefs(text, footnotes)}`;
}

/**
 * Renders a list item's text content with facets applied
 */
function renderListItemContent(item: ListItem, footnotes: FootnoteMap = new Map()): string {
  const content = item.content;
  if (!content) return "";

  if (content.$type === "pub.leaflet.blocks.text") {
    const textBlock = content as TextBlock;
    let text = textBlock.plaintext || "";
    if (textBlock.facets && textBlock.facets.length > 0) {
      text = applyFacets(text, textBlock.facets, footnotes);
    }
    return applyFootnoteRefs(text, footnotes);
  }

  if (content.$type === "pub.leaflet.blocks.header") {
    const headerBlock = content as HeaderBlock;
    let text = headerBlock.plaintext || "";
    if (headerBlock.facets && headerBlock.facets.length > 0) {
      text = applyFacets(text, headerBlock.facets, footnotes);
    }
    return `**${applyFootnoteRefs(text, footnotes)}**`;
  }

  if (content.$type === "pub.leaflet.blocks.image") {
    return transformImageBlock(content as ImageBlock);
  }

  return "";
}

/**
 * Recursively renders list items with indentation for nesting
 */
function renderListItems(children: ListItem[], prefix: string, depth: number, footnotes: FootnoteMap): string {
  const indent = "  ".repeat(depth);
  const lines: string[] = [];

  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    const itemPrefix = prefix === "-" ? "-" : `${i + 1}.`;
    const text = renderListItemContent(child, footnotes);
    if (text) {
      lines.push(`${indent}${itemPrefix} ${text}`);
    }
    if (child.children && child.children.length > 0) {
      lines.push(renderListItems(child.children, prefix, depth + 1, footnotes));
    }
  }

  return lines.filter(Boolean).join("\n");
}

/**
 * Transforms unordered list to markdown with nested children support
 */
function transformUnorderedListBlock(block: UnorderedListBlock, footnotes: FootnoteMap = new Map()): string {
  if (!block.children || !Array.isArray(block.children)) {
    return "";
  }
  return renderListItems(block.children, "-", 0, footnotes);
}

/**
 * Transforms ordered list to markdown with nested children support
 */
function transformOrderedListBlock(block: OrderedListBlock, footnotes: FootnoteMap = new Map()): string {
  if (!block.children || !Array.isArray(block.children)) {
    return "";
  }
  return renderListItems(block.children, "1.", 0, footnotes);
}

/**
 * Transforms code block to markdown
 */
function transformCodeBlock(block: CodeBlock): string {
  if (!block.plaintext) {
    return "";
  }
  const language = block.language || "";
  return "```" + language + "\n" + block.plaintext + "\n```";
}

/**
 * Transforms math block to markdown
 */
function transformMathBlock(block: MathBlock): string {
  if (!block.tex) {
    return "";
  }
  return "$$\n" + block.tex + "\n$$";
}

/**
 * Transforms image block to markdown
 */
function transformImageBlock(block: ImageBlock): string {
  const blobRef = block.image.ref as unknown as Record<string, unknown>;
  const blobCid = blobRef.$link as string | undefined;

  if (!blobCid) {
    return "";
  }

  const alt = block.alt || "";
  const extension = getMimeTypeExtension(block.image.mimeType);
  const cachedUrl = `/leaflet-images/${blobCid}.${extension}`;
  return `![${alt}](${cachedUrl})`;
}

/**
 * Transforms website embed to an HTML card
 */
function transformWebsiteBlock(block: WebsiteBlock): string {
  const url = block.src || "";
  if (!url) return "";

  const title = block.title ? escapeHtml(block.title) : "";
  const description = block.description ? escapeHtml(block.description) : "";

  let thumbnailHtml = "";
  if (block.previewImage) {
    const ref = block.previewImage.ref as unknown as Record<string, unknown>;
    const cid = ref.$link as string | undefined;
    if (cid) {
      const ext = getMimeTypeExtension(block.previewImage.mimeType);
      thumbnailHtml = `<img src="/leaflet-images/${cid}.${ext}" alt="" class="website-embed-thumb" />`;
    }
  }

  return `<div class="website-embed-card"><a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" class="website-embed-link">${thumbnailHtml}<div class="website-embed-info">${title ? `<span class="website-embed-title">${title}</span>` : ""}${description ? `<span class="website-embed-desc">${description}</span>` : ""}<span class="website-embed-url">${escapeHtml(url)}</span></div></a></div>`;
}

/**
 * Transforms Bluesky post embed to HTML card using postRef
 */
function transformBskyPostBlock(block: BskyPostBlock): string {
  const postRef = block.postRef;
  if (!postRef || !postRef.uri) return "";

  const uriParts = postRef.uri.split("/");
  const did = uriParts[2] || "";
  const rkey = uriParts[uriParts.length - 1] || "";
  const host = block.clientHost || "https://bsky.app";
  const bskyUrl = `${host}/profile/${did}/post/${rkey}`;

  return `<div class="bsky-embed-card"><div class="bsky-embed-header"><span class="bsky-icon">🦋</span><span class="bsky-label">Bluesky Post</span></div><a href="${bskyUrl}" target="_blank" rel="noopener noreferrer" class="bsky-link">View on Bluesky →</a></div>`;
}

/**
 * Transforms button block to an HTML link styled as a button
 */
function transformButtonBlock(block: ButtonBlock): string {
  const text = escapeHtml(block.text || "");
  const url = escapeHtml(block.url || "#");
  return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="leaflet-button">${text}</a>`;
}

/**
 * Transforms iframe block to a link (iframes are not embedded for security)
 */
function transformIframeBlock(block: IframeBlock): string {
  const url = block.url || "";
  if (!url) return "";
  return `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" class="leaflet-iframe-link">View embedded content →</a>`;
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
