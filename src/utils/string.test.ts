import { describe, expect, test } from 'vitest'
import { capitalizeWords, excerptFromHtml, extractPlainTextFromHtml, truncateText } from './string'

describe('capitalizeWords', () => {
  test('capitalizes the first letter of each word', () => {
    expect(capitalizeWords('hello world')).toBe('Hello World')
  })
})

describe('extractPlainTextFromHtml', () => {
  test('extracts text from the first paragraph', () => {
    const html = '<h1>Title</h1><p>これは最初の段落です。</p><p>これは2番目の段落です。</p>'
    expect(extractPlainTextFromHtml(html)).toBe('これは最初の段落です。')
  })

  test('strips inline tags inside the paragraph', () => {
    const html = '<p>これは<strong>強調</strong>された<a href="https://example.com">リンク</a>を含む文章です。</p>'
    expect(extractPlainTextFromHtml(html)).toBe('これは強調されたリンクを含む文章です。')
  })

  test('decodes HTML entities', () => {
    const html = '<p>AT&amp;T &lt;is&gt; &quot;great&quot;&nbsp;company</p>'
    expect(extractPlainTextFromHtml(html)).toBe('AT&T <is> "great" company')
  })

  test('decodes numeric character references outside the BMP (e.g. emoji) without breaking surrogate pairs', () => {
    const html = '<p>検索アイコン&#128269;と虫眼鏡&#x1F50D;です。</p>'
    expect(extractPlainTextFromHtml(html)).toBe('検索アイコン🔍と虫眼鏡🔍です。')
  })

  test('collapses whitespace and newlines', () => {
    const html = '<p>\n  改行を\n  含む\n  文章です。\n</p>'
    expect(extractPlainTextFromHtml(html)).toBe('改行を 含む 文章です。')
  })

  test('skips a table-of-contents list and picks the first real paragraph', () => {
    const html =
      '<h2 id="目次">目次</h2><ul><li><a href="#見出し1">見出し1</a></li></ul><p>本文の最初の段落です。</p>'
    expect(extractPlainTextFromHtml(html)).toBe('本文の最初の段落です。')
  })

  test('skips a leading link card and uses the following paragraph', () => {
    const html = `
      <div class="remark-link-card-plus__container">
        <a href="https://example.com" target="_blank" rel="noreferrer noopener" class="remark-link-card-plus__card">
          <div class="remark-link-card-plus__main">
            <div class="remark-link-card-plus__content">
              <div class="remark-link-card-plus__title">Example Site</div>
              <div class="remark-link-card-plus__description">This is an example description from OGP.</div>
            </div>
            <div class="remark-link-card-plus__meta">
              <span class="remark-link-card-plus__url">example.com</span>
            </div>
          </div>
        </a>
      </div>
      <p>リンクカードの後に続く本文です。</p>
    `
    expect(extractPlainTextFromHtml(html)).toBe('リンクカードの後に続く本文です。')
  })

  test('removes embedded iframes such as YouTube', () => {
    const html =
      '<iframe class="youtube" src="https://www.youtube.com/embed/xxxx"></iframe><p>動画の後の説明文です。</p>'
    expect(extractPlainTextFromHtml(html)).toBe('動画の後の説明文です。')
  })

  test('falls back to stripped text when there is no paragraph', () => {
    const html = '<h1>見出しのみの記事</h1>'
    expect(extractPlainTextFromHtml(html)).toBe('見出しのみの記事')
  })

  test('falls back to link card text when there is no other content', () => {
    const html =
      '<div class="remark-link-card-plus__container"><a href="https://example.com"><div class="remark-link-card-plus__main"><div class="remark-link-card-plus__content"><div class="remark-link-card-plus__title">Only Link Card</div></div></div></a></div>'
    expect(extractPlainTextFromHtml(html)).toBe('')
  })
})

describe('truncateText', () => {
  test('returns text unchanged when within the limit', () => {
    expect(truncateText('short text', 20)).toBe('short text')
  })

  test('truncates and appends an ellipsis when over the limit', () => {
    const text = 'a'.repeat(10)
    expect(truncateText(text, 5)).toBe('aaaaa…')
  })

  test('counts surrogate-pair characters correctly', () => {
    // 😀 is a surrogate pair (2 UTF-16 code units) but should count as 1 character
    const text = '😀'.repeat(5)
    expect(truncateText(text, 3)).toBe('😀😀😀…')
  })
})

describe('excerptFromHtml', () => {
  test('extracts and truncates the first paragraph to the default length', () => {
    const body = 'あ'.repeat(150)
    const html = `<p>${body}</p>`
    const result = excerptFromHtml(html)
    expect(result).toBe(`${'あ'.repeat(120)}…`)
  })

  test('does not add an ellipsis when the text fits within the limit', () => {
    const html = '<p>短い本文です。</p>'
    expect(excerptFromHtml(html)).toBe('短い本文です。')
  })

  test('supports a custom max length', () => {
    const html = '<p>これはとても長い日本語の文章のテストです。</p>'
    expect(excerptFromHtml(html, 5)).toBe('これはとて…')
  })
})
