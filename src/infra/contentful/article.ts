import type { ContentfulCollection } from 'contentful'
import { contentfulClient, contentTpes } from './client'
import type { IArticle } from './generated'

export type ArticleItem = IArticle

export const fetchArticles = async () => {
  const entries = await contentfulClient.getEntries({
    content_type: contentTpes.article
  })
  return entries as ContentfulCollection<ArticleItem>
}
