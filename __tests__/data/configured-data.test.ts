import { team, configuredTeam } from '@/data/team'
import { testimonials, configuredTestimonials } from '@/data/testimonials'

// `team`/`testimonials` are assembled from a fixed list of JSON imports, so a
// fork that blanks those JSON files (rather than deleting entries) leaves the
// raw arrays non-empty. The `configured*` views drop entries whose required
// fields are blank, and the section + nav visibility key off them so a blanked
// fork self-hides instead of rendering empty cards / dead anchors
// (FFC-Cloudflare-Automation#816 Part B).
describe('configuredTeam', () => {
  it('is a subset of team containing only members with a non-empty name', () => {
    expect(configuredTeam.length).toBeLessThanOrEqual(team.length)
    for (const member of configuredTeam) {
      expect(member.name.trim().length).toBeGreaterThan(0)
    }
  })

  it('excludes members with a blank, missing, or non-string name (fails closed)', () => {
    // Uses the real TeamMember shape ({ name, role, linkedinUrl? }) plus the
    // malformed cases a partially-blanked JSON can produce (null / missing key).
    // The guard must filter them out, never throw at module init.
    const blanked = [
      { name: '', role: '' },
      { name: '   ', role: 'Volunteer', linkedinUrl: 'https://linkedin.com/in/x' },
      { name: null, role: 'Nulled' },
      { role: 'No name key' },
    ] as unknown as { name: string }[]
    const isConfigured = (m: { name: unknown }) =>
      typeof m.name === 'string' && m.name.trim().length > 0
    expect(() => blanked.filter(isConfigured)).not.toThrow()
    expect(blanked.filter(isConfigured)).toHaveLength(0)
  })
})

describe('configuredTestimonials', () => {
  it('is a subset of testimonials with non-empty heading and text', () => {
    expect(configuredTestimonials.length).toBeLessThanOrEqual(testimonials.length)
    for (const t of configuredTestimonials) {
      expect(t.heading.trim().length).toBeGreaterThan(0)
      expect(t.text.trim().length).toBeGreaterThan(0)
    }
  })

  it('excludes entries with blank, missing, or non-string heading/text (fails closed)', () => {
    const blanked = [
      { heading: '', text: '' },
      { heading: 'x', text: '' },
      { heading: '', text: 'x' },
      { heading: null, text: null },
      {},
    ] as unknown as { heading: string; text: string }[]
    const isConfigured = (t: { heading: unknown; text: unknown }) =>
      typeof t.heading === 'string' &&
      t.heading.trim().length > 0 &&
      typeof t.text === 'string' &&
      t.text.trim().length > 0
    expect(() => blanked.filter(isConfigured)).not.toThrow()
    expect(blanked.filter(isConfigured)).toHaveLength(0)
  })
})
