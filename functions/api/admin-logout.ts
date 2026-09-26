import type { PagesFunction, Env } from './types'
import { clearAdminSessionCookies } from './admin-session'

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request } = context
  const url = new URL(request.url)

  const headers = new Headers({ Location: `${url.origin}/` })
  for (const cookie of clearAdminSessionCookies(request.url)) {
    headers.append('Set-Cookie', cookie)
  }
  return new Response(null, { headers, status: 303 })
}
