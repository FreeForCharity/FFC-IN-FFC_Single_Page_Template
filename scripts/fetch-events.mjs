#!/usr/bin/env node
import { readFile, writeFile, rename } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const SNAPSHOT_PATH = resolve(__dirname, '..', 'src', 'data', 'events.generated.json')

const FETCH_TIMEOUT_MS = 30_000
const MAX_BYTES = 10 * 1024 * 1024 // 10 MiB hard cap on any single feed
const MAX_FACEBOOK_PAGES = 5 // upper bound on pagination follow
const FACEBOOK_ID_RE = /^[A-Za-z0-9._-]+$/

const ALLOWED_ICS_HOSTS = [
  'calendar.google.com',
  'outlook.live.com',
  'outlook.office.com',
  'outlook.office365.com',
]

const TEXT_UNESCAPE = [
  [/\\n/gi, '\n'],
  [/\\,/g, ','],
  [/\\;/g, ';'],
  [/\\\\/g, '\\'],
]

function unfoldLines(raw) {
  const stripped = raw.replace(/^﻿/, '').replace(/\r\n/g, '\n')
  const lines = []
  for (const line of stripped.split('\n')) {
    if ((line.startsWith(' ') || line.startsWith('\t')) && lines.length > 0) {
      lines[lines.length - 1] += line.slice(1)
    } else {
      lines.push(line)
    }
  }
  return lines
}

function parseProperty(line) {
  const colonIndex = line.indexOf(':')
  if (colonIndex === -1) return null
  const head = line.slice(0, colonIndex)
  const value = line.slice(colonIndex + 1)
  const segments = head.split(';')
  const name = (segments.shift() ?? '').toUpperCase()
  if (!name) return null
  const params = {}
  for (const segment of segments) {
    const equalsIndex = segment.indexOf('=')
    if (equalsIndex === -1) continue
    const paramName = segment.slice(0, equalsIndex).toUpperCase()
    const paramValue = segment.slice(equalsIndex + 1).replace(/^"|"$/g, '')
    params[paramName] = paramValue
  }
  return { name, params, value }
}

function decodeText(value) {
  let out = value
  for (const [pattern, replacement] of TEXT_UNESCAPE) {
    out = out.replace(pattern, replacement)
  }
  return out
}

function tzOffsetMinutes(utcMs, timeZone) {
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
  const parts = {}
  for (const p of fmt.formatToParts(new Date(utcMs))) {
    if (p.type !== 'literal') parts[p.type] = p.value
  }
  if (parts.hour === '24') parts.hour = '00'
  const asUtc = Date.UTC(
    +parts.year,
    +parts.month - 1,
    +parts.day,
    +parts.hour,
    +parts.minute,
    +parts.second
  )
  return (asUtc - utcMs) / 60000
}

function wallTimeToUtc(y, mo, d, h, mi, s, timeZone) {
  if (!timeZone) {
    return Date.UTC(y, mo - 1, d, h, mi, s)
  }
  // Two passes to settle ambiguous DST instants.
  let guess = Date.UTC(y, mo - 1, d, h, mi, s)
  let offset = tzOffsetMinutes(guess, timeZone)
  let utc = guess - offset * 60000
  offset = tzOffsetMinutes(utc, timeZone)
  return guess - offset * 60000
}

function parseIcsDate(prop) {
  const value = prop.value.trim()
  if (!value) return null
  const tzid = prop.params.TZID
  const isDateOnly = prop.params.VALUE === 'DATE' || /^\d{8}$/.test(value)
  if (isDateOnly) {
    const match = value.match(/^(\d{4})(\d{2})(\d{2})$/)
    if (!match) return null
    const [, y, m, d] = match
    return { iso: `${y}-${m}-${d}T00:00:00.000Z`, allDay: true }
  }
  const match = value.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z?)$/)
  if (!match) return null
  const [, y, mo, d, h, mi, s, z] = match
  if (z === 'Z') {
    return { iso: `${y}-${mo}-${d}T${h}:${mi}:${s}.000Z`, allDay: false }
  }
  const utcMs = wallTimeToUtc(+y, +mo, +d, +h, +mi, +s, tzid)
  return { iso: new Date(utcMs).toISOString(), allDay: false, tzid: tzid || undefined }
}

