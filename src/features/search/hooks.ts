import { useCallback, useEffect, useRef, useState } from 'preact/hooks'
import type { PagefindInstance, SearchResult } from './types'

/**
 * Pagefindの読み込みと検索を管理するカスタムフック
 */
export function usePagefind() {
  const pagefindRef = useRef<PagefindInstance | null>(null)
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    if (pagefindRef.current) return

    try {
      // @ts-expect-error - Pagefind is generated at build time
      const pagefind = await import('/pagefind/pagefind.js')
      pagefindRef.current = pagefind
    } catch (e) {
      console.error('Failed to load Pagefind:', e)
    }
  }, [])

  const search = useCallback(async (query: string) => {
    if (!pagefindRef.current || !query.trim()) {
      setResults([])
      return
    }

    setLoading(true)
    try {
      const searchResponse = await pagefindRef.current.search(query)
      const searchResults = await Promise.all(
        searchResponse.results.slice(0, 10).map(async (result) => {
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
    } finally {
      setLoading(false)
    }
  }, [])

  const clearResults = useCallback(() => {
    setResults([])
  }, [])

  return { load, search, clearResults, results, loading }
}

/**
 * 値をデバウンスするカスタムフック
 */
export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

/**
 * キーボードショートカットを登録するカスタムフック
 */
export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  options: { ctrlOrMeta?: boolean } = {}
) {
  const { ctrlOrMeta = false } = options

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const modifierPressed = ctrlOrMeta ? e.metaKey || e.ctrlKey : true
      if (modifierPressed && e.key === key) {
        e.preventDefault()
        callback()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [key, callback, ctrlOrMeta])
}
