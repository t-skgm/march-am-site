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
        class="fixed z-50 flex items-center justify-center w-10 h-10 rounded-full bg-white/90 shadow-md hover:shadow-lg text-greenish hover:text-greenish-dark transition-all duration-200 cursor-pointer border-none top-4 right-4 lg:top-8 lg:right-8 lg:w-12 lg:h-12"
        aria-label="検索を開く"
        title="検索 (Ctrl+K / Cmd+K)"
      >
        <SearchIcon />
      </button>

      {isOpen && (
        <div
          class="fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-[10vh]"
          onClick={handleBackdropClick}
        >
          <div
            class="bg-white rounded-lg shadow-2xl w-full max-w-xl mx-4 overflow-hidden max-h-[70vh]"
            ref={modalRef}
          >
            <div class="flex items-center gap-3 px-4 py-3 border-b border-slate-200">
              <span class="text-slate-400 shrink-0">
                <SearchIcon />
              </span>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
                placeholder="記事を検索..."
                class="flex-1 text-base outline-none bg-transparent border-none text-greenish placeholder:text-slate-400"
              />
              <kbd class="px-2 py-1 text-xs rounded bg-slate-100 text-slate-500 font-mono shrink-0">
                ESC
              </kbd>
            </div>

            <div class="overflow-y-auto p-2 max-h-[calc(70vh-60px)]">
              {loading && (
                <div class="px-4 py-8 text-center text-slate-500">検索中...</div>
              )}

              {!loading && query && results.length === 0 && (
                <div class="px-4 py-8 text-center text-slate-500">
                  「{query}」に一致する記事が見つかりませんでした
                </div>
              )}

              {!loading &&
                results.map((result) => (
                  <a
                    key={result.id}
                    href={result.url}
                    class="block px-4 py-3 rounded-md no-underline hover:bg-slate-100 transition-colors duration-150"
                  >
                    <div class="font-semibold text-greenish-dark mb-1">
                      {result.title}
                    </div>
                    <div
                      class="text-sm text-slate-600 leading-relaxed [&_mark]:bg-yellow-200 [&_mark]:text-greenish-dark [&_mark]:rounded [&_mark]:px-0.5"
                      dangerouslySetInnerHTML={{ __html: result.excerpt }}
                    />
                  </a>
                ))}

              {!loading && !query && (
                <div class="px-4 py-8 text-center text-slate-500">
                  キーワードを入力して記事を検索
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
