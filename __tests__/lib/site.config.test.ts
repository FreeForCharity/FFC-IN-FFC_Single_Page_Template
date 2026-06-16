import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import {
  siteConfig,
  siteTrustProfile,
  siteUrl,
  twitterSite,
  cardDescription,
  getSiteTrustProfile,
} from '../../src/lib/site.config'

describe('site trust profile contract', () => {
  it('exposes the stable v1 machine-readable contract shape', () => {
    expect(siteTrustProfile.schemaVersion).toBe('ffc.site-profile.v1')
    expect(siteTrustProfile.profileEndpoints).toEqual({
      siteProfile: '/site-profile.json',
      securityTxt: '/.well-known/security.txt',
      sitemap: '/sitemap.xml',
      robots: '/robots.txt',
    })
    expect(siteTrustProfile.trust).toMatchObject({
      hosting: 'github-pages-static-export',
      requiresHttps: true,
      managesSecrets: false,
      productionDnsManagedHere: false,
    })
    expect(siteTrustProfile.trust.requiredChecks).toContain('npm run build')
  })

  it('keeps the static public JSON endpoint in sync with the typed profile', () => {
    const publicProfile = JSON.parse(
      readFileSync(join(process.cwd(), 'public/site-profile.json'), 'utf8')
    )

    expect(publicProfile).toEqual(siteTrustProfile)
  })

  it('returns JSON-serializable public data only', () => {
    const profile = getSiteTrustProfile()
    expect(() => JSON.stringify(profile)).not.toThrow()
    expect(JSON.parse(JSON.stringify(profile))).toEqual(profile)
    const serialized = JSON.stringify(profile).toLowerCase()
    expect(serialized).not.toContain('apikey')
    expect(serialized).not.toContain('token')
    expect(profile.canonicalUrl).toBe(siteConfig.url)
    expect(profile.contacts.primaryEmail).toBe(siteConfig.contactEmail)
  })

  it('reflects siteConfig edits used by generated-site automation', () => {
    const originalName = siteConfig.name
    const originalUrl = siteConfig.url
    const originalEmail = siteConfig.contactEmail

    try {
      siteConfig.name = 'Example Nonprofit'
      siteConfig.url = 'https://example.org'
      siteConfig.contactEmail = 'hello@example.org'

      expect(getSiteTrustProfile()).toMatchObject({
        siteName: 'Example Nonprofit',
        canonicalUrl: 'https://example.org',
        contacts: {
          primaryEmail: 'hello@example.org',
          securityEmail: 'hello@example.org',
        },
      })
    } finally {
      siteConfig.name = originalName
      siteConfig.url = originalUrl
      siteConfig.contactEmail = originalEmail
    }
  })
})

describe('siteUrl', () => {
  it('returns the base URL for "/"', () => {
    expect(siteUrl('/')).toBe(`${siteConfig.url}/`)
  })

  it('preserves single absolute paths', () => {
    expect(siteUrl('/foo')).toBe(`${siteConfig.url}/foo`)
    expect(siteUrl('/foo/bar/')).toBe(`${siteConfig.url}/foo/bar/`)
  })

  it('throws on an empty string', () => {
    expect(() => siteUrl('')).toThrow(TypeError)
  })

  it('throws on a relative path with no leading slash', () => {
    expect(() => siteUrl('foo')).toThrow(TypeError)
  })

  it('throws on a protocol-relative path (closes redirect-bypass surface)', () => {
    expect(() => siteUrl('//evil.com/x')).toThrow(TypeError)
  })

  it('throws on non-string input', () => {
    // @ts-expect-error -- intentionally passing wrong type to exercise the guard
    expect(() => siteUrl(123)).toThrow(TypeError)
    // @ts-expect-error -- intentionally passing wrong type to exercise the guard
    expect(() => siteUrl(null)).toThrow(TypeError)
  })

  it('uses the default "/" path when called with no argument', () => {
    expect(siteUrl()).toBe(`${siteConfig.url}/`)
  })

  it('strips a trailing slash from siteConfig.url before joining', () => {
    // Mutate siteConfig.url to actually exercise the trailing-slash
    // branch in siteUrl(). Without this the previous assertion was
    // testing the no-slash default path and giving false confidence.
    const original = siteConfig.url
    try {
      siteConfig.url = original.replace(/\/?$/, '/') // ensure trailing slash
      expect(siteUrl('/x')).toBe(original.replace(/\/$/, '') + '/x')
      expect(siteUrl('/x').includes('//x')).toBe(false)
    } finally {
      siteConfig.url = original
    }
  })
})

describe('twitterSite', () => {
  // The default fixture sets twitterHandle = '@freeforcharity'. These tests
  // mutate the module-level config object temporarily so the helper sees
  // the input we want to exercise.
  const original = siteConfig.twitterHandle
  afterEach(() => {
    siteConfig.twitterHandle = original
  })

  it('passes through a well-formed @handle unchanged', () => {
    siteConfig.twitterHandle = '@foo'
    expect(twitterSite()).toBe('@foo')
  })

  it('prepends @ when missing so attribution does not silently break', () => {
    siteConfig.twitterHandle = 'foo'
    expect(twitterSite()).toBe('@foo')
  })

  it('returns undefined when handle is empty / whitespace / bare @', () => {
    for (const raw of ['', '   ', '@', '@@', '@ ']) {
      siteConfig.twitterHandle = raw
      expect(twitterSite()).toBeUndefined()
    }
  })

  it('does not duplicate the @ prefix on already-prefixed input', () => {
    siteConfig.twitterHandle = '@@foo'
    expect(twitterSite()).toBe('@foo')
  })
})

describe('cardDescription', () => {
  const original = siteConfig.shortDescription
  afterEach(() => {
    siteConfig.shortDescription = original
  })

  it('returns the shorter card-tuned copy when present', () => {
    siteConfig.shortDescription = 'short'
    expect(cardDescription()).toBe('short')
  })

  it('falls back to description when shortDescription is empty', () => {
    siteConfig.shortDescription = ''
    expect(cardDescription()).toBe(siteConfig.description)
  })

  it('falls back when shortDescription is whitespace only', () => {
    siteConfig.shortDescription = '   '
    expect(cardDescription()).toBe(siteConfig.description)
  })
})
