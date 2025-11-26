import { springDuration, formatDuration } from "./animations";

/**
 * Initialize collapsible tag toggles with slide animations.
 *
 * Finds all `.categories` containers with a `[data-toggle]` button and attaches
 * click handlers to expand/collapse hidden tags with spring-based animations.
 */
export function initializeTagToggles() {
  const duration = springDuration({ stiffness: 200, damping: 28, min: 220, max: 360 });
  const durationStr = formatDuration(duration);

  document.querySelectorAll<HTMLDivElement>(".categories").forEach((categories) => {
    const toggle = categories.querySelector<HTMLButtonElement>("[data-toggle]");
    if (!toggle) {
      return;
    }

    if (toggle.dataset.initialized === "true") {
      return;
    }

    toggle.dataset.initialized = "true";

    const visualLabel = toggle.querySelector<HTMLSpanElement>('[aria-hidden="true"]');
    const srLabel = toggle.querySelector<HTMLSpanElement>(".sr-only");
    const hiddenTags = categories.querySelectorAll<HTMLElement>("[data-hidden]");

    hiddenTags.forEach((tag) => {
      tag.style.transition = `all ${durationStr} ease-in-out`;
    });

    toggle.addEventListener("click", () => {
      const expanded = categories.dataset.expanded === "true";
      const nextExpanded = !expanded;
      categories.dataset.expanded = nextExpanded ? "true" : "false";
      toggle.setAttribute("aria-expanded", nextExpanded ? "true" : "false");

      if (visualLabel) {
        visualLabel.textContent = nextExpanded ? "−" : "…";
      }
      if (srLabel) {
        srLabel.textContent = nextExpanded ? "Hide tags" : "Show all tags";
      }
    });
  });
}

/**
 * Initialize tag toggles when ready, handling both initial load and post-DOMContentLoaded cases.
 */
export function setupTagToggles() {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeTagToggles);
  } else {
    initializeTagToggles();
  }
}
