import React from 'react'
import { render, screen, within } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import Footer from '../../src/components/footer'
import Support from '../../src/components/home-page/SupportFreeForCharity'
import Volunteer from '../../src/components/home-page/Volunteer-with-Us'
import DonationPolicyPage from '../../src/app/donation-policy/page'
import { buildOrganizationSchema } from '../../src/components/seo/OrganizationSchema'
import { PENDING_TEXT, siteConfig } from '../../src/lib/site.config'
import {
  asCharitySite,
  CHARITY,
  restoreSiteConfig,
  withFooterFieldsPending,
} from '../helpers/site-identity'

expect.extend(toHaveNoViolations)

// FreeForCharity/FFC-IN-FFC_Single_Page_Template#482: a footer-standard field
// the charity has not supplied yet is listed in `siteConfig.pending`, keeps an
// empty value, and renders PENDING_TEXT in its slot as plain text — never a
// link. The template itself sets no `pending`, so every case here sets the
// state it is about and restores the config afterwards.

const SEAL_ALT = 'GuideStar Platinum Seal of Transparency'
const DIRECT_LINK_TEXT = 'Direct GuideStar Profile Link'

/** Every placeholder rendered in `container`, each asserted to be plain text. */
function placeholders(container: HTMLElement): HTMLElement[] {
  const notes = within(container).queryAllByText(PENDING_TEXT)
  for (const note of notes) expect(note.closest('a')).toBeNull()
  return notes
}

describe('pending footer fields', () => {
  afterEach(restoreSiteConfig)

  it('renders no placeholder when nothing is pending (the template as shipped)', () => {
    const { container } = render(<Footer />)
    expect(placeholders(container)).toHaveLength(0)
  })

  it('renders one visible, non-link placeholder per pending footer field', () => {
    asCharitySite()
    withFooterFieldsPending()
    const { container } = render(<Footer />)
    // email, phone, address, ein, guidestar, social, donationUrl, volunteerUrl
    expect(placeholders(container)).toHaveLength(siteConfig.pending!.length)
  })

  it('keeps each placeholder in its own labelled slot', () => {
    asCharitySite()
    withFooterFieldsPending()
    render(<Footer />)
    for (const label of [
      'E-mail',
      'Call Us Today',
      'Address',
      'GuideStar / Candid Profile',
      'Social Media',
    ]) {
      const slot = screen.getByText(label).parentElement as HTMLElement
      expect(within(slot).getByText(PENDING_TEXT)).toBeInTheDocument()
    }
    expect(screen.getByText(`${CHARITY.name} EIN:`)).toBeInTheDocument()
    for (const name of ['Donate', 'Volunteer']) {
      const item = screen.getByText(name).closest('li') as HTMLElement
      expect(within(item).getByText(PENDING_TEXT)).toBeInTheDocument()
    }
  })

  it('shows a non-dialable placeholder while the phone is pending', () => {
    asCharitySite({ phone: { display: '', tel: '' }, pending: ['phone'] })
    const { container } = render(<Footer />)
    expect(screen.getByText('Call Us Today')).toBeInTheDocument()
    expect(placeholders(container)).toHaveLength(1)
    expect(container.querySelector('a[href^="tel:"]')).toBeNull()
  })

  it('omits the Call Us block for an empty phone that is NOT pending (no phone)', () => {
    asCharitySite({ phone: { display: '', tel: '' } })
    const { container } = render(<Footer />)
    expect(screen.queryByText('Call Us Today')).not.toBeInTheDocument()
    expect(placeholders(container)).toHaveLength(0)
  })

  it('shows no mailto: or map link while the email and address are pending', () => {
    asCharitySite({ contactEmail: '', addresses: [], pending: ['email', 'address'] })
    const { container } = render(<Footer />)
    expect(placeholders(container)).toHaveLength(2)
    expect(container.querySelector('a[href^="mailto:"]')).toBeNull()
    expect(container.querySelector('a[href*="google.com/maps"]')).toBeNull()
  })

  it('shows the EIN label with a placeholder, not an empty EIN, while the EIN is pending', () => {
    asCharitySite({ ein: '', pending: ['ein'] })
    const { container } = render(<Footer />)
    expect(screen.getByText(`${CHARITY.name} EIN:`)).toBeInTheDocument()
    expect(placeholders(container)).toHaveLength(1)
  })

  it('drops the EIN line for an empty EIN that is NOT pending', () => {
    asCharitySite({ ein: '' })
    render(<Footer />)
    expect(screen.queryByText(/ EIN:/)).not.toBeInTheDocument()
  })

  it('has no accessibility violations with every footer field pending', async () => {
    asCharitySite()
    withFooterFieldsPending()
    const { container } = render(<Footer />)
    expect(await axe(container)).toHaveNoViolations()
  })
})

