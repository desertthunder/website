/**
 * Sets up keyboard navigation for pagination links
 * Supports arrow keys and double bracket shortcuts
 */
export function setupPaginationNavigation(): void {
  document.addEventListener("keydown", (e) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return;
    }

    const prevLink = document.querySelector<HTMLAnchorElement>('a[data-nav="prev"]');
    const nextLink = document.querySelector<HTMLAnchorElement>('a[data-nav="next"]');

    if (e.key === "ArrowLeft") {
      prevLink?.click();
    } else if (e.key === "ArrowRight") {
      nextLink?.click();
    } else if (e.key === "[" && document.activeElement?.tagName !== "INPUT") {
      const handleSecondBracket = (e2: KeyboardEvent) => {
        if (e2.key === "[") {
          prevLink?.click();
        }
        document.removeEventListener("keydown", handleSecondBracket);
      };
      document.addEventListener("keydown", handleSecondBracket);
      setTimeout(() => document.removeEventListener("keydown", handleSecondBracket), 500);
    } else if (e.key === "]" && document.activeElement?.tagName !== "INPUT") {
      const handleSecondBracket = (e2: KeyboardEvent) => {
        if (e2.key === "]") {
          nextLink?.click();
        }
        document.removeEventListener("keydown", handleSecondBracket);
      };
      document.addEventListener("keydown", handleSecondBracket);
      setTimeout(() => document.removeEventListener("keydown", handleSecondBracket), 500);
    }
  });
}

/**
 * Paginates an array of items
 */
export function paginate<T>(items: T[], page: number, pageSize: number): PaginatedResult<T> {
  const totalPages = Math.ceil(items.length / pageSize);
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;

  return {
    data: items.slice(start, end),
    currentPage,
    lastPage: totalPages,
    total: items.length,
    pageSize,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
  };
}

export type PaginatedResult<T> = {
  data: T[];
  currentPage: number;
  lastPage: number;
  total: number;
  pageSize: number;
  hasNext: boolean;
  hasPrev: boolean;
};
