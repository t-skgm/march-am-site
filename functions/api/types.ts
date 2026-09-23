export type { PagesFunction } from '@cloudflare/workers-types'

export type Env = {
  GITHUB_CLIENT_ID: string
  GITHUB_CLIENT_SECRET: string
  PUBLIC_CONTENTFUL_SPACE_ID: string
  PUBLIC_CONTENTFUL_ENVIRONMENT: string
  CONTENTFUL_PREVIEW_TOKEN: string
  CONTENTFUL_PREVIEW_SECRET: string
}
