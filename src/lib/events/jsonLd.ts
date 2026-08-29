/**
 * Serialize a value for embedding inside a <script type="application/ld+json">
 * block. Plain JSON.stringify is NOT safe there: event titles, descriptions
 * and locations arrive from upstream calendars and Facebook, and a value
 * containing `</script>` (or `<!--`) terminates the script element early and
 * lets the remainder parse as markup - an XSS breakout. Escaping every `<`
 * as the JSON escape sequence u003c closes both vectors while remaining
 * valid JSON; the JS line separators U+2028/U+2029 are escaped too so the
 * payload stays valid even if it is ever consumed as JavaScript.
 */
export function safeJsonLdSerialize(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}
