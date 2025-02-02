/** All blog posts as a collection. */
export const getAllPosts = collection => {
  return collection.getFilteredByGlob('./src/posts/**/*.md').reverse();
};

/** All relevant pages as a collection for sitemap.xml */
export const showInSitemap = collection => {
  return collection.getFilteredByGlob('./src/**/*.{md,njk}');
};

/** All tags from all posts as a collection - excluding custom collections */
export const tagList = collection => {
  const tagsSet = new Set();
  for (const item of collection.getAll()) {
    if (!item.data.tags) continue;
    for (const tag of item.data.tags) {
      if (!['posts', 'docs', 'all'].includes(tag)) {
        tagsSet.add(tag);
      }
    }
  }
  return Array.from(tagsSet).sort();
};

/**
 * Sort bookmarks by date, then alphabetically.
 */
export const sortedBookmarks = collection => {
  return collection.getFilteredByGlob('./src/bookmarks/**/*.md').sort((a, b) => {
    return a.date - b.date || a.url - b.url;
  });
}
