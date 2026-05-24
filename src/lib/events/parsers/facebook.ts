import type { UnifiedEvent } from '../types'
import { safeHttpsImageUrl } from '../safeUrl'

const FACEBOOK_ID_RE = /^[A-Za-z0-9._-]+$/

interface FacebookEventPlace {
  name?: string
  location?: {
    city?: string
    state?: string
    country?: string
    street?: string
  }
}

interface FacebookEventCover {
  source?: string
}

interface FacebookEventNode {
  id: string
  name?: string
  description?: string
  start_time?: string
  end_time?: string
  place?: FacebookEventPlace
  cover?: FacebookEventCover
  is_online?: boolean
}

interface FacebookEventsResponse {
  data?: FacebookEventNode[]
  error?: { message?: string; code?: number }
}

const GRAPH_API_VERSION = 'v23.0'

function formatPlace(place?: FacebookEventPlace): string | undefined {
  if (!place) return undefined
  const parts: string[] = []
  if (place.name) parts.push(place.name)
  const loc = place.location
  if (loc) {
    const localityParts = [loc.street, loc.city, loc.state, loc.country].filter(Boolean)
    if (localityParts.length) parts.push(localityParts.join(', '))
  }
  return parts.length ? parts.join(' — ') : undefined
}

function toIsoUtc(value?: string): string | undefined {
  if (!value) return undefined
  const ts = Date.parse(value)
  return Number.isFinite(ts) ? new Date(ts).toISOString() : undefined
}

export function normalizeFacebookEvents(payload: FacebookEventsResponse): UnifiedEvent[] {
  if (!payload.data) return []
  const now = Date.now()
  const cutoff = now - 24 * 60 * 60 * 1000
  const out: UnifiedEvent[] = []
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
      timezone: undefined,
      allDay: false,
      location: node.is_online ? 'Online event' : formatPlace(node.place),
      url: `https://www.facebook.com/events/${encodeURIComponent(node.id)}`,
      imageUrl: safeHttpsImageUrl(node.cover?.source),
    })
  }
  return out
}

export async function fetchFacebookEvents(
  pageId: string,
  accessToken: string,
  fetcher: typeof fetch = fetch
): Promise<UnifiedEvent[]> {
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
  const url = new URL(`https://graph.facebook.com/${GRAPH_API_VERSION}/${pageId}/events`)
  url.searchParams.set('time_filter', 'upcoming')
  url.searchParams.set('fields', fields)
  url.searchParams.set('limit', '20')
  url.searchParams.set('access_token', accessToken)
  try {
    const res = await fetcher(url.toString())
    if (!res.ok) {
      console.warn(`[events] Facebook responded ${res.status}; skipping source.`)
      return []
    }
    const payload = (await res.json()) as FacebookEventsResponse
    if (payload.error) {
      console.warn(
        `[events] Facebook error: ${payload.error.message ?? 'unknown'}; skipping source.`
      )
      return []
    }
    return normalizeFacebookEvents(payload)
  } catch (err) {
    console.warn(`[events] Facebook fetch failed: ${(err as Error).message}; skipping source.`)
    return []
  }
}
