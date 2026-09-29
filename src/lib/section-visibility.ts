import { isPending, isSupportingOrgSite, siteConfig } from '@/lib/site.config'
import { configuredTeam } from '@/data/team'

/**
 * Self-hide predicates for the home-page sections whose copy is about the
 * supporting organization itself rather than about the site's own charity.
 *
 * Each section and every link to its #anchor (header, footer, hero) key off the
 * SAME predicate, so a hidden section never leaves a dead link behind.
 *
 * `sections.show*` stays the per-site switch. On top of it, these sections
 * render only on the supporting organization's own site: their copy states the
 * supporter's programs, endowment and FAQ answers in the first person ("our
 * domain program", "our EIN is ..."), so on a charity's site they would make
 * the supporter's claims in the charity's name. A provisioned charity site gets
 * that for free — setting `siteConfig.name` is enough — instead of depending on
 * someone remembering to flip three flags.
 */

/** FFC's own three-program (Domains / Hosting / Consulting) block. */
export function programsSectionVisible(): boolean {
  return siteConfig.sections.showPrograms && isSupportingOrgSite()
}

/** FFC Endowment feature cards. */
export function endowmentSectionVisible(): boolean {
  return siteConfig.sections.showEndowment && isSupportingOrgSite()
}

/** The FAQ section and its FAQPage JSON-LD, whose answers are FFC's. */
export function faqSectionVisible(): boolean {
  return isSupportingOrgSite()
}

/**
 * The Team section and its #team nav links: shown when at least one member has
 * a populated name, or while the team is pending (the section then renders the
 * "awaiting information" placeholder instead of cards — see `PendingField`).
 */
export function teamSectionVisible(): boolean {
  return configuredTeam.length > 0 || isPending('team')
}
