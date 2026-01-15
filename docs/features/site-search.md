# サイト内検索機能

## 概要

Pagefindを使用したクライアントサイドの全文検索機能を実装する。

## 選定理由

| 観点 | 評価 |
|------|------|
| コスト | 完全無料 |
| Astro統合 | 公式サポートあり |
| 日本語対応 | 対応済み |
| パフォーマンス | 検索UIは約6KB、インデックスは必要部分のみ遅延読み込み |
| 実装難易度 | 低（Astro統合で簡単） |

### 他の選択肢との比較

| 方法 | コスト | 実装難易度 | 検索精度 | リアルタイム |
|------|--------|-----------|---------|-------------|
| **Pagefind** | 無料 | 簡単 | 高 | × |
| Contentful API | 無料 | 最も簡単 | 中 | ○ |
| Fuse.js | 無料 | 簡単 | 中〜高 | × |
| Algolia | 無料枠あり | 簡単 | 高 | ○ |

## 技術仕様

### Pagefindとは

- 静的サイト向けの全文検索ライブラリ
- ビルド時にHTMLをクロールしてインデックスを生成
- 検索時はインデックスの必要部分のみを遅延読み込み
- 日本語のトークナイズに対応

### 動作フロー

```
[ビルド時]
Astro Build
    ↓
Pagefind CLI がHTML出力をスキャン
    ↓
検索インデックス生成 (dist/pagefind/)
    ├── pagefind.js        # 検索ライブラリ
    ├── pagefind-ui.js     # UI コンポーネント
    ├── pagefind-ui.css    # UI スタイル
    └── index/             # 検索インデックス（分割済み）

[実行時]
ユーザーが検索
    ↓
pagefind.js が必要なインデックスチャンクを取得
    ↓
クライアントサイドで検索実行
    ↓
結果表示
```

## 実装計画

### Phase 1: 基本実装

1. **Pagefindのインストール**
   ```bash
   pnpm add -D pagefind
   ```

2. **ビルドスクリプトの修正**
   ```json
   {
     "scripts": {
       "build": "astro build && pagefind --site dist"
     }
   }
   ```

3. **検索UIコンポーネントの作成**
   - `src/components/Search.astro` または `src/features/Search.tsx`
   - Pagefind UIを使用するか、カスタムUIを実装

4. **ヘッダーへの検索ボタン追加**
   - モーダルまたはドロワーで検索UIを表示

### Phase 2: 最適化

1. **インデックス対象の制御**
   - `data-pagefind-body` 属性で検索対象を記事本文に限定
   - `data-pagefind-ignore` でナビゲーション等を除外

2. **メタデータの追加**
   - `data-pagefind-meta` で記事タイトル、カテゴリ、タグを検索結果に表示

3. **日本語検索の最適化**
   - Pagefindの日本語トークナイザー設定確認

### Phase 3: UI/UX改善

1. **キーボードショートカット**
   - `Cmd/Ctrl + K` で検索モーダルを開く

2. **検索結果のハイライト**
   - マッチした箇所をハイライト表示

3. **最近の検索履歴**
   - localStorage に保存（オプション）

## ファイル構成（予定）

```
src/
├── components/
│   └── Search.astro          # 検索UIコンポーネント
├── features/
│   └── SearchModal.tsx       # 検索モーダル（Preact）
└── layouts/
    └── Layout.astro          # ヘッダーに検索ボタン追加

pagefind.yml                  # Pagefind設定ファイル（オプション）
```

## 検索対象

### 対象とするコンテンツ

- 記事タイトル
- 記事本文
- タグ
- カテゴリ

### 除外するコンテンツ

- ナビゲーション
- フッター
- サイドバー
- 404ページ

## 制約事項

1. **リアルタイム更新不可**
   - Contentfulでコンテンツを更新後、サイトを再ビルドするまで検索インデックスは更新されない
   - 現状のワークフロー（Contentful更新 → 自動デプロイ）で問題なし

2. **プレビューモードでの検索**
   - プレビューコンテンツは検索対象外
   - プレビューモードでは検索機能を無効化するか、注意書きを表示

## 参考リンク

- [Pagefind公式ドキュメント](https://pagefind.app/)
- [Astro + Pagefind統合ガイド](https://docs.astro.build/en/guides/integrations-guide/pagefind/)
- [Pagefind日本語対応](https://pagefind.app/docs/multilingual/)
