# CLAUDE.md

このファイルは、このリポジトリでClaude Code（claude.ai/code）を利用する際のガイドラインを示します。

## プロジェクト概要

**march-am-site** は「march-am」（街）の個人ブログ／ウェブサイトです。Astroで構築された静的サイトで、Contentful CMSからコンテンツを取得し、Cloudflare Pagesにデプロイされています。

### 主な特徴
- マークダウン対応のブログ記事（リンクカード、GFMテーブル対応）
- タグ・カテゴリによる記事整理
- RSSフィード生成
- SNSシェア用OG画像生成
- 日本時間（Asia/Tokyo）対応

## パッケージマネージャー

このプロジェクトは **pnpm** を使用します（npmやyarnは使用しません）。

```bash
# 依存関係のインストール
pnpm install

# 開発サーバーの起動
pnpm dev

# リンティングの実行
pnpm lint

# 型チェックの実行
pnpm typecheck

# テストの実行
pnpm test
```

`npm install` の使用や `package-lock.json` の作成は禁止です。`pnpm-lock.yaml` を利用してください。

## 技術スタック

- **フレームワーク**: Astro（静的サイトジェネレーター）
- **言語**: TypeScript
- **テスト**: Vitest
- **CMS**: Contentful
- **スタイリング**: Tailwind CSS
- **ホスティング**: Cloudflare Pages

## ディレクトリ構成

```
src/
├── components/     # Astro UIコンポーネント
├── constants/      # サイト設定・ルート
├── features/       # React/Preactコンポーネント
├── infra/          # Contentfulクライアント・データ取得
│   └── contentful/
├── layouts/        # ページレイアウト
├── pages/          # Astroページ・APIルート
├── styles/         # CSS
└── utils/          # ユーティリティ関数（Markdown処理、日付など）

functions/          # Cloudflare Pages Functions
├── api/            # プレビュー認証エンドポイント
└── article/        # 記事ミドルウェア
```

## コンテンツアーキテクチャ

### Contentful CMS

Contentfulで単一のコンテンツタイプを管理:

**`article`** (記事):
- `title`: 記事タイトル
- `slug`: URL用スラッグ
- `category`: `Diary` | `Review`
- `postedAt`: 投稿日時
- `tags`: タグ配列
- `thumbnail`: サムネイル画像
- `ogpImageUrl`: OGP画像URL
- `body`: Markdown形式の本文

### コンテンツパイプライン

```
Contentful CMS
    ↓
src/infra/contentful/article.ts (fetchArticles)
    ↓
Markdown処理 via src/utils/remark.ts
    - 目次自動生成 (mdast-util-toc)
    - リンクカード機能 (remark-link-card-plus)
    - GFM対応 (remark-gfm)
    - 見出しへの自動ID付与 (rehype-slug)
    ↓
HTML出力
```

### 主要なデータ取得関数

- `fetchArticles()` - 全記事取得（メモリキャッシュ付き）
- `fetchArticleTags()` - タグ一覧取得
- `fetchArticleCategories()` - カテゴリ一覧取得
- `mapArticleEntry()` - Contentfulエントリを記事オブジェクトに変換

## ページルート

| ルート | 説明 |
|-------|------|
| `/` | トップページ |
| `/article/` | 記事一覧（ページネーション付き） |
| `/article/[slug]` | 個別記事ページ |
| `/article/category/[category]/[page]` | カテゴリ別一覧 |
| `/article/tag/[tag]/[page]` | タグ別一覧 |
| `/about` | Aboutページ |
| `/rss.xml` | RSSフィード |

## Cloudflare Pages設定

- **デプロイ**: GitHub Actions経由で自動デプロイ
- **Functions**: プレビュー認証機能 (`/functions/api/`)
- **OG画像**: `@cloudflare/pages-plugin-vercel-og` でOGP画像生成
- **キャッシュ**: デプロイ時に全キャッシュパージ

### 環境変数

```
PUBLIC_GA_TRACKING_ID           # Google Analytics
PUBLIC_CONTENTFUL_SPACE_ID      # Contentful Space ID
PUBLIC_CONTENTFUL_ENVIRONMENT   # Contentful Environment
PUBLIC_CONTENTFUL_DELIVERY_TOKEN # Contentful Delivery API Token
PUBLIC_CONTENTFUL_PREVIEW_TOKEN # Contentful Preview API Token
CONTENTFUL_MANAGEMENT_TOKEN     # Contentful Management Token (scripts)
CONTENTFUL_PREVIEW_SECRET       # Preview authentication secret
```

## ツールの利用

### gh

- -R owner/repo フラグが必要です。
