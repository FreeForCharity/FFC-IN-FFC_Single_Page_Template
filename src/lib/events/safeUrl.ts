/**
 * Returns the input only if it is a syntactically valid http/https URL.
 * Otherwise returns undefined. Used to guard against javascript:, data:,
 * vbscript:, file:, and protocol-relative inputs flowing into href / src
 * attributes from untrusted upstream calendar data.
 */
export function safeHttpUrl(input: string | undefined | null): string | undefined {
  if (typeof input !== 'string') return undefined
  const trimmed = input.trim()
  if (!trimmed) return undefined
  let parsed: URL
  try {
    parsed = new URL(trimmed)
  } catch {
    return undefined
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return undefined
  return parsed.toString()
}

/**
 * Like safeHttpUrl but accepts only https — for image sources where we want
 * to enforce TLS and avoid mixed-content.
 */
export function safeHttpsImageUrl(input: string | undefined | null): string | undefined {
  const u = safeHttpUrl(input)
  if (!u) return undefined
  return u.startsWith('https://') ? u : undefined
}