function extractEvents(lines) {
  const events = []
  let current = null
  let depth = 0
  for (const line of lines) {
    if (line === 'BEGIN:VEVENT') {
      current = { props: new Map() }
      depth = 1
      continue
    }
    if (line === 'END:VEVENT' && current) {
      if (depth === 1) events.push(current)
      current = null
      depth = 0
      continue
    }
    if (!current) continue
    if (line.startsWith('BEGIN:')) {
      depth++
      continue
    }
    if (line.startsWith('END:')) {
      depth--
      continue
    }
    if (depth !== 1) continue
    const prop = parseProperty(line)
    if (!prop) continue
    const bucket = current.props.get(prop.name) ?? []
    bucket.push(prop)
    current.props.set(prop.name, bucket)
  }
  return events
}

function firstProp(raw, name) {
  return raw.props.get(name)?.[0]
}

function safeHttpUrl(input) {
  if (typeof input !== 'string') return undefined
  const t = input.trim()
  if (!t) return undefined
  try {
    const u = new URL(t)
    if (u.protocol === 'http:' || u.protocol === 'https:') return u.toString()
  } catch {
    /* fall through */
  }
  return undefined
}

function safeHttpsImage(input) {
  const u = safeHttpUrl(input)
  return u && u.startsWith('https://') ? u : undefined
}

function escapeId(value) {
  return value.replace(/[\r\n]+/g, '_')
}

const BYDAY_TO_DOW = { SU: 0, MO: 1, TU: 2, WE: 3, TH: 4, FR: 5, SA: 6 }
const EXPANSION_WINDOW_MS = 18 * 30 * 24 * 60 * 60 * 1000
const MAX_INSTANCES_PER_RULE = 200

function parseRRule(value) {
  const out = { interval: 1 }
  for (const part of value.split(';')) {
    const eq = part.indexOf('=')
    if (eq === -1) continue
    const key = part.slice(0, eq).toUpperCase()
    const val = part.slice(eq + 1)
    if (key === 'FREQ') {
      const u = val.toUpperCase()
      if (u === 'DAILY' || u === 'WEEKLY' || u === 'MONTHLY' || u === 'YEARLY') out.freq = u
    } else if (key === 'INTERVAL') {
      const n = parseInt(val, 10)
      if (Number.isFinite(n) && n > 0) out.interval = n
    } else if (key === 'COUNT') {
      const n = parseInt(val, 10)
      if (Number.isFinite(n) && n > 0) out.count = n
    } else if (key === 'UNTIL') {
      const m = val.match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})Z?)?$/)
      if (m) {
        const [, y, mo, d, h = '23', mi = '59', s = '59'] = m
        out.untilMs = Date.UTC(+y, +mo - 1, +d, +h, +mi, +s)
      }
    } else if (key === 'BYDAY') {
      const days = []
      for (const t of val.split(',')) {
        const code = t.slice(-2).toUpperCase()
        if (code in BYDAY_TO_DOW) days.push(BYDAY_TO_DOW[code])
      }
      if (days.length) out.byDay = days
    }
  }
  return out
}

function expandRRule(seedIso, rruleValue, exDates, untilMs, cap) {
  const seedMs = Date.parse(seedIso)
  if (!Number.isFinite(seedMs)) return [seedIso]
  if (!rruleValue) return exDates.has(seedIso) ? [] : [seedIso]
  const rule = parseRRule(rruleValue)
  if (!rule.freq) return [seedIso]
  const limit = Math.min(rule.count ?? Infinity, cap)
  const stop = Math.min(rule.untilMs ?? untilMs, untilMs)
  const out = []
  const push = (ms) => {
    const iso = new Date(ms).toISOString()
    if (!exDates.has(iso)) out.push(iso)
  }
  let cursor = seedMs
  let emitted = 0
  let safety = 0
  while (cursor <= stop && emitted < limit && safety < 10_000) {
    safety++
    if (rule.freq === 'WEEKLY' && rule.byDay && rule.byDay.length > 0) {
      const dow = new Date(cursor).getUTCDay()
      for (const day of [...rule.byDay].sort((a, b) => a - b)) {
        const offset = day - dow
        if (offset < 0) continue
        const candidate = cursor + offset * 86_400_000
        if (candidate < seedMs) continue
        if (candidate > stop) break
        push(candidate)
        emitted++
        if (emitted >= limit) break
      }
      cursor += (7 * rule.interval - new Date(cursor).getUTCDay()) * 86_400_000
      continue
    }
    push(cursor)
    emitted++
    if (rule.freq === 'DAILY') cursor += rule.interval * 86_400_000
    else if (rule.freq === 'WEEKLY') cursor += 7 * rule.interval * 86_400_000
    else if (rule.freq === 'MONTHLY') {
      const d = new Date(cursor)
      d.setUTCMonth(d.getUTCMonth() + rule.interval)
      cursor = d.getTime()
    } else if (rule.freq === 'YEARLY') {
      const d = new Date(cursor)
      d.setUTCFullYear(d.getUTCFullYear() + rule.interval)
      cursor = d.getTime()
    } else break
  }
  return out
}

