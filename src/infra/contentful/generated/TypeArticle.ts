import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode
} from 'contentful'

/**
 * Fields type definition for content type 'TypeArticle'
 * @name TypeArticleFields
 * @type {TypeArticleFields}
 * @memberof TypeArticle
 */
export interface TypeArticleFields {
  /**
   * Field type definition for field 'category' (Category)
   * @name Category
   * @localized false
   */
  category: EntryFieldTypes.Symbol<'Diary' | 'Review'>
  /**
   * Field type definition for field 'title' (Title)
   * @name Title
   * @localized false
   */
  title: EntryFieldTypes.Symbol
  /**
   * Field type definition for field 'postedAt' (PostedAt)
   * @name PostedAt
   * @localized false
   */
  postedAt: EntryFieldTypes.Date
  /**
   * Field type definition for field 'slug' (Slug)
   * @name Slug
   * @localized false
   */
  slug: EntryFieldTypes.Symbol
  /**
   * Field type definition for field 'thumbnail' (Thumbnail)
   * @name Thumbnail
   * @localized false
   */
  thumbnail?: EntryFieldTypes.AssetLink
  /**
   * Field type definition for field 'ogpImageUrl' (OGP Image URL)
   * @name OGP Image URL
   * @localized false
   */
  ogpImageUrl?: EntryFieldTypes.Symbol
  /**
   * Field type definition for field 'tags' (Tags)
   * @name Tags
   * @localized false
   */
  tags?: EntryFieldTypes.Array<EntryFieldTypes.Symbol>
  /**
   * Field type definition for field 'body' (Body)
   * @name Body
   * @localized false
   */
  body: EntryFieldTypes.Text
}

/**
 * Entry skeleton type definition for content type 'article' (Article)
 * @name TypeArticleSkeleton
 * @type {TypeArticleSkeleton}
 * @author 21n7y8VaJyQM8TcB6aGF2s
 * @since 2020-04-12T07:04:59.801Z
 * @version 31
 */
export type TypeArticleSkeleton = EntrySkeletonType<TypeArticleFields, 'article'>
/**
 * Entry type definition for content type 'article' (Article)
 * @name TypeArticle
 * @type {TypeArticle}
 * @author 21n7y8VaJyQM8TcB6aGF2s
 * @since 2020-04-12T07:04:59.801Z
 * @version 31
 */
export type TypeArticle<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode
> = Entry<TypeArticleSkeleton, Modifiers, Locales>
export type TypeArticleWithoutLinkResolutionResponse = TypeArticle<'WITHOUT_LINK_RESOLUTION'>
export type TypeArticleWithoutUnresolvableLinksResponse = TypeArticle<'WITHOUT_UNRESOLVABLE_LINKS'>
export type TypeArticleWithAllLocalesResponse<Locales extends LocaleCode = LocaleCode> =
  TypeArticle<'WITH_ALL_LOCALES', Locales>
export type TypeArticleWithAllLocalesAndWithoutLinkResolutionResponse<
  Locales extends LocaleCode = LocaleCode
> = TypeArticle<'WITHOUT_LINK_RESOLUTION' | 'WITH_ALL_LOCALES', Locales>
export type TypeArticleWithAllLocalesAndWithoutUnresolvableLinksResponse<
  Locales extends LocaleCode = LocaleCode
> = TypeArticle<'WITHOUT_UNRESOLVABLE_LINKS' | 'WITH_ALL_LOCALES', Locales>
