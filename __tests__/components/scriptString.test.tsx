/**
 * @jest-environment jsdom
 */

/**
 * `scriptString` serialises a tracking ID for embedding in an inline
 * `<script>` body. The three analytics loaders interpolate IDs into script
 * text, and nothing else validates them: `isConfigured()` rejects placeholder
 * values but not malformed ones, so this helper is the only thing between a
 * bad ID and the script body.
 *
 * The IDs are build-time values a maintainer sets, not visitor input, so this
 * is defence in depth rather than a live hole.
 *
 * The case that decides the implementation is `</script>`. `JSON.stringify`
 * alone escapes quotes and newlines — enough to keep the script parsing — but
 * leaves `<` untouched, so a stringify-only version still lets an ID close the
 * element early and have the rest parsed as markup. The third case below fails
 * against bare `JSON.stringify` and passes here; that is the whole reason the
 * helper exists rather than a direct call.
 */
import { scriptString } from '../../src/components/cookie-consent'

describe('scriptString', () => {
  it('wraps an ordinary ID in quotes and changes nothing else', () => {
    expect(scriptString('G-ABC1234567')).toBe('"G-ABC1234567"')
    expect(scriptString('123456789012345')).toBe('"123456789012345"')
    expect(scriptString('abcdefghij')).toBe('"abcdefghij"')
  })

  it('keeps the surrounding script parseable when the ID fights back', () => {
    const hostile = `G-X'); alert('xss'); //`
    // Compiles, does not run.
    expect(() => new Function(`gtag('config', ${scriptString(hostile)}, {});`)).not.toThrow()
    // A raw newline is a syntax error inside a JS string literal.
    expect(() => new Function(`x = ${scriptString('a\nb')}`)).not.toThrow()
    expect(() => new Function(`x = ${scriptString('a"b')}`)).not.toThrow()
  })

  it('never emits a literal </script>', () => {
    // This is what bare JSON.stringify gets wrong: it leaves `<` alone.
    expect(scriptString('a</script>b')).not.toContain('</script>')
    expect(scriptString('a</script>b')).toContain('\\u003c/script>')
  })

  it('round-trips exactly, so a real ID cannot be silently mangled', () => {
    // Escaping that altered a legitimate value would misconfigure analytics
    // without failing anything — worse than the injection it guards against.
    for (const value of [
      'G-ABC1234567',
      `G-X'); alert('xss'); //</script>`,
      'a\nb',
      'a"b',
      '\u2028\u2029',
    ]) {
      expect(JSON.parse(scriptString(value))).toBe(value)
    }
  })
})
