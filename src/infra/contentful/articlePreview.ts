import { type Article, type ArticleEntry } from './interfaces'
import { processMarkdown } from '../../utils/remark'

export const fetchArticleBySlug = async (args: { slug: string }) => {
  const response = await fetch(
    `/api/preview-article?slug=${encodeURIComponent(args.slug)}`,
    { credentials: 'same-origin' }
  )

  if (!response.ok) {
    throw new Error(`Preview API request failed: ${response.status}`)
  }

  const entry = (await response.json()) as ArticleEntry | null
  return entry ?? undefined
}

export const mapArticleEntry = async ({
  fields
}: Pick<ArticleEntry, 'fields'>): Promise<Article> => ({
  title: fields.title,
  slug: fields.slug,
  category: fields.category,
  postedAt: new Date(fields.postedAt),
  tags: fields.tags,
  thumbnail: fields.thumbnail?.fields.file?.url,
  content: String(await processMarkdown(fields.body))
})

export const fetchArticleEntry = async (args: { slug: string }) => {
  const article = await fetchArticleBySlug(args)
  if (article == null) return

  const articleEntry = await mapArticleEntry(article)
  return articleEntry
}
