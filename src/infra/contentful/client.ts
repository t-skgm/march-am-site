import contentful from 'contentful'
const { createClient } = contentful

export const createContentfulClient = () =>
  createClient({
    space: import.meta.env.PUBLIC_CONTENTFUL_SPACE_ID,
    accessToken: import.meta.env.PUBLIC_CONTENTFUL_DELIVERY_TOKEN,
    host: 'cdn.contentful.com'
  })
