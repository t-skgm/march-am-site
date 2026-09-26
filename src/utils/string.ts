export function capitalizeWords(sentence: string): string {
  return sentence.replace(/\b\w/g, (c) => c.toUpperCase())
}

const LINK_CARD_CONTAINER_CLASS = 'remark-link-card-plus__container'

const HTML_ENTITIES: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&apos;': "'",
  '&nbsp;': ' '
}

function decodeHtmlEntities(text: string): string {
  let result = text
  for (const [entity, char] of Object.entries(HTML_ENTITIES)) {
    result = result.split(entity).join(char)
  }
  result = result.replace(/&#(\d+);/g, (_, num: string) => String.fromCodePoint(parseInt(num, 10)))
  result = result.replace(/&#x([0-9a-fA-F]+);/g, (_, hex: string) =>
    String.fromCodePoint(parseInt(hex, 16))
  )
  return result
}

function stripTags(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/(p|li|h[1-6]|div|ul|ol|blockquote|tr|td|th|section|article)>/gi, ' ')
    .replace(/<[^>]+>/g, '')
}

function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, ' ').trim()
}

function htmlTextOf(fragment: string): string {
  return normalizeWhitespace(decodeHtmlEntities(stripTags(fragment)))
}

/**
 * remark-link-card-plus が生成するリンクカードの `<div class="remark-link-card-plus__container">...</div>`
 * ブロックを、タグの入れ子（`<div>`）を数えながら丸ごと取り除く。
 * リンクカード内の title/description テキストが抜粋に混ざるのを防ぐ。
 */
function removeLinkCardBlocks(html: string): string {
  let result = html
  const openTagPattern = new RegExp(
    `<div[^>]*class="[^"]*${LINK_CARD_CONTAINER_CLASS}[^"]*"[^>]*>`,
    'i'
  )

  for (;;) {
    const match = openTagPattern.exec(result)
    if (match == null || match.index == null) break

    const start = match.index
    let pos = start + match[0].length
    let depth = 1

    while (depth > 0 && pos < result.length) {
      const nextOpen = result.indexOf('<div', pos)
      const nextClose = result.indexOf('</div>', pos)
      if (nextClose === -1) {
        pos = result.length
        break
      }
      if (nextOpen !== -1 && nextOpen < nextClose) {
        depth++
        pos = nextOpen + '<div'.length
      } else {
        depth--
        pos = nextClose + '</div>'.length
      }
    }

    result = result.slice(0, start) + result.slice(pos)
  }

  return result
}

function removeIframes(html: string): string {
  return html.replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, '').replace(/<iframe\b[^>]*\/?>/gi, '')
}

/**
 * 記事本文のHTML（processMarkdownの出力）からmeta description用のプレーンテキストを抽出する。
 * - リンクカード・iframe埋め込みは除外する
 * - 最初の `<p>` 段落のテキストを優先する（見出しや目次のリストは無視される）
 * - `<p>` が見つからない場合は残りのHTMLからタグを除去したテキストにフォールバックする
 */
export function extractPlainTextFromHtml(html: string): string {
  const withoutLinkCards = removeLinkCardBlocks(html)
  const withoutEmbeds = removeIframes(withoutLinkCards)

  const paragraphMatches = withoutEmbeds.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)
  for (const match of paragraphMatches) {
    const text = htmlTextOf(match[1] ?? '')
    if (text.length > 0) return text
  }

  return htmlTextOf(withoutEmbeds)
}

/**
 * プレーンテキストを指定文字数（デフォルト120文字）に切り詰め、
 * 省略された場合は末尾に「…」を付与する。サロゲートペアを考慮して文字数をカウントする。
 */
export function truncateText(text: string, maxLength: number = 120): string {
  const chars = Array.from(text)
  if (chars.length <= maxLength) return text
  return `${chars.slice(0, maxLength).join('')}…`
}

/**
 * 記事本文のHTMLからmeta description用の抜粋を生成する。
 */
export function excerptFromHtml(html: string, maxLength: number = 120): string {
  const text = extractPlainTextFromHtml(html)
  return truncateText(text, maxLength)
}
