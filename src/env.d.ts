/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_GA_TRACKING_ID: string
  readonly CONTENTFUL_SPACE_ID: string
  readonly CONTENTFUL_DELIVERY_TOKEN: string
  readonly CONTENTFUL_PREVIEW_TOKEN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
