import type { Metadata } from 'next'
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema'
import { pageMetadata } from '@/lib/page-metadata'

const PAGE_NAME = 'Privacy Policy'
const CANONICAL_PATH = '/privacy-policy'

// Bare page name as title (the root layout template appends the brand);
// per-page OG/Twitter handling is documented in src/lib/page-metadata.ts.
export const metadata: Metadata = pageMetadata({
  title: PAGE_NAME,
  description: 'Privacy Policy for Free For Charity website',
  canonical: CANONICAL_PATH,
})

export default function PrivacyPolicy() {
  return (
    <div className="pt-[140px] pb-[54px]">
      <BreadcrumbSchema name={PAGE_NAME} path={CANONICAL_PATH} />
      <div className="py-[27px] w-[90%] md:w-[80%] mx-auto">
        <div className="aria-font">
          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500]"></p>
          <h1 className="text-[30px] text-[#333] pb-[10px] leading-[1em] font-[500]">
            <strong>Privacy Policy</strong>
          </h1>
          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500]">
            <em>Effective Date: 12-07-2025</em>
          </p>

          {/* Section 1 */}
          <ol className="list-decimal list-inside pb-[1em]">
            <li>
              <h2 className="text-[26px] leading-[26px] font-[700] text-[#333] mb-[10px]">
                <strong>Introduction</strong>
              </h2>
            </li>
          </ol>
          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500]">
            At Free for Charity, accessible from https://freeforcharity.org, your privacy is one of
            our primary concerns. This Privacy Policy document contains types of information we
            collect and record, and how we use it. By using our website, you hereby consent to our
            Privacy Policy and agree to its terms.
          </p>

          {/* Section 2 */}
          <ol className="list-decimal list-inside pb-[1em]" start={2}>
            <li>
              <h2 className="text-[26px] leading-[26px] font-[700] text-[#333] mb-[10px]">
                <strong>Who We Are</strong>
              </h2>
            </li>
          </ol>
          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500]">
            Our website address is: https://freeforcharity.org
          </p>

          {/* Section 3 */}
          <ol className="list-decimal list-inside pb-[1em]" start={3}>
            <li>
              <h2 className="text-[26px] leading-[26px] font-[700] text-[#333] mb-[10px]">
                <strong>Information We Collect</strong>
              </h2>
            </li>
          </ol>

          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500]">
            <strong>3.1. Comments</strong>
          </p>
          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500]">
            When visitors leave comments on the site, we collect:
          </p>
          <ul className="list-disc list-inside space-y-[4px] pb-[1em]">
            <li className="text-[14px] text-[#666] leading-[24px] font-[500]">
              <strong>Data from the comments form:</strong> This includes your name, email address,
              website, and the comment itself.
            </li>
            <li className="text-[14px] text-[#666] leading-[24px] font-[500]">
              <strong>IP Address and Browser User Agent String:</strong> To assist with spam
              detection and enhance security.
            </li>
            <li className="text-[14px] text-[#666] leading-[24px] font-[500]">
              <strong>Gravatar Service:</strong> An anonymized string created from your email
              address (also called a hash) may be provided to the Gravatar service to see if you are
              using it. After approval of your comment, your profile picture (if available) is
              visible to the public in the context of your comment. The Gravatar service privacy
              policy is available here: Gravatar Privacy Policy
            </li>
          </ul>

          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500] mt-[1em]">
            <strong>3.2. Media</strong>
          </p>
          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500]">
            If you upload images to the website:
          </p>
          <ul className="list-inside list-disc space-y-[4px] pb-[1em]">
            <li className="text-[14px] text-[#666] leading-[24px] font-[500]">
              <strong>Embedded Location Data:</strong> Please avoid uploading images with embedded
              location data (EXIF GPS) included. Visitors can download and extract any location data
              from images on the website.
            </li>
          </ul>

          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500] mt-[1em]">
            <strong>3.3. Cookies</strong>
          </p>
          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500]">
            Our website uses cookies to enhance your browsing experience:
          </p>
          <ul className="list-inside list-disc space-y-[4px] pb-[1em]">
            <li className="text-[14px] text-[#666] leading-[24px] font-[500]">
              <strong>Comments Cookies:</strong> When you leave a comment, you may opt-in to saving
              your name, email address, and website in cookies. These are for your convenience for
              future comments and last for one year.
            </li>
            <li className="text-[14px] text-[#666] leading-[24px] font-[500]">
              <strong>Login Cookies:</strong> When you log in, we set up cookies to save your login
              information and screen display choices.
              <ul className="list-disc list-inside ml-[1rem] mt-[4px] pb-[1em] space-y-[2px]">
                <li className="text-[14px] text-[#666] leading-[24px] font-[500]">
                  Login cookies last for two days.
                </li>
                <li className="text-[14px] text-[#666] leading-[24px] font-[500]">
                  Screen options cookies last for one year.
                </li>
                <li className="text-[14px] text-[#666] leading-[24px] font-[500]">
                  Selecting “Remember Me” extends login retention to two weeks.
                </li>
                <li className="text-[14px] text-[#666] leading-[24px] font-[500]">
                  Logging out removes login cookies.
                </li>
              </ul>
            </li>
            <li className="text-[14px] text-[#666] leading-[24px] font-[500]">
              <strong>Temporary Cookies:</strong> Visiting our login page sets a temporary cookie to
              determine if your browser accepts cookies. It contains no personal data and is
              discarded when you close your browser.
            </li>
            <li className="text-[14px] text-[#666] leading-[24px] font-[500]">
              <strong>Editing or Publishing Articles:</strong> This sets an additional cookie in
              your browser, indicating the post ID of the article you just edited. It expires after
              one day.
            </li>
          </ul>

          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500] mt-[1em]">
            <strong>3.4. Microsoft Forms - Application Forms</strong>
          </p>
          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500]">
            We use Microsoft Forms (forms.office.com) for our charity application process. When you
            submit an application through our website:
          </p>
          <ul className="list-inside list-disc space-y-[4px] pb-[1em]">
            <li className="text-[14px] text-[#666] leading-[24px] font-[500]">
              <strong>Data Collected:</strong> Information you provide in the application form
              (name, email, organization details, etc.)
            </li>
            <li className="text-[14px] text-[#666] leading-[24px] font-[500]">
              <strong>Third-Party Processing:</strong> Microsoft Forms is a service provided by
              Microsoft Corporation. Your form submissions are processed according to
              Microsoft&apos;s privacy policies.
            </li>
            <li className="text-[14px] text-[#666] leading-[24px] font-[500]">
              <strong>Additional Third-Party Services:</strong> Microsoft Forms may use additional
              services (including HubSpot) for form analytics and feedback collection. These are
              controlled by Microsoft, not Free For Charity.
            </li>
            <li className="text-[14px] text-[#666] leading-[24px] font-[500]">
              <strong>Privacy Policy:</strong> Review Microsoft&apos;s privacy practices at{' '}
              <a
                href="https://privacy.microsoft.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0062CC] underline"
              >
                https://privacy.microsoft.com/
              </a>
            </li>
          </ul>

          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500] mt-[1em]">
            <strong>3.5. Embedded Content from Other Websites</strong>
          </p>
          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500]">
            Articles on this site may include embedded content (e.g., videos, images, articles).
            Embedded content from other websites behaves as if you have visited the other website
            directly. These websites may:
          </p>
          <ul className="list-inside list-disc space-y-[4px] pb-[1em]">
            <li className="text-[14px] text-[#666] leading-[24px] font-[500]">
              Collect data about you.
            </li>
            <li className="text-[14px] text-[#666] leading-[24px] font-[500]">Use cookies.</li>
            <li className="text-[14px] text-[#666] leading-[24px] font-[500]">
              Embed additional third-party tracking.
            </li>
            <li className="text-[14px] text-[#666] leading-[24px] font-[500]">
              Monitor your interaction with the embedded content, including tracking your
              interaction if you have an account and are logged in to that website.
            </li>
          </ul>

          {/* Section 4 */}
          <ol className="list-decimal list-inside pb-[1em]" start={4}>
            <li>
              <h2 className="text-[26px] leading-[26px] font-[700] text-[#333] mb-[10px]">
                <strong>How We Use Your Information</strong>
              </h2>
            </li>
          </ol>
          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500]">
            We use the collected information for various purposes:
          </p>
          <ul className="list-inside list-disc space-y-[4px] pb-[1em]">
            <li className="text-[14px] text-[#666] leading-[24px] font-[500]">
              <strong>To Operate and Maintain Our Website:</strong> Ensuring smooth functionality
              and user experience.
            </li>
            <li className="text-[14px] text-[#666] leading-[24px] font-[500]">
              <strong>To Improve Customer Service:</strong> Your information helps us respond to
              your requests and support needs more efficiently.
            </li>
            <li className="text-[14px] text-[#666] leading-[24px] font-[500]">
              <strong>To Personalize User Experience:</strong> Understanding how our users utilize
              the services and resources provided.
            </li>
            <li className="text-[14px] text-[#666] leading-[24px] font-[500]">
              <strong>To Process Transactions:</strong> Information provided during transactions is
              used strictly for order processing.
            </li>
            <li className="text-[14px] text-[#666] leading-[24px] font-[500]">
              <strong>To Send Periodic Emails:</strong> Using the email address to send information
              and updates pertaining to your interests.
            </li>
          </ul>

          {/* Section 5 */}
          <ol className="list-decimal list-inside pb-[1em]" start={5}>
            <li>
              <h2 className="text-[26px] leading-[26px] font-[700] text-[#333] mb-[10px]">
                <strong>Who We Share Your Data With</strong>
              </h2>
            </li>
          </ol>
          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500]">
            We respect your privacy and do not sell, trade, or rent your personal identification
            information to others. However:
          </p>
          <ul className="list-inside list-disc space-y-[4px] pb-[1em]">
            <li className="text-[14px] text-[#666] leading-[24px] font-[500]">
              <strong>Service Providers:</strong> We may share your information with third-party
              service providers to help us operate our website or administer activities on our
              behalf, such as sending out newsletters or surveys.
            </li>
            <li className="text-[14px] text-[#666] leading-[24px] font-[500]">
              <strong>Spam Detection Services:</strong> Visitor comments may be checked through
              automated spam detection services.
            </li>
            <li className="text-[14px] text-[#666] leading-[24px] font-[500]">
              <strong>Legal Obligations:</strong> We may disclose your information if required to do
              so by law or in response to valid requests by public authorities.
            </li>
          </ul>

          {/* Section 6 */}
          <ol className="list-decimal list-inside pb-[1em]" start={6}>
            <li>
              <h2 className="text-[26px] leading-[26px] font-[700] text-[#333] mb-[10px]">
                <strong>Data Retention</strong>
              </h2>
            </li>
          </ol>

          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500]">
            <strong>6.1. Comments</strong>
          </p>
          <ul className="list-inside list-disc space-y-[4px] pb-[1em]">
            <li className="text-[14px] text-[#666] leading-[24px] font-[500]">
              <strong>Retention Period:</strong> Comments and their metadata are retained
              indefinitely. This allows us to recognize and approve any follow-up comments
              automatically.
            </li>
          </ul>

          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500] mt-[1em]">
            <strong>6.2. Registered Users</strong>
          </p>
          <ul className="list-inside list-disc space-y-[4px] pb-[1em]">
            <li className="text-[14px] text-[#666] leading-[24px] font-[500]">
              <strong>User Profiles:</strong> For users that register on our website, we store the
              personal information provided in their user profile.
            </li>
            <li className="text-[14px] text-[#666] leading-[24px] font-[500]">
              <strong>User Rights:</strong> All users can see, edit, or delete their personal
              information at any time (except for changing their username). Website administrators
              can also view and edit this information.
            </li>
          </ul>

          {/* Section 7 */}
          <ol className="list-decimal list-inside pb-[1em]" start={7}>
            <li>
              <h2 className="text-[26px] leading-[26px] font-[700] text-[#333] mb-[10px]">
                <strong>Your Rights Over Your Data</strong>
              </h2>
            </li>
          </ol>
          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500]">
            You have the following data protection rights:
          </p>
          <ul className="list-inside list-disc space-y-[4px] pb-[1em]">
            <li className="text-[14px] text-[#666] leading-[24px] font-[500]">
              <strong>Access and Portability:</strong> Request a copy of the personal data we hold
              about you.
            </li>
            <li className="text-[14px] text-[#666] leading-[24px] font-[500]">
              <strong>Correction:</strong> Request that we correct any personal information if it is
              inaccurate or incomplete.
            </li>
            <li className="text-[14px] text-[#666] leading-[24px] font-[500]">
              <strong>Erasure:</strong> Request that we erase your personal data, under certain
              conditions.
            </li>
            <li className="text-[14px] text-[#666] leading-[24px] font-[500]">
              <strong>Restrict Processing:</strong> Object to our processing of your personal data,
              under certain conditions.
            </li>
            <li className="text-[14px] text-[#666] leading-[24px] font-[500]">
              <strong>Withdraw Consent:</strong> Withdraw your consent at any time where we relied
              on your consent to process your personal information.
            </li>
          </ul>
          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500]">
            To exercise these rights, please contact us at 520-222-8104.
          </p>

          {/* Section 8 */}
          <ol className="list-decimal list-inside pb-[1em]" start={8}>
            <li>
              <h2 className="text-[26px] leading-[26px] font-[700] text-[#333] mb-[10px]">
                <strong>Security Measures</strong>
              </h2>
            </li>
          </ol>
          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500]">
            We implement a variety of security measures to maintain the safety of your personal
            information:
          </p>
          <ul className="list-inside list-disc space-y-[4px] pb-[1em]">
            <li className="text-[14px] text-[#666] leading-[24px] font-[500]">
              <strong>Secure Socket Layer (SSL) Technology:</strong> To encrypt sensitive
              information transmitted online.
            </li>
            <li className="text-[14px] text-[#666] leading-[24px] font-[500]">
              <strong>Access Controls:</strong> Limited access to your personal data to those
              employees, agents, contractors, and other third parties who have a business need to
              know.
            </li>
            <li className="text-[14px] text-[#666] leading-[24px] font-[500]">
              <strong>Regular Security Audits:</strong> To identify and address potential
              vulnerabilities.
            </li>
          </ul>
          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500] italic">
            However, please note that no method of transmission over the Internet or method of
            electronic storage is 100% secure.
          </p>

          {/* Section 9 */}
          <ol className="list-decimal list-inside pb-[1em]" start={9}>
            <li>
              <h2 className="text-[26px] leading-[26px] font-[700] text-[#333] mb-[10px]">
                <strong>Third-Party Links</strong>
              </h2>
            </li>
          </ol>
          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500]">
            Our website may contain links to external sites that are not operated by us. We have no
            control over and assume no responsibility for the content, privacy policies, or
            practices of any third-party sites or services. We encourage you to review the Privacy
            Policy of every site you visit.
          </p>

          {/* Section 10 */}
          <ol className="list-decimal list-inside pb-[1em]" start={10}>
            <li>
              <h2 className="text-[26px] leading-[26px] font-[700] text-[#333] mb-[10px]">
                <strong>Children’s Privacy</strong>
              </h2>
            </li>
          </ol>
          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500]">
            Protecting the privacy of young children is especially important:
          </p>
          <ul className="list-inside list-disc space-y-[4px] pb-[1em]">
            <li className="text-[14px] text-[#666] leading-[24px] font-[500]">
              <strong>Age Restrictions:</strong> Our services are not intended for individuals under
              the age of 13.
            </li>
            <li className="text-[14px] text-[#666] leading-[24px] font-[500]">
              <strong>Parental Consent:</strong> We do not knowingly collect personal information
              from children under 13 without parental consent. If you believe we might have any
              information from or about a child under 13, please contact us immediately.
            </li>
          </ul>

          {/* Section 11 */}
          <ol className="list-decimal list-inside pb-[1em]" start={11}>
            <li>
              <h2 className="text-[26px] leading-[26px] font-[700] text-[#333] mb-[10px]">
                <strong>International Data Transfers</strong>
              </h2>
            </li>
          </ol>
          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500]">
            Your information may be transferred to—and maintained on—computers located outside of
            your state, province, country, or other governmental jurisdiction where data protection
            laws may differ:
          </p>
          <ul className="list-inside list-disc space-y-[4px] pb-[1em]">
            <li className="text-[14px] text-[#666] leading-[24px] font-[500]">
              <strong>Consent to Transfer:</strong> Your consent to this Privacy Policy followed by
              your submission of such information represents your agreement to that transfer.
            </li>
            <li className="text-[14px] text-[#666] leading-[24px] font-[500]">
              <strong>Compliance with Laws:</strong> We will take all steps reasonably necessary to
              ensure that your data is treated securely and in accordance with this Privacy Policy.
            </li>
          </ul>

          {/* Section 12 */}
          <ol className="list-decimal list-inside pb-[1em]" start={12}>
            <li>
              <h2 className="text-[26px] leading-[26px] font-[700] text-[#333] mb-[10px]">
                <strong>Changes to This Privacy Policy</strong>
              </h2>
            </li>
          </ol>
          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500]">
            We may update our Privacy Policy from time to time:
          </p>
          <ul className="list-inside list-disc space-y-[4px] pb-[1em]">
            <li className="text-[14px] text-[#666] leading-[24px] font-[500]">
              <strong>Notification of Changes:</strong> Any changes will be posted on this page with
              an updated effective date.
            </li>
            <li className="text-[14px] text-[#666] leading-[24px] font-[500]">
              <strong>Review Periodically:</strong> We encourage users to frequently check this page
              for any changes to stay informed about how we are helping to protect the personal
              information we collect.
            </li>
          </ul>

          {/* Section 13 */}
          <ol className="list-decimal list-inside pb-[1em]" start={13}>
            <li>
              <h2 className="text-[26px] leading-[26px] font-[700] text-[#333] mb-[10px]">
                <strong>Contact Us</strong>
              </h2>
            </li>
          </ol>
          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500]">
            If you have any questions about this Privacy Policy, please contact us:
          </p>
          <ul className="list-inside list-disc space-y-[4px] pb-[1em]">
            <li className="text-[14px] text-[#666] leading-[24px] font-[500]">
              <strong>Email:</strong>{' '}
              <a href="mailto:clarkemoyer@freeforcharity.org" className="text-[#0062CC] underline">
                clarkemoyer@freeforcharity.org
              </a>{' '}
              520-222-8104
            </li>
          </ul>

          {/* Section 14 */}
          <ol className="list-decimal list-inside pb-[1em]" start={14}>
            <li>
              <h2 className="text-[26px] leading-[26px] font-[700] text-[#333] mb-[10px]">
                <strong>Additional Information</strong>
              </h2>
            </li>
          </ol>

          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500]">
            <strong>14.1. Data Protection Officer</strong>
          </p>
          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500]">
            We have appointed a Data Protection Officer (DPO) responsible for overseeing questions
            in relation to this Privacy Policy:
          </p>
          <ul className="list-inside list-disc space-y-[4px] pb-[1em]">
            <li className="text-[14px] text-[#666] leading-[24px] font-[500]">
              <strong>Contact DPO:</strong> Clarke Moyer{' '}
              <a href="mailto:clarkemoyer@freeforcharity.org" className="text-[#0062CC] underline">
                clarkemoyer@freeforcharity.org
              </a>{' '}
              520-222-8104
            </li>
          </ul>

          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[700] mt-[1.5em]">
            Your trust matters to us, and we are committed to protecting your personal information
            and using it responsibly.
          </p>
        </div>
      </div>
    </div>
  )
}
