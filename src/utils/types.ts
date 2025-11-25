export type IconName =
  | "gh"
  | "bluesky"
  | "linkedin"
  | "rss"
  | "sun"
  | "moon"
  | "chevron-up"
  | "external-link"
  | "bolt"
  | "search";

export type MetadataItem = { label?: string; value: string; href?: string; external?: boolean };
