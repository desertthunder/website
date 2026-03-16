---
title: Writer
description: >
    A local-first desktop markdown editor built with Tauri, designed for
    distraction-free writing with multi-format export.
repo: https://github.com/stormlightlabs/writer
status: Pre-release (Active Development)
tech: [Rust, Tauri, React, TypeScript, SQLite]
tags: [productivity, desktop, editor]
date: 2026-03-15
featured: true
---

Writer is a local-first desktop markdown editor that keeps your documents in plain folders you choose, not locked behind a proprietary database or cloud service. It pairs a React frontend with a multi-crate Rust backend to deliver a fast, native writing experience with professional export options.

## Why I Built This

Most markdown editors either live in the browser, rely on cloud sync, or lack the polish of a native app. I wanted something that treats local folders as the source of truth, supports focused writing sessions, and can export to PDF, DOCX, and plaintext without leaving the app. Writer fills that gap with a Tauri-powered desktop app that feels lightweight but packs real functionality.

## Features

- CodeMirror 6 editor with live markdown preview and split-pane layout
- Focus mode with typewriter scrolling and paragraph dimming
- NLP-powered style checking that flags filler words, redundancies, and cliches
- Multi-format export (PDF with inline preview, DOCX, plaintext) from a unified dialog
- Global quick capture hotkey for jotting down ideas from anywhere
- Full sidebar file browser with drag-and-drop, rename, and nested directories
- Session persistence that restores open tabs, pane sizes, and layout on relaunch
- Filesystem watching with automatic sync of external changes

## Architecture

Writer is organized as a Rust workspace with three crates behind the Tauri boundary:

- **writer-core** — shared types and error contracts
- **writer-markdown** — rendering pipelines (comrak for parsing, docx-rs for DOCX)
- **writer-store** — SQLite-backed persistence and indexed search

The frontend uses Zustand for state management, a selector layer to decouple components from the store shape, and a dedicated `ports/` layer for all Tauri command interaction.

## Planned Features

- Custom style rule definitions
- Plugin system for extended functionality
- Template support for recurring document types
