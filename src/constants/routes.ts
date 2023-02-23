import { normalizeTag } from '../utils/collection/common'

export const routes = {
  index: '/',
  about: '/about',
  article: {
    index: '/article',
    slug: (s: string) => `/article/${s}`,
    page: (p: number = 1) => `/article/page/${p.toString()}`,
    tag: {
      index: '/article/tag',
      tag: (tag: string) => `/article/tag/${normalizeTag(tag)}`,
      page: (tag: string, p: number = 1) => `/article/tag/${normalizeTag(tag)}/${p.toString()}`
    },
    category: {
      index: '/article/category',
      category: (cat: string) => `/article/category/${normalizeTag(cat)}`,
      page: (cat: string, p: number = 1) => `/article/category/${normalizeTag(cat)}/${p.toString()}`
    }
  }
} as const
