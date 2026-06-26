---
title: Colors
description: >
  A copy-friendly browser for Tailwind CSS v3, uchu, and Reasonable Colors with
  multi-format value copying and sticky palette navigation.
repo: https://github.com/desertthunder/colors
link: https://colors.desertthunder.dev
status: active
tech: [TypeScript, Vue]
tags: [colors, design-systems, tailwind, developer-tools]
date: 2026-06-26
featured: false
highlighted: true
---

Colors is a copy-friendly browser for Tailwind CSS v3, uchu, and Reasonable Colors.

It gathers three existing palette systems into one UI and makes it fast to preview a
color group and copy its value in whichever format a project needs.

## Why I Built This

I kept switching between docs and config files to grab color values while styling interfaces.

Colors keeps the palettes I reach for most in one place and copies them as raw values,
CSS custom properties, or POJOs, depending on the use case.

## Features

- Browse Tailwind CSS v3, uchu, and Reasonable Colors palettes in a single interface
- Switch displayed values between `hex`, `rgb`, `hsl`, and `oklch`
- Copy raw values, CSS custom properties, or JavaScript object entries
- Sticky color-group picker with scrollspy highlight for navigating long palettes
- Collapsible accordion sections per color group
- Compact light-to-dark swatch ramp preview for each group

## Architecture

Colors is a Vue + Vite + TypeScript single-page app deployed to Cloudflare pages.

## Status

Colors is live at [colors.desertthunder.dev](https://colors.desertthunder.dev).
