import { normalizeTag } from '../infra/contentful/common'
import { cleanPathParam } from '../utils/cleanPathParam'

/**
 * タグ・カテゴリ名を URL セグメントとして安全な形にする。
 * - normalizeTag: getStaticPaths 側の一覧（fetchArticleTags/fetchArticleCategories）と
 *   同じ表記ゆれ吸収を行い、ビルド出力のディレクトリ名と一致させる
 * - cleanPathParam: `/` `#` `?` を全角文字に置換する（getStaticPaths の params と同じ変換）
 * - encodeURIComponent: スペース等をパーセントエンコードし、href として不正にならないようにする
 */
const toSafePathSegment = (raw: string) => encodeURIComponent(cleanPathParam(normalizeTag(raw)))

export const routes = {
  index: '/',
  about: '/about/',
  article: {
    index: '/article/',
    slug: (s: string) => `/article/${s}/`,
    page: (p: number = 1) => `/article/page/${p.toString()}/`,
    tag: {
      index: '/article/tag/',
      /** @deprecated 通常 page を利用 */
      tag: (tag: string) => `/article/tag/${toSafePathSegment(tag)}/`,
      page: (tag: string, p: number = 1) => `/article/tag/${toSafePathSegment(tag)}/${p.toString()}/`
    },
    category: {
      index: '/article/category/',
      /** @deprecated 通常 page を利用 */
      category: (cat: string) => `/article/category/${toSafePathSegment(cat)}/`,
      page: (cat: string, p: number = 1) =>
        `/article/category/${toSafePathSegment(cat)}/${p.toString()}/`
    }
  }
} as const
