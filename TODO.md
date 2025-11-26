# To-Do

## Refactor

### Fonts

- Serif font: Crimson Pro
    - Title, navigation
- Sans font: Recursive
    - Body text
- Monospace: Google Sans Code

### Colors

- Light mode: nord light inspired (with darker text)
- Dark mode: iceberg.vim
- Implement both, but default to light

### Layout

- Single column with wide content area
- Large typography
- Consistent spacing (limited on mobile, more generous on desktop)
- No more terminal style UI
- Dashed/Dotted borders

```md
iceberg:
    palette:
        base00: #dcdfe7
        base01: #cc517a
        base02: #668e3d
        base03: #c57339
        base04: #2d539e
        base05: #7759b4
        base06: #3f83a6
        base07: #33374c
        base08: #8389a3
        base09: #cc3768
        base0A: #598030
        base0B: #b6662d
        base0C: #22478e
        base0D: #6845ad
        base0E: #327698
        base0F: #262a3f
- system: "base16"
  name: "Nord Light"
  author: "threddast, based on fuxialexander's doom-nord-light-theme (Doom Emacs)"
  variant: "light"
    palette:
        base00: "#e5e9f0"
        base01: "#c2d0e7"
        base02: "#b8c5db"
        base03: "#aebacf"
        base04: "#60728c"
        base05: "#2e3440"
        base06: "#3b4252"
        base07: "#29838d"
        base08: "#99324b"
        base09: "#ac4426"
        base0A: "#9a7500"
        base0B: "#4f894c"
        base0C: "#398eac"
        base0D: "#3b6ea8"
        base0E: "#97365b"
        base0F: "#5272af"
```

### Components

Tags: square with subtle rounding and background color

### Content

Most of home moved to about me page, keep `whoami` section

## Pre-Deployment

- Only build blog post & project OG-images in addition to default

## Nice to Have

### Blog Listing Improvements (later)

- Add search functionality (client-side or build-time)

### Comments & Analytics

- Add to blog post layout
    - Integrate comment system (Giscus)
- Add analytics
- Track page views (respect DNT header) and popular content
