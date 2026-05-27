import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Donation Policy | Free For Charity',
  description: 'Donation Policy for Free For Charity website',
}

export default function DonationPolicy() {
  return (
    <div className="ffc-container py-16">
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
          <p>
            Free For Charity is a qualified 501(c)(3) nonprofit organization (EIN: 46-2471893).
            Donations are tax-deductible to the full extent allowed by law.
          </p>

          <h2 className="font-[var(--font-faustina)] text-[32px] leading-[40px] mt-8 mb-4">
            Use of Donations
          </h2>
          <p>
            Donations support our mission to reduce costs and increase revenues for nonprofits by
            providing:
          </p>
          <ul>
            <li>Free domain registration and hosting services</li>
            <li>Technology consultation and support</li>
            <li>Volunteer coordination and training</li>
            <li>Administrative costs necessary to operate our programs</li>
          </ul>

          <h2 className="font-[var(--font-faustina)] text-[32px] leading-[40px] mt-8 mb-4">
            Donation Processing
          </h2>
          <p>
            Donations are processed securely through our payment partners. You will receive a
            receipt for tax purposes via email after your donation is processed.
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
            <a
              href="mailto:clarkemoyer@freeforcharity.org"
              className="text-primary hover:underline"
            >
              clarkemoyer@freeforcharity.org
            </a>
            <br />
            Phone: (520) 222-8104
          </p>
        </div>
      </div>
    </div>
  )
}
