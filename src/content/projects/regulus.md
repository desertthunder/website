---
title: Regulus
description: An experimental Gleam to WebAssembly compiler written in Rust.
repo: https://github.com/desertthunder/regulus
status: Experimental (Active Development)
tech: [Rust, Gleam, WebAssembly, Tree-sitter]
tags: [compiler, webassembly, gleam, rust]
date: 2026-06-15
featured: true
---

Regulus is an experimental Gleam to WebAssembly compiler written in Rust. It parses Gleam with
tree-sitter, builds compiler-owned data structures, lowers a supported subset to core IR, and emits
`.wasm` with optional WAT output.

## Why I Built This

I wanted to understand a real compiler pipeline by building one end to end: parsing, name resolution,
type checking, lowering, runtime values, and WebAssembly output. Gleam is small enough to study closely
but expressive enough to make the work interesting.

## Features

- Single-file Gleam to WebAssembly compilation
- Supported project builds into linked Wasm output
- Source-span diagnostics for parser, resolver, and type checker errors
- Name resolution for imports, modules, locals, types, constructors, and fields
- Type checking for scalar values, structured values, calls, branches, and patterns
- Generic functions, generic constructors, closures, and list inference
- Lowering to core IR and deterministic `.wasm` emission
- Optional WAT, AST, resolved, typed, and IR debug artifacts
- Wasmtime-backed tests for scalar exports and managed runtime values
- Selected Hex and path dependency source loading

## Architecture

The pipeline is deliberately visible & aims to be as simple as possible.

Gleam source becomes a tree-sitter syntax tree, then an AST, resolved names, checked types,
core IR, and a WebAssembly module. Runtime support covers strings, records, lists, tuples,
closures, custom values, branches, equality, pattern checks, and selected standard library intrinsics.

## Status

Regulus is not a full Gleam compiler. It can compile and run small programs that use scalar values,
managed values, pattern matching, closures, selected standard library modules, and host imports.

The next features are broader dependency support, the full standard library, complete browser and
Node host ABIs, WASI adapters, and memory management.
