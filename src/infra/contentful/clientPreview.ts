import * as contentfulAll from 'contentful'
const { createClient } = contentfulAll

/** プレビュー表示用 */
export const contentfulPreviewClient = () => {
  const client = createClient({
    space: import.meta.env.PUBLIC_CONTENTFUL_SPACE_ID,
    accessToken: import.meta.env.PUBLIC_CONTENTFUL_DELIVERY_TOKEN,
    host: 'cdn.contentful.com'
  })

  return client
}
