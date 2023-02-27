import { defineConfig } from 'astro/config'
import preact from '@astrojs/preact'
import tailwind from '@astrojs/tailwind'
import sitemap from '@astrojs/sitemap'
import mdx from '@astrojs/mdx'
import netlifyCMS from 'astro-netlify-cms'

const SITE_URL =
  process.env.SITE_URL ||
  process.env.CF_PAGES_URL ||
  // Netlify
  process.env.DEPLOY_PRIME_URL ||
  'http://localhost:3000'

/** @type {import('netlify-cms-core').CmsConfig} */
const cmsConfig = {
  backend: {
    name: 'github',
    repo: 't-skgm/march-am-site',
    branch: 'main',
    base_url: SITE_URL,
    auth_endpoint: '/api/auth'
  },
  publish_mode: 'simple',
  media_folder: 'public/uploads',
  public_folder: '/uploads',
  site_url: SITE_URL,
  collections: [
    {
      name: 'blog',
      label: 'Blog',
      identifier_field: 'slug',
      folder: 'src/content/blog',
      preview_path: 'article/{{slug}}/',
      create: true,
      delete: true,
      extension: 'md',
      format: 'frontmatter',
      slug: '{{year}}-{{month}}-{{day}}_{{slug}}',
      sortable_fields: ['postedAt'],
      fields: [
        {
          name: 'title',
          label: 'Title',
          widget: 'string',
          required: true
        },
        {
          widget: 'image',
          name: 'thumbnail',
          label: 'サムネイル',
          required: false
        },
        {
          name: 'postedAt',
          label: '投稿時刻',
          widget: 'datetime',
          required: true
        },
        {
          name: 'category',
          label: 'カテゴリー',
          widget: 'select',
          required: true,
          options: ['Review', 'Diary']
        },
        {
          name: 'tags',
          label: 'タグ',
          widget: 'list',
          required: false
        },
        {
          name: 'body',
          label: '本文',
          widget: 'markdown',
          required: true
        }
      ]
    }
  ]
}

// https://astro.build/config
export default defineConfig({
  markdown: {
    drafts: true,
    gfm: true
  },
  integrations: [
    preact(),
    tailwind(),
    sitemap(),
    netlifyCMS({
      adminPath: '/cms-admin',
      config: cmsConfig
    }),
    mdx()
  ],
  vite: {
    ssr: {
      noExternal: ['path-to-regexp']
    }
  },
  site: SITE_URL
})
