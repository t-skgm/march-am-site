import type { CONTENT_TYPE, IArticle, IArticleFields } from './generated'

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

export type ArticleEntry = Omit<IArticleFields, 'body' | 'postedAt' | 'thumbnail'> & {
  postedAt: Date
  thumbnail: string | undefined
  content: string
}
