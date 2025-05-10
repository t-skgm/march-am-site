import type { TypeArticle, TypeArticleSkeleton } from './generated'

export type ArticleEntry = TypeArticle<'WITHOUT_UNRESOLVABLE_LINKS'>

export type ArticleSkeleton = TypeArticleSkeleton

export type Article = {
  title: string
  slug: string
  category: 'Diary' | 'Review'
  postedAt: Date
  tags?: string[] | undefined
  thumbnail?: string | undefined
  ogpImageUrl?: string | undefined
  content: string
}

export const contentTypes = {
  article: 'article'
} as const

export type SearchParams = {
  order?: string
  /** max 1000 */
  limit?: number
  skip?: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [param: string]: any
}
