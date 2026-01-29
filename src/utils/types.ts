export type IconName =
  | "gh"
  | "bluesky"
  | "linkedin"
  | "sun"
  | "moon"
  | "chevron-up"
  | "external-link"
  | "bolt"
  | "search"
  | "external";

export type MetadataItem = { label?: string; value: string; href?: string; external?: boolean };
