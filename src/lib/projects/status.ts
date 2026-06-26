export const PROJECT_STATUS_KEYS = [
  "active",
  "pre_release",
  "experimental",
  "paused",
  "completed",
  "archived",
] as const;

export type ProjectStatus = (typeof PROJECT_STATUS_KEYS)[number];

export const PROJECT_STATUS_META: Record<ProjectStatus, { label: string; icon: string; color: string }> = {
  active: { label: "active", icon: "i-ri-checkbox-blank-circle-fill", color: "text-terminal-success" },
  pre_release: { label: "pre-release", icon: "i-ri-rocket-line", color: "text-terminal-warning" },
  experimental: { label: "experimental", icon: "i-ri-flask-line", color: "text-terminal-primary" },
  paused: { label: "paused", icon: "i-ri-pause-circle-line", color: "text-terminal-text-muted" },
  completed: { label: "completed", icon: "i-ri-checkbox-circle-line", color: "text-terminal-secondary" },
  archived: { label: "archived", icon: "i-ri-archive-line", color: "text-terminal-text-dim" },
};

export const IN_PROGRESS_STATUSES: readonly ProjectStatus[] = ["active", "pre_release", "experimental"];
