# TODO: Component-Based Refactoring

## Layout Improvements

### Blog Post Layout

- Reading time calculation
- Add previous/next post navigation with vim keybinds for navigation

## Content Collection Enhancements

### Blog Listing Improvements

- Add pagination for blog index

### Bookmark Improvements

- Group bookmarks by category
- Add date range filtering
- Grid layout instead of terminal list

## Build Process

- Aliases: `$components`, `$pages`, `$layouts`, `$styles`

### OG Images

- Refactor to use <https://docs.astro.build/en/reference/experimental-flags/fonts/#getfontdata>
- Refactor application fonts to use this (font stored in `/public`):

```css
/* jetbrains-mono-latin-wght-normal */
@font-face {
  font-family: 'JetBrains Mono Variable';
  font-style: normal;
  font-display: swap;
  font-weight: 100 800;
  src: url(https://cdn.jsdelivr.net/fontsource/fonts/jetbrains-mono:vf@latest/latin-wght-normal.woff2) format('woff2-variations');
  unicode-range: U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;
}
```

### RSS Feed

- Docs: <https://docs.astro.build/en/recipes/rss/>
- Add RSS feed generation for blog posts
- Include full content or excerpts
- Add to site header with link tag

### Sitemap

- Ensure Astro sitemap integration is configured (<https://docs.astro.build/en/guides/integrations-guide/sitemap/>)
- Include all pages, blog posts, and bookmarks

## Performance

### Image Optimization

- Add Astro Image integration for optimized images
- Use responsive images with multiple sizes
- Lazy load images below the fold

### Font Loading

- Self-host JetBrains Mono fonts
- Use font-display: swap for better performance
- Subset fonts to reduce file size

## Nice to Have

### Pages Collection

- Actually use the pages collection for static pages
- Create dynamic page template at src/pages/[...slug].astro
- Migrate about page content to collection

### Blog Listing Improvements

- Add search functionality (client-side or build-time)

### Dark/Light Mode Toggle

- Implement theme switcher (already dark by default)
- Store preference in localStorage
- Add light theme color palette

### Reading Progress Indicator

- Add progress bar for blog posts
- Show estimated reading time
- Scroll-to-top button

### Comments & Analytics

- Integrate comment system (Giscus)
- Add to blog post layout
- Add privacy-friendly analytics (Plausible, Fathom, etc.)
- Track page views and popular content
- Respect DNT header
