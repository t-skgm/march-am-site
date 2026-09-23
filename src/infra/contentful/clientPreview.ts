import { createClient } from 'contentful'
import type { CreateClientParams } from 'contentful'

/**
 * This module is server-only. Never import it from browser code.
 */
export type PreviewClientParams = Pick<CreateClientParams, 'space' | 'accessToken' | 'environment'>

export const createContentfulPreviewClient = (params: PreviewClientParams) =>
  createClient({
    ...params,
    host: 'preview.contentful.com'
  })
