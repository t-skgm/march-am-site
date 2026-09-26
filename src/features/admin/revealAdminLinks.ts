/** is_adminヒントCookieがある場合のみ /api/admin-status で検証し、管理者用リンクを表示する */
export const revealAdminLinksIfAdmin = async (): Promise<void> => {
  if (!document.cookie.includes('is_admin=1')) return

  try {
    const response = await fetch('/api/admin-status', { credentials: 'same-origin' })
    if (!response.ok) return

    const data = (await response.json()) as { isAdmin?: boolean }
    if (data.isAdmin !== true) return

    document.querySelectorAll<HTMLElement>('[data-admin-only]').forEach((el) => {
      el.removeAttribute('hidden')
    })
  } catch {
    // 失敗時は何もしない
  }
}
