import { normalizeTag } from '../infra/contentful/common'

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
      tag: (tag: string) => `/article/tag/${normalizeTag(tag)}/`,
      page: (tag: string, p: number = 1) => `/article/tag/${normalizeTag(tag)}/${p.toString()}/`
    },
    category: {
      index: '/article/category/',
      /** @deprecated 通常 page を利用 */
      category: (cat: string) => `/article/category/${normalizeTag(cat)}/`,
      page: (cat: string, p: number = 1) =>
        `/article/category/${normalizeTag(cat)}/${p.toString()}/`
    }
  }
} as const
