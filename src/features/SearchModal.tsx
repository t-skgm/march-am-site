import { useCallback, useEffect, useRef, useState } from 'preact/hooks'
import type { FunctionComponent } from 'preact'

interface PagefindSearchResults {
  results: PagefindSearchResult[]
}

interface PagefindSearchResult {
  id: string
  data: () => Promise<PagefindSearchData>
}

interface PagefindSearchData {
  url: string
  meta: {
    title: string
  }
  excerpt: string
}

interface PagefindInstance {
  search: (query: string) => Promise<PagefindSearchResults>
}

interface SearchResult {
  id: string
  url: string
  title: string
  excerpt: string
}

export const SearchModal: FunctionComponent = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [pagefindLoaded, setPagefindLoaded] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const pagefindRef = useRef<PagefindInstance | null>(null)

  // Load Pagefind via dynamic import
  const loadPagefind = useCallback(async () => {
    if (pagefindLoaded || pagefindRef.current) {
      return
    }

    try {
      // Dynamic import of Pagefind module
      // @ts-expect-error - Pagefind is generated at build time
      const pagefind = await import('/pagefind/pagefind.js')
      pagefindRef.current = pagefind
      setPagefindLoaded(true)
    } catch (e) {
      console.error('Failed to load Pagefind:', e)
    }
  }, [pagefindLoaded])

  // Handle search
  const handleSearch = useCallback(
    async (searchQuery: string) => {
      if (!pagefindRef.current || !searchQuery.trim()) {
        setResults([])
        return
      }

      setLoading(true)
      try {
        const search = await pagefindRef.current.search(searchQuery)
        const searchResults = await Promise.all(
          search.results.slice(0, 10).map(async (result) => {
            const data = await result.data()
            return {
              id: result.id,
              url: data.url,
              title: data.meta.title,
              excerpt: data.excerpt
            }
          })
        )
        setResults(searchResults)
      } catch (e) {
        console.error('Search error:', e)
        setResults([])
      }
      setLoading(false)
    },
    []
  )

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(query)
    }, 200)
    return () => clearTimeout(timer)
  }, [query, handleSearch])

  // Keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      loadPagefind()
      setTimeout(() => inputRef.current?.focus(), 50)
    } else {
      setQuery('')
      setResults([])
    }
  }, [isOpen, loadPagefind])

  // Close on backdrop click
  const handleBackdropClick = (e: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      setIsOpen(false)
    }
  }

  return (
    <>
      {/* Search button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        class="search-button"
        aria-label="検索を開く"
        title="検索 (Ctrl+K / Cmd+K)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </button>

      {/* Modal backdrop */}
      {isOpen && (
        <div class="search-modal-backdrop" onClick={handleBackdropClick}>
          <div class="search-modal" ref={modalRef}>
            {/* Search input */}
            <div class="search-input-wrapper">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="search-icon"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
                placeholder="記事を検索..."
                class="search-input"
              />
              <kbd class="search-kbd">ESC</kbd>
            </div>

            {/* Results */}
            <div class="search-results">
              {loading && <div class="search-loading">検索中...</div>}

              {!loading && query && results.length === 0 && (
                <div class="search-no-results">
                  「{query}」に一致する記事が見つかりませんでした
                </div>
              )}

              {!loading &&
                results.map((result) => (
                  <a key={result.id} href={result.url} class="search-result-item">
                    <div class="search-result-title">{result.title}</div>
                    <div
                      class="search-result-excerpt"
                      dangerouslySetInnerHTML={{ __html: result.excerpt }}
                    />
                  </a>
                ))}

              {!loading && !query && (
                <div class="search-hint">キーワードを入力して記事を検索</div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
