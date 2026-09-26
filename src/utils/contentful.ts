/** Contentfulの管理画面で該当エントリを編集するためのURLを生成する */
export const contentfulEntryEditUrl = (
  entryId: string,
  {
    spaceId = import.meta.env.PUBLIC_CONTENTFUL_SPACE_ID,
    environment = import.meta.env.PUBLIC_CONTENTFUL_ENVIRONMENT
  }: { spaceId?: string; environment?: string } = {}
): string => {
  const env = environment != null && environment.length > 0 ? environment : 'master'
  return `https://app.contentful.com/spaces/${spaceId}/environments/${env}/entries/${entryId}`
}
