import type { Plugin } from 'unified'

/**
 * remark.ts では remarkRehype に `allowDangerousHtml: true` を指定しているため、
 * Markdown 中の生 HTML（Contentful の記事本文に埋め込まれる iframe など）は
 * hast の要素ノードにはならず、文字列のまま `raw` ノードとして保持される
 * （rehype-raw を使わない限り要素化されない）。
 * そのため、このプラグインは `raw` ノードの文字列に対して直接
 * `<iframe>` タグを検出し、`title` / `loading` 属性を補完する。
 *
 * NOTE: hast の型定義（`hast` パッケージ）はプロジェクトの直接依存に含まれておらず、
 * 型参照のためだけに依存を追加しないよう、必要最小限の構造を持つローカル型
 * （unist の Node と構造的に互換）でツリーを走査する。
 */
type HastLikeNode = {
  type: string
  value?: string
  children?: HastLikeNode[]
}

type HostnameRule = {
  test: (hostname: string) => boolean
  title: string
}

const HOSTNAME_RULES: HostnameRule[] = [
  {
    test: (hostname) => hostname === 'embed.music.apple.com',
    title: 'Apple Music の埋め込みプレイヤー'
  },
  {
    test: (hostname) =>
      hostname === 'youtube.com' ||
      hostname === 'www.youtube.com' ||
      hostname === 'youtube-nocookie.com' ||
      hostname === 'www.youtube-nocookie.com',
    title: 'YouTube 動画'
  },
  {
    test: (hostname) => hostname === 'bandcamp.com' || hostname.endsWith('.bandcamp.com'),
    title: 'Bandcamp の埋め込みプレイヤー'
  },
  {
    test: (hostname) => hostname === 'open.spotify.com',
    title: 'Spotify の埋め込みプレイヤー'
  }
]

const DEFAULT_IFRAME_TITLE = '埋め込みコンテンツ'

const IFRAME_TAG_RE = /<iframe\b[^>]*>/gi

// Exported for testing
export const getIframeTitleForSrc = (src: string | undefined): string => {
  if (!src) return DEFAULT_IFRAME_TITLE

  try {
    const hostname = new URL(src).hostname
    const rule = HOSTNAME_RULES.find(({ test }) => test(hostname))
    return rule?.title ?? DEFAULT_IFRAME_TITLE
  } catch {
    return DEFAULT_IFRAME_TITLE
  }
}

const hasAttribute = (tag: string, attrName: string): boolean =>
  new RegExp(`\\s${attrName}\\s*=`, 'i').test(tag)

const getAttributeValue = (tag: string, attrName: string): string | undefined => {
  const match = tag.match(new RegExp(`\\s${attrName}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, 'i'))
  return match?.[1] ?? match?.[2]
}

// Exported for testing
export const addMissingIframeAttributes = (tag: string): string => {
  let result = tag

  // NOTE: 各挿入は `<iframe` 直後に属性を追加するため、後から挿入した方が先頭側に来る。
  // 出力を `title` → `loading` の順にするため、先に loading を挿入する。
  if (!hasAttribute(result, 'loading')) {
    result = result.replace(/^<iframe\b/i, '<iframe loading="lazy"')
  }

  if (!hasAttribute(result, 'title')) {
    const title = getIframeTitleForSrc(getAttributeValue(result, 'src'))
    result = result.replace(/^<iframe\b/i, `<iframe title="${title}"`)
  }

  return result
}

const visitRawNodes = (node: HastLikeNode): void => {
  if (node.type === 'raw' && typeof node.value === 'string') {
    node.value = node.value.replace(IFRAME_TAG_RE, addMissingIframeAttributes)
  }
  for (const child of node.children ?? []) {
    visitRawNodes(child)
  }
}

export const rehypeIframeTitle: Plugin<[], HastLikeNode> = () => (tree) => {
  visitRawNodes(tree)
}
