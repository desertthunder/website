---
title: VoltX.js
description: A lightweight, declarative alternative to component-centric UI frameworks.
repo: https://github.com/stormlightlabs/volt
status: Pre-release (Active Development)
tech: [TypeScript, Signals, WebSockets, SSE, Hypermedia]
tags: [frontend, library, framework]
date: 2025-10-30
featured: true
---

Volt is a monorepo centered around the VoltX.js runtime, a lightweight, declarative alternative to component-centric UI frameworks.
The repo also ships VoltX.css, a classless css framework for prototyping, the Volt CLI and the documentation site that demonstrates and explains the runtime.

## Philosophy/Goals

- Behavior is declared via `data-volt-*` attributes
    - HTML drives the UI, not components
- Core under 20 KB gzipped, zero dependencies
- Signals update the DOM directly without a virtual DOM
    - Native Server-Sent Events (SSE) and WebSocket patch updates
    - No reactivity scheduler, no VDOM diffing
- Extend behavior declaratively (persist, scroll, animate, etc.)
- Progressive enhancement, i.e. works with static HTML out of the box

### Values

- Never exceed 15 KB for the core (gzipped) runtime
- Work with any backend
- All source in TypeScript, no DSL or external dependencies
- Every feature ships with a test harness

## Concepts

| Concept  | Description                                                                                              |
| -------- | -------------------------------------------------------------------------------------------------------- |
| Signals  | Reactive primitives that automatically update DOM bindings when changed                                  |
| Bindings | `data-volt-text`, `data-volt-html`, `data-volt-class` connect attributes or text to expressions          |
| Actions  | `data-volt-on-click`, `data-volt-on-input`, etc. attach event handlers declaratively                     |
| Streams  | `data-volt-stream="/events"` listens for SSE or WebSocket updates and applies JSON patches               |
| Plugins  | Modular extensions (`data-volt-persist`, `data-volt-surge`, `data-volt-shift`, etc.) to enhance the core |

## VoltX.css

VoltX ships with an optional classless CSS framework inspired by Pico CSS and Tufte CSS. It provides beautiful, semantic styling for HTML elements without requiring any CSS classes - just write semantic markup and it looks great out of the box.

Features include typography with modular scale, Tufte-style sidenotes, styled form elements, dialogs, accordions, tooltips, tables, and more.

## Getting Started

- Runtime usage: see `lib/README.md` for installation guides and quick-start examples
- Local development: `pnpm install` then `pnpm --filter lib dev` run package-specific scripts (`build`, `test`, etc.)
- Documentation: `pnpm --filter docs docs:dev` launches the VitePress site

## Status

Pre-release software in active development. Expect breaking changes until v1.0 and evaluate before using in production.
