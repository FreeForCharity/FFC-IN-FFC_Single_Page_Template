import React from 'react'
import { render } from '@testing-library/react'
import WebsiteSchema, { buildWebsiteSchema } from '../../../src/components/seo/WebsiteSchema'
import { siteConfig } from '../../../src/lib/site.config'

describe('WebsiteSchema', () => {
  it('builds a schema.org WebSite object with values from siteConfig', () => {
    const schema = buildWebsiteSchema()

    expect(schema['@context']).toBe('https://schema.org')
    expect(schema['@type']).toBe('WebSite')
    expect(schema.name).toBe(siteConfig.name)

    expect(typeof schema.url).toBe('string')
    expect(schema.url as string).toMatch(/^https:\/\//)

    const publisher = schema.publisher as Record<string, unknown>
    expect(publisher['@type']).toBe('NonprofitOrganization')
    expect(publisher.name).toBe(siteConfig.name)
  })

  it('does not advertise a SearchAction (no site-search endpoint exists)', () => {
    const schema = buildWebsiteSchema()
    expect(schema.potentialAction).toBeUndefined()
  })

  it('renders a single application/ld+json script block whose JSON parses', () => {
    const { container } = render(<WebsiteSchema />)
    const scripts = container.querySelectorAll('script[type="application/ld+json"]')
    expect(scripts.length).toBe(1)
    const text = scripts[0].textContent ?? ''
    expect(text.length).toBeGreaterThan(0)
    const parsed = JSON.parse(text) as Record<string, unknown>
    expect(parsed['@type']).toBe('WebSite')
    expect(parsed.name).toBe(siteConfig.name)
  })
})
