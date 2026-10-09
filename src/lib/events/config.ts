import type { EventSource } from './types'

export interface EventsConfig {
  googleIcsUrl?: string
  microsoftIcsUrl?: string
  facebookPageId?: string
  facebookAccessToken?: string
}

export function readEventsConfig(): EventsConfig {
  return {
    googleIcsUrl: process.env.EVENTS_GOOGLE_ICS_URL || undefined,
    microsoftIcsUrl: process.env.EVENTS_MICROSOFT_ICS_URL || undefined,
    facebookPageId: process.env.EVENTS_FACEBOOK_PAGE_ID || undefined,
    facebookAccessToken: process.env.EVENTS_FACEBOOK_ACCESS_TOKEN || undefined,
  }
}

export function enabledSources(config: EventsConfig): EventSource[] {
  const enabled: EventSource[] = []
  if (config.googleIcsUrl) enabled.push('google')
  if (config.microsoftIcsUrl) enabled.push('microsoft')
  if (config.facebookPageId && config.facebookAccessToken) enabled.push('facebook')
  return enabled
}
