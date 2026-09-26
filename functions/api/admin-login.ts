import type { PagesFunction, Env } from './types'
import { createAdminSessionCookies, ctEqual, toUint8a } from './admin-session'

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context
  const url = new URL(request.url)
  const secret = url.searchParams.get('secret')

  if (
    secret == null ||
    secret.length === 0 ||
    !ctEqual(toUint8a(secret), toUint8a(env.CONTENTFUL_PREVIEW_SECRET))
  ) {
    return new Response('Unauthorized', { status: 401 })
  }

  const cookies = await createAdminSessionCookies(env.CONTENTFUL_PREVIEW_SECRET, request.url)
  const headers = new Headers({ Location: `${url.origin}/`, 'Cache-Control': 'no-store' })
  for (const cookie of cookies) {
    headers.append('Set-Cookie', cookie)
  }
  return new Response(null, { headers, status: 303 })
}
