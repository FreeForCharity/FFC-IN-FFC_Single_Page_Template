// Impact / results statistics shown in the "Results" section of the home page.
// To update the heading or the stat cards, edit this file — no need to touch
// the component. `value` is rendered as-is; if it is a plain integer string the
// component animates the count up to it.

export type ResultStat = {
  value: string
  label: string
}

export const results: { heading: string; stats: ResultStat[] } = {
  heading: 'Results - 2023',
  stats: [
    { value: '221', label: 'Organizational partners' },
    { value: '3', label: 'Total volunteers' },
    { value: '221', label: 'Organizations accessing technical assistance offerings' },
    { value: '25', label: 'Volunteer hours contributed to the organization' },
  ],
}
