---
title: Beacon
description: A Rust implementation of the language server protocol & a Hindley-Milner type system for Python.
repo: https://github.com/stormlightlabs/beacon
status: In Development
tech: [Rust, LSP, Python]
tags: [language-server, developer-tools]
date: 2025-10-30
featured: true
---

Beacon is a Rust implementation of the language server protocol & a Hindley-Milner type system for Python, inspired by languages like F# & OCaml and the work of Astral.

## Goals

Deliver an incremental, performant, pragmatic Hindley-Milner (HM) type inference and checking engine for Python that integrates with modern editor tooling via the Language Server Protocol (LSP).
The system supports Python's dynamic features thoughtfully, interoperates with `typing` hints, and scales to multi-file projects.

## HM for Python

HM type systems provide principled inference (no annotations required), compositional reasoning, strong guarantees, & fast unification-based algorithms (Algorithm W family).

### Challenges

- Pervasive dynamism (monkey-patching, `__getattr__`, metaclasses, duck typing, runtime reflection)
- Nominal & structural patterns mixed
- Subtyping-ish expectations (`None`, unions, protocols)
- First-class classes & functions
- Decorators
- Generators
- Async
- Pattern matching (PEP 634)

## Features

### "Smart" Completions

The `CompletionProvider` looks at the latest document snapshot (text, AST, and symbol tables) to suggest in-scope names, imports, and attribute members the moment you type or hit the `"."` trigger.

### Confident Feedback

Beacon's static analyzer combines Hindley-Milner style inference with control/data-flow passes. It flags type mismatches, use-before-def bugs, unreachable code, and unused bindings, then caches the results per file so hovers, squiggles, and inlay hints stay consistent without extra latency.

### Shared Insight

Both systems reuse the same analyzer output, so upcoming features like type-filtered completions or richer hover details piggyback on the existing substitution data instead of re-walking files.

## Design

HM core + pragmatic extensions, with a gradual boundary to accommodate Python idioms and annotations:

- HM for expressions and local bindings
- Controlled subtyping-like features via unions/optionals and protocols/structural constraints
- Annotation-aware: treat PEP 484/PEP 695 types as constraints and hints
- Soundness modes: "strict", "balanced", "loose" (affecting treatment of `Any`, unknown attributes, dynamic imports)
