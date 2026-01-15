export interface PagefindSearchResults {
  results: PagefindSearchResult[]
}

export interface PagefindSearchResult {
  id: string
  data: () => Promise<PagefindSearchData>
}

export interface PagefindSearchData {
  url: string
  meta: {
    title: string
  }
  excerpt: string
}

export interface PagefindInstance {
  search: (query: string) => Promise<PagefindSearchResults>
}

export interface SearchResult {
  id: string
  url: string
  title: string
  excerpt: string
}
