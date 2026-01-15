import { describe, expect, test } from 'vitest'
import {
  className,
  createLinkCardNode,
  decodeHtmlEntities,
  getOgImageUrl,
  isSameUrlValue,
  parseOgTags,
  type LinkCardData,
  type Options,
} from './remark-link-card-plus'

describe('decodeHtmlEntities', () => {
  describe('named entities', () => {
    test('decodes &amp; to &', () => {
      expect(decodeHtmlEntities('&amp;')).toBe('&')
    })

    test('decodes &lt; to <', () => {
      expect(decodeHtmlEntities('&lt;')).toBe('<')
    })

    test('decodes &gt; to >', () => {
      expect(decodeHtmlEntities('&gt;')).toBe('>')
    })

    test('decodes &quot; to "', () => {
      expect(decodeHtmlEntities('&quot;')).toBe('"')
    })

    test('decodes &#39; to \'', () => {
      expect(decodeHtmlEntities('&#39;')).toBe("'")
    })

    test('decodes &apos; to \'', () => {
      expect(decodeHtmlEntities('&apos;')).toBe("'")
    })

    test('decodes &nbsp; to space', () => {
      expect(decodeHtmlEntities('&nbsp;')).toBe(' ')
    })

    test('decodes multiple named entities in a string', () => {
      expect(decodeHtmlEntities('&lt;div&gt;&amp;&quot;test&quot;&lt;/div&gt;')).toBe(
        '<div>&"test"</div>'
      )
    })
  })

  describe('numeric entities (decimal)', () => {
    test('decodes &#65; to A', () => {
      expect(decodeHtmlEntities('&#65;')).toBe('A')
    })

    test('decodes &#97; to a', () => {
      expect(decodeHtmlEntities('&#97;')).toBe('a')
    })

    test('decodes &#8212; to em dash', () => {
      expect(decodeHtmlEntities('&#8212;')).toBe('—')
    })

    test('decodes &#169; to copyright symbol', () => {
      expect(decodeHtmlEntities('&#169;')).toBe('©')
    })

    test('decodes multiple decimal numeric entities', () => {
      expect(decodeHtmlEntities('&#72;&#101;&#108;&#108;&#111;')).toBe('Hello')
    })
  })

  describe('numeric entities (hexadecimal)', () => {
    test('decodes &#x41; to A', () => {
      expect(decodeHtmlEntities('&#x41;')).toBe('A')
    })

    test('decodes &#x61; to a', () => {
      expect(decodeHtmlEntities('&#x61;')).toBe('a')
    })

    test('decodes &#x2014; to em dash', () => {
      expect(decodeHtmlEntities('&#x2014;')).toBe('—')
    })

    test('decodes uppercase hex &#xA9; to copyright symbol', () => {
      expect(decodeHtmlEntities('&#xA9;')).toBe('©')
    })

    test('decodes lowercase hex &#xa9; to copyright symbol', () => {
      expect(decodeHtmlEntities('&#xa9;')).toBe('©')
    })
  })

  describe('mixed entities', () => {
    test('decodes mixed named and numeric entities', () => {
      expect(decodeHtmlEntities('&lt;&#65;&#x42;&gt;')).toBe('<AB>')
    })

    test('preserves plain text without entities', () => {
      expect(decodeHtmlEntities('Hello World')).toBe('Hello World')
    })

    test('handles empty string', () => {
      expect(decodeHtmlEntities('')).toBe('')
    })

    test('handles string with no entities', () => {
      expect(decodeHtmlEntities('Just plain text without any entities')).toBe(
        'Just plain text without any entities'
      )
    })
  })
})

