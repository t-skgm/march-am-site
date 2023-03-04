/* eslint-disable @typescript-eslint/no-non-null-assertion */
import 'dotenv/config'
import { readdir, readFile } from 'fs/promises'
import Bluebird from 'bluebird'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import frontmatter from 'front-matter'
import contentfulManagement from 'contentful-management'

const filename = fileURLToPath(import.meta.url)
const currentDir = dirname(filename)

export interface Article {
  category: 'Review' | 'Diary'
  title: string
  postedAt: string
  slug: string
  thumbnail?: any | undefined
  tags?: string[] | undefined
}

const main = async () => {
  const filenames = await readdir(resolve(currentDir, './articles/'))

  const contentfulClient = contentfulManagement.createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN!
  })

  const space = await contentfulClient.getSpace(process.env.CONTENTFUL_SPACE_ID!)
  const environment = await space.getEnvironment(process.env.CONTENTFUL_ENVIRONMENT!)
  // const e = await environment.getEntry('5wkYpFhJ0bfqvXBMT2OMZY')
  // console.dir(e, { depth: 5 })

  await Bluebird.each(filenames.slice(0, 1), async (filename) => {
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
        thumbnail: attr.thumbnail != null ? ja(attr.thumbnail) : undefined,
        tags: attr.tags != null ? ja(attr.tags) : undefined,
        body: ja(parsed.body)
      }
    })
    console.log(draftEntry)

    // const publishedEntry = await draftEntry.publish()
  })
}

const ja = (value: string | string[]) => ({ 'ja-JP': value })

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
