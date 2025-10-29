/**
 * Truncate text to a maximum length.
 *
 * Adds ellipsis if text exceeds maxLength. Attempts to break at word boundaries to avoid cutting words in half.
 */
export function truncate(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) {
    return text;
  }

  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");

  if (lastSpace > maxLength * 0.8) {
    return truncated.slice(0, lastSpace) + "…";
  }

  return truncated + "…";
}

/**
 * Truncate text to a maximum word count.
 *
 * Adds ellipsis if word count exceeds maxWords.
 */
export function truncateWords(text: string, maxWords: number): string {
  if (!text) {
    return text;
  }

  const words = text.trim().split(/\s+/);

  if (words.length <= maxWords) {
    return text;
  }

  return words.slice(0, maxWords).join(" ") + "…";
}
