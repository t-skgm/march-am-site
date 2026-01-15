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

## コミット前チェック

コードを変更した後、コミット前に以下のチェックを必ず実行すること:

```bash
# 型チェック
pnpm typecheck

# リンティング
pnpm lint
```

両方のチェックが通ることを確認してからコミットする。

## React/Preact コンポーネント実装方針

React公式ドキュメントのベストプラクティスに従う。

### ファイル構成

機能単位でディレクトリを作成し、以下のように分割する:

```
src/features/{feature-name}/
├── index.ts          # エクスポート
├── types.ts          # 型定義
├── hooks.ts          # カスタムフック
├── {Feature}.tsx     # メインコンポーネント
└── {SubComponent}.tsx # サブコンポーネント
```

### コンポーネントの純粋性

- 子コンポーネントやアイコンは親コンポーネントの外で定義する
- レンダー内で関数コンポーネントを定義しない

```tsx
// ✅ Good: コンポーネント外で定義
const SearchIcon: FunctionComponent = () => <svg>...</svg>

export const SearchModal: FunctionComponent = () => {
  return <SearchIcon />
}

// ❌ Bad: レンダー内で定義
export const SearchModal: FunctionComponent = () => {
  const SearchIcon = () => <svg>...</svg>  // 毎回再生成される
  return <SearchIcon />
}
```

### 不要なEffectを避ける

- イベントに応じた処理はイベントハンドラ内で行う
- Effectは外部システムとの同期にのみ使用する

```tsx
// ✅ Good: イベントハンドラ内でリセット
const close = () => {
  setIsOpen(false)
  setQuery('')
  clearResults()
}

// ❌ Bad: Effectでリセット
useEffect(() => {
  if (!isOpen) {
    setQuery('')
    clearResults()
  }
}, [isOpen])
```

### 状態の構造化

- 重複した状態を持たない
- refで十分な場合はstateを使わない

```tsx
// ✅ Good: refのみで管理
const pagefindRef = useRef<PagefindInstance | null>(null)
const isLoaded = pagefindRef.current !== null

// ❌ Bad: 重複した状態
const [pagefindLoaded, setPagefindLoaded] = useState(false)
const pagefindRef = useRef<PagefindInstance | null>(null)
```

### カスタムフックでロジック再利用

再利用可能なロジックはカスタムフックに抽出する:

- `usePagefind` - 外部ライブラリの読み込みと操作
- `useDebouncedValue` - 値のデバウンス
- `useKeyboardShortcut` - キーボードショートカット

### JSX内の条件分岐

複雑な条件分岐は別コンポーネントに抽出する:

```tsx
// ✅ Good: 条件分岐をコンポーネントに隠蔽
<SearchResults loading={loading} query={query} results={results} />

// ❌ Bad: JSX内で複雑な条件分岐
{loading && <div>検索中...</div>}
{!loading && query && results.length === 0 && <div>見つかりません</div>}
{!loading && results.map(...)}
{!loading && !query && <div>検索してください</div>}
```

### スタイリング

- Tailwind CSSのユーティリティクラスを直接使用する
- インラインスタイルオブジェクトや外部CSSファイルは避ける

## ツールの利用

### gh コマンド

このリポジトリでは git remote がプロキシ経由（`http://local_proxy@127.0.0.1:...`）で設定されているため、gh コマンドがデフォルトで GitHub ホストを検出できない。

そのため、**必ず `-R owner/repo` フラグでリポジトリを明示的に指定する**こと。

```bash
# ❌ エラーになる
gh pr create --title "..."

# ✅ 正しい使い方
gh pr create -R t-skgm/march-am-site --title "..."
```

## タスク完了後のフロー

依頼されたタスクが完了したら、以下のフローでPRを作成する:

1. **コミット前チェック**
   ```bash
   pnpm typecheck
   pnpm lint
   ```

2. **変更をコミット**
   ```bash
   git add <変更ファイル>
   git commit -m "fix/feat: 変更内容の要約"
   ```

3. **ブランチをプッシュ**
   ```bash
   git push -u origin <ブランチ名>
   ```

4. **PRを作成**
   ```bash
   gh pr create -R t-skgm/march-am-site --head <ブランチ名> --title "..." --body "..."
   ```

### PR本文のテンプレート

```markdown
## Summary
- 変更内容を箇条書きで説明

## Test plan
- [ ] テスト項目1
- [ ] テスト項目2
```
