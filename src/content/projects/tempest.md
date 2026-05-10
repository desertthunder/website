---
title: Tempest
description: A self-hostable AT Protocol Personal Data Server built with Elixir, Phoenix, SQLite, and pure-Elixir repo primitives.
repo: https://github.com/desertthunder/tempest
status: Pre-release (Active Development)
tech: [Elixir, Phoenix, SQLite, XRPC, AT Protocol, CAR, MST]
tags: [atproto, server, elixir, infrastructure]
date: 2026-05-08
featured: true
---

Tempest is a self-hostable AT Protocol Personal Data Server (PDS) built with Elixir and Phoenix.
It implements the core account, identity, repo, and sync surfaces needed to create accounts, write records, read repositories, and export CAR data.

## Why I Built This

I wanted a PDS implementation in a functional language that was entirely mine end to end, with account storage, handles, DIDs, record writes, signed commits, repo exports, and the HTTP RPC layer.
Elixir fits the shape of the project well because Phoenix gives the server a strong web foundation while OTP keeps the long-running pieces explicit.

## Features

- XRPC routing for AT Protocol server, identity, repo, and sync endpoints
- Account creation, password hashing, sessions, refresh tokens, and bearer auth
- DID document generation, hosted DID discovery, handle validation, and handle resolution
- Per-account repository storage with blocks, records, commits, and repo metadata
- Record writes through `createRecord`, `putRecord`, and `deleteRecord`
- Record reads through `getRecord`, `listRecords`, and `describeRepo`
- Sync reads through `getRepo`, `getLatestCommit`, `getRecord`, `getBlocks`, `getRepoStatus`, `listRepos`, and `listBlobs`
- CAR v1 responses for repository export
- Protocol-shaped JSON errors, verb mismatch handling, and validation boundaries

## Architecture

Tempest uses Phoenix and Bandit for HTTP, Ecto with SQLite for account data, and raw per-DID SQLite databases for repository storage.
The repository core includes pure-Elixir implementations for AT URIs, NSIDs, record keys, DIDs, TIDs, CIDs, DAG-CBOR, CAR v1, Merkle Search Tree operations, and signed commit blocks.

Every record write runs inside a SQLite transaction that updates MST entries, writes CBOR blocks, signs a new commit, updates record indexes, and advances repo metadata.

## Status

Tempest is early pre-release software.

The next major work areas are durable firehose sequencing, blob upload and garbage collection,
broader lexicon validation, OAuth, app passwords, admin tooling, and importing/exporting/verifying repo data.

For myself, I'll top it off with self-hostable deployment packaging, and compatibility testing against official fixtures and SDKs.
