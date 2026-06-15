---
title: Big Fly
description: >
  A baseball data platform with a Go API, Svelte documentation, 
  Flutter clients,  and for Lahman and Retrosheet data.
repo: https://github.com/stormlightlabs/baseball
link: https://bigfly.tech
status: In Development
tech: [Go, PostgreSQL, Redis, SvelteKit, Flutter, Retrosheet, Lahman]
tags: [baseball, api, data, analytics]
date: 2025-12-10
featured: false
---

Big Fly is a baseball statistics platform built around a Go API, a local-first ETL pipeline, a Svelte
documentation site, and Flutter clients. It serves data from Lahman, Retrosheet, MLB sources, FanGraphs
constants, and salary datasets through documented HTTP endpoints.

## Why I Built This

I wanted a baseball data API that was practical to run locally, easy to reload from source datasets,
and broad enough for historical search, pitch-level analysis, leaderboards, and game context.
The CLI owns the database, ETL, worker, validation, and server workflows so the system can be rebuilt
without a pile of one-off scripts.

## Features

- REST API under `/v1` for players, teams, games, stats, pitches, events, search, and metadata
- Interactive API documentation and Swagger/OpenAPI explorer
- ETL commands for Lahman, Retrosheet, Negro Leagues, Chadwick, salary, and derived data
- Worker-based loading flow with scoped year windows for larger Retrosheet imports
- Materialized views for batting, pitching, fielding, team stats, leaders, and milestone games
- Pitch-level endpoints derived from Retrosheet sequences
- Derived analytics for streaks, splits, run differential windows, win probability, and win expectancy
- Natural language game search with team aliases, season filters, and postseason context

## Architecture

The Go backend is split between server and ETL commands, with Cobra/Viper for CLI surfaces, PostgreSQL
for relational storage, Redis-backed rate limiting, and Swagger generation for API docs. The web app is
a SvelteKit documentation and explorer frontend, while the broader monorepo includes Flutter clients for
consuming the same baseball data.

## Status

Big Fly is in development and already has the core server, ETL, docs, and representative data-loading
flows in place. Current work is centered on API coverage, operational loading patterns, and keeping the
derived baseball views reproducible from source data.
