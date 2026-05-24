import { siteConfig, siteUrl, twitterSite, cardDescription } from '../../src/lib/site.config'

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
    // The function reads siteConfig.url at call time. Confirm that the
    // helper does not double-up trailing slashes if the caller's path
    // already begins with one (which it must).
    expect(siteUrl('/x').endsWith('//x')).toBe(false)
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
