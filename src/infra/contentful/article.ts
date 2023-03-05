import type { Entry } from 'contentful'
import {
  type ArticleEntity,
  type ArticleEntry,
  contentTypes,
  type SearchParams
} from './interfaces'
import { processMarkdown } from '../../utils/remark'
import { calcFirstPage, normalizeTag } from './common'
import { uniqBy } from 'remeda'
import { contentfulClient } from './client'

const fetchCache: Record<string, ArticleEntity[]> = {}

export const fetchArticles = async (args: SearchParams = {}) => {
  // メモリキャッシュに存在すればそちらを返す
  const cacheKey = JSON.stringify(args)
  const cached = fetchCache[cacheKey]
  if (cached != null) {
    return cached
  }

  // paginateしてすべて取得
  const entries = await getNext<ArticleEntity>({
    content_type: contentTypes.article,
    order: '-fields.postedAt',
    ...args
  })

  return entries
}

const getNext = async <Item extends Entry<unknown>>(
  baseArgs: any,
  skip: number = 0,
  limit = 1000,
  prev: Item[] = []
): Promise<Item[]> => {
  const current = await contentfulClient.getEntries({
    ...baseArgs,
    limit,
    skip
  })

  const fetchedCount = skip + limit
  // 次ページ取得
  if (current.total > fetchedCount) {
    return await getNext<Item>(baseArgs, fetchedCount, limit, [
      ...prev,
      ...(current.items as Item[])
    ])
  }

  return current.items as Item[]
}

// ------

export const mapArticleEntry = async ({ fields }: Pick<ArticleEntity, 'fields'>) => ({
  title: fields.title,
  slug: fields.slug,
  category: fields.category,
  postedAt: new Date(fields.postedAt),
  tags: fields.tags,
  thumbnail: fields.thumbnail?.fields.file.url,
  content: String(await processMarkdown(fields.body))
})

export const fetchArticleEntries = async (args: SearchParams = {}): Promise<ArticleEntry[]> => {
  const article = await fetchArticles(args)
  const articleEntries = await Promise.all(article.map(mapArticleEntry))
  return articleEntries
}

export const fetchArticlesFirstPage = async (pageSize: number = 20) => {
  const entries = await fetchArticleEntries({ limit: pageSize })
  return calcFirstPage({ entries, pageSize })
}

// -----------

/** Normalize済みのtagリスト */
export const fetchArticleTags = async (): Promise<string[]> => {
  const entries = await fetchArticles()
  const tags = entries.flatMap((e) => e.fields.tags ?? [])
  const uniqTags = uniqBy(tags, (t) => t.toLowerCase())
    .sort()
    .map(normalizeTag)
  return uniqTags
}

/** Normalize済みのCategoryリスト */
export const fetchArticleCategories = async (): Promise<string[]> => {
  const entries = await fetchArticles()
  const categories = entries.map((e) => e.fields.category)
  const uniqCategories = uniqBy(categories, (t) => t.toLowerCase())
    .sort()
    .map(normalizeTag)
  return uniqCategories
}
