---
title: W1C
description: >
  A retro OS and early-web inspired web component library with portable themes, 
  interactive docs, and framework-neutral drag and resize primitives.
repo: https://github.com/desertthunder/w1c
link: https://w1c.desertthunder.dev
status: pre_release
tech: [TypeScript, Lit, Web Components, SvelteKit, Storybook, CSS]
tags: [web-components, design-system, frontend, retro-ui]
date: 2026-06-21
featured: true
---

W1C is a web component library for building retro operating-system and early-web interfaces.
It packages reusable custom elements, theme CSS, fonts, icon assets, documentation, and small
interaction primitives into a set of framework-neutral packages.

## Why I Built This

I had a few projects with System 7, Windows 95, GNOME 2, Ubuntu 8.10, and Web 1.0 interface
ideas, but the useful pieces were tied to individual apps. W1C pulls those patterns into
a standalone component library so desktop shells, document surfaces, admin panels, and
personal-web pages can reuse the same primitives without copying app code.

## Features

- Lit-based custom elements planned to be published through `@w1c/components`
- Individual component entrypoints for smaller imports
- Themes for Windows 95, GNOME 2, Ubuntu 8.10, Classic Mac, GeoCities, and Web 1.0 styles
- Optional native element styles, token styles, and CSS utilities
- Bundled theme fonts through `@w1c/fonts`
- Framework-neutral drag, resize, geometry, and pointer-session helpers in `@w1c/dnd`
- Component docs and examples on the public docs site
- Storybook workspace for component development and visual examples
- CLI support for reading bundled docs from the terminal
- Early-web primitives such as badges, counters, guestbooks, webrings, marquees, blink
  text, tiled backgrounds, link clusters, last-updated labels, and image maps

## Architecture

W1C is a pnpm workspace split into focused packages. `@w1c/components` contains the Lit
custom elements, themes, optional styles, and icon exports. `@w1c/dnd` keeps drag and
resize behavior small, dependency-free, and testable outside the component layer.
`@w1c/fonts` owns the font imports used by the themes, while the SvelteKit docs app and
Storybook package provide the public reference and component workshop.

## Status

W1C is pre-release software. The current work is focused on hardening the component API,
documenting theme and asset usage, expanding the retro component catalog, and keeping the
packages small enough to work in plain HTML, framework apps, and static personal sites.
