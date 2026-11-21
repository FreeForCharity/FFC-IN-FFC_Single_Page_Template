// Impact / results statistics shown in the "Results" section of the home page.
// To update the heading or the stat cards, edit this file — no need to touch
// the component. `value` is rendered as-is; if it is a plain integer string the
// component animates the count up to it.

// `supportingOrgOnly: true` marks the numbers below as the supporting
// organization's own (`siteConfig.supportedBy`). They render only on its own site
// (see `resultsSectionVisible()` in src/lib/section-visibility.ts), so a charity
// site provisioned from this template never shows them as its own. A charity
// that publishes its own results replaces this object and leaves the flag out.

export type ResultStat = {
  value: string
  label: string
}

export type Results = {
  heading: string
  stats: ResultStat[]
  /** The supporting organization's own numbers; hidden on any other site. */
  supportingOrgOnly?: boolean
}

export const results: Results = {
  supportingOrgOnly: true,
  heading: 'Results - 2023',
  stats: [
    { value: '221', label: 'Organizational partners' },
    { value: '3', label: 'Total volunteers' },
    { value: '221', label: 'Organizations accessing technical assistance offerings' },
    { value: '25', label: 'Volunteer hours contributed to the organization' },
  ],
}
