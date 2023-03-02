import type { ContentfulCollection } from 'contentful'
import { contentfulClient, contentTpes, type SearchParams } from './client'
import type { IArticle } from './generated'
import { remark } from '../../utils/remark'
import { calcFirstPage } from '../../utils/collection/common'

export type ArticleItem = IArticle

export const fetchArticles = async (args?: SearchParams) => {
  const entries = await contentfulClient.getEntries({
    content_type: contentTpes.article,
    order: '-fields.postedAt',
    ...args
  })
  return entries as ContentfulCollection<ArticleItem>
}

export const fetchArticlesFirstPage = async (pageSize: number = 20) => {
  const entries = await fetchArticles({
    limit: pageSize
  })
  return calcFirstPage({ entries: entries.items, pageSize })
}

// ------

export type ArticleEntry = {
  slug: string
  title: string
  content: string
  postedAt: Date
  category: string
  tags: string[] | undefined
  thumbnail: string | undefined
}

export const mapArticleEntry = async ({ fields }: Pick<ArticleItem, 'fields'>) => ({
  title: fields.title,
  slug: fields.slug,
  category: fields.category,
  postedAt: new Date(fields.postedAt),
  tags: fields.tags,
  thumbnail: fields.thumbnail?.fields.file.url,
  content: String(await remark.process(fields.body))
})
