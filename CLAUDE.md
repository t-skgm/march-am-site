# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with this repository.

## Project Overview

**march-am-site** is a personal blog/website for "march-am" (街). The site is built as a static site using Astro and fetches content from Contentful CMS. It is deployed on Cloudflare Pages.

### Key Features
- Blog articles with markdown support (including link cards, GFM tables)
- Tag and category based article organization
- RSS feed generation
- OG image generation for social sharing
- Japanese timezone support (Asia/Tokyo)

## Package Manager

This project uses **pnpm** (not npm or yarn).

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Run linting
pnpm lint

# Run type checking
pnpm typecheck

# Run tests
pnpm test
```

Do not use `npm install` or create `package-lock.json`. The project uses `pnpm-lock.yaml`.

## Tech Stack

- **Framework**: Astro (static site generator)
- **Language**: TypeScript
- **Testing**: Vitest
- **CMS**: Contentful
- **Styling**: Tailwind CSS
- **Hosting**: Cloudflare Pages

## Directory Structure

```
src/
├── components/     # Astro UI components
├── constants/      # Site config, routes
├── features/       # React/Preact components
├── infra/          # Contentful client & data fetching
│   └── contentful/
├── layouts/        # Page layouts
├── pages/          # Astro pages & API routes
├── styles/         # CSS
└── utils/          # Utility functions (markdown processing, date, etc.)
```
