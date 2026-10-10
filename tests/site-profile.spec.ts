import { test, expect } from '@playwright/test'
import { siteConfig } from '../src/lib/site.config'

test('static export publishes the current charity profile at its declared endpoint', async ({
  request,
}) => {
  const response = await request.get('/site-profile.json')
  expect(response.ok()).toBe(true)
  const profile = await response.json()
  expect(profile.schemaVersion).toBe('ffc.site-profile.v1')
  expect(profile.organization.name).toBe(siteConfig.name)
  expect(profile.organization.ein).toBe(siteConfig.ein.trim() || null)
  expect(profile.supportedBy.name).toBe(siteConfig.supportedBy.name)
  expect(profile.profileEndpoints.siteProfile).toBe(profile.canonicalUrl + '/site-profile.json')
  expect(profile.trust.requiredChecks).toContain('pnpm run test:coverage')
})
