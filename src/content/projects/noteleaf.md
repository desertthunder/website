---
title: Noteleaf
description: >
    A unified personal productivity CLI that combines task management, note-taking,
    and media tracking in one place.
repo: https://github.com/stormlightlabs/noteleaf
status: Pre-release (Active Development)
tech: [Go, Charm.sh]
tags: [productivity, cli]
date: 2025-10-30
featured: true
---

Noteleaf is a unified personal productivity CLI that combines task management, note-taking, and media tracking in one place.
It provides TaskWarrior inspired task management with additional support for notes, articles, books, movies, and TV shows, all built with Golang & Charm.sh libs. Inspired by TaskWarrior & todo.txt CLI applications.

## Why I Built This

I juggle multiple apps for tasks, notes, reading lists, and media queues, and find myself frustrated with reading experiences on some publication sites.
Noteleaf provides a single CLI interface for these processes.
For developers and power users who prefer staying in the terminal, Noteleaf can handle these statically or interactively with rich TUIs.

## Features

- Task management with projects and tags
- Note-taking system
- Article parsing from URLs
- Media tracking (books, movies, TV shows)

## Basic Usage

```sh
# Initialize the application
noteleaf setup

# Add sample data for exploration
noteleaf setup seed

# Create your first task
noteleaf task add "Learn Noteleaf CLI"

# View tasks
noteleaf task list

# Create a note
noteleaf note add "My first note"

# Add a book to your reading list
noteleaf media book add "The Name of the Wind"
```

## Planned Features

- Time tracking integration
- Advanced search and filtering
- Export/import functionality
- Plugin system
- "Leaf" Server