describe('GuideStar seal and direct link', () => {
  afterEach(restoreSiteConfig)

  const PROFILE = 'https://www.guidestar.org/profile/12-3456789'
  const DIRECT = 'https://www.guidestar.org/profile/shared/riverbend-test'

  it('shows both when both URLs are configured', () => {
    asCharitySite({ guidestar: { profileUrl: PROFILE, directProfileUrl: DIRECT } })
    render(<Footer />)
    expect(screen.getByAltText(SEAL_ALT).closest('a')).toHaveAttribute('href', PROFILE)
    expect(screen.getByText(DIRECT_LINK_TEXT).closest('a')).toHaveAttribute('href', DIRECT)
  })

  it('gates the seal on profileUrl alone', () => {
    asCharitySite({ guidestar: { profileUrl: PROFILE, directProfileUrl: '' } })
    render(<Footer />)
    expect(screen.getByAltText(SEAL_ALT)).toBeInTheDocument()
    expect(screen.queryByText(DIRECT_LINK_TEXT)).not.toBeInTheDocument()
  })

  it('gates the direct link on directProfileUrl alone', () => {
    asCharitySite({ guidestar: { profileUrl: '', directProfileUrl: DIRECT } })
    render(<Footer />)
    expect(screen.queryByAltText(SEAL_ALT)).not.toBeInTheDocument()
    expect(screen.getByText(DIRECT_LINK_TEXT).closest('a')).toHaveAttribute('href', DIRECT)
  })

  it('hides both, with no placeholder, when the charity has no profile (not pending)', () => {
    asCharitySite({ guidestar: { profileUrl: '   ', directProfileUrl: '' } })
    const { container } = render(<Footer />)
    expect(screen.queryByAltText(SEAL_ALT)).not.toBeInTheDocument()
    expect(screen.queryByText(DIRECT_LINK_TEXT)).not.toBeInTheDocument()
    expect(screen.queryByText('GuideStar / Candid Profile')).not.toBeInTheDocument()
    expect(container.innerHTML).not.toContain('guidestar.org')
  })

  it('shows only the placeholder while GuideStar is pending', () => {
    asCharitySite({ guidestar: { profileUrl: '', directProfileUrl: '' }, pending: ['guidestar'] })
    const { container } = render(<Footer />)
    expect(screen.queryByAltText(SEAL_ALT)).not.toBeInTheDocument()
    expect(screen.queryByText(DIRECT_LINK_TEXT)).not.toBeInTheDocument()
    expect(screen.getByText('GuideStar / Candid Profile')).toBeInTheDocument()
    expect(placeholders(container)).toHaveLength(1)
  })
})