describe('parseOgTags', () => {
  describe('og:title extraction', () => {
    test('extracts og:title with property before content', () => {
      const html = '<meta property="og:title" content="Test Title">'
      const result = parseOgTags(html)
      expect(result.ogTitle).toBe('Test Title')
    })

    test('extracts og:title with content before property', () => {
      const html = '<meta content="Test Title" property="og:title">'
      const result = parseOgTags(html)
      expect(result.ogTitle).toBe('Test Title')
    })

    test('extracts og:title with single quotes', () => {
      const html = "<meta property='og:title' content='Test Title'>"
      const result = parseOgTags(html)
      expect(result.ogTitle).toBe('Test Title')
    })

    test('falls back to <title> tag when og:title is missing', () => {
      const html = '<head><title>Fallback Title</title></head>'
      const result = parseOgTags(html)
      expect(result.ogTitle).toBe('Fallback Title')
    })

    test('prefers og:title over <title> tag', () => {
      const html = `
        <head>
          <title>Fallback Title</title>
          <meta property="og:title" content="OG Title">
        </head>
      `
      const result = parseOgTags(html)
      expect(result.ogTitle).toBe('OG Title')
    })

    test('decodes HTML entities in og:title', () => {
      const html = '<meta property="og:title" content="Test &amp; Title">'
      const result = parseOgTags(html)
      expect(result.ogTitle).toBe('Test & Title')
    })
  })

  describe('og:description extraction', () => {
    test('extracts og:description with property before content', () => {
      const html = '<meta property="og:description" content="Test Description">'
      const result = parseOgTags(html)
      expect(result.ogDescription).toBe('Test Description')
    })

    test('extracts og:description with content before property', () => {
      const html = '<meta content="Test Description" property="og:description">'
      const result = parseOgTags(html)
      expect(result.ogDescription).toBe('Test Description')
    })

    test('falls back to meta description when og:description is missing', () => {
      const html = '<meta name="description" content="Fallback Description">'
      const result = parseOgTags(html)
      expect(result.ogDescription).toBe('Fallback Description')
    })

    test('falls back to meta description with content before name', () => {
      const html = '<meta content="Fallback Description" name="description">'
      const result = parseOgTags(html)
      expect(result.ogDescription).toBe('Fallback Description')
    })

    test('prefers og:description over meta description', () => {
      const html = `
        <meta name="description" content="Fallback Description">
        <meta property="og:description" content="OG Description">
      `
      const result = parseOgTags(html)
      expect(result.ogDescription).toBe('OG Description')
    })
  })

  describe('og:image extraction', () => {
    test('extracts og:image with property before content', () => {
      const html = '<meta property="og:image" content="https://example.com/image.jpg">'
      const result = parseOgTags(html)
      expect(result.ogImage).toBe('https://example.com/image.jpg')
    })

    test('extracts og:image with content before property', () => {
      const html = '<meta content="https://example.com/image.jpg" property="og:image">'
      const result = parseOgTags(html)
      expect(result.ogImage).toBe('https://example.com/image.jpg')
    })

    test('extracts og:image with relative path', () => {
      const html = '<meta property="og:image" content="/images/og.png">'
      const result = parseOgTags(html)
      expect(result.ogImage).toBe('/images/og.png')
    })
  })

  describe('favicon extraction', () => {
    test('extracts favicon with rel="icon"', () => {
      const html = '<link rel="icon" href="/favicon.ico">'
      const result = parseOgTags(html)
      expect(result.favicon).toBe('/favicon.ico')
    })

    test('extracts favicon with rel="shortcut icon"', () => {
      const html = '<link rel="shortcut icon" href="/favicon.ico">'
      const result = parseOgTags(html)
      expect(result.favicon).toBe('/favicon.ico')
    })

    test('extracts favicon with href before rel', () => {
      const html = '<link href="/favicon.ico" rel="icon">'
      const result = parseOgTags(html)
      expect(result.favicon).toBe('/favicon.ico')
    })

    test('extracts favicon with absolute URL', () => {
      const html = '<link rel="icon" href="https://example.com/favicon.ico">'
      const result = parseOgTags(html)
      expect(result.favicon).toBe('https://example.com/favicon.ico')
    })
  })

  describe('complete HTML parsing', () => {
    test('extracts all OG tags from complete HTML', () => {
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Page Title</title>
          <meta property="og:title" content="OG Title">
          <meta property="og:description" content="OG Description">
          <meta property="og:image" content="https://example.com/og.jpg">
          <link rel="icon" href="/favicon.ico">
        </head>
        <body></body>
        </html>
      `
      const result = parseOgTags(html)
      expect(result.ogTitle).toBe('OG Title')
      expect(result.ogDescription).toBe('OG Description')
      expect(result.ogImage).toBe('https://example.com/og.jpg')
      expect(result.favicon).toBe('/favicon.ico')
    })

    test('handles HTML with no OG tags', () => {
      const html = '<html><head></head><body></body></html>'
      const result = parseOgTags(html)
      expect(result.ogTitle).toBeUndefined()
      expect(result.ogDescription).toBeUndefined()
      expect(result.ogImage).toBeUndefined()
      expect(result.favicon).toBeUndefined()
    })

    test('handles empty HTML', () => {
      const result = parseOgTags('')
      expect(result.ogTitle).toBeUndefined()
      expect(result.ogDescription).toBeUndefined()
      expect(result.ogImage).toBeUndefined()
      expect(result.favicon).toBeUndefined()
    })
  })
})

describe('isSameUrlValue', () => {
  describe('identical URLs', () => {
    test('returns true for identical URLs', () => {
      expect(isSameUrlValue('https://example.com', 'https://example.com')).toBe(true)
    })

    test('returns true for URLs with trailing slash normalization', () => {
      expect(isSameUrlValue('https://example.com', 'https://example.com/')).toBe(true)
    })

    test('returns true for URLs with path', () => {
      expect(isSameUrlValue('https://example.com/path', 'https://example.com/path')).toBe(true)
    })
  })

  describe('different URLs', () => {
    test('returns false for different hostnames', () => {
      expect(isSameUrlValue('https://example.com', 'https://other.com')).toBe(false)
    })

    test('returns false for different paths', () => {
      expect(isSameUrlValue('https://example.com/a', 'https://example.com/b')).toBe(false)
    })

    test('returns false for different protocols', () => {
      expect(isSameUrlValue('http://example.com', 'https://example.com')).toBe(false)
    })

    test('returns false for different ports', () => {
      expect(isSameUrlValue('https://example.com:8080', 'https://example.com:3000')).toBe(false)
    })
  })

  describe('invalid URLs', () => {
    test('returns false for invalid first URL', () => {
      expect(isSameUrlValue('not-a-url', 'https://example.com')).toBe(false)
    })

    test('returns false for invalid second URL', () => {
      expect(isSameUrlValue('https://example.com', 'not-a-url')).toBe(false)
    })

    test('returns false for both invalid URLs', () => {
      expect(isSameUrlValue('not-a-url', 'also-not-a-url')).toBe(false)
    })

    test('returns false for empty strings', () => {
      expect(isSameUrlValue('', '')).toBe(false)
    })
  })

  describe('URL normalization', () => {
    test('handles query parameters in URL comparison', () => {
      expect(isSameUrlValue('https://example.com?a=1', 'https://example.com?a=1')).toBe(true)
    })

    test('returns false for different query parameters', () => {
      expect(isSameUrlValue('https://example.com?a=1', 'https://example.com?a=2')).toBe(false)
    })

    test('handles hash fragments', () => {
      expect(isSameUrlValue('https://example.com#section', 'https://example.com#section')).toBe(
        true
      )
    })
  })
})

describe('getOgImageUrl', () => {
  const baseUrl = new URL('https://example.com')

  describe('with noThumbnail option', () => {
    test('returns empty string when noThumbnail is true', () => {
      const options: Options = { noThumbnail: true }
      expect(getOgImageUrl(baseUrl, 'https://example.com/image.jpg', options)).toBe('')
    })
  })

  describe('with undefined or empty imageUrl', () => {
    test('returns empty string when imageUrl is undefined', () => {
      const options: Options = {}
      expect(getOgImageUrl(baseUrl, undefined, options)).toBe('')
    })

    test('returns empty string when imageUrl is empty string', () => {
      const options: Options = {}
      expect(getOgImageUrl(baseUrl, '', options)).toBe('')
    })
  })

  describe('absolute URLs', () => {
    test('returns absolute URL as-is', () => {
      const options: Options = {}
      expect(getOgImageUrl(baseUrl, 'https://cdn.example.com/image.jpg', options)).toBe(
        'https://cdn.example.com/image.jpg'
      )
    })

    test('returns absolute URL with different protocol', () => {
      const options: Options = {}
      expect(getOgImageUrl(baseUrl, 'http://cdn.example.com/image.jpg', options)).toBe(
        'http://cdn.example.com/image.jpg'
      )
    })
  })

  describe('relative URLs', () => {
    test('resolves relative URL starting with /', () => {
      const options: Options = {}
      expect(getOgImageUrl(baseUrl, '/images/og.jpg', options)).toBe(
        'https://example.com/images/og.jpg'
      )
    })

    test('resolves relative URL without leading /', () => {
      const options: Options = {}
      expect(getOgImageUrl(baseUrl, 'images/og.jpg', options)).toBe(
        'https://example.com/images/og.jpg'
      )
    })

    test('resolves relative URL with deeper path', () => {
      const options: Options = {}
      expect(getOgImageUrl(baseUrl, '/assets/images/og.jpg', options)).toBe(
        'https://example.com/assets/images/og.jpg'
      )
    })
  })

  describe('edge cases', () => {
    test('handles base URL with path', () => {
      const baseUrlWithPath = new URL('https://example.com/blog/post')
      const options: Options = {}
      expect(getOgImageUrl(baseUrlWithPath, '/images/og.jpg', options)).toBe(
        'https://example.com/images/og.jpg'
      )
    })

    test('handles base URL with port', () => {
      const baseUrlWithPort = new URL('https://example.com:8080')
      const options: Options = {}
      expect(getOgImageUrl(baseUrlWithPort, '/images/og.jpg', options)).toBe(
        'https://example.com:8080/images/og.jpg'
      )
    })
  })
})

describe('className', () => {
  test('generates class name with prefix', () => {
    expect(className('container')).toBe('remark-link-card-plus__container')
  })

  test('generates class name for thumbnail', () => {
    expect(className('thumbnail')).toBe('remark-link-card-plus__thumbnail')
  })

  test('generates class name for card', () => {
    expect(className('card')).toBe('remark-link-card-plus__card')
  })

  test('generates class name for main', () => {
    expect(className('main')).toBe('remark-link-card-plus__main')
  })

  test('generates class name for content', () => {
    expect(className('content')).toBe('remark-link-card-plus__content')
  })

  test('generates class name for title', () => {
    expect(className('title')).toBe('remark-link-card-plus__title')
  })

  test('generates class name for description', () => {
    expect(className('description')).toBe('remark-link-card-plus__description')
  })

  test('generates class name for meta', () => {
    expect(className('meta')).toBe('remark-link-card-plus__meta')
  })

  test('generates class name for favicon', () => {
    expect(className('favicon')).toBe('remark-link-card-plus__favicon')
  })

  test('generates class name for url', () => {
    expect(className('url')).toBe('remark-link-card-plus__url')
  })

  test('generates class name for image', () => {
    expect(className('image')).toBe('remark-link-card-plus__image')
  })

  test('handles empty string', () => {
    expect(className('')).toBe('remark-link-card-plus__')
  })
})

describe('createLinkCardNode', () => {
  const createTestData = (overrides: Partial<LinkCardData> = {}): LinkCardData => ({
    title: 'Test Title',
    description: 'Test Description',
    faviconUrl: 'https://example.com/favicon.ico',
    ogImageUrl: 'https://example.com/og.jpg',
    displayUrl: 'example.com',
    url: new URL('https://example.com'),
    ...overrides,
  })

  describe('basic structure', () => {
    test('creates HTML node type', () => {
      const data = createTestData()
      const options: Options = {}
      const result = createLinkCardNode(data, options)
      expect(result.type).toBe('html')
    })

    test('includes link with correct href', () => {
      const data = createTestData()
      const options: Options = {}
      const result = createLinkCardNode(data, options)
      expect(result.value).toContain('href="https://example.com/"')
    })

    test('includes target="_blank" for security', () => {
      const data = createTestData()
      const options: Options = {}
      const result = createLinkCardNode(data, options)
      expect(result.value).toContain('target="_blank"')
    })

    test('includes rel="noreferrer noopener" for security', () => {
      const data = createTestData()
      const options: Options = {}
      const result = createLinkCardNode(data, options)
      expect(result.value).toContain('rel="noreferrer noopener"')
    })
  })

  describe('content rendering', () => {
    test('includes title', () => {
      const data = createTestData({ title: 'My Test Title' })
      const options: Options = {}
      const result = createLinkCardNode(data, options)
      expect(result.value).toContain('My Test Title')
    })

    test('includes description', () => {
      const data = createTestData({ description: 'My Test Description' })
      const options: Options = {}
      const result = createLinkCardNode(data, options)
      expect(result.value).toContain('My Test Description')
    })

    test('includes display URL', () => {
      const data = createTestData({ displayUrl: 'example.com/path' })
      const options: Options = {}
      const result = createLinkCardNode(data, options)
      expect(result.value).toContain('example.com/path')
    })

    test('sanitizes title with HTML entities', () => {
      const data = createTestData({ title: '<script>alert("xss")</script>' })
      const options: Options = {}
      const result = createLinkCardNode(data, options)
      expect(result.value).not.toContain('<script>')
    })

    test('sanitizes description with HTML entities', () => {
      const data = createTestData({ description: '<img onerror="alert(1)">' })
      const options: Options = {}
      const result = createLinkCardNode(data, options)
      expect(result.value).not.toContain('onerror')
    })
  })

  describe('thumbnail rendering', () => {
    test('includes thumbnail when ogImageUrl is provided', () => {
      const data = createTestData({ ogImageUrl: 'https://example.com/thumb.jpg' })
      const options: Options = {}
      const result = createLinkCardNode(data, options)
      expect(result.value).toContain('remark-link-card-plus__thumbnail')
      expect(result.value).toContain('src="https://example.com/thumb.jpg"')
    })

    test('excludes thumbnail when ogImageUrl is not provided', () => {
      const data: LinkCardData = {
        title: 'Test Title',
        description: 'Test Description',
        faviconUrl: 'https://example.com/favicon.ico',
        displayUrl: 'example.com',
        url: new URL('https://example.com'),
      }
      const options: Options = {}
      const result = createLinkCardNode(data, options)
      expect(result.value).not.toContain('remark-link-card-plus__thumbnail')
    })

    test('excludes thumbnail when ogImageUrl is empty', () => {
      const data = createTestData({ ogImageUrl: '' })
      const options: Options = {}
      const result = createLinkCardNode(data, options)
      expect(result.value).not.toContain('remark-link-card-plus__thumbnail')
    })
  })

  describe('thumbnail position', () => {
    test('places thumbnail after main content by default (right)', () => {
      const data = createTestData()
      const options: Options = {}
      const result = createLinkCardNode(data, options)
      const mainIndex = result.value.indexOf('remark-link-card-plus__main')
      const thumbnailIndex = result.value.indexOf('remark-link-card-plus__thumbnail')
      expect(mainIndex).toBeLessThan(thumbnailIndex)
    })

    test('places thumbnail after main content with thumbnailPosition="right"', () => {
      const data = createTestData()
      const options: Options = { thumbnailPosition: 'right' }
      const result = createLinkCardNode(data, options)
      const mainIndex = result.value.indexOf('remark-link-card-plus__main')
      const thumbnailIndex = result.value.indexOf('remark-link-card-plus__thumbnail')
      expect(mainIndex).toBeLessThan(thumbnailIndex)
    })

    test('places thumbnail before main content with thumbnailPosition="left"', () => {
      const data = createTestData()
      const options: Options = { thumbnailPosition: 'left' }
      const result = createLinkCardNode(data, options)
      const mainIndex = result.value.indexOf('remark-link-card-plus__main')
      const thumbnailIndex = result.value.indexOf('remark-link-card-plus__thumbnail')
      expect(thumbnailIndex).toBeLessThan(mainIndex)
    })
  })

  describe('favicon rendering', () => {
    test('includes favicon when faviconUrl is provided', () => {
      const data = createTestData({ faviconUrl: 'https://example.com/favicon.ico' })
      const options: Options = {}
      const result = createLinkCardNode(data, options)
      expect(result.value).toContain('remark-link-card-plus__favicon')
      expect(result.value).toContain('src="https://example.com/favicon.ico"')
    })

    test('excludes favicon when faviconUrl is empty', () => {
      const data = createTestData({ faviconUrl: '' })
      const options: Options = {}
      const result = createLinkCardNode(data, options)
      expect(result.value).not.toContain('remark-link-card-plus__favicon')
    })

    test('includes favicon dimensions', () => {
      const data = createTestData({ faviconUrl: 'https://example.com/favicon.ico' })
      const options: Options = {}
      const result = createLinkCardNode(data, options)
      expect(result.value).toContain('width="14"')
      expect(result.value).toContain('height="14"')
    })
  })

  describe('CSS classes', () => {
    test('includes container class', () => {
      const data = createTestData()
      const options: Options = {}
      const result = createLinkCardNode(data, options)
      expect(result.value).toContain('remark-link-card-plus__container')
    })

    test('includes card class', () => {
      const data = createTestData()
      const options: Options = {}
      const result = createLinkCardNode(data, options)
      expect(result.value).toContain('remark-link-card-plus__card')
    })

    test('includes main class', () => {
      const data = createTestData()
      const options: Options = {}
      const result = createLinkCardNode(data, options)
      expect(result.value).toContain('remark-link-card-plus__main')
    })

    test('includes content class', () => {
      const data = createTestData()
      const options: Options = {}
      const result = createLinkCardNode(data, options)
      expect(result.value).toContain('remark-link-card-plus__content')
    })

    test('includes title class', () => {
      const data = createTestData()
      const options: Options = {}
      const result = createLinkCardNode(data, options)
      expect(result.value).toContain('remark-link-card-plus__title')
    })

    test('includes description class', () => {
      const data = createTestData()
      const options: Options = {}
      const result = createLinkCardNode(data, options)
      expect(result.value).toContain('remark-link-card-plus__description')
    })

    test('includes meta class', () => {
      const data = createTestData()
      const options: Options = {}
      const result = createLinkCardNode(data, options)
      expect(result.value).toContain('remark-link-card-plus__meta')
    })

    test('includes url class', () => {
      const data = createTestData()
      const options: Options = {}
      const result = createLinkCardNode(data, options)
      expect(result.value).toContain('remark-link-card-plus__url')
    })
  })
})
