import type { Response as CFResponse } from '@cloudflare/workers-types'

export type { PagesFunction, Response as CFResponse } from '@cloudflare/workers-types'

export type Env = {
  GITHUB_CLIENT_ID: string
  GITHUB_CLIENT_SECRET: string
}

export const coerceReponse = (body?: BodyInit | null, init?: ResponseInit): CFResponse =>
  new Response(body, init) as unknown as CFResponse
