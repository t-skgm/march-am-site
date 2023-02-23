export const onlyPublished = (entry: { data: { draft?: boolean | undefined } }): boolean =>
  entry.data.draft == null || !entry.data.draft

export const calcFirstPage = <T>({ entries, pageSize }: { entries: T[]; pageSize: number }) => {
  const entriesSize = entries.length
  const lastPage = Math.ceil(entriesSize / pageSize)

  return {
    data: entries.slice(0, pageSize),
    currentPage: 1,
    lastPage,
    size: pageSize,
    total: entriesSize,
    /** urlはstubで有無チェックしかできない */
    url: {
      current: 'current',
      prev: undefined,
      next: lastPage > 1 ? 'next' : undefined
    },
    start: 0,
    end: pageSize - 1
  }
}
