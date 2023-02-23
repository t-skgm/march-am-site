import { type BlogEntry, getBlogCollection } from './collection'
import { routes } from '../constants/routes'
import type { Page } from 'astro'

export const getFirstBlogPage = async (pageSize: number = 20): Promise<Page<BlogEntry>> => {
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
