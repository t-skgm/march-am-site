import { describe, expect, test } from 'vitest'
import { routes } from './routes'

describe('routes.article.slug', () => {
  test('builds a slug URL', () => {
    expect(routes.article.slug('my-post')).toBe('/article/my-post/')
  })
})

describe('routes.article.page', () => {
  test('defaults to page 1', () => {
    expect(routes.article.page()).toBe('/article/page/1/')
  })

  test('builds a specific page URL', () => {
    expect(routes.article.page(3)).toBe('/article/page/3/')
  })
})

describe('routes.article.tag', () => {
  test('capitalizes each word like normalizeTag', () => {
    expect(routes.article.tag.page('rock')).toBe('/article/tag/Rock/1/')
  })

  test('encodes spaces so the href stays a valid URL', () => {
    expect(routes.article.tag.page('BURGER NUDS', 2)).toBe('/article/tag/BURGER%20NUDS/2/')
  })

  test('replaces a slash with a fullwidth slash before encoding, matching the built output directory', () => {
    // getStaticPaths 側は cleanPathParam で `/` を全角スラッシュ（／）に置換してから
    // ディレクトリ名として使うため、href 側も同じ変換を経てからエンコードする必要がある
    const href = routes.article.tag.page('rock/pop')
    expect(href).toBe(`/article/tag/${encodeURIComponent('Rock／Pop')}/1/`)
    expect(decodeURIComponent(href)).toBe('/article/tag/Rock／Pop/1/')
  })

  test('replaces # and ? with fullwidth characters before encoding', () => {
    const hrefHash = routes.article.tag.page('c#')
    expect(decodeURIComponent(hrefHash)).toBe('/article/tag/C＃/1/')

    const hrefQuestion = routes.article.tag.page('what?')
    expect(decodeURIComponent(hrefQuestion)).toBe('/article/tag/What？/1/')
  })

  test('deprecated tag() helper applies the same transformation', () => {
    expect(routes.article.tag.tag('BURGER NUDS')).toBe('/article/tag/BURGER%20NUDS/')
  })
})

describe('routes.article.category', () => {
  test('capitalizes and encodes the category name', () => {
    expect(routes.article.category.page('diary')).toBe('/article/category/Diary/1/')
  })

  test('encodes spaces in category names', () => {
    expect(routes.article.category.page('my category', 2)).toBe(
      '/article/category/My%20Category/2/'
    )
  })

  test('deprecated category() helper applies the same transformation', () => {
    expect(routes.article.category.category('column')).toBe('/article/category/Column/')
  })
})
