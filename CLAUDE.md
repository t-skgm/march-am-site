# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with this repository.

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
