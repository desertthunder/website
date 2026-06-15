---
title: Lazurite
description: >
  A cross-platform mobile client for Bluesky and Blacksky with offline-aware feeds, 
  local semantic search, and AT Protocol tools.
repo: https://github.com/stormlightlabs/lazurite
status: pre_release
tech: [Dart, Flutter, BLoC, Drift, SQLite, ObjectBox, AT Protocol]
tags: [mobile, social, atproto, search]
date: 2026-01-04
featured: true
---

Lazurite is a Flutter client for Bluesky and Blacksky built with Material 3. It covers the core social
client flows, then adds local-first tools for saved posts, liked-post search, account debugging, and
PDS inspection.

## Why I Built This

I wanted a mobile Bluesky client with more local state and more protocol visibility. Lazurite keeps
common reading flows fast with cached feed and profile data, works better when the network is flaky,
and exposes enough AT Protocol data to debug what the app is doing.

## Features

- Home timeline, custom feeds, feed pinning, and feed reordering
- Post threads, replies, quote posts, reposts, likes, saves, sharing, drafts, and scheduled posts
- Profile screens with follows, followers, lists, starter packs, likes, author feeds, and profile
  actions
- Search across posts, actors, hashtags, starter packs, and profile-scoped posts
- Notifications, direct messages, lists, starter packs, labelers, and moderation preferences
- Drift-backed local cache for feeds, profiles, drafts, saved posts, liked posts, and search history
- On-device semantic search for saved and liked posts with MiniLM embeddings and ObjectBox vector search
- Offline-aware screens that render cached data and disable network-only actions
- OAuth login, account switching, session restore, and debug app-password login
- Provider-aware AppView routing for Bluesky, Blacksky, and validated custom AppViews
- Follow audits for deleted, deactivated, suspended, blocking, hidden, and self-follow records
- AT Protocol Dev Tools for browsing PDS repositories, collections, and records as JSON
- In-app logs with level filters, search, sharing, and export
- Light and dark Material 3 themes, multiple palettes, and card or compact feed layouts

## Architecture

The app uses a feature-first Flutter structure with shared infrastructure under `lib/core` and
product areas under `lib/features`. Screens talk to BLoCs, BLoCs call repository classes, and
repositories coordinate authenticated PDS requests, public AppView requests, Drift storage, and
ObjectBox vector search.

## Status

Lazurite is in active development. Current work is focused on tightening the core client behavior,
improving local and offline support, expanding semantic search, and refining the protocol tools that
make it easier to browser the [ATmosphere](https://atmosphereaccount.com)
