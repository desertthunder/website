---
title: Bluesky Browser (CLI)
description: >
    A Golang CLI that lets you search, browse, and manage your Bluesky saved/bookmarked and liked posts offline via SQLite FTS5.
repo: https://github.com/stormlightlabs/bsky-browser
status: Released (Mature)
tech: [Go, SQLite, FTS5, Cobra, Lipgloss]
tags: [productivity, cli, social, search]
date: 2026-03-15
featured: false
---

Bluesky Browser CLI is a command-line tool that lets you search, browse, and manage your Bluesky saved bookmarks and liked posts offline via a local SQLite database with FTS5 full-text search. Built with Go, it provides a fast, scriptable interface for accessing your Bluesky content without relying on the web interface.

## Why I Built This

I made this to stop having to `CTRL`/`CMD`+`F` and infinite scroll through my saved and liked posts on Bluesky. The official Bluesky interface makes it difficult to find old content you've bookmarked or liked. This CLI tool creates a local, searchable archive of your content that you can query instantly from the terminal using full-text search.

## Features

- **OAuth Authentication** — Secure AT Protocol OAuth login with automatic token refresh
- **Offline Indexing** — Download all your bookmarks and likes to a local SQLite database
- **Full-Text Search** — Fast FTS5-powered search with BM25 ranking
- **Source Filtering** — Search all posts, saved only, or liked only
- **Styled Output** — Beautiful terminal UI using Charm's Lipgloss
- **Flexible Search** — Use positional args or `-q` flag for queries
- **Auto-refresh Option** — Force re-index before searching with `-f` flag
- **Verbose Logging** — Adjustable log levels (-v, -vv) for debugging

## Commands

- `login` — Authenticate with Bluesky via OAuth
- `whoami` — Display current user info
- `refresh` / `index` — Fetch and index all bookmarks and likes
- `[query]` — Search indexed posts (root command)

## Architecture

The CLI follows a clean, modular-ish Go architecture (just a single main package for simplicity):

- **cli.go** — Cobra command definitions and flag handling
- **auth.go** — OAuth flow with loopback client and token refresh
- **client.go** — Authenticated XRPC client for Bluesky API
- **database.go** — SQLite operations with FTS5 and migrations
- **logging.go** — Multi-writer logging with file and stderr output
- **styles.go** — Lipgloss styling definitions

## Database Schema

- **posts** — Stores bookmarked and liked posts with metadata (URI PK, CID, author, text, timestamps, source)
- **posts_fts** — FTS5 virtual table for full-text search with sync triggers (insert/update/delete)
- **auth** — OAuth tokens, session state, and DPoP metadata (DID PK, handle, tokens, PDS URL)
