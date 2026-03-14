---
title: "Dark Mode Engineering"
date: 2024-01-20
summary: "Technical considerations for implementing true dark mode experiences."
tags: ["css", "dark-mode", "accessibility"]
---

## Beyond `prefers-color-scheme`

True dark mode is more than inverting colors. It requires careful consideration of:

### Contrast Ratios

WCAG 2.1 guidelines still apply:

- Normal text: 4.5:1 minimum
- Large text: 3:1 minimum
- UI components: 3:1 minimum

### Color Temperature

Dark themes should use cooler colors:

- **Blues and cyans**: Easier on the eyes
- **Avoid pure black**: `#0a0a0a` beats `#000000`
- **Reduced saturation**: Prevents color bleeding

### Implementation Strategy

```css
:root {
  --bg: #0a0a0a;
  --fg: #e2e8f0;
  --accent: #3b82f6;
}
```

## OLED Considerations

For OLED screens, true black saves battery:

```css
@media (dynamic-range: high) {
  :root {
    --bg: #000000;
  }
}
```

## Conclusion

Dark mode done right improves accessibility and reduces eye strain.
