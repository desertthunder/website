import type { CollectionEntry } from "astro:content";

/**
 * @summary Resolve the single highlighted project for the home page and projects list.
 *
 * `highlighted` is meant to be set on at most one project.
 *
 * zod validates per-file, so this enforces the "at most one" rule at query time
 * such that if more than one is flagged, the most recent is used and a dev-time
 * warning is logged.
 */
export function getHighlightedProjectFrom(projects: CollectionEntry<"projects">[]): CollectionEntry<"projects"> | null {
  const highlighted = projects.filter((p) => p.data.highlighted);
  if (highlighted.length === 0) return null;

  if (import.meta.env.DEV && highlighted.length > 1) {
    console.warn(
      `[projects] ${highlighted.length} projects are marked highlighted; expected at most 1. ` +
        `Showing the most recent.`,
    );
  }

  return highlighted.toSorted((a, b) => b.data.date.getTime() - a.data.date.getTime())[0];
}
