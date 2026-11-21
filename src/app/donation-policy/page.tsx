import Link from 'next/link'
import type { Metadata } from 'next'
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema'
import { pageMetadata } from '@/lib/page-metadata'
import {
  PENDING_TEXT,
  isPending,
  legalContact,
  publishedPhone,
  siteConfig,
} from '@/lib/site.config'
import ContactEmail from '@/components/ui/ContactEmail'
import ContactLocation, { hasContactLocation } from '@/components/ui/ContactLocation'

const PAGE_NAME = 'Donation Policy'
const CANONICAL_PATH = '/donation-policy'
// The date this text last changed in substance. It merged the template's two
// donation policies into this one (FFC footer standard: one donation policy per
// site, branded to the site's own organization).
const EFFECTIVE_DATE = 'October 14, 2026'

// Bare page name as title (the root layout template appends the brand);
// per-page OG/Twitter handling is documented in src/lib/page-metadata.ts.
export const metadata: Metadata = pageMetadata({
  title: PAGE_NAME,
  description: `Donation Policy for ${siteConfig.name}: tax deductibility, receipts, refunds and how donations are used`,
  canonical: CANONICAL_PATH,
})

const h2 = 'font-[var(--font-faustina)] text-[32px] leading-[40px] mt-8 mb-4'

/**
 * The site's ONE donation policy, always about the site's own organization.
 *
 * Every name, address and claim comes from siteConfig, so a provisioned
 * charity's site publishes the charity's policy with its public email and city
 * and state, and the template as shipped publishes the supporting
 * organization's. There is no second, supporter-branded donation policy: the
 * gift-acceptance, acknowledgment, recognition and privacy terms that page
 * carried are folded in here.
 */
export default function DonationPolicy() {
  const name = siteConfig.name
  const legal = legalContact()
  // A legal claim, made only when siteConfig.taxStatusLabel says the
  // organization holds IRS 501(c)(3) recognition. Provisioning writes '' for an
  // organization without it, and then neither the footer clause nor this page
  // may call a donation tax-deductible.
  const taxExempt = siteConfig.taxStatusLabel.trim() !== ''
  const phone = publishedPhone()
  // The EIN clause: the EIN itself, the pending placeholder while the charity
  // has not supplied it, or nothing when it has none (see PendingField).
  const ein = siteConfig.ein.trim()
  const einClause = isPending('ein') ? ` (EIN: ${PENDING_TEXT})` : ein ? ` (EIN: ${ein})` : ''
  return (
    <div className="ffc-container py-16">
      <BreadcrumbSchema name={PAGE_NAME} path={CANONICAL_PATH} />
      <div className="max-w-4xl mx-auto">
        <h1 className="font-[var(--font-faustina)] text-[48px] leading-[60px] mb-8">
          {name} Donation Policy
        </h1>

        <div className="prose max-w-none font-[var(--font-lato)] text-[18px] leading-[28px]">
          <p>
            <strong>Effective Date:</strong> {EFFECTIVE_DATE}
          </p>
          <p>
            This policy explains how {name} accepts, acknowledges and uses donations, and what
            donors can expect from us. It applies to every gift made to {name}, online or offline.
          </p>

          <h2 className={h2}>Tax Deductibility</h2>
          {taxExempt ? (
            <p>
              {name} is a qualified 501(c)(3) nonprofit organization{einClause}. Donations are
              tax-deductible to the full extent allowed by law. Please consult your own tax advisor
              about how the law applies to your gift.
            </p>
          ) : (
            <p>
              {name}
              {einClause} has not yet received IRS recognition as a 501(c)(3) organization, so
              donations may not be tax-deductible. Please consult a tax advisor before claiming a
              deduction.
            </p>
          )}

          <h2 className={h2}>Use of Donations</h2>
          {/* The organization's own description, not a fixed list of services:
              the template's list described the supporting organization's
              programs, which no other organization provides. */}
          <p>
            Donations support {name}&apos;s mission and the administrative costs necessary to carry
            it out: {siteConfig.description}
          </p>

          <h2 className={h2}>Gifts We Accept</h2>
          <p>
            {name} gratefully accepts gifts of money through its donation page and by the other
            methods it offers. Gifts of securities, real estate, vehicles or other property, and
            in-kind goods or services are considered case by case: please contact us before making
            one so we can confirm we are able to accept it.
          </p>
          <p>
            {name} may decline any gift that does not fit its mission, that it cannot use or manage
            responsibly, or that would expose it to legal or financial risk.
          </p>

          <h2 className={h2}>Receipts and Acknowledgment</h2>
          <p>
            Donations are processed securely through our payment partners. You will receive a
            {taxExempt ? ' receipt for tax purposes' : ' receipt'} by email after your donation is
            processed; gifts made by mail or in person are acknowledged in writing. Please keep your
            receipt with your records. If you do not receive one, or need a copy, contact us.
          </p>

          <h2 className={h2}>Refunds</h2>
          <p>
            Donations are generally non-refundable. Refund requests, for example for a donation made
            in error, may be granted at the discretion of {name}; contact us at{' '}
            <ContactEmail email={legal.email} className="text-primary underline" />. An approved
            refund is returned to the original payment method, and any receipt issued for the
            refunded amount no longer applies.
          </p>

          <h2 className={h2}>Donor Recognition</h2>
          <p>
            {name} recognizes donors publicly, for example on this website or in newsletters, only
            with their consent. You may give anonymously, and we will honor that request.
          </p>

          <h2 className={h2}>Donor Privacy</h2>
          <p>
            Information you give us when you donate is used to process and acknowledge your gift and
            to keep the records the law requires. It is stored securely and is not shared with third
            parties except the payment partners that process your donation, or as required by law.
            Our <Link href="/privacy-policy">Privacy Policy</Link> explains how we handle personal
            information.
          </p>

          <h2 className={h2}>Conflicts of Interest</h2>
          <p>
            Anyone acting for {name} in accepting a gift must disclose any personal interest in it
            and step aside from that decision.
          </p>

          <h2 className={h2}>Changes to This Policy</h2>
          <p>
            We may update this policy from time to time. The current version is always published on
            this page with its effective date.
          </p>

          <h2 className={h2}>Contact Us</h2>
          <p>For questions about donations or this policy, please contact us at:</p>
          <p>
            {name}
            <br />
            Email: <ContactEmail email={legal.email} className="text-primary underline" />
            {/* Only a configured number is shown, matching the footer's phone guard. */}
            {phone && (
              <>
                <br />
                Phone: {phone.display}
              </>
            )}
            {hasContactLocation() && (
              <>
                <br />
                Location: <ContactLocation />
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
