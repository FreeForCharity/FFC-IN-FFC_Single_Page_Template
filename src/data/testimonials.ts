// Testimonials data
// This file imports testimonial data from JSON files in ./testimonials/ directory
// To edit testimonials, edit the JSON files directly in src/data/testimonials/.
// Each testimonial needs a heading and text; name, location, and locationUrl
// are optional (location renders as a link when locationUrl is present).

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
}

export const testimonials: Testimonial[] = [testimonial1, testimonial2, testimonial3, testimonial4]
