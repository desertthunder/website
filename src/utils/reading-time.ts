/**
 * Calculate estimated reading time for content.
 *
 * Defaults to standard 250 words per minute reading speed.
 */
export function calculateReadingTime(content: string, wpm: number = 250): string {
  const wordCount = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wpm);

  if (minutes === 1) {
    return "1 min read";
  }

  return `${minutes} min read`;
}
