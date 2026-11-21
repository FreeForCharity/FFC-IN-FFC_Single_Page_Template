// Testimonials data
// This file imports testimonial data from JSON files in ./testimonials/ directory
// To edit testimonials, edit the JSON files directly in src/data/testimonials/.
// Each testimonial needs a heading and text; name, location, and locationUrl
// are optional (location renders as a link when locationUrl is present).
// `supportingOrgOnly: true` marks a testimonial about the supporting
// organization (`siteConfig.supportedBy`) itself: it renders only on that
// organization's own site (see `visibleTestimonials()` in
// src/lib/section-visibility.ts), so a charity site never shows the
// supporting organization's testimonials as its own. A charity's own testimonials leave it out.

import testimonial1 from './testimonials/testimonial-1.json'
import testimonial2 from './testimonials/testimonial-2.json'
import testimonial3 from './testimonials/testimonial-3.json'
import testimonial4 from './testimonials/testimonial-4.json'

export type Testimonial = {
  heading: string
  text: string
  name?: string
  location?: string
  locationUrl?: string
  /** About the supporting organization itself; hidden on any other site. */
  supportingOrgOnly?: boolean
}

export const testimonials: Testimonial[] = [testimonial1, testimonial2, testimonial3, testimonial4]

// Mirrors `configuredTeam`: `testimonials` is a fixed list of JSON imports, so
// blanking the JSON files leaves its length unchanged. `configuredTestimonials`
// keeps only entries with the required `heading` and `text` populated, so the
// section self-hides when a fork clears them rather than rendering empty quotes.
export const configuredTestimonials: Testimonial[] = testimonials.filter(
  (t) =>
    typeof t.heading === 'string' &&
    t.heading.trim().length > 0 &&
    typeof t.text === 'string' &&
    t.text.trim().length > 0
)
