import { defineConfig } from 'astro/config'
import preact from '@astrojs/preact'
import sitemap from '@astrojs/sitemap'
import mdx from '@astrojs/mdx'
import tailwindcss from '@tailwindcss/vite'

const SITE_URL = process.env.SITE_URL || process.env.CF_PAGES_URL || 'http://localhost:3000'

// https://astro.build/config
export default defineConfig({
  markdown: { drafts: true, gfm: true },
  integrations: [preact(), sitemap(), mdx()],
  vite: {
    ssr: { noExternal: ['path-to-regexp'] },
    plugins: [tailwindcss()]
  },
  site: SITE_URL
})
