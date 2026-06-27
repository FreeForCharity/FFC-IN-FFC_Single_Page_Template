import React from 'react'
import { render } from '@testing-library/react'
import FaqSchema, { buildFaqSchema } from '../../../src/components/seo/FaqSchema'
import { faqs } from '../../../src/data/faqs'

describe('FaqSchema', () => {
  it('builds a schema.org FAQPage object from the faqs data', () => {
    const schema = buildFaqSchema()

    expect(schema['@context']).toBe('https://schema.org')
    expect(schema['@type']).toBe('FAQPage')

    const mainEntity = schema.mainEntity as Array<Record<string, unknown>>
    expect(Array.isArray(mainEntity)).toBe(true)
    expect(mainEntity.length).toBe(faqs.length)
  })

  it('maps each FAQ to a Question with an acceptedAnswer', () => {
    const schema = buildFaqSchema()
    const mainEntity = schema.mainEntity as Array<Record<string, unknown>>

    mainEntity.forEach((entry, i) => {
      expect(entry['@type']).toBe('Question')
      expect(entry.name).toBe(faqs[i].question)
      const answer = entry.acceptedAnswer as Record<string, unknown>
      expect(answer['@type']).toBe('Answer')
      expect(answer.text).toBe(faqs[i].answer)
    })
  })

  it('renders a single application/ld+json script block whose JSON parses', () => {
    const { container } = render(<FaqSchema />)
    const scripts = container.querySelectorAll('script[type="application/ld+json"]')
    expect(scripts.length).toBe(1)
    const text = scripts[0].textContent ?? ''
    expect(text.length).toBeGreaterThan(0)
    const parsed = JSON.parse(text) as Record<string, unknown>
    expect(parsed['@type']).toBe('FAQPage')
    expect((parsed.mainEntity as unknown[]).length).toBe(faqs.length)
  })
})
