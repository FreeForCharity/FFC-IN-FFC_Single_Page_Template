import { siteConfig } from '@/lib/site.config'

/**
 * True when at least one events calendar source is configured.
 *
 * `EVENTS_SOURCES_CONFIGURED` is a derived, non-secret boolean that
 * next.config.ts inlines into BOTH the server and client bundles, so the
 * prerendered HTML and hydration agree (the footer - a client component -
 * gates its Events nav link on the same predicate as the section). The
 * check is strict (`=== 'true'`): next.config only ever inlines 'true' or
 * '', so any other value (say, a stray 'false' set by hand) must read as
 * not configured.
 *
 * This module is deliberately client-safe: it reads only inlined derived
 * booleans and imports neither the events snapshot nor the events config
 * (whose env names cover secret ICS URLs / tokens), so importing it from a
 * client component pulls no snapshot data and no secret-adjacent code into
 * the client bundle.
 */
export function hasConfiguredEventSources(): boolean {
  return process.env.EVENTS_SOURCES_CONFIGURED === 'true'
}

/**
 * Self-hide predicate for the Events home-page section, following the FFC
 * section-visibility convention (FFC-Cloudflare-Automation#816 Part B):
 * every home-page section renders null when unconfigured - see
 * __tests__/components/home-page/section-visibility.test.tsx.
 *
 * The section is visible only when `siteConfig.sections.showEvents` is on
 * AND there is either something to show (the committed snapshot has events;
 * `EVENTS_SNAPSHOT_HAS_EVENTS` is derived from it by next.config.ts) or a
 * pipeline that could produce something (at least one source configured -
 * in which case the empty state invites visitors to follow the charity's
 * page until the next refresh lands).
 */
export function eventsSectionVisible(): boolean {
  if (!siteConfig.sections.showEvents) return false
  if (process.env.EVENTS_SNAPSHOT_HAS_EVENTS === 'true') return true
  return hasConfiguredEventSources()
}
