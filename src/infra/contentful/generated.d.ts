// THIS FILE IS AUTOMATICALLY GENERATED. DO NOT MODIFY IT.

import { Asset, Entry } from 'contentful'

export interface IArticleFields {
  /** Category */
  category: 'Review' | 'Diary'

  /** Title */
  title: string

  /** PostedAt */
  postedAt: string

  /** Slug */
  slug: string

  /** Thumbnail */
  thumbnail?: Asset | undefined

  /** OGP Image URL */
  ogpImageUrl?: string | undefined

  /** Tags */
  tags?: string[] | undefined

  /** Body */
  body: string
}

export interface IArticle extends Entry<IArticleFields> {
  sys: {
    id: string
    type: string
    createdAt: string
    updatedAt: string
    locale: string
    contentType: {
      sys: {
        id: 'article'
        linkType: 'ContentType'
        type: 'Link'
      }
    }
  }
}

export type CONTENT_TYPE = 'article'

export type IEntry = IArticle

export type LOCALE_CODE = 'ja-JP'

export type CONTENTFUL_DEFAULT_LOCALE_CODE = 'ja-JP'
