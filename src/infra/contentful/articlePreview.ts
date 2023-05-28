import { type ArticleEntry, type ArticleEntity, contentTypes } from './interfaces'
import { processMarkdown } from '../../utils/remark'
import { createContentfulPreviewClient } from './clientPreview'

export const fetchArticleBySlug = async (args: { slug: string }) => {
  const entries = await createContentfulPreviewClient().getEntries({
    content_type: contentTypes.article,
    'fields.slug': args.slug,
    limit: 1
  })
  const entry = entries.items[0]
  return entry as ArticleEntity | undefined
}

export const mapArticleEntry = async ({ fields }: Pick<ArticleEntity, 'fields'>) => ({
  title: fields.title,
  slug: fields.slug,
  category: fields.category,
  postedAt: new Date(fields.postedAt),
  tags: fields.tags,
  thumbnail: fields.thumbnail?.fields.file.url,
  content: String(await processMarkdown(fields.body))
})

export const fetchArticleEntry = async (args: {
  slug: string
}): Promise<ArticleEntry | undefined> => {
  const article = await fetchArticleBySlug(args)
  if (article == null) return

  const articleEntry = await mapArticleEntry(article)
  return articleEntry
}
