# DesertThunder.dev Site

This is the Astro-powered source for [desertthunder.dev](https://desertthunder.dev).

The project runs on pnpm and targets Node 20+.

## Highlights

### Content Helper CLI (`scripts/create.js`)

Run `node scripts/create.js` to launch a helper for creating blog posts, bookmarks, or pages. Use `--help` for more details.

### Search Implementation

The site features a custom client-side search powered by MiniSearch.

#### How it works

**Build time:**

- API endpoint at `src/pages/search-index.json.ts` is prerendered during build
- Reads all content collections (blog, bookmarks, projects, pages)
- Strips markdown formatting and extracts first 500 chars of content
- Generates static JSON file at `/search-index.json`
- Works dynamically in dev mode, static in production

**Runtime:**

- Search UI components load the JSON index in the browser
- MiniSearch instantiates with fuzzy matching and prefix search enabled
- Results are ranked by relevance (title matches weighted 2x, descriptions 1.5x)
- Match highlighting shows query terms in yellow

### OG Image Implementation

The site generates custom Open Graph images for social media sharing using Satori and Resvg.

#### How it works

**Build time:**

- Two API endpoints generate images at build time:
    - `src/pages/og/[...slug].png.ts` - Dynamic images for all blog posts
    - `src/pages/og/page/[id].png.ts` - Static images for site pages (home, etc.)
- Satori converts React-like JSX objects to SVG
- Resvg converts SVG to optimized PNG format
- Images are 1200x630 pixels (standard OG dimensions)
- Uses JetBrains Mono font loaded from `/fonts/`

**Design:**

- Terminal-themed aesthetic matching site design
- macOS-style window with colored dots (red, yellow, green)
- Title bar shows site name "Desert Thunder | Owais Jamil"
- Content area displays title, description, and optional subtitle
- Footer shows page URL and domain
- Dark background (`#161821`) with subtle radial gradient
- Blog posts include formatted date in command-style format

**Caching:**

- Images served with immutable cache headers (`max-age=31536000`)
- Pre-generated at build time, not runtime
