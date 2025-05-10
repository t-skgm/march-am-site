import type { Page } from 'astro'
import { capitalizeWords } from '../../utils/string'

export const onlyPublished = (entry: { data: { draft?: boolean | undefined } }): boolean =>
  entry.data.draft == null || !entry.data.draft

export const calcFirstPage = async <T>({
  entries,
  pageSize
}: {
  entries: T[]
  pageSize: number
}): Promise<Page<T>> => {
  const entriesSize = entries.length
  const lastPage = Math.ceil(entriesSize / pageSize)

  return {
    data: entries.slice(0, pageSize),
    currentPage: 1,
    lastPage,
    size: pageSize,
    total: entriesSize,
    /** urlはstubで有無チェックしかできない */
    url: {
      current: 'current',
      prev: undefined,
      next: lastPage > 1 ? 'next' : undefined,
      first: undefined,
      last: lastPage > 1 ? 'last' : undefined
    },
    start: 0,
    end: pageSize - 1
  }
}

export const normalizeTag = (tag: string) => capitalizeWords(tag)