function collectExDates(raw) {
  const out = new Set()
  for (const prop of raw.props.get('EXDATE') ?? []) {
    for (const part of prop.value.split(',')) {
      const parsed = parseIcsDate({ name: 'EXDATE', params: prop.params, value: part })
      if (parsed) out.add(parsed.iso)
    }
  }
  return out
}

function toUnifiedEventFromIcs(raw, source) {
  const summary = firstProp(raw, 'SUMMARY')
  const dtstart = firstProp(raw, 'DTSTART')
  const uid = firstProp(raw, 'UID')
  if (!summary || !dtstart || !uid) return null
  const start = parseIcsDate(dtstart)
  if (!start) return null
  const dtend = firstProp(raw, 'DTEND')
  const end = dtend ? parseIcsDate(dtend) : null
  const rawUrl = firstProp(raw, 'URL')?.value
  const location = firstProp(raw, 'LOCATION')
  const description = firstProp(raw, 'DESCRIPTION')
  return {
    id: `${source}:${escapeId(uid.value.trim())}`,
    source,
    title: decodeText(summary.value).trim(),
    description: description ? decodeText(description.value).trim() : undefined,
    startUtc: start.iso,
    endUtc: end?.iso,
    timezone: start.tzid,
    allDay: start.allDay,
    location: location ? decodeText(location.value).trim() : undefined,
    url: safeHttpUrl(rawUrl) ?? '',
  }
}

function expandSeed(seed, raw) {
  const rrule = firstProp(raw, 'RRULE')?.value
  if (!rrule) return [seed]
  const exDates = collectExDates(raw)
  const startMs = Date.parse(seed.startUtc)
  const durationMs = seed.endUtc ? Date.parse(seed.endUtc) - startMs : 0
  const untilMs = Date.now() + EXPANSION_WINDOW_MS
  const occurrences = expandRRule(seed.startUtc, rrule, exDates, untilMs, MAX_INSTANCES_PER_RULE)
  return occurrences.map((iso, idx) => {
    if (idx === 0) return { ...seed, startUtc: iso, endUtc: seed.endUtc }
    const occMs = Date.parse(iso)
    return {
      ...seed,
      id: `${seed.id}::${iso}`,
      startUtc: iso,
      endUtc: durationMs > 0 ? new Date(occMs + durationMs).toISOString() : undefined,
    }
  })
}

function parseIcs(raw, source) {
  const lines = unfoldLines(raw)
  const rawEvents = extractEvents(lines)
  const cutoff = Date.now() - 24 * 60 * 60 * 1000
  const out = []
  for (const rawEvent of rawEvents) {
    const seed = toUnifiedEventFromIcs(rawEvent, source)
    if (!seed) continue
    for (const occurrence of expandSeed(seed, rawEvent)) {
      const end = occurrence.endUtc
        ? Date.parse(occurrence.endUtc)
        : Date.parse(occurrence.startUtc)
      if (Number.isFinite(end) && end >= cutoff) out.push(occurrence)
    }
  }
  return out
}

function formatPlace(place) {
  if (!place) return undefined
  const parts = []
  if (place.name) parts.push(place.name)
  const loc = place.location
  if (loc) {
    const localityParts = [loc.street, loc.city, loc.state, loc.country].filter(Boolean)
    if (localityParts.length) parts.push(localityParts.join(', '))
  }
  return parts.length ? parts.join(' — ') : undefined
}

