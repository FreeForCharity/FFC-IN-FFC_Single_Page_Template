import { siteConfig } from '@/lib/site.config'
import snapshot from '@/data/events.generated.json'
import type { EventsSnapshot } from './types'
import { enabledSources, readEventsConfig } from './config'

/**
 * True when at least one events calendar source is configured.
 *
 * `EVENTS_SOURCES_CONFIGURED` is a derived, non-secret boolean that
 * next.config.ts inlines into BOTH the server and client bundles, so the
 * prerendered HTML and hydration agree (the footer — a client component —
 * gates its Events nav link on the same predicate as the section). The raw
 * EVENTS_* variables can carry secret ICS URLs / tokens, are never inlined
 * client-side, and act as the fallback for plain-node contexts (Jest, the
 * server render) that do not go through next.config env inlining.
 */
export function hasConfiguredEventSources(): boolean {
  if (process.env.EVENTS_SOURCES_CONFIGURED) return true
  return enabledSources(readEventsConfig()).length > 0
}

/**
 * Self-hide predicate for the Events home-page section, following the FFC
 * section-visibility convention (FFC-Cloudflare-Automation#816 Part B):
 * every home-page section renders null when unconfigured — see
 * __tests__/components/home-page/section-visibility.test.tsx.
 *
 * The section is visible only when `siteConfig.sections.showEvents` is on
 * AND there is either something to show (the committed snapshot has events)
 * or a pipeline that could produce something (at least one source
 * configured — in which case the empty state invites visitors to follow
 * the charity's page until the next refresh lands).
 */
export function eventsSectionVisible(): boolean {
  if (!siteConfig.sections.showEvents) return false
  const data = snapshot as EventsSnapshot
  if ((data.events?.length ?? 0) > 0) return true
  return hasConfiguredEventSources()
}
