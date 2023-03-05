import type { CONTENT_TYPE, IArticle } from './generated'

export const contentTypes: Record<CONTENT_TYPE, CONTENT_TYPE> = {
  article: 'article'
}

export type SearchParams = {
  order?: string
  /** max 1000 */
  limit?: number
  skip?: number
  [param: string]: any
}

export type ArticleEntity = IArticle

export type ArticleEntry = {
  slug: string
  title: string
  content: string
  postedAt: Date
  category: string
  tags: string[] | undefined
  thumbnail: string | undefined
}
