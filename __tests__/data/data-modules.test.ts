import { testimonials } from '@/data/testimonials'
import { team } from '@/data/team'
import { faqs } from '@/data/faqs'
import { results } from '@/data/results'

// These validate the data contract a forking charity must follow when editing
// the JSON/TS under src/data/* — every item must carry the fields its component
// renders, so a malformed edit fails the suite instead of the live site.
describe('data modules', () => {
  describe('testimonials', () => {
    it('is a non-empty array', () => {
      expect(Array.isArray(testimonials)).toBe(true)
      expect(testimonials.length).toBeGreaterThan(0)
    })
    it('every entry has a heading and text', () => {
      for (const t of testimonials) {
        expect(typeof t.heading).toBe('string')
        expect(t.heading.length).toBeGreaterThan(0)
        expect(typeof t.text).toBe('string')
        expect(t.text.length).toBeGreaterThan(0)
      }
    })
  })

  describe('team', () => {
    it('is a non-empty array', () => {
      expect(Array.isArray(team)).toBe(true)
      expect(team.length).toBeGreaterThan(0)
    })
    it('every member has name, title, an /Images/ photo, and an http(s) LinkedIn URL', () => {
      for (const m of team) {
        expect(m.name).toBeTruthy()
        expect(m.title).toBeTruthy()
        expect(m.imageUrl).toMatch(/^\/Images\//)
        expect(m.linkedinUrl).toMatch(/^https?:\/\//)
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
    it('has a heading and a non-empty stats array', () => {
      expect(results.heading).toBeTruthy()
      expect(Array.isArray(results.stats)).toBe(true)
      expect(results.stats.length).toBeGreaterThan(0)
    })
    it('every stat has a value and a label', () => {
      for (const s of results.stats) {
        expect(s.value).toBeTruthy()
        expect(s.label).toBeTruthy()
      }
    })
  })
})
