import { type CollectionEntry, getCollection } from 'astro:content'
import { sortBy, uniqBy } from 'remeda'
import { routes } from '../../constants/routes'
import type { Page } from 'astro'

export type BlogEntry = CollectionEntry<'blog'>

/**
 * get BlogEntry array
 * - Publishedのみ
 * - 日付最近順
 */
export const getBlogCollection = async (): Promise<BlogEntry[]> => {
  const entries = await getCollection('blog', onlyPublished)
  return sortBy(entries, [(e) => e.data.postedAt, 'desc'])
}

export const onlyPublished = (entry: { data: { draft?: boolean | undefined } }): boolean =>
  entry.data.draft == null || !entry.data.draft

export const getBlogTags = async (): Promise<string[]> => {
  const entries = await getBlogCollection()
  const tags = entries.flatMap((e) => e.data.tags ?? [])
  const uniqTags = uniqBy(tags, (t) => t.toLowerCase()).sort()
  return uniqTags
}

export const getBlogFirstPage = async (pageSize: number = 20): Promise<Page<BlogEntry>> => {
  const entries = await getBlogCollection()
  const entitiesSize = entries.length

  return {
    data: entries.slice(0, pageSize),
    currentPage: 1,
    lastPage: Math.round(entitiesSize / pageSize),
    size: pageSize,
    total: entitiesSize,
    url: {
      current: routes.article.page(1),
      prev: undefined,
      next: routes.article.page(2)
    },
    start: 0,
    end: 19
  }
}
