# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A French-language knowledge base about software architecture patterns, built as a static website with Nuxt 4. The landing page lists 20 architectural patterns organized into 6 categories; each pattern can link to a dedicated detail page.

All content is written in **French**. Code and technical terms remain in English.

## Commands

```bash
npm run dev        # Start dev server at http://localhost:3000
npm run build      # Production build
npm run generate   # Generate static site
npm run preview    # Preview production build
```

No test framework is configured. No linter is configured.

## Tech Stack

- **Nuxt 4** (^4.3.1) with file-based routing
- **Vue 3** (^3.5.29) Composition API + `<script setup lang="ts">`
- **TypeScript** throughout
- **No UI library** — pure CSS with CSS custom properties
- **No additional dependencies** beyond Nuxt, Vue, and Vue Router

## Architecture

### Global Config

- `nuxt.config.ts` — Centralizes: `lang="fr"`, Google Fonts (DM Serif Display, IBM Plex Mono, DM Sans), `titleTemplate`, default SEO meta (OG, description), and references the global CSS file.
- `app/assets/css/global.css` — Design system tokens (CSS custom properties), reset, body styles, and the decorative grid background (`body::before`). All pages inherit these.

### Page Pattern

Each page follows the same structure:

1. **`<script setup lang="ts">`** — TypeScript interfaces for data structures, typed arrays for repeated content (cards, comparison tables, layer diagrams), raw HTML strings for code blocks rendered via `v-html`.
2. **`useHead()`** — Page-specific title only (global config handles the rest). JSON-LD structured data.
3. **`useSeoMeta()`** — Page-specific description, OG tags, Twitter Card.
4. **`<template>`** — Data-driven sections use `v-for`; unique content (prose, diagrams, code blocks) stays as direct markup.
5. **`<style scoped>`** — All page-specific CSS. Code blocks use `:deep()` for `v-html` syntax highlighting classes (`.cm`, `.kw`, `.fn`, `.str`, `.ty`, `.op`).

### Adding a New Architecture Page

1. Create `app/pages/<slug>.vue` following the pattern of `clean-architecture.vue` or `onion-architecture.vue`.
2. In `app/pages/index.vue`, add `slug: '<slug>'` to the relevant card in the `categories` array. Cards with a `slug` automatically render as `<NuxtLink>` instead of `<article>`.
3. Use `useHead()` for title + JSON-LD, `useSeoMeta()` for meta tags. Global styles, fonts, and `lang` are inherited from `nuxt.config.ts`.

### Design System

Color variants for cards use CSS custom properties scoped via classes:

| Class | `--card-accent` | Category |
|-------|----------------|----------|
| `.yellow` | `#e8c84a` | Monolithic |
| `.green` | `#4ae8b0` | Clean/DDD |
| `.blue` | `#4a9ee8` | Service-oriented |
| `.pink` | `#e84a7a` | Event-driven |
| `.purple` | `#9a4ae8` | Modular |
| `.orange` | `#e87a4a` | Distributed/Cloud |

Typography: DM Serif Display (headings), IBM Plex Mono (code/labels), DM Sans (body).
