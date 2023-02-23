export const routes = {
  index: '/',
  about: '/about',
  article: {
    index: '/article',
    slug: (s: string) => `/article/${s}`,
    page: (p: number) => `/article/page/${p.toString()}`,
    tag: {
      index: '/article/tag',
      tag: (encodedTag: string) => `/article/tag/${encodedTag}`,
      page: (encodedTag: string, p: number) => `/article/tag/${encodedTag}/${p.toString()}`
    },
    category: {
      index: '/article/category',
      category: (encodedCategory: string) => `/article/category/${encodedCategory}`,
      page: (encodedCategory: string, p: number) =>
        `/article/category/${encodedCategory}/${p.toString()}`
    }
  }
} as const
