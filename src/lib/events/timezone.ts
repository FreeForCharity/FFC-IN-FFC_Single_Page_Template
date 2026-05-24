/**
 * Tiny IANA-timezone offset helper that uses Intl.DateTimeFormat — no
 * tz database dependency. Returns the offset (in minutes) that the
 * given UTC instant has in the supplied IANA zone (e.g. -240 for EDT).
 */
export function tzOffsetMinutes(utcMs: number, timeZone: string): number {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
  const parts: Record<string, string> = {}
  for (const p of fmt.formatToParts(new Date(utcMs))) {
    if (p.type !== 'literal') parts[p.type] = p.value
  }
  // Intl can emit hour:'24' for midnight in some locales; normalize.
  if (parts.hour === '24') parts.hour = '00'
  const asUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second)
  )
  return (asUtc - utcMs) / 60000
}

/**
 * Convert a wall-clock time interpreted in `timeZone` into the true UTC
 * milliseconds. Two-pass solves DST-overlap ambiguity stably.
 */
export function wallTimeToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second: number,
  timeZone?: string
): number {
  const guess = Date.UTC(year, month - 1, day, hour, minute, second)
  if (!timeZone) return guess
  let offset = tzOffsetMinutes(guess, timeZone)
  const firstPass = guess - offset * 60_000
  offset = tzOffsetMinutes(firstPass, timeZone)
  return guess - offset * 60_000
}
