#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const SNAPSHOT_PATH = resolve(__dirname, '..', 'src', 'data', 'events.generated.json')

const TEXT_UNESCAPE = [
  [/\\n/gi, '\n'],
  [/\\,/g, ','],
  [/\\;/g, ';'],
  [/\\\\/g, '\\'],
]

function unfoldLines(raw) {
  const normalized = raw.replace(/\r\n/g, '\n')
  const lines = []
  for (const line of normalized.split('\n')) {
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
  return { iso: `${y}-${mo}-${d}T${h}:${mi}:${s}.000Z`, allDay: false, tzid }
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

function toUnifiedEventFromIcs(raw, source) {
  const summary = firstProp(raw, 'SUMMARY')
  const dtstart = firstProp(raw, 'DTSTART')
  const uid = firstProp(raw, 'UID')
  if (!summary || !dtstart || !uid) return null
  const start = parseIcsDate(dtstart)
  if (!start) return null
  const dtend = firstProp(raw, 'DTEND')
  const end = dtend ? parseIcsDate(dtend) : null
  const url = firstProp(raw, 'URL')?.value.trim()
  const location = firstProp(raw, 'LOCATION')
  const description = firstProp(raw, 'DESCRIPTION')
  return {
    id: `${source}:${uid.value.trim()}`,
    source,
    title: decodeText(summary.value).trim(),
    description: description ? decodeText(description.value).trim() : undefined,
    startUtc: start.iso,
    endUtc: end?.iso,
    timezone: start.tzid,
    allDay: start.allDay,
    location: location ? decodeText(location.value).trim() : undefined,
    url: url || '',
  }
}

function parseIcs(raw, source) {
  const lines = unfoldLines(raw)
  const rawEvents = extractEvents(lines)
  const cutoff = Date.now() - 24 * 60 * 60 * 1000
  return rawEvents
    .map((event) => toUnifiedEventFromIcs(event, source))
    .filter(Boolean)
    .filter((event) => {
      const end = event.endUtc ? Date.parse(event.endUtc) : Date.parse(event.startUtc)
      return Number.isFinite(end) && end >= cutoff
    })
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
      url: `https://www.facebook.com/events/${node.id}`,
      imageUrl: node.cover?.source,
    })
  }
  return out
}

async function fetchIcsSource(label, urlString, source) {
  try {
    const res = await fetch(urlString, { redirect: 'follow' })
    if (!res.ok) {
      console.warn(`[events] ${label} responded ${res.status}; skipping.`)
      return []
    }
    const text = await res.text()
    return parseIcs(text, source)
  } catch (err) {
    console.warn(`[events] ${label} fetch failed: ${err.message}; skipping.`)
    return []
  }
}

async function fetchFacebookSource(pageId, token) {
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
  const url = new URL(`https://graph.facebook.com/v23.0/${pageId}/events`)
  url.searchParams.set('time_filter', 'upcoming')
  url.searchParams.set('fields', fields)
  url.searchParams.set('limit', '20')
  url.searchParams.set('access_token', token)
  try {
    const res = await fetch(url.toString())
    if (!res.ok) {
      console.warn(`[events] Facebook responded ${res.status}; skipping.`)
      return []
    }
    const payload = await res.json()
    if (payload.error) {
      console.warn(`[events] Facebook error: ${payload.error.message ?? 'unknown'}; skipping.`)
      return []
    }
    return normalizeFacebookEvents(payload)
  } catch (err) {
    console.warn(`[events] Facebook fetch failed: ${err.message}; skipping.`)
    return []
  }
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

async function main() {
  const googleIcsUrl = process.env.EVENTS_GOOGLE_ICS_URL || ''
  const microsoftIcsUrl = process.env.EVENTS_MICROSOFT_ICS_URL || ''
  const facebookPageId = process.env.EVENTS_FACEBOOK_PAGE_ID || ''
  const facebookAccessToken = process.env.EVENTS_FACEBOOK_ACCESS_TOKEN || ''

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
  if (googleIcsUrl) tasks.push(fetchIcsSource('Google Calendar', googleIcsUrl, 'google'))
  if (microsoftIcsUrl) tasks.push(fetchIcsSource('Microsoft 365', microsoftIcsUrl, 'microsoft'))
  if (facebookPageId && facebookAccessToken)
    tasks.push(fetchFacebookSource(facebookPageId, facebookAccessToken))

  const results = await Promise.all(tasks)
  const fetched = dedupe(results.flat()).sort((a, b) => a.startUtc.localeCompare(b.startUtc))

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
  await writeFile(SNAPSHOT_PATH, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8')
  console.log(`[events] Wrote ${fetched.length} events to ${SNAPSHOT_PATH}`)
}

main().catch((err) => {
  console.error(`[events] Unexpected failure: ${err.message}`)
  // Never break the build; the existing snapshot stays in place.
  process.exit(0)
})
