export type { PagesFunction } from '@cloudflare/workers-types'

export type Env = {
  GITHUB_CLIENT_ID: string
  GITHUB_CLIENT_SECRET: string
  CONTENTFUL_PREVIEW_SECRET: string
}