describe('pending donation and volunteer pages', () => {
  afterEach(restoreSiteConfig)

  it('the Donate section keeps the email fallback and adds a plain-text placeholder', () => {
    asCharitySite({ donationUrl: '', pending: ['donationUrl'] })
    const { container } = render(<Support />)
    expect(placeholders(container)).toHaveLength(1)
    expect(screen.getByRole('link', { name: `Donate to ${CHARITY.name}` })).toHaveAttribute(
      'href',
      expect.stringMatching(/^mailto:hello@riverbend-pantry\.example\?subject=/)
    )
  })

  it('the Volunteer section keeps the email fallback and adds a plain-text placeholder', () => {
    asCharitySite({ volunteerUrl: '', pending: ['volunteerUrl'] })
    const { container } = render(<Volunteer />)
    expect(placeholders(container)).toHaveLength(1)
    expect(screen.getByRole('link', { name: 'Volunteer' })).toHaveAttribute(
      'href',
      expect.stringMatching(/^mailto:hello@riverbend-pantry\.example\?subject=/)
    )
  })

  it('offers no dead mailto: link when the email is pending too', () => {
    asCharitySite()
    withFooterFieldsPending()
    const donate = render(<Support />)
    expect(placeholders(donate.container)).toHaveLength(1)
    expect(donate.container.querySelector('a')).toBeNull()
    donate.unmount()

    const volunteer = render(<Volunteer />)
    expect(placeholders(volunteer.container)).toHaveLength(1)
    expect(volunteer.container.querySelector('a')).toBeNull()
  })

  it('shows no placeholder for a configured donation or volunteer URL', () => {
    asCharitySite({
      donationUrl: 'https://www.zeffy.com/en-US/donation-form/riverbend-test',
      volunteerUrl: 'https://www.idealist.org/en/nonprofit/riverbend-test',
    })
    expect(placeholders(render(<Support />).container)).toHaveLength(0)
    expect(placeholders(render(<Volunteer />).container)).toHaveLength(0)
  })
})

describe('pending fields never reach structured data', () => {
  afterEach(restoreSiteConfig)

  it('omits email, taxID, telephone and address while they are pending', () => {
    asCharitySite()
    withFooterFieldsPending()
    const schema = buildOrganizationSchema()
    expect(schema.email).toBeUndefined()
    expect(schema.taxID).toBeUndefined()
    expect(schema.telephone).toBeUndefined()
    expect(schema.address).toBeUndefined()
    expect(schema.sameAs).toBeUndefined()
    expect(JSON.stringify(schema)).not.toContain(PENDING_TEXT)
  })

  it('omits a half-set phone, blank address lines and a malformed EIN', () => {
    asCharitySite({
      ein: 'PENDING',
      phone: { display: '', tel: '15550100101' },
      addresses: [{ label: 'Office', lines: ['  ', ''], mapUrl: 'https://maps.example' }],
    })
    const schema = buildOrganizationSchema()
    expect(schema.taxID).toBeUndefined()
    expect(schema.telephone).toBeUndefined()
    expect(schema.address).toBeUndefined()
  })

  it('still emits configured values', () => {
    asCharitySite()
    const schema = buildOrganizationSchema()
    expect(schema.email).toBe(CHARITY.contactEmail)
    expect(schema.taxID).toBe(CHARITY.ein)
    expect(schema.telephone).toBe(CHARITY.phone!.tel)
  })
})

describe('donation policy EIN clause', () => {
  afterEach(restoreSiteConfig)

  it('names the EIN when one is configured', () => {
    asCharitySite()
    const { container } = render(<DonationPolicyPage />)
    expect(container.textContent).toContain(`(EIN: ${CHARITY.ein})`)
  })

  it('shows the placeholder while the EIN is pending', () => {
    asCharitySite({ ein: '', pending: ['ein'] })
    const { container } = render(<DonationPolicyPage />)
    expect(container.textContent).toContain(`(EIN: ${PENDING_TEXT})`)
  })

  it('prints no empty "(EIN: )" when the organization has none', () => {
    asCharitySite({ ein: '' })
    const { container } = render(<DonationPolicyPage />)
    expect(container.textContent).not.toContain('EIN:')
  })
})
