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
