# TODO: Component-Based Refactoring

This site is currently using a layout-first approach. The following refactorings would improve modularity and maintainability:

## Completed

### Terminal Component System
- Created Command.astro component for terminal commands with semantic API
- Created Output.astro component for command output
- Updated Terminal.astro to accept title prop displaying as /{title}/
- Migrated all pages to use Command/Output pattern

### Blog Components
- Created BlogPostCard.astro for post listings with TUI-style dashed borders
- Added prose styling (prose.css) for markdown content
- Made tags clickable throughout the site

### Tag System
- Created /tags/index.astro showing all tags with post counts
- Created /tags/[tag].astro for dynamic tag filtering
- Added tags navigation link to main nav

## Component Extraction

### Navigation Component

- Extract `<nav>` from Base.astro into separate Nav.astro component
- Props: currentPath for active page highlighting
- Benefits: Reusable, testable, easier to modify

### Header Component

- Extract site header from Base.astro
- Props: title, subtitle (optional)
- Benefits: Support different header styles per page type

### Footer Component

- Extract footer from Base.astro
- Consider dynamic year calculation
- Benefits: Centralized copyright management

### Bookmark Card Component

- Create component for individual bookmark display
- Props: title, url, date, categories, content
- Benefits: Consistent bookmark styling, easier A/B testing

## Layout Improvements

### Blog Post Layout

- Create dedicated BlogPost.astro layout extending Base.astro
- Include reading time calculation
- Add previous/next post navigation
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
- Consider grid layout instead of terminal list

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
