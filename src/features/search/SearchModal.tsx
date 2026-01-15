import { useCallback, useEffect, useRef, useState } from 'preact/hooks'
import type { FunctionComponent } from 'preact'
import { usePagefind, useDebouncedValue, useKeyboardShortcut } from './hooks'
import { SearchResults } from './SearchResults'

const SearchIcon: FunctionComponent = () => (
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

export const SearchModal: FunctionComponent = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  const pagefind = usePagefind()
  const debouncedQuery = useDebouncedValue(query, 200)

  const close = useCallback(() => {
    setIsOpen(false)
    setQuery('')
    pagefind.clearResults()
  }, [pagefind.clearResults])

  // キーボードショートカット: Cmd/Ctrl + K でトグル
  useKeyboardShortcut('k', () => setIsOpen((prev) => !prev), { ctrlOrMeta: true })

  // キーボードショートカット: Escape で閉じる
  useKeyboardShortcut('Escape', close)

  // デバウンスされたクエリで検索実行
  useEffect(() => {
    pagefind.search(debouncedQuery)
  }, [debouncedQuery, pagefind.search])

  // モーダルが開いた時の処理
  useEffect(() => {
    if (!isOpen) return

    pagefind.load()
    const timer = setTimeout(() => inputRef.current?.focus(), 50)
    return () => clearTimeout(timer)
  }, [isOpen, pagefind.load])

  const handleBackdropClick = useCallback(
    (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        close()
      }
    },
    [close]
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
              <SearchResults
                loading={pagefind.loading}
                query={query}
                results={pagefind.results}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
