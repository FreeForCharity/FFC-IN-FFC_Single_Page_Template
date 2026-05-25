import React from 'react'
import { render } from '@testing-library/react'
import OrganizationSchema, {
  buildOrganizationSchema,
} from '../../../src/components/seo/OrganizationSchema'
import { siteConfig } from '../../../src/lib/site.config'

describe('OrganizationSchema', () => {
  it('builds a schema.org NGO object with values from siteConfig', () => {
    const schema = buildOrganizationSchema()

    expect(schema['@context']).toBe('https://schema.org')
    expect(schema['@type']).toBe('NGO')
    expect(schema.name).toBe(siteConfig.name)
    expect(schema.description).toBe(siteConfig.description)

    expect(typeof schema.url).toBe('string')
    expect(schema.url as string).toMatch(/^https:\/\//)

    expect(typeof schema.logo).toBe('string')
    expect(schema.logo as string).toMatch(/^https:\/\//)
  })

  it('includes social profiles as sameAs when configured', () => {
    const schema = buildOrganizationSchema()
    if (siteConfig.social.some((s) => s.href.trim().length > 0)) {
      expect(Array.isArray(schema.sameAs)).toBe(true)
      const sameAs = schema.sameAs as string[]
      for (const s of siteConfig.social) {
        if (s.href.trim().length > 0) {
          expect(sameAs).toContain(s.href.trim())
        }
      }
    }
  })

  it('renders a single application/ld+json script block whose JSON parses', () => {
    const { container } = render(<OrganizationSchema />)
    const scripts = container.querySelectorAll('script[type="application/ld+json"]')
    expect(scripts.length).toBe(1)
    const text = scripts[0].textContent ?? ''
    expect(text.length).toBeGreaterThan(0)
    const parsed = JSON.parse(text) as Record<string, unknown>
    expect(parsed.name).toBe(siteConfig.name)
    expect(parsed['@type']).toBe('NGO')
  })
})
