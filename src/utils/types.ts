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

export type SourceKind = "bluesky" | "substack" | "leaflet" | "bearblog";

export type FeedItem = {
  id: string;
  source_kind: SourceKind;
  source_id: string;
  author: string;
  title: string;
  summary: string;
  url: string;
  content_html: string | null;
  published_at: string;
  created_at: string;
};

export type FeedResponse = { items: FeedItem[] };

export type StatusResponse = {
  status: string;
  version: string;
  total_items: number;
  sources: Record<SourceKind, number>;
};
