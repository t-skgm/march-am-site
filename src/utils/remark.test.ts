import { describe, expect, test } from 'vitest'
import { processMarkdown, remark } from './remark'

describe('remark', () => {
  test('can convert md', async () => {
    const result = await remark.process(`# Title
paragraph.`)
    expect(String(result)).toMatchInlineSnapshot(`
      "<h1 id="title">Title</h1>
      <p>paragraph.</p>"
    `)
  })

  test('can convert gfm table md', async () => {
    const result = await remark.process(`
| a | b |
| - | - |
| 1 | 2 |
    `)
    expect(String(result)).toMatchInlineSnapshot(`
      "<table>
      <thead>
      <tr>
      <th>a</th>
      <th>b</th>
      </tr>
      </thead>
      <tbody>
      <tr>
      <td>1</td>
      <td>2</td>
      </tr>
      </tbody>
      </table>"
    `)
  })

  test('can convert link card markdown', async () => {
    const result = await remark.process(`https://example.com`)
    expect(String(result)).toMatchInlineSnapshot(`
      "<div class="remark-link-card-plus__container">
        <a href="https://example.com/" target="_blank" rel="noreferrer noopener" class="remark-link-card-plus__card">
          <div class="remark-link-card-plus__main">
        <div class="remark-link-card-plus__content">
          <div class="remark-link-card-plus__title">Example Domain</div>
          <div class="remark-link-card-plus__description"></div>
        </div>
        <div class="remark-link-card-plus__meta">
          <span class="remark-link-card-plus__url">example.com</span>
        </div>
      </div>
        </a>
      </div>"
    `)
  })
})

describe('processMarkdown()', () => {
  test("don't remove html tags", async () => {
    const result = await processMarkdown(`# Title
<p>paragraph with tag.</p>`)

    expect(String(result)).toMatchInlineSnapshot(`
      "<h1 id="title">Title</h1>
      <p>paragraph with tag.</p>"
    `)
  })

  test("don't remove script tags", async () => {
    const result = await processMarkdown(`# Title
paragraph with <script /> tag.`)

    expect(String(result)).toMatchInlineSnapshot(`
      "<h1 id="title">Title</h1>
      <p>paragraph with <script /> tag.</p>"
    `)
  })
})
