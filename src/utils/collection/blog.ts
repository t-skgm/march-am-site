import { type CollectionEntry, getCollection } from 'astro:content'
import { sortBy, uniqBy } from 'remeda'
import type { Page } from 'astro'
import { calcFirstPage, normalizeTag } from './common'

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

/** Normalize済みのtagリスト */
export const getBlogTags = async (): Promise<string[]> => {
  const entries = await getBlogCollection()
  const tags = entries.flatMap((e) => e.data.tags ?? [])
  const uniqTags = uniqBy(tags, (t) => t.toLowerCase())
    .sort()
    .map(normalizeTag)
  return uniqTags
}

/** Normalize済みのCategoryリスト */
export const getBlogCategories = async (): Promise<string[]> => {
  const entries = await getBlogCollection()
  const categories = entries.map((e) => e.data.category)
  const uniqCategories = uniqBy(categories, (t) => t.toLowerCase())
    .sort()
    .map(normalizeTag)
  return uniqCategories
}

export const getBlogFirstPage = async (pageSize: number = 20): Promise<Page<BlogEntry>> => {
  const entries = await getBlogCollection()
  return calcFirstPage({ entries, pageSize })
}
