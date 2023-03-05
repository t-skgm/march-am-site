import rss, { type RSSOptions } from '@astrojs/rss'
import type { APIRoute } from 'astro'
import { routes } from '../constants/routes'
import { site } from '../constants/site'
import { fetchArticles } from '../infra/contentful/article'

const articles = await fetchArticles()

export const get: APIRoute = async () => {
  const items: RSSOptions['items'] = articles.map(({ fields }) => ({
    link: routes.article.slug(fields.slug),
    title: fields.title,
    pubDate: new Date(fields.postedAt)
  }))

  const { body } = await rss({
    title: site.title,
    description: `${site.title}: Feed`,
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
