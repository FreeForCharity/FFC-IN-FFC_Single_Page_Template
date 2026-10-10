export type EventSource = 'google' | 'microsoft' | 'facebook'

export interface UnifiedEvent {
  id: string
  source: EventSource
  title: string
  description?: string
  startUtc: string
  endUtc?: string
  timezone?: string
  allDay: boolean
  location?: string
  url: string
  imageUrl?: string
}

export interface EventsSnapshot {
  updatedAt: string | null
  events: UnifiedEvent[]
}

export interface EventBucket {
  monthKey: string
  monthLabel: string
  events: UnifiedEvent[]
}

export const SOURCE_LABELS: Record<EventSource, string> = {
  google: 'Google Calendar',
  microsoft: 'Microsoft 365',
  facebook: 'Facebook',
}
