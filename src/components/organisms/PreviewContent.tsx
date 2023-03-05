import { useEffect, useState } from 'preact/hooks'
import { routes } from '../../constants/routes'
import { fetchArticleEntry } from '../../infra/contentful/articlePreview'
import type { ArticleEntry } from '../../infra/contentful/interfaces'
import { formatDateJp } from '../../utils/date'

export const PreviewContent = () => {
  const [entry, setEntry] = useState<ArticleEntry | undefined>()

  useEffect(() => {
    ;(async () => {
      const search = new URLSearchParams(window.location.search)
      const slugParam = search.get('slug')
      if (slugParam != null) {
        const entry = await fetchArticleEntry({ slug: slugParam })
        setEntry(entry)
      }
    })().catch((e) => {
      console.warn(e)
    })
  }, [])

  console.log('entry', entry)

  if (entry == null) return null

  return <CopietArticleContent entry={entry} />
}

const CopietArticleContent = ({
  entry: { category, content, postedAt, slug, tags, thumbnail, title }
}: {
  entry: ArticleEntry
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
