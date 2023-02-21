export const routes = {
  index: '/',
  about: '/about',
  article: {
    index: '/article',
    slug: (s: string) => `/article/${s}`,
    page: (p: number) => `/article/page/${p.toString()}`
  }
} as const
