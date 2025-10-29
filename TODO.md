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

- Auto-generate OG images for each blog post during build
- Use post title and subtitle from frontmatter
- Store in public/og/ directory
- Add og:image meta tags to blog post template

### RSS Feed

- Add RSS feed generation for blog posts
- Include full content or excerpts
- Add to site header with link tag

### Sitemap

- Ensure Astro sitemap integration is configured
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
