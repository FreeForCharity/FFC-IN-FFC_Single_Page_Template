import { safeHttpUrl, safeHttpsImageUrl } from '@/lib/events/safeUrl'

describe('safeHttpUrl', () => {
  it.each([
    ['https://example.org/path?q=1', 'https://example.org/path?q=1'],
    ['http://example.org', 'http://example.org/'],
    ['  https://example.org  ', 'https://example.org/'],
  ])('accepts valid http(s) URL %p', (input, expected) => {
    expect(safeHttpUrl(input)).toBe(expected)
  })

  it.each([
    'javascript:alert(1)',
    'JAVASCRIPT:alert(1)',
    'data:text/html,<script>alert(1)</script>',
    'vbscript:msgbox(1)',
    'file:///etc/passwd',
    '//evil.example.org',
    'mailto:user@example.org',
    'about:blank',
    '',
    '   ',
    'not a url',
  ])('rejects unsafe input %p', (input) => {
    expect(safeHttpUrl(input)).toBeUndefined()
  })

  it('rejects null / undefined / non-strings', () => {
    expect(safeHttpUrl(undefined)).toBeUndefined()
    expect(safeHttpUrl(null)).toBeUndefined()
    // @ts-expect-error – proving runtime safety for unexpected types
    expect(safeHttpUrl(123)).toBeUndefined()
  })
})

describe('safeHttpsImageUrl', () => {
  it('accepts https URLs only', () => {
    expect(safeHttpsImageUrl('https://example.org/img.jpg')).toBe('https://example.org/img.jpg')
  })

  it('rejects http URLs', () => {
    expect(safeHttpsImageUrl('http://example.org/img.jpg')).toBeUndefined()
  })

  it('rejects unsafe schemes', () => {
    expect(safeHttpsImageUrl('javascript:alert(1)')).toBeUndefined()
    expect(safeHttpsImageUrl('data:image/png;base64,AAA')).toBeUndefined()
  })
})
