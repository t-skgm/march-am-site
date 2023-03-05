import { describe, expect, test } from 'vitest'
import { processMarkdown, remark } from './remark'

describe('remark', () => {
  test('can convert md', async () => {
    const result = await remark.process(`# Title
paragraph.`)
    expect(String(result)).toMatchInlineSnapshot(`
      "<h1>Title</h1>
      <p>paragraph.</p>"
    `)
  })
})

describe('processMarkdown()', () => {
  test("don't remove html tags", async () => {
    const result = await processMarkdown(`# Title
<p>paragraph with tag.</p>`)

    expect(String(result)).toMatchInlineSnapshot(`
    "<h1>Title</h1>
    <p>paragraph with tag.</p>"
  `)
  })

  test("don't remove script tags", async () => {
    const result = await processMarkdown(`# Title
paragraph with <script /> tag.`)

    expect(String(result)).toMatchInlineSnapshot(`
    "<h1>Title</h1>
    <p>paragraph with <script /> tag.</p>"
  `)
  })
})
