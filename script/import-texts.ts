import 'dotenv/config'
import { readdir, readFile } from 'fs/promises'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import frontmatter from 'front-matter'
import contentfulManagement from 'contentful-management'

const currentDir = dirname(fileURLToPath(import.meta.url))

export interface Article {
  category: 'Review' | 'Diary'
  title: string
  postedAt: string
  slug: string
  thumbnail?: Record<string, unknown> | undefined
  tags?: string[] | undefined
}

const main = async () => {
  const filenames = await readdir(resolve(currentDir, './articles/'))

  // oxlint-disable-next-line typescript/no-deprecated -- legacyを治すの面倒なので
  const contentfulClient = contentfulManagement.createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN!
  }, { type: 'legacy' })

  const space = await contentfulClient.getSpace(process.env.PUBLIC_CONTENTFUL_SPACE_ID!)
  const environment = await space.getEnvironment(process.env.PUBLIC_CONTENTFUL_ENVIRONMENT!)

  for (const [idx, filename] of filenames.entries()) {
    if (idx % 10 === 1) console.log('idx:', idx)

    const markdownStr = await readFile(resolve(currentDir, './articles/', filename), {
      encoding: 'utf-8'
    })
    const slug = filename.replace(/\.md$/, '')
    const parsed = frontmatter(markdownStr)
    const attr = parsed.attributes as Article

    const draftEntry = await environment.createEntry('article', {
      fields: {
        slug: ja(slug),
        category: ja(attr.category),
        title: ja(attr.title),
        postedAt: ja(attr.postedAt),
        // thumbnail: attr.thumbnail != null ? ja(attr.thumbnail) : undefined,
        tags: attr.tags != null ? ja(attr.tags) : undefined,
        body: ja(parsed.body)
      }
    })
    // console.log(draftEntry)

    await draftEntry.publish()
  }
}

const ja = (value: string | string[]) => ({ 'ja-JP': value })

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
