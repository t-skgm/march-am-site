import { useEffect, useState } from 'preact/hooks'
import type { FunctionComponent } from 'preact'
import { routes } from '../constants/routes'
import { fetchArticleEntry } from '../infra/contentful/articlePreview'
import type { Article } from '../infra/contentful/interfaces'
import { formatDateJp } from '../utils/date'

export const PreviewContent: FunctionComponent = () => {
  const [entry, setEntry] = useState<Article | undefined>()
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const cookies = (window.document.cookie ?? '').split(';')
    if (!isValidAccess(cookies)) {
      throw new Error('Invalid Access')
    }

    ;(async () => {
      setLoading(true)
      // fetch entry
      const search = new URLSearchParams(window.location.search)
      const slugParam = search.get('slug')
      if (slugParam != null) {
        const entry = await fetchArticleEntry({ slug: slugParam })
        setEntry(entry)
      }
      setLoading(false)
    })().catch((e) => {
      console.warn(e)
      setLoading(false)
    })
  }, [])

  if (loading) return <p>Loading...</p>
  if (entry == null) return <p>Entry 取得失敗</p>

  return <PreviewArticleContent entry={entry} />
}

const PreviewArticleContent: FunctionComponent<{ entry: Article }> = ({
  entry: { category, content, postedAt, slug, tags, thumbnail, title }
}) => (
  <>
    <header>
      {thumbnail != null && <img src={thumbnail} alt={`Eye catch of ${title}`} class="mb-8" />}
      <h1 class="text-3xl font-bold break-all">
        <a href={routes.article.slug(slug)}>{title}</a>
      </h1>
    </header>

    <div class="mt-6 mb-2">
      <a href={routes.article.category.page(category)} class="uppercase">
        {category}
      </a>{' '}
      | {formatDateJp(postedAt)}
    </div>
    {tags != null && (
      <div>
        tags:
        {tags.map((tag) => (
          <a href={routes.article.tag.page(tag)}>{tag}</a>
        ))}
      </div>
    )}

    <article class="post-content mt-10" dangerouslySetInnerHTML={{ __html: content }} />
  </>
)

const isValidAccess = (cookies: string[]): boolean => {
  if (import.meta.env.DEV) return true
  const token = Object.fromEntries(cookies.map((c) => c.trim().split('=')))
    .contentful_preview_token as string | undefined

  // FIXME: 雑
  if (token != null && token.length !== 0) return true

  return false
}
