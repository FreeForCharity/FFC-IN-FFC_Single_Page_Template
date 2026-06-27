import React from 'react'
import { render } from '@testing-library/react'
import BreadcrumbSchema, {
  buildBreadcrumbSchema,
} from '../../../src/components/seo/BreadcrumbSchema'
import { siteUrl } from '../../../src/lib/site.config'

describe('BreadcrumbSchema', () => {
  it('builds a two-item BreadcrumbList from Home to the page', () => {
    const schema = buildBreadcrumbSchema('Privacy Policy', '/privacy-policy')

    expect(schema['@context']).toBe('https://schema.org')
    expect(schema['@type']).toBe('BreadcrumbList')

    const items = schema.itemListElement as Array<Record<string, unknown>>
    expect(items).toHaveLength(2)

    expect(items[0]).toMatchObject({
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: siteUrl('/'),
    })
    expect(items[1]).toMatchObject({
      '@type': 'ListItem',
      position: 2,
      name: 'Privacy Policy',
      item: siteUrl('/privacy-policy'),
    })
  })

  it('uses absolute https URLs for every crumb', () => {
    const schema = buildBreadcrumbSchema('Terms of Service', '/terms-of-service')
    const items = schema.itemListElement as Array<Record<string, unknown>>
    for (const item of items) {
      expect(item.item as string).toMatch(/^https:\/\//)
    }
  })

  it('renders a single application/ld+json script block whose JSON parses', () => {
    const { container } = render(<BreadcrumbSchema name="Cookie Policy" path="/cookie-policy" />)
    const scripts = container.querySelectorAll('script[type="application/ld+json"]')
    expect(scripts.length).toBe(1)
    const text = scripts[0].textContent ?? ''
    const parsed = JSON.parse(text) as Record<string, unknown>
    expect(parsed['@type']).toBe('BreadcrumbList')
    const items = parsed.itemListElement as Array<Record<string, unknown>>
    expect(items[1].name).toBe('Cookie Policy')
  })
})
