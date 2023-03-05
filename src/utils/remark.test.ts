import { expect, test } from 'vitest'
import { remark } from './remark'

test('can convert md', async () => {
  const result = await remark.process('# Title\n' + 'paragraph.')
  expect(String(result)).toMatchInlineSnapshot(`
      "<h1>Title</h1>
      <p>paragraph.</p>"
    `)
})
