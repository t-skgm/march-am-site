import { type Article, type ArticleEntry, contentTypes } from './interfaces'
import { processMarkdown } from '../../utils/remark'
import { createContentfulPreviewClient } from './clientPreview'

export const fetchArticleBySlug = async (args: { slug: string }) => {
  const entries = await createContentfulPreviewClient().getEntries({
    content_type: contentTypes.article,
    'fields.slug': args.slug,
    limit: 1
  })
  const entry = entries.items[0]
  return entry as ArticleEntry | undefined
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
