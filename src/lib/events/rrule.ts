/**
 * Minimal RFC 5545 RRULE expander. Supports the common cases a nonprofit
 * needs: DAILY / WEEKLY / MONTHLY / YEARLY, INTERVAL, COUNT, UNTIL, and
 * BYDAY for WEEKLY (e.g. "every Tue/Thu"). Anything we don't recognise
 * falls back to emitting just the seed instance.
 *
 * Returns a list of instance-start ISO strings (UTC). The caller is
 * responsible for shifting DTEND alongside if the event spans a duration.
 */

export interface ExpansionWindow {
  /** Cutoff in milliseconds since epoch — stop expanding beyond this. */
  untilMs: number
  /** Hard cap on emitted instances to keep the snapshot bounded. */
  maxInstances?: number
}

const BYDAY_TO_DOW: Record<string, number> = {
  SU: 0,
  MO: 1,
  TU: 2,
  WE: 3,
  TH: 4,
  FR: 5,
  SA: 6,
}

interface ParsedRule {
  freq?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'
  interval: number
  count?: number
  untilMs?: number
  byDay?: number[]
}

export function parseRRule(value: string): ParsedRule {
  const out: ParsedRule = { interval: 1 }
  for (const part of value.split(';')) {
    const eq = part.indexOf('=')
    if (eq === -1) continue
    const key = part.slice(0, eq).toUpperCase()
    const val = part.slice(eq + 1)
    if (key === 'FREQ') {
      const upper = val.toUpperCase()
      if (upper === 'DAILY' || upper === 'WEEKLY' || upper === 'MONTHLY' || upper === 'YEARLY') {
        out.freq = upper
      }
    } else if (key === 'INTERVAL') {
      const n = Number.parseInt(val, 10)
      if (Number.isFinite(n) && n > 0) out.interval = n
    } else if (key === 'COUNT') {
      const n = Number.parseInt(val, 10)
      if (Number.isFinite(n) && n > 0) out.count = n
    } else if (key === 'UNTIL') {
      // ICS UNTIL can be YYYYMMDD or YYYYMMDDTHHMMSSZ.
      const m = val.match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})Z?)?$/)
      if (m) {
        const [, y, mo, d, h = '23', mi = '59', s = '59'] = m
        out.untilMs = Date.UTC(+y, +mo - 1, +d, +h, +mi, +s)
      }
    } else if (key === 'BYDAY') {
      const days: number[] = []
      for (const token of val.split(',')) {
        const code = token.slice(-2).toUpperCase()
        if (code in BYDAY_TO_DOW) days.push(BYDAY_TO_DOW[code])
      }
      if (days.length) out.byDay = days
    }
  }
  return out
}

function addUtcDays(ms: number, days: number): number {
  return ms + days * 86_400_000
}

function addUtcMonths(ms: number, months: number): number {
  const d = new Date(ms)
  d.setUTCMonth(d.getUTCMonth() + months)
  return d.getTime()
}

function addUtcYears(ms: number, years: number): number {
  const d = new Date(ms)
  d.setUTCFullYear(d.getUTCFullYear() + years)
  return d.getTime()
}

/**
 * Expand a seed start instant into all RRULE-implied occurrences within
 * the supplied window. Returns the seed when the rule is unrecognised so
 * callers always get at least one entry.
 */
export function expandRRule(
  seedStartIsoUtc: string,
  rruleValue: string | undefined,
  exDateIsoUtc: ReadonlySet<string>,
  window: ExpansionWindow
): string[] {
  const seedMs = Date.parse(seedStartIsoUtc)
  if (!Number.isFinite(seedMs)) return [seedStartIsoUtc]
  if (!rruleValue) {
    return exDateIsoUtc.has(seedStartIsoUtc) ? [] : [seedStartIsoUtc]
  }
  const rule = parseRRule(rruleValue)
  if (!rule.freq) return [seedStartIsoUtc]

  const cap = Math.min(rule.count ?? Infinity, window.maxInstances ?? 500)
  const untilMs = Math.min(rule.untilMs ?? window.untilMs, window.untilMs)
  const out: string[] = []
  const push = (ms: number) => {
    const iso = new Date(ms).toISOString()
    if (!exDateIsoUtc.has(iso)) out.push(iso)
  }

  let cursor = seedMs
  let emitted = 0 // total instances visited, including those excluded by EXDATE
  let safety = 0
  while (cursor <= untilMs && emitted < cap && safety < 10_000) {
    safety++
    if (rule.freq === 'WEEKLY' && rule.byDay && rule.byDay.length > 0) {
      const dow = new Date(cursor).getUTCDay()
      for (const day of [...rule.byDay].sort((a, b) => a - b)) {
        const offset = day - dow
        if (offset < 0) continue
        const candidate = addUtcDays(cursor, offset)
        if (candidate < seedMs) continue
        if (candidate > untilMs) break
        push(candidate)
        emitted++
        if (emitted >= cap) break
      }
      cursor = addUtcDays(cursor, 7 * rule.interval - new Date(cursor).getUTCDay())
      continue
    }
    push(cursor)
    emitted++
    if (rule.freq === 'DAILY') cursor = addUtcDays(cursor, rule.interval)
    else if (rule.freq === 'WEEKLY') cursor = addUtcDays(cursor, 7 * rule.interval)
    else if (rule.freq === 'MONTHLY') cursor = addUtcMonths(cursor, rule.interval)
    else if (rule.freq === 'YEARLY') cursor = addUtcYears(cursor, rule.interval)
    else break
  }
  return out
}
