// Team member data
// This file imports team member data from JSON files in ./team/ directory
// To edit team members, edit the JSON files directly in src/data/team/.
// Each member needs: name and role. linkedinUrl is optional — when present the
// member's card links to it. There are no photos: cards render an initials
// monogram, so a forking charity never has to source or host portrait images.

import clarkeMoyer from './team/clarke-moyer.json'
import chrisRae from './team/chris-rae.json'
import tylerCarlotto from './team/tyler-carlotto.json'
import brennanDarling from './team/brennan-darling.json'
import rebeccaCook from './team/rebecca-cook.json'

export type TeamMember = {
  /** Full name; the first + last initials seed the avatar monogram. */
  name: string
  /** Role or title, e.g. "Founder", "Program Lead", "Treasurer". */
  role: string
  /**
   * Optional LinkedIn profile URL. Must be `https://` on linkedin.com (or a
   * subdomain) to render as a link — TeamMemberCard's `safeLinkedInUrl()`
   * ignores any other host or scheme, so the card shows without a link.
   */
  linkedinUrl?: string
}

export const team: TeamMember[] = [
  clarkeMoyer,
  chrisRae,
  tylerCarlotto,
  brennanDarling,
  rebeccaCook,
]

// `team` is assembled from a fixed list of JSON imports, so its length never
// drops to 0 when a fork blanks those JSON files (rather than deleting entries).
// `configuredTeam` is the subset with the required `name` populated — the Team
// section and its Header/Footer nav link all key visibility off this list so
// they self-hide together instead of rendering empty cards / dead anchors.
export const configuredTeam: TeamMember[] = team.filter(
  (member) => typeof member.name === 'string' && member.name.trim().length > 0
)