function toIsoUtc(value) {
  if (!value) return undefined
  const ts = Date.parse(value)
  return Number.isFinite(ts) ? new Date(ts).toISOString() : undefined
}

function normalizeFacebookEvents(payload) {
  if (!payload?.data) return []
  const cutoff = Date.now() - 24 * 60 * 60 * 1000
  const out = []
  for (const node of payload.data) {
    if (typeof node.id !== 'string' || !FACEBOOK_ID_RE.test(node.id)) continue
    const startUtc = toIsoUtc(node.start_time)
    if (!startUtc) continue
    const endUtc = toIsoUtc(node.end_time)
    const endTs = endUtc ? Date.parse(endUtc) : Date.parse(startUtc)
    if (!Number.isFinite(endTs) || endTs < cutoff) continue
    out.push({
      id: `facebook:${node.id}`,
      source: 'facebook',
      title: node.name?.trim() || 'Facebook Event',
      description: node.description?.trim() || undefined,
      startUtc,
      endUtc,
      allDay: false,
      location: node.is_online ? 'Online event' : formatPlace(node.place),
      url: `https://www.facebook.com/events/${encodeURIComponent(node.id)}`,
      imageUrl: safeHttpsImage(node.cover?.source),
    })
  }
  return out
}

function scrubSecrets(message, secrets) {
  if (typeof message !== 'string') return message
  let out = message
  for (const s of secrets) {
    if (s && s.length >= 6) out = out.replaceAll(s, '[REDACTED]')
  }
  return out
}

async function fetchWithLimits(url) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
  try {
    const res = await fetch(url, { redirect: 'follow', signal: controller.signal })
    const buf = await res.arrayBuffer()
    if (buf.byteLength > MAX_BYTES) {
      throw new Error(`response too large (${buf.byteLength} bytes)`)
    }
    return { res, text: new TextDecoder('utf-8').decode(buf) }
  } finally {
    clearTimeout(timeout)
  }
}

async function fetchIcsSource(label, urlString, source, secrets) {
  const safe = safeHttpUrl(urlString)
  if (!safe) {
    console.warn(`[events] ${label} URL is not a valid http(s) URL; skipping.`)
    return { ok: false, events: [] }
  }
  const host = new URL(safe).hostname
  if (!ALLOWED_ICS_HOSTS.some((h) => host === h || host.endsWith(`.${h}`))) {
    console.warn(`[events] ${label} host ${host} is not allowlisted; skipping.`)
    return { ok: false, events: [] }
  }
  try {
    const { res, text } = await fetchWithLimits(safe)
    if (!res.ok) {
      console.warn(`[events] ${label} responded ${res.status}; skipping.`)
      return { ok: false, events: [] }
    }
    const ct = res.headers.get('content-type') ?? ''
    if (!/text\/calendar|application\/octet-stream|text\/plain/i.test(ct)) {
      console.warn(
        `[events] ${label} returned unexpected content-type "${ct}"; skipping (likely an auth redirect).`
      )
      return { ok: false, events: [] }
    }
    return { ok: true, events: parseIcs(text, source) }
  } catch (err) {
    const msg = scrubSecrets(err.message ?? String(err), secrets)
    console.warn(`[events] ${label} fetch failed: ${msg}; skipping.`)
    return { ok: false, events: [] }
  }
}

async function fetchFacebookSource(pageId, token, secrets) {
  if (!FACEBOOK_ID_RE.test(pageId)) {
    console.warn('[events] Facebook page id has unexpected characters; skipping.')
    return { ok: false, events: [] }
  }
  const fields = [
    'id',
    'name',
    'description',
    'start_time',
    'end_time',
    'place',
    'cover',
    'is_online',
  ].join(',')
  let nextUrl = new URL(`https://graph.facebook.com/v23.0/${encodeURIComponent(pageId)}/events`)
  nextUrl.searchParams.set('time_filter', 'upcoming')
  nextUrl.searchParams.set('fields', fields)
  nextUrl.searchParams.set('limit', '50')
  nextUrl.searchParams.set('access_token', token)
  let url = nextUrl.toString()
  const events = []
  for (let page = 0; page < MAX_FACEBOOK_PAGES; page++) {
    try {
      const { res, text } = await fetchWithLimits(url)
      if (!res.ok) {
        console.warn(`[events] Facebook responded ${res.status}; skipping.`)
        return { ok: events.length > 0, events }
      }
      const payload = JSON.parse(text)
      if (payload.error) {
        const msg = scrubSecrets(payload.error.message ?? 'unknown', secrets)
        console.warn(`[events] Facebook error: ${msg}; skipping.`)
        return { ok: events.length > 0, events }
      }
      events.push(...normalizeFacebookEvents(payload))
      const next = payload?.paging?.next
      if (!next) return { ok: true, events }
      url = next
    } catch (err) {
      const msg = scrubSecrets(err.message ?? String(err), secrets)
      console.warn(`[events] Facebook fetch failed: ${msg}; skipping.`)
      return { ok: events.length > 0, events }
    }
  }
  return { ok: true, events }
}

