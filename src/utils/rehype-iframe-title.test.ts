import { describe, expect, test } from 'vitest'
import { addMissingIframeAttributes, getIframeTitleForSrc } from './rehype-iframe-title'

describe('getIframeTitleForSrc', () => {
  test('Apple Music の埋め込みには専用タイトルを付与する', () => {
    expect(getIframeTitleForSrc('https://embed.music.apple.com/jp/album/xxx')).toBe(
      'Apple Music の埋め込みプレイヤー'
    )
  })

  test('YouTube（通常ドメイン）には専用タイトルを付与する', () => {
    expect(getIframeTitleForSrc('https://www.youtube.com/embed/xxx')).toBe('YouTube 動画')
  })

  test('YouTube（nocookieドメイン）には専用タイトルを付与する', () => {
    expect(getIframeTitleForSrc('https://www.youtube-nocookie.com/embed/xxx')).toBe('YouTube 動画')
  })

  test('Bandcamp の埋め込みには専用タイトルを付与する', () => {
    expect(getIframeTitleForSrc('https://bandcamp.com/EmbeddedPlayer/xxx')).toBe(
      'Bandcamp の埋め込みプレイヤー'
    )
  })

  test('Spotify の埋め込みには専用タイトルを付与する', () => {
    expect(getIframeTitleForSrc('https://open.spotify.com/embed/track/xxx')).toBe(
      'Spotify の埋め込みプレイヤー'
    )
  })

  test('未知のホストには汎用タイトルを付与する', () => {
    expect(getIframeTitleForSrc('https://example.com/embed')).toBe('埋め込みコンテンツ')
  })

  test('src が無い/不正な場合も汎用タイトルを返す', () => {
    expect(getIframeTitleForSrc(undefined)).toBe('埋め込みコンテンツ')
    expect(getIframeTitleForSrc('not a url')).toBe('埋め込みコンテンツ')
  })
})

describe('addMissingIframeAttributes', () => {
  test('title・loading が無い場合は両方付与する', () => {
    const result = addMissingIframeAttributes(
      '<iframe src="https://embed.music.apple.com/jp/album/xxx" width="100%" height="150">'
    )
    expect(result).toBe(
      '<iframe title="Apple Music の埋め込みプレイヤー" loading="lazy" src="https://embed.music.apple.com/jp/album/xxx" width="100%" height="150">'
    )
  })

  test('既に title がある場合は上書きしない', () => {
    const result = addMissingIframeAttributes(
      '<iframe title="カスタムタイトル" src="https://www.youtube.com/embed/xxx">'
    )
    expect(result).toBe(
      '<iframe loading="lazy" title="カスタムタイトル" src="https://www.youtube.com/embed/xxx">'
    )
  })

  test('既に loading がある場合は上書きしない', () => {
    const result = addMissingIframeAttributes(
      '<iframe loading="eager" src="https://www.youtube.com/embed/xxx">'
    )
    expect(result).toBe(
      '<iframe title="YouTube 動画" loading="eager" src="https://www.youtube.com/embed/xxx">'
    )
  })

  test('自己終了タグにも対応する', () => {
    const result = addMissingIframeAttributes(
      '<iframe src="https://open.spotify.com/embed/track/xxx" />'
    )
    expect(result).toBe(
      '<iframe title="Spotify の埋め込みプレイヤー" loading="lazy" src="https://open.spotify.com/embed/track/xxx" />'
    )
  })
})
