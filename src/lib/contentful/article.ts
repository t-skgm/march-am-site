import { contentfulClient } from './client'
import type { Document } from '@contentful/rich-text-types'

export type Article = {
  slug: string
  title: string
  body: Document
}

export const fetchArticles = async () => {
  const entries = await contentfulClient.getEntries<Article>({
    content_type: 'article'
  })
  return entries
}