function dedupe(events) {
  const seen = new Map()
  for (const event of events) {
    if (!seen.has(event.id)) seen.set(event.id, event)
  }
  return [...seen.values()]
}

async function readExistingSnapshot() {
  try {
    const raw = await readFile(SNAPSHOT_PATH, 'utf8')
    return JSON.parse(raw)
  } catch {
    return { updatedAt: null, events: [] }
  }
}

async function atomicWrite(path, contents) {
  const tmp = `${path}.tmp-${process.pid}-${Date.now()}`
  await writeFile(tmp, contents, 'utf8')
  await rename(tmp, path)
}

async function main() {
  const googleIcsUrl = process.env.EVENTS_GOOGLE_ICS_URL || ''
  const microsoftIcsUrl = process.env.EVENTS_MICROSOFT_ICS_URL || ''
  const facebookPageId = process.env.EVENTS_FACEBOOK_PAGE_ID || ''
  const facebookAccessToken = process.env.EVENTS_FACEBOOK_ACCESS_TOKEN || ''
  const secrets = [googleIcsUrl, microsoftIcsUrl, facebookAccessToken]

  const configuredSources = [
    googleIcsUrl && 'google',
    microsoftIcsUrl && 'microsoft',
    facebookPageId && facebookAccessToken && 'facebook',
  ].filter(Boolean)

  if (configuredSources.length === 0) {
    console.log('[events] No sources configured; leaving existing snapshot untouched.')
    return
  }

  console.log(`[events] Fetching: ${configuredSources.join(', ')}`)

  const tasks = []
  if (googleIcsUrl) tasks.push(fetchIcsSource('Google Calendar', googleIcsUrl, 'google', secrets))
  if (microsoftIcsUrl)
    tasks.push(fetchIcsSource('Microsoft 365', microsoftIcsUrl, 'microsoft', secrets))
  if (facebookPageId && facebookAccessToken)
    tasks.push(fetchFacebookSource(facebookPageId, facebookAccessToken, secrets))

  const results = await Promise.all(tasks)
  const anySourceSucceeded = results.some((r) => r.ok)
  const fetched = dedupe(results.flatMap((r) => r.events)).sort((a, b) =>
    a.startUtc.localeCompare(b.startUtc)
  )

  if (!anySourceSucceeded) {
    console.warn('[events] All configured sources failed; keeping previous snapshot.')
    return
  }

  if (fetched.length === 0) {
    const existing = await readExistingSnapshot()
    if (existing.events.length > 0) {
      console.warn(
        '[events] All sources returned 0 events; keeping previous snapshot to avoid data loss.'
      )
      return
    }
  }

  const snapshot = { updatedAt: new Date().toISOString(), events: fetched }
  await atomicWrite(SNAPSHOT_PATH, `${JSON.stringify(snapshot, null, 2)}\n`)
  console.log(`[events] Wrote ${fetched.length} events to ${SNAPSHOT_PATH}`)
}

main().catch((err) => {
  // Scrub any secrets that may have made it into err.message before logging.
  const secrets = [
    process.env.EVENTS_GOOGLE_ICS_URL,
    process.env.EVENTS_MICROSOFT_ICS_URL,
    process.env.EVENTS_FACEBOOK_ACCESS_TOKEN,
  ]
  console.error(`[events] Unexpected failure: ${scrubSecrets(err.message ?? String(err), secrets)}`)
  // Do not break the build; the existing snapshot stays in place.
  process.exit(0)
})
