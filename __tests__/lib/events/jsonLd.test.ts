import { safeJsonLdSerialize } from '@/lib/events/jsonLd'

describe('safeJsonLdSerialize', () => {
  it('escapes </script> so upstream content cannot break out of the JSON-LD block', () => {
    const evil = { name: '</script><script>alert(1)</script>' }
    const out = safeJsonLdSerialize(evil)
    expect(out).not.toContain('</script>')
    expect(out).not.toContain('<')
  })

  it('escapes HTML comment openers', () => {
    const out = safeJsonLdSerialize({ name: '<!-- sneaky' })
    expect(out).not.toContain('<!--')
  })

  it('round-trips: escaped output parses back to the original value', () => {
    const value = {
      name: '</script> & <b>bold</b>',
      description: 'plain text',
      nested: [{ location: '<Main Hall>' }],
    }
    expect(JSON.parse(safeJsonLdSerialize(value))).toEqual(value)
  })

  it('escapes JS line separators U+2028/U+2029', () => {
    const value = { name: `a${String.fromCharCode(0x2028)}b${String.fromCharCode(0x2029)}c` }
    const out = safeJsonLdSerialize(value)
    expect(out.includes(String.fromCharCode(0x2028))).toBe(false)
    expect(out.includes(String.fromCharCode(0x2029))).toBe(false)
    expect(JSON.parse(out)).toEqual(value)
  })

  it('leaves ordinary content untouched', () => {
    const value = { name: 'Community Cleanup', startDate: '2026-10-01T17:00:00Z' }
    expect(safeJsonLdSerialize(value)).toBe(JSON.stringify(value))
  })
})
