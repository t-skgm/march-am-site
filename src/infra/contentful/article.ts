import {
  contentTypes,
  type ArticleEntry,
  type SearchParams,
  type Article,
  type ArticleSkeleton
} from './interfaces'
import { processMarkdown } from '../../utils/remark'
import { calcFirstPage, normalizeTag } from './common'
import { uniqueBy, pipe, sort, map } from 'remeda'
import { createContentfulClient } from './client'
import type { EntriesQueries } from 'contentful'

const fetchCache: Record<string, ArticleEntry[]> = {}

export const fetchArticles = async (args: SearchParams = {}) => {
  // メモリキャッシュに存在すればそちらを返す
  const cacheKey = JSON.stringify(args)
  const cached = fetchCache[cacheKey]
  if (cached != null) {
    return cached
  }

  // paginateしてすべて取得
  const entries = await getNext<ArticleEntry>({
    content_type: contentTypes.article,
    order: '-fields.postedAt',
    ...args
  })

  return entries
}

const getNext = async <Item extends ArticleEntry>(
  baseArgs: EntriesQueries<ArticleSkeleton, undefined>,
  skip: number = 0,
  limit = 1000,
  prev: Item[] = []
): Promise<Item[]> => {
  const current = await createContentfulClient().getEntries({
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

export const mapArticleEntry = async ({
  fields
}: Pick<ArticleEntry, 'fields'>): Promise<Article> => ({
  title: fields.title,
  slug: fields.slug,
  category: fields.category,
  postedAt: new Date(fields.postedAt),
  tags: fields.tags,
  thumbnail: fields.thumbnail?.fields.file?.url,
  ogpImageUrl: fields.ogpImageUrl,
  content: String(await processMarkdown(fields.body))
})

export const fetchArticleEntries = async (args: SearchParams = {}): Promise<Article[]> => {
  const article = await fetchArticles(args)
  const articleEntries = await Promise.all(article.map(mapArticleEntry))
  return articleEntries
}

export const fetchArticlesFirstPage = async (pageSize: number = 20) => {
  const entries = await fetchArticleEntries({ limit: pageSize })
  return await calcFirstPage({ entries, pageSize })
}

// -----------

/** Normalize済みのtagリスト */
export const fetchArticleTags = async (): Promise<string[]> => {
  const entries = await fetchArticles()
  const tags = entries.flatMap((e) => e.fields.tags ?? [])
  const uniqTags = pipe(
    tags,
    uniqueBy((t) => t.toLowerCase()),
    sort((a, b) => a.localeCompare(b)),
    map(normalizeTag)
  )
  return uniqTags
}

/** Normalize済みのCategoryリスト */
export const fetchArticleCategories = async (): Promise<string[]> => {
  const entries = await fetchArticles()
  const categories = entries.map((e) => e.fields.category)
  const uniqCategories = pipe(
    categories,
    uniqueBy((t) => t.toLowerCase()),
    sort((a, b) => a.localeCompare(b)),
    map(normalizeTag)
  )
  return uniqCategories
}
