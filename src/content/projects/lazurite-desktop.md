---
title: Lazurite Desktop
description: >
  A desktop Bluesky and AT Protocol power tool with multicolumn feeds, saved-post search, and a 
  local PDS explorer.
repo: https://github.com/stormlightlabs/lazurite-desktop
status: paused
tech: [Rust, Tauri, Solid.js, TypeScript, SQLite, Tailwind, AT Protocol]
tags: [desktop, social, atproto, search]
date: 2026-03-29
featured: false
---

Lazurite Desktop is a Tauri app for Bluesky users who want faster navigation, denser views, keyboard
shortcuts, local search, and direct access to AT Protocol records. It is the desktop companion to
Lazurite mobile and the follow-up to my earlier Bluesky Browser projects.

## Why I Built This

I wanted a Bluesky client that fits desktop habits: multicolumn feeds, command-heavy navigation,
saved-post search, diagnostics, and a PDS browser in the same app. The project keeps the social
client visible while giving power users a place to inspect account data and protocol behavior.

## Features

- Account switching and multicolumn views
- Pinned feed navigation with keyboard shortcuts
- Saved and liked post search backed by local SQLite
- Optional local semantic search with FastEmbed and vector search
- PDS browser for exploring repositories, collections, and records
- Profile context for relationship and moderation state
- Lists, starter packs, feed views, and composer workflows
- Image gallery, thread drawer, diagnostics panels, and app-wide shortcuts

## Architecture

The frontend uses Solid.js, TypeScript, Tailwind, Vite, and Tauri's desktop APIs.

The Rust side handles AT Protocol access through `jacquard`, local persistence through
`rusqlite`, semantic indexing through `fastembed`, and desktop integrations through Tauri plugins.

## Status

Lazurite Desktop is pre-release software. The current build focuses on account management,
feed workflows, search, and protocol inspection, with standard.site reading planned as a
near-term feature.
