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

  it('excludes members whose required name field is blank', () => {
    const blanked = [
      { name: '', title: '', imageUrl: '', linkedinUrl: '' },
      { name: '   ', title: 'x', imageUrl: '/x.webp', linkedinUrl: 'https://x' },
    ]
    expect(blanked.filter((m) => m.name.trim().length > 0)).toHaveLength(0)
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

  it('excludes entries missing heading or text', () => {
    const blanked = [
      { heading: '', text: '' },
      { heading: 'x', text: '' },
      { heading: '', text: 'x' },
    ]
    expect(
      blanked.filter((t) => t.heading.trim().length > 0 && t.text.trim().length > 0)
    ).toHaveLength(0)
  })
})
