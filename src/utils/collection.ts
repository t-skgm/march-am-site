import { sortBy, reverse, take, drop, pipe, identity } from 'remeda'

export const onlyPublished = (entry: { data: { draft?: boolean | undefined } }): boolean =>
  entry.data.draft == null || !entry.data.draft

export const cropEntries = <Entry extends { data: { postedAt: string } }>({
  entries,
  first,
  skip
}: {
  entries: Entry[]
  first?: number | undefined
  skip?: number | undefined
}) =>
  /* eslint-disable @typescript-eslint/indent */
  pipe(
    entries,
    sortBy((e) => e.data.postedAt),
    reverse(),
    skip != null ? drop(skip) : identity,
    first != null ? take(first) : identity
  )

export const getTotalPage = ({
  perPage = 20,
  totalCount
}: {
  totalCount: number
  perPage?: number
}) => Math.round(totalCount / perPage)

export const getPaginateParams = ({
  page,
  perPage = 20,
  totalCount
}: {
  page: number
  perPage?: number
  totalCount: number
}) => {
  const totalPage = getTotalPage({ totalCount, perPage })
  const skip = perPage * (page - 1)
  const hasPrev = page > 1
  const hasNext = page < totalPage

  return {
    totalPage,
    perPage,
    skip,
    prevPage: hasPrev ? page - 1 : undefined,
    nextPage: hasNext ? page + 1 : undefined
  }
}
