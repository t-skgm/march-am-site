export const onlyPublished = (entry: { data: { draft?: boolean | undefined } }): boolean =>
  !entry.data.draft
