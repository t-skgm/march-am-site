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
```

## ツールの利用

### gh

- -R owner/repo フラグが必要です。
