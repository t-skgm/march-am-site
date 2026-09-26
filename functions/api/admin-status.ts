import type { PagesFunction, Env } from './types'
import { hasAdminSession } from './admin-session'

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context
  const isAdmin = await hasAdminSession(request, env.CONTENTFUL_PREVIEW_SECRET)
  return Response.json({ isAdmin }, { headers: { 'Cache-Control': 'no-store' } })
}
