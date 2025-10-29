# TODO: Component-Based Refactoring

## Layout Improvements

### Blog Post Layout

- Create dedicated BlogPost.astro layout extending Base.astro
- Include reading time calculation
- Add previous/next post navigation with vim keybinds for navigation
- Add table of contents for long posts

## Content Collection Enhancements

### Pages Collection

- Actually use the pages collection for static pages
- Create dynamic page template at src/pages/[...slug].astro
- Migrate about page content to collection

### Blog Listing Improvements

- Add pagination for blog index
- Add search functionality (client-side or build-time)

### Bookmark Improvements

- Group bookmarks by category
- Add date range filtering
- Grid layout instead of terminal list

## Build Process

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

## Developer Experience

### Type Safety

- Add TypeScript interfaces for all component props
- Type the content collection schemas more strictly
- Add JSDoc comments for complex functions

### Testing

- Add Vitest for component testing
- Test Terminal component rendering
- Test content collection queries

### Documentation

- Document component API in README or Storybook
- Add examples for each component usage
- Document content frontmatter requirements

## Nice to Have

### Dark/Light Mode Toggle

- Implement theme switcher (already dark by default)
- Store preference in localStorage
- Add light theme color palette

### Reading Progress Indicator

- Add progress bar for blog posts
- Show estimated reading time
- Scroll-to-top button

### Comments

- Integrate comment system (Giscus, utterances, etc.)
- Add to blog post layout
- Respect privacy and performance

### Analytics

- Add privacy-friendly analytics (Plausible, Fathom, etc.)
- Track page views and popular content
- Respect DNT header
