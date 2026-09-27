import type { Metadata } from 'next'
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema'
import { pageMetadata } from '@/lib/page-metadata'
import { legalContact, mailtoHref, publishedPhone, siteConfig } from '@/lib/site.config'

const PAGE_NAME = 'Donation Policy'
const CANONICAL_PATH = '/donation-policy'

// Bare page name as title (the root layout template appends the brand);
// per-page OG/Twitter handling is documented in src/lib/page-metadata.ts.
export const metadata: Metadata = pageMetadata({
  title: PAGE_NAME,
  description: `Donation Policy for the ${siteConfig.name} website`,
  canonical: CANONICAL_PATH,
})

export default function DonationPolicy() {
  const legal = legalContact()
  // A legal claim, made only when siteConfig.taxStatusLabel says the
  // organization holds IRS 501(c)(3) recognition. Provisioning writes '' for an
  // organization without it, and then neither the footer clause nor this page
  // may call a donation tax-deductible.
  const taxExempt = siteConfig.taxStatusLabel.trim() !== ''
  const phone = publishedPhone()
  return (
    <div className="ffc-container py-16">
      <BreadcrumbSchema name={PAGE_NAME} path={CANONICAL_PATH} />
      <div className="max-w-4xl mx-auto">
        <h1 className="font-[var(--font-faustina)] text-[48px] leading-[60px] mb-8">
          Donation Policy
        </h1>

        <div className="prose max-w-none font-[var(--font-lato)] text-[18px] leading-[28px]">
          <p>
            <strong>Effective Date:</strong> January 1, 2024
          </p>

          <h2 className="font-[var(--font-faustina)] text-[32px] leading-[40px] mt-8 mb-4">
            Tax Deductibility
          </h2>
          {taxExempt ? (
            <p>
              {siteConfig.name} is a qualified 501(c)(3) nonprofit organization{' '}
              {`(EIN: ${siteConfig.ein}).`} Donations are tax-deductible to the full extent allowed
              by law.
            </p>
          ) : (
            <p>
              {siteConfig.name} {`(EIN: ${siteConfig.ein})`} has not yet received IRS recognition as
              a 501(c)(3) organization, so donations may not be tax-deductible. Please consult a tax
              advisor before claiming a deduction.
            </p>
          )}

          <h2 className="font-[var(--font-faustina)] text-[32px] leading-[40px] mt-8 mb-4">
            Use of Donations
          </h2>
          {/* The organization's own description, not a fixed list of services:
              the template's list described the supporting organization's
              programs, which no other organization provides. */}
          <p>
            Donations support {siteConfig.name}&apos;s mission and the administrative costs
            necessary to carry it out: {siteConfig.description}
          </p>

          <h2 className="font-[var(--font-faustina)] text-[32px] leading-[40px] mt-8 mb-4">
            Donation Processing
          </h2>
          <p>
            Donations are processed securely through our payment partners. You will receive a
            {taxExempt ? ' receipt for tax purposes' : ' receipt'} via email after your donation is
            processed.
          </p>

          <h2 className="font-[var(--font-faustina)] text-[32px] leading-[40px] mt-8 mb-4">
            Refund Policy
          </h2>
          <p>
            We generally do not provide refunds for donations. However, if you believe an error has
            occurred, please contact us within 30 days of your donation.
          </p>

          <h2 className="font-[var(--font-faustina)] text-[32px] leading-[40px] mt-8 mb-4">
            Privacy
          </h2>
          <p>
            Donor information is kept confidential and will not be shared with third parties except
            as required by law.
          </p>

          <h2 className="font-[var(--font-faustina)] text-[32px] leading-[40px] mt-8 mb-4">
            Contact Us
          </h2>
          <p>For questions about donations or this policy, please contact us at:</p>
          <p>
            Email:{' '}
            <a href={mailtoHref(undefined, legal.email)} className="text-primary underline">
              {legal.email}
            </a>
            {/* Only a configured number is shown, matching the footer's phone guard. */}
            {phone && (
              <>
                <br />
                Phone: {phone.display}
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
