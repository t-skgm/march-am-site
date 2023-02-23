import { type CollectionEntry, getCollection } from 'astro:content'
import { sortBy } from 'remeda'

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
