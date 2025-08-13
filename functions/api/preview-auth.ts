import type { PagesFunction, Env } from './types'

export const onRequest: PagesFunction<Env> = async (context) => {
  const {
    request, // same as existing Worker API
    env // same as existing Worker API
    // params, // if filename includes [id] or [[path]]
    // waitUntil, // same as ctx.waitUntil in existing Worker API
    // next, // used for middleware or to fetch assets
    // data // arbitrary space for passing data between middlewares
  } = context
  const url = new URL(request.url)
  const secret = url.searchParams.get('secret')
  const slug = url.searchParams.get('slug')

  if (
    slug == null ||
    slug.length === 0 ||
    secret == null ||
    secret.length === 0 ||
    !ctEqual(toUint8a(secret), toUint8a(env.CONTENTFUL_PREVIEW_SECRET))
  ) {
    return new Response('Unauthorized', { status: 401 })
  }

  const redirectURL = `${url.origin}/article/preview?slug=${slug}`
  return Response.redirect(redirectURL, 303)
}

function ctEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length || a.length === 0) {
    throw new Error('arrays of different length')
  }
  const n = a.length
  let c = 0
  for (let i = 0; i < n; i++) {
    c |= a[i]! ^ b[i]!
  }
  return c === 0
}

function toUint8a(str: string) {
  return new TextEncoder().encode(str)
}
