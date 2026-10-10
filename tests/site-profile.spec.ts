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
  expect(profile.trust.requiredChecks).toContain('pnpm run verify:build')
  expect(profile.trust.requiredChecks).toContain('pnpm run check:bundle')
  expect(profile.trust.requiredChecks).toContain('pnpm run check:site-config')
  expect(profile.trust.requiredChecks).toContain('pnpm run audit:high')
  expect(profile.contacts.vulnerabilityDisclosureUrl).toBe(
    profile.canonicalUrl + siteConfig.vulnerabilityDisclosurePath
  )
  expect(profile.contacts).not.toHaveProperty('vulnerabilityDisclosurePath')
  expect(profile.profileEndpoints.securityTxt).toBe(profile.canonicalUrl + '/security.txt')
  const security = await request.get(new URL(profile.profileEndpoints.securityTxt).pathname)
  expect(security.ok()).toBe(true)
  expect(await security.text()).toContain('Contact:')
})
