---
title: Bluesky Browser (GUI)
description: >
    A desktop app for searching your Bluesky bookmarks and likes, built with Go and Wails.
repo: https://github.com/desertthunder/bsky-browser-gui
status: Pre-release (Active Development)
tech: [Go, Wails v2, SQLite, FTS5]
tags: [productivity, desktop, social, search]
date: 2026-03-15
featured: true
---

Bluesky Browser GUI is a desktop application that lets you search, browse, and manage your Bluesky saved bookmarks and liked posts offline via a native SQLite-backed full-text search index. It is built with Go and Wails v2, and has a fast, native desktop experience with a modern web-based UI, inspired
by IBM Carbon and [anisota](https://anisota.net).

## Why I Built This

I made this to stop having to `CTRL`/`CMD`+`F` and infinite scroll through my saved and liked posts on Bluesky. The official Bluesky interface makes it difficult to find old content you've bookmarked or liked. This tool creates a local, searchable archive of your content that you can query instantly using full-text search.

## Features

- OAuth authentication with Bluesky using loopback OAuth
- Local SQLite database with FTS5 full-text search and BM25 ranking
- Desktop-native UI with search interface, source filtering, and results table
- Real-time indexing progress with desktop events and log viewer
- Rich-text rendering for links, mentions, and hashtags in posts
- Source filtering: search All, Saved only, or Liked only
- Click-to-open original posts on bsky.app
- Session persistence with automatic token refresh
- Keyboard shortcuts for power users (Cmd/Ctrl+K for search, Cmd/Ctrl+R for refresh)

## Architecture

The app has a clean Go backend (single `main` package) with Wails v2, and a Svelte SPA frontend:

- **Go Backend** — Authentication service, index service, database layer with migrations
- **SQLite + FTS5** — Local data persistence with full-text search indexing
- **Wails v2** — Bridges Go backend with modern web frontend
- **Frontend** — Svelte 5 & Tailwind based UI with search, filtering, and progress visualization

## Database Schema

- **posts** — Stores bookmarked and liked posts with metadata
- **posts_fts** — FTS5 virtual table for full-text search with sync triggers
- **auth** — OAuth tokens, session state, and DPoP metadata

## Data Storage

- **Database**: `~/.config/bsky-browser/bsky-browser.db`
- **Logs**: `~/.config/bsky-browser/logs/bsky-browser_*.log`
