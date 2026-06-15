---
title: Markdownz
description: A CommonMark-compatible Markdown engine for Zig with CommonMark, GFM, and Obsidian dialect support.
repo: https://codeberg.org/desertthunder/markdownz
status: paused
tech: [Zig, Markdown]
tags: [markdown, parser, zig, developer-tools]
date: 2026-06-15
featured: false
---

Markdownz is a Markdown engine for Zig. It targets CommonMark compatibility, adds GitHub Flavored
Markdown and Obsidian Flavored Markdown modes, and exposes both a document AST and a pull-style event
stream.

## Why I Built This

I wanted a Markdown parser that I could use as a library, not just as a renderer. Markdownz keeps the
parsed tree available for transforms, formatters, renderers, and Obsidian vault tooling while still
giving low-allocation integrations an event API.

## Features

- CommonMark, GitHub Flavored Markdown, Obsidian, and strict Obsidian dialect modes
- AST-first API for traversal, transforms, formatters, and renderers
- Pull-event API for renderers, filters, and integrations
- CLI commands for checking, inspecting, event dumping, and HTML rendering
- Vendored CommonMark `0.31.2` corpus with full conformance against 652 examples
- Vendored GFM `0.29` corpus with full conformance against 672 examples
- Parsed nodes that borrow from the source input, keeping allocations predictable

## Architecture

Markdownz parses source into a document tree and renders or walks that tree through public APIs.
The event API currently parses to an AST first, then yields events from that tree, which keeps the
implementation consistent while leaving room for a streaming parser later.

## Status

Markdownz is usable for parser and renderer work, with the core CommonMark and GFM corpora passing.
Current work is focused on the remaining dialect edges, Obsidian-specific behavior, and polishing
the library surface.
