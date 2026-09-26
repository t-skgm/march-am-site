# サイトレビュー TODO

2026-09-26 に `pnpm dev` 上で PC（1280px）/ スマホ（375px）幅を実機確認したレビュー結果。
優先度順に並べている。完了したらチェックを付ける。

## 🔴 高：壊れている / 影響大

- [x] **記事カードのリンク入れ子を解消する**（`src/components/molecules/FullwidthCard.astro`）
  - カード全体の `<a>` 内にカテゴリ・タグの `<a>` があり不正 HTML。トップで無名の空リンクが 20 個生成され Tab フォーカスも止まる
  - リンク名が「日付 + title logo + タイトル×2」と冗長
  - 対応: タイトルのみを `<a>` にし `::after { position:absolute; inset:0 }` で全面クリック化、タグ類はリンク外へ
- [x] **ロゴ（トップへのリンク）をクリック可能にする**（`src/components/molecules/Logo.astro`）
  - `z-index: -1` で body の背面に潜り、PC でクリック不可（`elementFromPoint` が BODY）
  - スマホでは半透明の本文背景の裏に透けて「back to top」と重なる
- [x] **検索モーダルのアクセシビリティ対応**（`src/features/search/SearchModal.tsx`）
  - `role="dialog"` / `aria-modal` / ラベルがない → `<dialog>` + `showModal()` への置き換えを検討
  - フォーカストラップがなく Tab で背面へ抜ける
  - 閉じた後に起動ボタンへフォーカスが戻らない
  - 入力欄にラベルがない（placeholder のみ）、`outline-none` でフォーカス表示が消えている
  - 結果件数の `aria-live` 通知がない
  - 背面ページのスクロールがロックされない
- [x] **コントラスト不足を解消する**（WCAG AA 4.5:1 未達）
  - 抹茶色 `rgb(118,145,113)` × 白系 ≒ 3.3:1
  - 対象: カテゴリバッジ、タグピル、プレースホルダーのタイトル文字、ページネーションの丸ボタン
  - 対応: 抹茶色を暗くする（例: `#56704f` 前後）

## 🟠 中：アクセシビリティ / SEO

- [x] サムネイル `<img>` に `alt`・`loading="lazy"` を付ける（高さ固定コンテナのため width/height は不要と判断）（`FullwidthCard.astro`）
- [x] プレースホルダーの鳥画像を `alt=""`（装飾扱い）にする（`FullwidthCard.astro`）
- [ ] 記事末尾の「←」リンクに `aria-label`（例: 記事一覧へ戻る）を付ける（`Main.astro`）
- [ ] 「back to top」（→ `/`）と末尾「←」（→ `/article/`）の戻り先の不一致を整理する（`Main.astro`）
- [ ] 埋め込み `iframe`（Apple Music 等）に `title` を付与する（remark 処理 or 記事側）
- [ ] 記事ごとの meta description を設定する（現状全ページ "the site of march-am"）
- [ ] スキップリンクを追加し、フッターの主要導線を `<nav>` にする（`Layout.astro` / `Footer.astro`）
- [ ] 装飾記号（「→」「&gt; View all articles」）を読み上げ対象から外す（`aria-hidden` or CSS）
- [x] 記事の日付を `<time datetime>` にする（`src/features/ArticleContent.astro`）
- [ ] スマホのタップ領域を 24px 以上にする（Category / Tag / back to top 等）

## 🟡 デザイン

- [ ] 記事タイトルの `break-all` をやめる（「Emo/P｜ost-Hardcore」と単語途中で折れる）→ `overflow-wrap: anywhere` + `text-wrap: balance`（`ArticleContent.astro`）
- [ ] Lora のイタリック / 600 を読み込み、合成（faux）イタリック・ボールドを解消する（`Layout.astro`）
- [ ] PC 幅で右側に約 180px の白帯が出る問題を解消する（本文右マージン 250px と背景画像幅の不一致）
- [ ] プレースホルダーサムネイルとその下でタイトルが二重表示されるのを整理する。スマホで長いタイトルが下端ギリギリ
- [ ] 右下固定の鳥が本文・フッターに重なる。フッター付近で鳥が 2 羽になる
- [ ] 記事末尾の「←」だけの寂しいエリアに前後記事ナビ / 関連タグを置く

## ⚪ コンテンツ / コード / 細部

- [ ] 「Best Shoegazing Discs」の重複記事（別 slug で 2 件）を整理する（Contentful）
- [ ] タグ表記ゆれを整理する（Apple Music / AppleMusic、scrap / Scrap、martin newell / Martin Newell）（Contentful）
- [ ] タグ一覧に記事数を表示する、`☆6` 等のタグの意味を補足する
- [ ] タグ URL を `encodeURIComponent` する（`/article/tag/BURGER NUDS/1/` にスペースが生で入る）
- [ ] `ArticleList.astro` の `fullwidth != null` を `fullwidth ?` に修正する
- [ ] 記事ページのタグ一覧に `flex-wrap` を付ける（`ArticleContent.astro`）
- [ ] CLAUDE.md のカテゴリ記述を更新する（`Diary | Review` → `Column` を追加）
- [ ] Twitter → X の名称・アイコン更新を検討する
- [x] `.playwright-mcp/` を `.gitignore` に追加する
