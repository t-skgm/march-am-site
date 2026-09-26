import { useCallback, useEffect, useId, useState } from 'preact/hooks'
import type { FunctionComponent, TargetedEvent } from 'preact'
import {
  usePagefind,
  useDebouncedValue,
  useKeyboardShortcut,
  useDialogSync,
  useBodyScrollLock
} from './hooks'
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
  const inputId = useId()

  const { load, search, clearResults, loading, results } = usePagefind()
  const debouncedQuery = useDebouncedValue(query, 200)

  const resetState = useCallback(() => {
    setIsOpen(false)
    setQuery('')
    clearResults()
  }, [clearResults])

  const open = useCallback(() => {
    setIsOpen(true)
    void load()
  }, [load])

  // ネイティブ<dialog>とisOpenを同期する。Escキーで閉じられた場合も
  // dialogのcloseイベント経由でresetStateが呼ばれ、フォーカスは
  // ブラウザ標準の挙動で起動ボタンに自動的に戻る
  const dialogRef = useDialogSync(isOpen, resetState)

  // モーダル表示中は背面ページのスクロールをロックする
  useBodyScrollLock(isOpen)

  // キーボードショートカット: Cmd/Ctrl + K でトグル
  useKeyboardShortcut(
    'k',
    useCallback(() => (isOpen ? resetState() : open()), [isOpen, open, resetState]),
    { ctrlOrMeta: true }
  )

  // デバウンスされたクエリで検索実行
  useEffect(() => {
    void search(debouncedQuery)
  }, [debouncedQuery, search])

  // 背景（::backdrop）クリックで閉じる。クリックされた要素がdialog自身の場合のみ
  // 背景クリックと判定できる（中身のクリックはdialogの子要素がtargetになる）
  const handleDialogClick = useCallback(
    (e: TargetedEvent<HTMLDialogElement, MouseEvent>) => {
      if (e.target === dialogRef.current) {
        dialogRef.current?.close()
      }
    },
    [dialogRef]
  )

  return (
    <>
      <button
        type="button"
        onClick={open}
        class="fixed z-50 flex items-center justify-center w-10 h-10 rounded-full bg-white/90 shadow-md hover:shadow-lg text-greenish hover:text-greenish-dark transition-all duration-200 cursor-pointer border-none top-4 right-4 lg:top-8 lg:right-8 lg:w-12 lg:h-12"
        aria-label="検索を開く"
        title="検索 (Ctrl+K / Cmd+K)"
      >
        <SearchIcon />
      </button>

      {/* oxlint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions -- 背景(::backdrop)クリックで閉じるための補助的なハンドラ。キーボード操作はネイティブdialogのEsc/フォーカストラップで担保している */}
      <dialog
        ref={dialogRef}
        onClick={handleDialogClick}
        aria-label="サイト内検索"
        class="fixed top-[10vh] left-1/2 right-auto bottom-auto -translate-x-1/2 m-0 w-[calc(100%-2rem)] max-w-xl rounded-lg border-0 bg-white p-0 shadow-2xl overflow-hidden max-h-[70vh] backdrop:bg-black/50"
      >
        <div class="flex items-center gap-3 px-4 py-3 border-b border-slate-200">
          <span class="text-slate-400 shrink-0">
            <SearchIcon />
          </span>
          <label htmlFor={inputId} class="sr-only">
            記事を検索
          </label>
          <input
            id={inputId}
            type="search"
            value={query}
            onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
            placeholder="記事を検索..."
            class="flex-1 text-base bg-transparent border-none text-greenish placeholder:text-slate-400 rounded focus:outline-none focus-visible:outline-2 focus-visible:outline-greenish focus-visible:outline-offset-2"
            // oxlint-disable-next-line jsx-a11y/no-autofocus -- ユーザー操作で開いたモーダルの入力欄なのでフォーカスを移す
            autoFocus
          />
          <kbd class="px-2 py-1 text-xs rounded bg-slate-100 text-slate-500 font-mono shrink-0">
            ESC
          </kbd>
        </div>

        <div class="overflow-y-auto p-2 max-h-[calc(70vh-60px)]">
          <SearchResults loading={loading} query={query} results={results} />
        </div>
      </dialog>
    </>
  )
}
