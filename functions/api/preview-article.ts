import type { PagesFunction } from '@cloudflare/workers-types'
import { createContentfulPreviewClient } from '../../src/infra/contentful/clientPreview'
import { contentTypes, type ArticleEntry } from '../../src/infra/contentful/interfaces'
import { hasPreviewSession } from './preview-session'
import type { Env } from './types'

export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
  if (!hasPreviewSession(request, env.CONTENTFUL_PREVIEW_SECRET)) {
    return new Response('Unauthorized', { status: 401 })
  }

  const slug = new URL(request.url).searchParams.get('slug')
  if (slug == null || slug.length === 0) {
    return new Response('Missing slug', { status: 400 })
  }

  try {
    const entries = await createContentfulPreviewClient({
      space: env.PUBLIC_CONTENTFUL_SPACE_ID,
      environment: env.PUBLIC_CONTENTFUL_ENVIRONMENT,
      accessToken: env.CONTENTFUL_PREVIEW_TOKEN
    }).getEntries({
      content_type: contentTypes.article,
      'fields.slug': slug,
      limit: 1
    })

    const entry = entries.items[0] as ArticleEntry | undefined
    return Response.json(entry ?? null, {
      headers: { 'Cache-Control': 'no-store' }
    })
  } catch (error) {
    console.error(error)
    return new Response('Failed to fetch preview article', { status: 502 })
  }
}
