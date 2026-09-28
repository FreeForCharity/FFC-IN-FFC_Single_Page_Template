import {
  siteConfig,
  siteUrl,
  twitterSite,
  cardDescription,
  isSupportingOrgSite,
  mailtoHref,
  publishedPhone,
  eventsFacebookPageUrl,
  donationEmbedUrl,
} from '../../src/lib/site.config'
import { asCharitySite, asSupporterSite, restoreSiteConfig } from '../helpers/site-identity'

describe('supportedBy (FFC footer standard)', () => {
  // The permanent "Supported by" attribution is required on every FFC-supported
  // charity site. These assertions guard against a fork (or refactor) removing
  // or repointing it — the values are intentionally FFC's, forever.
  it('is present and points at Free For Charity', () => {
    expect(siteConfig.supportedBy).toEqual({
      name: 'Free For Charity',
      url: 'https://freeforcharity.org',
      hubUrl: 'https://freeforcharity.org/hub/',
      // FFC's own legal contacts, rendered only on FFC's own site (legalContact()).
      legalContactName: 'Clarke Moyer',
      legalContactEmail: 'clarkemoyer@freeforcharity.org',
      cookieContactEmail: 'privacy@freeforcharity.org',
    })
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

describe('isSupportingOrgSite', () => {
  afterEach(restoreSiteConfig)

  it("is true on the supporting organization's own site", () => {
    asSupporterSite()
    expect(isSupportingOrgSite()).toBe(true)
  })

  it("is false on a charity's site — setting the name is enough", () => {
    asCharitySite()
    expect(isSupportingOrgSite()).toBe(false)
  })
})

describe('mailtoHref', () => {
  afterEach(restoreSiteConfig)

  it('links to contactEmail', () => {
    asCharitySite({ contactEmail: ' hello@pantry.example ' })
    expect(mailtoHref()).toBe('mailto:hello@pantry.example')
  })

  it('encodes characters that would add a recipient or a header', () => {
    asCharitySite({ contactEmail: 'a@b.example,c@d.example?bcc=e@f.example' })
    expect(mailtoHref()).toBe('mailto:a@b.example%2Cc@d.example%3Fbcc=e@f.example')
  })

  it('removes whitespace inside the address instead of encoding it', () => {
    asCharitySite({ contactEmail: 'hello @pantry.\nexample' })
    expect(mailtoHref()).toBe('mailto:hello@pantry.example')
  })

  it('appends an encoded subject', () => {
    asCharitySite()
    expect(mailtoHref('Hi & bye')).toMatch(/\?subject=Hi%20%26%20bye$/)
  })
})

describe("the supporting organization's integrations render only on its own site", () => {
  afterEach(restoreSiteConfig)

  it('embeds its donation form and links its Facebook page on its own site', () => {
    asSupporterSite()
    expect(donationEmbedUrl()).toBe(siteConfig.integrations.zeffyDonationUrl)
    expect(eventsFacebookPageUrl()).toBe(siteConfig.integrations.eventsFacebookPageUrl)
  })

  it("uses a charity's own Facebook link, and never embeds the supporter's form", () => {
    asCharitySite({
      social: [
        { label: 'LinkedIn', href: 'https://www.linkedin.com/company/riverbend-test' },
        { label: 'Facebook', href: ' https://www.facebook.com/riverbend-test ' },
      ],
    })
    expect(donationEmbedUrl()).toBeNull()
    expect(eventsFacebookPageUrl()).toBe('https://www.facebook.com/riverbend-test')
  })

  it("hides the Events Facebook link when a charity has none, rather than use the supporter's", () => {
    asCharitySite({ social: [{ label: 'X', href: 'https://x.com/riverbend-test' }] })
    expect(eventsFacebookPageUrl()).toBe('')
  })
})

describe('publishedPhone', () => {
  afterEach(restoreSiteConfig)

  it('returns the trimmed number when both halves are set', () => {
    asCharitySite({ phone: { display: ' (555) 010-0101 ', tel: ' 15550100101 ' } })
    expect(publishedPhone()).toEqual({ display: '(555) 010-0101', tel: '15550100101' })
  })

  it.each([
    [{ display: '', tel: '' }],
    [{ display: '(555) 010-0101', tel: '' }],
    [{ display: '', tel: '15550100101' }],
  ])('returns null unless both halves are set (%j)', (phone) => {
    asCharitySite({ phone })
    expect(publishedPhone()).toBeNull()
  })
})
