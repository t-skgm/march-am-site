import { describe, expect, test } from 'vitest'
import { contentfulEntryEditUrl } from './contentful'

describe('contentfulEntryEditUrl', () => {
  test('spaceIdとenvironmentからContentful管理画面のURLを組み立てる', () => {
    expect(
      contentfulEntryEditUrl('entry123', { spaceId: 'space456', environment: 'staging' })
    ).toBe('https://app.contentful.com/spaces/space456/environments/staging/entries/entry123')
  })

  test('environmentが空の場合はmasterにフォールバックする', () => {
    expect(contentfulEntryEditUrl('entry123', { spaceId: 'space456', environment: '' })).toBe(
      'https://app.contentful.com/spaces/space456/environments/master/entries/entry123'
    )
  })
})
