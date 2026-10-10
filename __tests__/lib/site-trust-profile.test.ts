import { siteConfig } from '@/lib/site.config'
import { getSiteTrustProfile } from '@/lib/site-trust-profile'

const original = JSON.parse(JSON.stringify(siteConfig))
const originalBasePath = process.env.NEXT_PUBLIC_BASE_PATH

afterEach(() => {
  Object.assign(siteConfig, JSON.parse(JSON.stringify(original)))
  siteConfig.pending = original.pending
  if (originalBasePath === undefined) delete process.env.NEXT_PUBLIC_BASE_PATH
  else process.env.NEXT_PUBLIC_BASE_PATH = originalBasePath
})

describe('public site trust profile', () => {
  it('publishes the configured owning charity separately from FFC support', () => {
    Object.assign(siteConfig, {
      name: 'Example Charity',
      url: 'https://example.org',
      ein: '12-3456789',
      nonprofitStatus: 'https://schema.org/Nonprofit501c3',
      contactEmail: 'hello@example.org',
    })
    process.env.NEXT_PUBLIC_BASE_PATH = ''
    const profile = getSiteTrustProfile()
    expect(profile.organization).toEqual({
      name: 'Example Charity',
      ein: '12-3456789',
      nonprofitStatus: 'https://schema.org/Nonprofit501c3',
    })
    expect(profile.supportedBy.name).toBe(original.supportedBy.name)
    expect(profile.contacts.primaryEmail).toBe('hello@example.org')
    expect(profile.siteId).toBe('https://example.org')
    expect(JSON.stringify(profile)).not.toContain('46-2471893')
  })
  it('makes no nonprofit or missing identity claim for an unverified charity', () => {
    Object.assign(siteConfig, {
      name: 'New Charity',
      ein: '',
      contactEmail: '',
      nonprofitStatus: undefined,
      pending: ['ein', 'email'],
    })
    expect(getSiteTrustProfile().organization).toEqual({
      name: 'New Charity',
      ein: null,
      nonprofitStatus: null,
    })
    expect(getSiteTrustProfile().contacts.primaryEmail).toBeNull()
  })
  it.each(['', '/FFC-IN-FFC_Single_Page_Template'])(
    'prefixes every endpoint for basePath %s',
    (basePath) => {
      siteConfig.url = 'https://example.org/'
      process.env.NEXT_PUBLIC_BASE_PATH = basePath
      const profile = getSiteTrustProfile()
      expect(profile.canonicalUrl).toBe('https://example.org' + basePath)
      expect(profile.profileEndpoints.siteProfile).toBe(
        'https://example.org' + basePath + '/site-profile.json'
      )
      for (const url of Object.values(profile.profileEndpoints)) {
        expect(url.startsWith(profile.canonicalUrl + '/')).toBe(true)
      }
    }
  )
  it('reflects rebranding after an earlier read rather than caching stale identity', () => {
    const first = getSiteTrustProfile()
    siteConfig.name = 'Rebranded Charity'
    siteConfig.ein = '98-7654321'
    expect(getSiteTrustProfile().organization.ein).toBe('98-7654321')
    expect(getSiteTrustProfile().siteName).toBe('Rebranded Charity')
    expect(first.siteName).toBe(original.name)
  })
  it('publishes only explicit public fields and the current pnpm checks', () => {
    const profile = getSiteTrustProfile()
    expect(Object.keys(profile).sort()).toEqual(
      [
        'canonicalUrl',
        'contacts',
        'organization',
        'profileEndpoints',
        'schemaVersion',
        'siteId',
        'siteName',
        'supportedBy',
        'template',
        'trust',
      ].sort()
    )
    expect(profile.trust.requiredChecks).toContain('pnpm run test:coverage')
    expect(JSON.stringify(profile)).not.toContain('integrations')
  })
})
