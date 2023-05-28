import * as contentfulAll from 'contentful'
const { createClient } = contentfulAll

/** プレビュー表示用 */
export const createContentfulPreviewClient = () => {
  const client = createClient({
    space: import.meta.env.PUBLIC_CONTENTFUL_SPACE_ID,
    accessToken: import.meta.env.PUBLIC_CONTENTFUL_PREVIEW_TOKEN,
    host: 'preview.contentful.com'
  })

  return client
}
