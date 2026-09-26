# 管理者用 Contentful 編集リンク

## 概要

管理者がサイトを閲覧しているときのみ、記事ページと記事一覧（カード・リスト）に「Contentful で編集」リンクを表示する。
リンク先は `https://app.contentful.com/spaces/{space}/environments/{env}/entries/{entryId}`。

## 使い方

| 操作 | URL |
|------|-----|
| ログイン | `/api/admin-login?secret=<CONTENTFUL_PREVIEW_SECRET>` |
| ログアウト | `/api/admin-logout` |

ログインすると1年間有効な Cookie が発行され、以降そのブラウザでは編集リンクが表示される。

## 仕組み

```
[ビルド時]
各記事の sys.id から編集URLを生成し、hidden 属性付きの <a data-admin-only> として静的HTMLに埋め込む

[実行時]
/api/admin-login で2つのCookieを発行
  - admin_session: HMAC-SHA256(CONTENTFUL_PREVIEW_SECRET, 'admin-session')（HttpOnly）
  - is_admin=1: クライアント判定用のヒント（非HttpOnly）
    ↓
Layout の script（src/features/admin/revealAdminLinks.ts）
  is_admin=1 があるときだけ /api/admin-status を呼ぶ（一般閲覧者はリクエストしない）
    ↓
{ isAdmin: true } なら [data-admin-only] の hidden を外す
```

- Cookie には生のシークレットを保存しない。シークレットを変更すると既存セッションは自動的に無効になる
- 編集ページ自体は Contentful へのログインが必要なため、リンクURLが HTML に含まれていても編集はできない
- リンクには `data-pagefind-ignore` を付け、検索インデックスから除外している

## 関連ファイル

- `functions/api/admin-session.ts` / `admin-login.ts` / `admin-logout.ts` / `admin-status.ts`
- `src/components/molecules/AdminEditLink.astro`
- `src/features/admin/revealAdminLinks.ts`
- `src/utils/contentful.ts`
