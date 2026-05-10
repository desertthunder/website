---
title: Lazurite
description: A cross-platform mobile client for Bluesky and Blacksky with offline-aware feeds, local search, and AT Protocol tools.
repo: https://github.com/stormlightlabs/lazurite
status: Pre-release (Active Development)
tech: [Dart, Flutter, BLoC, Drift, SQLite, ObjectBox, AT Protocol]
tags: [mobile, social, atproto, search]
date: 2026-01-04
featured: true
---

Lazurite is a Flutter client for Bluesky and Blacksky built around Material 3, account switching, pinned feeds, post composition, media handling, moderation controls, and profile tooling.

## Why I Built This

I wanted a mobile Bluesky client with more local state and more protocol visibility. Lazurite keeps common reading flows fast with cached feed and profile data, then adds tools for saved posts, liked-post search, PDS browsing, and account debugging.

## Features

- Home timeline, custom feeds, feed pinning, and feed reordering
- Post threads, replies, quote posts, reposts, likes, saves, sharing, drafts, and scheduled posts
- Profile screens with follows, followers, lists, starter packs, likes, author feeds, and profile actions
- Search across posts, actors, hashtags, starter packs, and profile-scoped posts
- Drift-backed local cache for feeds, profiles, drafts, saved posts, liked posts, and search history
- On-device semantic search for saved and liked posts with MiniLM embeddings and ObjectBox vector search
- OAuth login, account switching, session restore, and provider-aware AppView routing
- AT Protocol Dev Tools for browsing PDS repositories, collections, and records as JSON
- In-app logs with level filters, search, sharing, and export

## Architecture

The app uses a feature-first Flutter structure with shared infrastructure under `lib/core` and product areas under `lib/features`.
Screens talk to BLoCs, BLoCs call repository classes, and repositories coordinate authenticated PDS requests, public AppView requests, and local SQLite storage.

## Status

Lazurite is in active development. The current work is focused on tightening core client behavior, local/offline support, semantic search, and the protocol tooling that makes the app useful while debugging AT Protocol data.
