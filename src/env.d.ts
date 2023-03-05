/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_GA_TRACKING_ID: string
  readonly PUBLIC_CONTENTFUL_SPACE_ID: string
  readonly PUBLIC_CONTENTFUL_ENVIRONMENT: string
  readonly PUBLIC_CONTENTFUL_DELIVERY_TOKEN: string
  readonly PUBLIC_CONTENTFUL_PREVIEW_TOKEN: string
  readonly CONTENTFUL_MANAGEMENT_TOKEN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
