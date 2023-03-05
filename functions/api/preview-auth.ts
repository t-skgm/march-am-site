import type { PagesFunction, Env } from './types'
import compare from 'safe-compare'

export const onRequest: PagesFunction<Env> = async (context) => {
  const {
    request, // same as existing Worker API
    env // same as existing Worker API
    // params, // if filename includes [id] or [[path]]
    // waitUntil, // same as ctx.waitUntil in existing Worker API
    // next, // used for middleware or to fetch assets
    // data // arbitrary space for passing data between middlewares
  } = context
  const params = new URL(request.url).searchParams
  const secret = params.get('secret')
  const slug = params.get('slug')

  if (slug == null || (secret != null && compare(secret, env.CONTENTFUL_PREVIEW_SECRET))) {
    return new Response('Error', { status: 401 })
  }

  const response = Response.redirect(`${BASE_URL}/article/preview?slug=${slug}`)
  response.headers.set('Set-Cookie', `ContentfulPreviewToken=${ContentfulPreviewToken}`)
  return response
}

const BASE_URL = 'https://march-am.page'
/** FIXME: 雑 */
const ContentfulPreviewToken = '24b648b45b108aeb21980aa907009387300ec2e5c598636607ccf2096e8cfc73'
