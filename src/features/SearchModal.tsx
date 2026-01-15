import { useCallback, useEffect, useRef, useState } from 'preact/hooks'
import type { FunctionComponent, JSX } from 'preact'

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

const styles = {
  button: {
    position: 'fixed',
    zIndex: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '2.5rem',
    height: '2.5rem',
    borderRadius: '9999px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    color: '#4a4740',
    transition: 'all 0.2s',
    cursor: 'pointer',
    border: 'none',
    top: '1rem',
    right: '1rem'
  } satisfies JSX.CSSProperties,
  backdrop: {
    position: 'fixed',
    inset: 0,
    zIndex: 50,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingTop: '10vh'
  } satisfies JSX.CSSProperties,
  modal: {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    width: '100%',
    maxWidth: '36rem',
    margin: '0 1rem',
    overflow: 'hidden',
    maxHeight: '70vh'
  } satisfies JSX.CSSProperties,
  inputWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    borderBottom: '1px solid #e2e8f0'
  } satisfies JSX.CSSProperties,
  searchIcon: {
    color: '#94a3b8',
    flexShrink: 0
  } satisfies JSX.CSSProperties,
  input: {
    flex: 1,
    fontSize: '1rem',
    outline: 'none',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#4a4740'
  } satisfies JSX.CSSProperties,
  kbd: {
    padding: '0.25rem 0.5rem',
    fontSize: '0.75rem',
    borderRadius: '0.25rem',
    backgroundColor: '#f1f5f9',
    color: '#64748b',
    fontFamily: 'monospace',
    flexShrink: 0
  } satisfies JSX.CSSProperties,
  results: {
    overflowY: 'auto',
    padding: '0.5rem',
    maxHeight: 'calc(70vh - 60px)'
  } satisfies JSX.CSSProperties,
  message: {
    padding: '2rem 1rem',
    textAlign: 'center',
    color: '#64748b'
  } satisfies JSX.CSSProperties,
  resultItem: {
    display: 'block',
    padding: '0.75rem 1rem',
    borderRadius: '0.375rem',
    textDecoration: 'none',
    transition: 'background-color 0.15s'
  } satisfies JSX.CSSProperties,
  resultTitle: {
    fontWeight: 600,
    color: '#37342f',
    marginBottom: '0.25rem'
  } satisfies JSX.CSSProperties,
  resultExcerpt: {
    fontSize: '0.875rem',
    color: '#475569',
    lineHeight: 1.625
  } satisfies JSX.CSSProperties
} as const

export const SearchModal: FunctionComponent = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [pagefindLoaded, setPagefindLoaded] = useState(false)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
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
  const handleSearch = useCallback(async (searchQuery: string) => {
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
  }, [])

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

  const SearchIcon = () => (
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
  )

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        style={styles.button}
        aria-label="検索を開く"
        title="検索 (Ctrl+K / Cmd+K)"
      >
        <SearchIcon />
      </button>

      {isOpen && (
        <div style={styles.backdrop} onClick={handleBackdropClick}>
          <div style={styles.modal} ref={modalRef}>
            <div style={styles.inputWrapper}>
              <span style={styles.searchIcon}>
                <SearchIcon />
              </span>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
                placeholder="記事を検索..."
                style={styles.input}
              />
              <kbd style={styles.kbd}>ESC</kbd>
            </div>

            <div style={styles.results}>
              {loading && <div style={styles.message}>検索中...</div>}

              {!loading && query && results.length === 0 && (
                <div style={styles.message}>
                  「{query}」に一致する記事が見つかりませんでした
                </div>
              )}

              {!loading &&
                results.map((result) => (
                  <a
                    key={result.id}
                    href={result.url}
                    style={{
                      ...styles.resultItem,
                      backgroundColor: hoveredId === result.id ? '#f1f5f9' : 'transparent'
                    }}
                    onMouseEnter={() => setHoveredId(result.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <div style={styles.resultTitle}>{result.title}</div>
                    <div
                      style={styles.resultExcerpt}
                      dangerouslySetInnerHTML={{ __html: result.excerpt }}
                    />
                  </a>
                ))}

              {!loading && !query && (
                <div style={styles.message}>キーワードを入力して記事を検索</div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .search-result-excerpt mark {
          background-color: #fef08a;
          color: #37342f;
          border-radius: 0.125rem;
          padding: 0 0.125rem;
        }
      `}</style>
    </>
  )
}
