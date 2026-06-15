---
title: Beacon
description: >
  A language server protocol implementation, static analyzer, and Hindley-Milner-inspired 
  type system for Python.
repo: https://github.com/stormlightlabs/beacon
status: In Development
tech: [Rust, LSP, Python, Type Inference, Static Analysis]
tags: [language-server, developer-tools, python, rust]
date: 2025-10-30
featured: true
---

Beacon is a Rust implementation of the Language Server Protocol with a Hindley-Milner-inspired type
system for Python. It aims to bring fast inference, static analysis, and editor feedback to Python
without making annotations mandatory.

## Why I Built This

I wanted to explore what a pragmatic HM-style checker could look like for Python. The goal is not to
pretend Python is ML but instead infer useful types, respect Python's dynamic edges, and feed that
analysis into editor features that feel immediate.

## Features

- Hindley-Milner-style type inference with generics and constraints
- Type narrowing through pattern matching and control flow
- Real-time diagnostics for syntax, semantic, and type errors
- Hover, completions, navigation, and symbol search through LSP
- Code actions and refactoring support, including quick fixes and renaming
- Semantic highlighting and inlay hints
- Code formatting and static analysis
- Stdio mode for editor integration and TCP mode for debugging or remote use
- Editor packages for VS Code and Zed, plus standard LSP support for Neovim and Helix

## HM for Python

HM type systems give strong local inference through unification, but Python needs a gradual boundary.
Beacon combines expression and local binding inference with support for annotations, unions, optionals,
protocols, dynamic imports, decorators, generators, async code, and pattern matching.

The checker can run in stricter or looser modes depending on how much `Any`, unknown attributes, and
dynamic behavior a project wants to allow.

## Architecture

Beacon keeps the analyzer output shared across the language server. Diagnostics, hovers, completions,
inlay hints, and later type-filtered completions can reuse the same syntax trees, symbol tables,
substitutions, and control-flow results instead of re-walking files for each feature.

## Status

Beacon is in development. The current focus is the analyzer core, LSP behavior, editor packaging, and
practical Python compatibility across real workspaces.
