import React from 'react'
import { render } from '@testing-library/react'
import OrganizationSchema, {
  buildOrganizationSchema,
} from '../../../src/components/seo/OrganizationSchema'
import { siteConfig } from '../../../src/lib/site.config'

describe('OrganizationSchema', () => {
  it('builds a schema.org NonprofitOrganization object with values from siteConfig', () => {
    const schema = buildOrganizationSchema()

    expect(schema['@context']).toBe('https://schema.org')
    expect(schema['@type']).toBe('NonprofitOrganization')
    expect(schema.name).toBe(siteConfig.name)
    expect(schema.description).toBe(siteConfig.description)

    expect(typeof schema.url).toBe('string')
    expect(schema.url as string).toMatch(/^https:\/\//)

    expect(typeof schema.logo).toBe('string')
    expect(schema.logo as string).toMatch(/^https:\/\//)
  })

  it('includes the EIN, phone, and address from siteConfig', () => {
    const schema = buildOrganizationSchema()

    if (siteConfig.ein) {
      expect(schema.taxID).toBe(siteConfig.ein)
    }
    // Mirror the production guards: these fields are only set when configured.
    if (siteConfig.nonprofitStatus) {
      expect(schema.nonprofitStatus).toBe(siteConfig.nonprofitStatus)
    } else {
      expect(schema.nonprofitStatus).toBeUndefined()
    }
    if (siteConfig.foundingDate) {
      expect(schema.foundingDate).toBe(siteConfig.foundingDate)
    } else {
      expect(schema.foundingDate).toBeUndefined()
    }
    if (siteConfig.alternateNames && siteConfig.alternateNames.length > 0) {
      expect(schema.alternateName).toEqual([...siteConfig.alternateNames])
    } else {
      expect(schema.alternateName).toBeUndefined()
    }
    if (siteConfig.phone?.tel) {
      expect(schema.telephone).toBe(siteConfig.phone.tel)
    }
    // Mirror the production guard: schema.address is only set when the first
    // address actually has lines.
    if (siteConfig.addresses?.[0] && siteConfig.addresses[0].lines.length > 0) {
      const address = schema.address as Record<string, unknown>
      expect(address['@type']).toBe('PostalAddress')
      expect(typeof address.streetAddress).toBe('string')
      expect((address.streetAddress as string).length).toBeGreaterThan(0)
    }
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

  it('links the parent organization when configured', () => {
    const schema = buildOrganizationSchema()
    if (siteConfig.parentOrg) {
      const parent = schema.parentOrganization as Record<string, unknown>
      expect(parent['@type']).toBe('NonprofitOrganization')
      expect(parent.name).toBe(siteConfig.parentOrg.name)
      expect(parent.url).toBe(siteConfig.parentOrg.url)
    } else {
      expect(schema.parentOrganization).toBeUndefined()
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
    expect(parsed['@type']).toBe('NonprofitOrganization')
  })
})
