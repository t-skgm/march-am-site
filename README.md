# march-am site

march-am（街）の個人ブログ／ウェブサイトです。

## 主な機能

- マークダウン対応のブログ記事（リンクカード、GFMテーブル対応）
- タグ・カテゴリによる記事整理
- サイト内全文検索（Pagefind）
- RSSフィード生成
- SNSシェア用OG画像自動生成
- 日本時間（Asia/Tokyo）対応

## 技術スタック

| カテゴリ | 技術 |
|---------|------|
| フレームワーク | [Astro](https://astro.build/) |
| 言語 | TypeScript |
| UIライブラリ | [Preact](https://preactjs.com/) |
| スタイリング | [Tailwind CSS](https://tailwindcss.com/) v4 |
| CMS | [Contentful](https://www.contentful.com/) |
| 検索 | [Pagefind](https://pagefind.app/) |
| ホスティング | [Cloudflare Pages](https://pages.cloudflare.com/) |
| テスト | [Vitest](https://vitest.dev/) |

## 必要環境

- Node.js v22以上
- pnpm

## セットアップ

```bash
# 依存関係のインストール
pnpm install

# 環境変数の設定（.env.exampleを参考に.envを作成）
cp .env.example .env
```

## 開発コマンド

| コマンド | 説明 |
|---------|------|
| `pnpm dev` | 開発サーバー起動（Astro + Pagefind） |
| `pnpm build` | プロダクションビルド（検索インデックス生成含む） |
| `pnpm lint` | ESLintによるコード品質チェック |
| `pnpm typecheck` | TypeScript型チェック |
| `pnpm test` | Vitestによるユニットテスト |

## ディレクトリ構成

```
src/
├── components/     # Astro UIコンポーネント
├── constants/      # サイト設定・ルート
├── features/       # Preactインタラクティブコンポーネント
├── infra/          # Contentfulクライアント・データ取得
├── layouts/        # ページレイアウト
├── pages/          # Astroページ・APIルート
├── styles/         # グローバルCSS
└── utils/          # ユーティリティ関数

functions/          # Cloudflare Pages Functions
```

## 環境変数

| 変数名 | 説明 |
|--------|------|
| `PUBLIC_GA_TRACKING_ID` | Google Analytics |
| `PUBLIC_CONTENTFUL_SPACE_ID` | Contentful Space ID |
| `PUBLIC_CONTENTFUL_ENVIRONMENT` | Contentful Environment |
| `PUBLIC_CONTENTFUL_DELIVERY_TOKEN` | Contentful Delivery API Token |
| `PUBLIC_CONTENTFUL_PREVIEW_TOKEN` | Contentful Preview API Token |

## Contentful型定義の生成

```bash
pnpm dlx cf-content-types-generator \
  --out src/infra/contentful \
  --environment ENV \
  --spaceId SPACE \
  --token TOKEN \
  --v10 --jsdoc --response
```

## ライセンス

Private
