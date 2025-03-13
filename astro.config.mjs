import { defineConfig } from 'astro/config'
import preact from '@astrojs/preact'
import tailwind from '@astrojs/tailwind'
import sitemap from '@astrojs/sitemap'
import mdx from '@astrojs/mdx'

const SITE_URL = process.env.SITE_URL || process.env.CF_PAGES_URL || 'http://localhost:3000'

// https://astro.build/config
export default defineConfig({
  markdown: { drafts: true, gfm: true },
  integrations: [preact(), sitemap(), tailwind(), mdx()],
  vite: { ssr: { noExternal: ['path-to-regexp'] } },
  site: SITE_URL
})
