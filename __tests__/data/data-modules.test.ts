import { testimonials } from '@/data/testimonials'
import { configuredTeam, team } from '@/data/team'
import { isPending } from '@/lib/site.config'
import { faqs } from '@/data/faqs'
import { results } from '@/data/results'

// These validate the data contract a forking charity must follow when editing
// the JSON/TS under src/data/* — every item must carry the fields its component
// renders, so a malformed edit fails the suite instead of the live site.
describe('data modules', () => {
  describe('testimonials', () => {
    it('is an array', () => {
      // May be empty, or all blanked: a charity with no testimonials of its own
      // yet has none, and the section then self-hides.
      expect(Array.isArray(testimonials)).toBe(true)
    })
    it('every entry has both a heading and text, or is blanked entirely', () => {
      // A half-filled entry (heading without text, or the reverse) is a
      // malformed edit; the section would silently drop it.
      for (const t of testimonials) {
        expect(typeof t.heading).toBe('string')
        expect(typeof t.text).toBe('string')
        expect(t.heading.trim().length > 0).toBe(t.text.trim().length > 0)
      }
    })
    it('supportingOrgOnly, when present, is a boolean', () => {
      for (const t of testimonials) {
        if (t.supportingOrgOnly !== undefined) expect(typeof t.supportingOrgOnly).toBe('boolean')
      }
    })
  })

  describe('team', () => {
    it('is a non-empty array', () => {
      expect(Array.isArray(team)).toBe(true)
      expect(team.length).toBeGreaterThan(0)
    })
    it('every member has a name and role; LinkedIn, when present, is an https://linkedin.com URL', () => {
      // A roster the charity has not supplied yet (siteConfig.pending includes
      // 'team') is blanked JSON files, members with no name yet; only the
      // configured members must then be complete (there may be none).
      for (const m of isPending('team') ? configuredTeam : team) {
        expect(m.name).toBeTruthy()
        expect(m.role).toBeTruthy()
        // Photos were removed in favor of initials monograms — no imageUrl field.
        expect('imageUrl' in m).toBe(false)
        // linkedinUrl is optional; when set it must be an https:// URL on
        // linkedin.com (or a subdomain) — the only shape TeamMemberCard turns
        // into a link (safeLinkedInUrl). Enforcing the host here means bad data
        // fails the suite instead of silently rendering as a non-link.
        if (m.linkedinUrl !== undefined) {
          expect(m.linkedinUrl).toMatch(/^https:\/\/([a-z0-9-]+\.)*linkedin\.com(\/|$)/i)
        }
      }
    })
  })

  describe('faqs', () => {
    it('is a non-empty array', () => {
      expect(Array.isArray(faqs)).toBe(true)
      expect(faqs.length).toBeGreaterThan(0)
    })
    it('every entry has a question and an answer', () => {
      for (const f of faqs) {
        expect(f.question).toBeTruthy()
        expect(f.answer).toBeTruthy()
      }
    })
  })

  describe('results', () => {
    it('has a stats array, and a heading whenever it has stats', () => {
      // An empty stats array is valid: the charity has no results of its own
      // yet, and the section self-hides.
      expect(Array.isArray(results.stats)).toBe(true)
      if (results.stats.length > 0) expect(results.heading).toBeTruthy()
    })
    it('every stat has a value and a label', () => {
      for (const s of results.stats) {
        expect(s.value).toBeTruthy()
        expect(s.label).toBeTruthy()
      }
    })
  })
})
