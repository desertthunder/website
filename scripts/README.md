# OG Image Generator

Generate Open Graph images for social sharing with terminal-themed styling.

## Usage

```bash
pnpm run generate:og --title "Your Title" --subtitle "Optional subtitle" --out public/og-image.png
```

## Options

- `--title`: Main title text (required)
- `--subtitle`: Optional subtitle
- `--mode`: Background style (grid, dot, hex) - default: grid
- `--out`: Output PNG path - default: og.png
- `--w`: Image width - default: 1200
- `--h`: Image height - default: 630
- `--spacing`: Grid/dot spacing in pixels - default: 28
- `--hexSize`: Hexagon radius in pixels - default: 22
- `--brand`: Optional brand/footer text
- `--fontPath`: Path to JetBrains Mono Regular - default: ./fonts/JetBrainsMono-Regular.ttf
- `--fontPathBold`: Path to JetBrains Mono Bold - default: ./fonts/JetBrainsMono-Bold.ttf

## Example

```bash
pnpm run generate:og \
  --title "Building with Astro" \
  --subtitle "A terminal-themed developer blog" \
  --mode hex \
  --brand "desertthunder.dev" \
  --out public/og-home.png
```

## TODO

- Integrate OG generation into Astro build pipeline
- Auto-generate OG images for blog posts from frontmatter
- Add caching to avoid regenerating unchanged images
