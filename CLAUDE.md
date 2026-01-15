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
├── features/       # React/Preact components (Preact)
├── infra/          # Contentful client & data fetching
│   └── contentful/
├── layouts/        # Page layouts
├── pages/          # Astro pages & API routes
├── styles/         # CSS
└── utils/          # Utility functions (markdown processing, date, etc.)

functions/          # Cloudflare Pages Functions
├── api/            # Preview authentication endpoints
└── article/        # Article middleware
```

## Content Architecture

### Contentful CMS

Content is managed in Contentful with a single content type:

**`article`** (記事):
- `title`: 記事タイトル
- `slug`: URL用スラッグ
- `category`: `Diary` | `Review`
- `postedAt`: 投稿日時
- `tags`: タグ配列
- `thumbnail`: サムネイル画像
- `ogpImageUrl`: OGP画像URL
- `body`: Markdown形式の本文

### Content Pipeline

```
Contentful CMS
    ↓
src/infra/contentful/article.ts (fetchArticles)
    ↓
Markdown processing via src/utils/remark.ts
    - 目次自動生成 (mdast-util-toc)
    - リンクカード機能 (remark-link-card-plus)
    - GFM対応 (remark-gfm)
    - 見出しへの自動ID付与 (rehype-slug)
    ↓
HTML output
```

### Key Data Access Functions

- `fetchArticles()` - 全記事取得（メモリキャッシュ付き）
- `fetchArticleTags()` - タグ一覧取得
- `fetchArticleCategories()` - カテゴリ一覧取得
- `mapArticleEntry()` - Contentfulエントリを記事オブジェクトに変換

## Page Routes

| Route | Description |
|-------|-------------|
| `/` | トップページ |
| `/article/` | 記事一覧（ページネーション付き） |
| `/article/[slug]` | 個別記事ページ |
| `/article/category/[category]/[page]` | カテゴリ別一覧 |
| `/article/tag/[tag]/[page]` | タグ別一覧 |
| `/about` | Aboutページ |
| `/rss.xml` | RSSフィード |

## Cloudflare Pages Configuration

- **Deployment**: GitHub Actions経由で自動デプロイ
- **Functions**: プレビュー認証機能 (`/functions/api/`)
- **OG Images**: `@cloudflare/pages-plugin-vercel-og` でOGP画像生成
- **Cache**: デプロイ時に全キャッシュパージ

### Environment Variables

```
PUBLIC_GA_TRACKING_ID           # Google Analytics
PUBLIC_CONTENTFUL_SPACE_ID      # Contentful Space ID
PUBLIC_CONTENTFUL_ENVIRONMENT   # Contentful Environment
PUBLIC_CONTENTFUL_DELIVERY_TOKEN # Contentful Delivery API Token
PUBLIC_CONTENTFUL_PREVIEW_TOKEN # Contentful Preview API Token
CONTENTFUL_MANAGEMENT_TOKEN     # Contentful Management Token (scripts)
CONTENTFUL_PREVIEW_SECRET       # Preview authentication secret
```
