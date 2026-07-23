// Team member data
// This file imports team member data from JSON files in ./team/ directory
// To edit team members, edit the JSON files directly in src/data/team/.
// Each member needs: name, title, imageUrl (a /Images/* path), linkedinUrl.

import clarkeMoyer from './team/clarke-moyer.json'
import chrisRae from './team/chris-rae.json'
import tylerCarlotto from './team/tyler-carlotto.json'
import brennanDarling from './team/brennan-darling.json'
import rebeccaCook from './team/rebecca-cook.json'

export type TeamMember = {
  name: string
  title: string
  imageUrl: string
  linkedinUrl: string
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
export const configuredTeam: TeamMember[] = team.filter((member) => member.name.trim().length > 0)
