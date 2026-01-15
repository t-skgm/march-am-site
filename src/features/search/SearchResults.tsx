import type { ComponentChildren, FunctionComponent } from 'preact'
import type { SearchResult } from './types'

interface SearchResultsProps {
  loading: boolean
  query: string
  results: SearchResult[]
}

const Message: FunctionComponent<{ children: ComponentChildren }> = ({ children }) => (
  <div class="px-4 py-8 text-center text-slate-500">{children}</div>
)

const ResultItem: FunctionComponent<{ result: SearchResult }> = ({ result }) => (
  <a
    href={result.url}
    class="block px-4 py-3 rounded-md no-underline hover:bg-slate-100 transition-colors duration-150"
  >
    <div class="font-semibold text-greenish-dark mb-1">{result.title}</div>
    <div
      class="text-sm text-slate-600 leading-relaxed [&_mark]:bg-yellow-200 [&_mark]:text-greenish-dark [&_mark]:rounded [&_mark]:px-0.5"
      dangerouslySetInnerHTML={{ __html: result.excerpt }}
    />
  </a>
)

export const SearchResults: FunctionComponent<SearchResultsProps> = ({
  loading,
  query,
  results
}) => {
  if (loading) {
    return <Message>検索中...</Message>
  }

  if (!query) {
    return <Message>キーワードを入力して記事を検索</Message>
  }

  if (results.length === 0) {
    return <Message>「{query}」に一致する記事が見つかりませんでした</Message>
  }

  return (
    <>
      {results.map((result) => (
        <ResultItem key={result.id} result={result} />
      ))}
    </>
  )
}
