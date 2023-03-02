import contentful from 'contentful'
import type { CONTENT_TYPE } from './generated'

export const contentfulClient = contentful.createClient({
  space: import.meta.env.CONTENTFUL_SPACE_ID,
  accessToken: import.meta.env.DEV
    ? import.meta.env.CONTENTFUL_PREVIEW_TOKEN
    : import.meta.env.CONTENTFUL_DELIVERY_TOKEN,
  host: import.meta.env.DEV ? 'preview.contentful.com' : 'cdn.contentful.com'
})

export const contentTpes: Record<CONTENT_TYPE, CONTENT_TYPE> = {
  article: 'article'
}

export type SearchParams = {
  order?: string
  /** max 1000 */
  limit?: number
  skip?: number
  [param: string]: any
}
