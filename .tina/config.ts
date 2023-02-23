import { defineConfig } from 'tinacms'
import { Blog } from './__generated__/types'
import dayjs from 'dayjs'
import slugify from 'slugify'
import { OmitTinaSysProps } from '../src/types'

// Your hosting provider likely exposes this as an environment variable
const branch = process.env.HEAD || process.env.CF_PAGES_BRANCH || 'main'

export default defineConfig({
  branch,
  clientId: process.env.TINA_CLIENT_ID!,
  token: process.env.TINA_TOKEN!,
  build: {
    outputFolder: 'admin',
    publicFolder: 'public'
  },
  media: {
    tina: {
      publicFolder: 'public',
      mediaRoot: 'assets/img/uploads'
    }
  },
  schema: {
    collections: [
      {
        name: 'blog',
        label: 'Blog posts',
        path: 'src/content/blog',
        format: 'md',
        ui: {
          filename: {
            slugify: (values) => {
              const b = values as OmitTinaSysProps<Blog>
              const slugified = b.title ? slugify(b.title) : undefined
              return `${dayjs(b.postedAt).format('YYYY-MM-DD')}${
                slugified ? `_${slugified}` : `-${dayjs(b.postedAt).format('HHmm')}`
              }`
            }
          }
        },
        fields: [
          {
            label: 'タイトル',
            type: 'string',
            name: 'title',
            isTitle: true,
            required: true
          },
          {
            label: '投稿日',
            type: 'datetime',
            name: 'postedAt',
            required: true,
            ui: {
              dateFormat: 'YYYY-MM-DD',
              timeFormat: 'HH:mm:ss'
            }
          },
          {
            label: 'タグ',
            name: 'tags',
            type: 'string',
            list: true,
            ui: {
              component: 'tags'
            }
          },
          {
            label: 'サムネイル画像',
            type: 'image',
            name: 'thumbnail',
            required: false
          },
          {
            label: '本文',
            type: 'rich-text',
            name: 'body',
            isBody: true
          },
          {
            label: '下書き',
            name: 'draft',
            type: 'boolean',
            required: false
          }
        ]
      }
    ]
  }
})
