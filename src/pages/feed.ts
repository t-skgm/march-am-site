import rss, { type RSSOptions } from '@astrojs/rss'
import type { APIRoute } from 'astro'
import { routes } from '../constants/routes'
import { site } from '../constants/site'
import { getBlogCollection } from '../utils/collection/blog'

const blogEntries = await getBlogCollection()

export const get: APIRoute = async () => {
  const items: RSSOptions['items'] = blogEntries.map((ent) => ({
    link: routes.article.slug(ent.slug),
    title: ent.data.title,
    pubDate: new Date(ent.data.postedAt)
  }))

  const { body } = await rss({
    title: site.title,
    description: `News feed of ${site.title}`,
    site: import.meta.env.SITE,
    items,
    stylesheet: '/xsl/pretty-feed-v3.xsl'
  })

  const headers = new Headers({
    'Content-Type': 'application/xml; charset=utf-8', // not application/rss+xml
    'X-Content-Type-Options': 'nosniff'
  })

  return new Response(body, { status: 200, headers })
}
