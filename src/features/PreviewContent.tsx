import { useEffect, useState } from 'preact/hooks'
import type { FunctionComponent } from 'preact'
import { routes } from '../constants/routes'
import { fetchArticleEntry } from '../infra/contentful/articlePreview'
import type { Article } from '../infra/contentful/interfaces'
import { formatDateJp } from '../utils/date'

export const PreviewContent: FunctionComponent = () => {
  const [entry, setEntry] = useState<Article | undefined>()
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | undefined>()

  useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)
        setError(undefined)
        // fetch entry
        const search = new URLSearchParams(window.location.search)
        const slugParam = search.get('slug')
        if (slugParam != null) {
          const entry = await fetchArticleEntry({ slug: slugParam })
          setEntry(entry)
        }
        setLoading(false)
      } catch (e) {
        console.warn(e)
        setError(e as Error)
        setLoading(false)
      }
    })()
  }, [])

  if (loading) return <p>Loading...</p>
  if (error != null) return <p>Error: {error.message}</p>
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
