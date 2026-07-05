import type { Metadata } from 'next'
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema'
import { pageMetadata } from '@/lib/page-metadata'

const PAGE_NAME = 'Terms of Service'
const CANONICAL_PATH = '/terms-of-service'

// Bare page name as title (the root layout template appends the brand);
// per-page OG/Twitter handling is documented in src/lib/page-metadata.ts.
export const metadata: Metadata = pageMetadata({
  title: PAGE_NAME,
  description: 'Terms of Service for Free For Charity website',
  canonical: CANONICAL_PATH,
})

export default function TermsOfService() {
  return (
    <div className="pt-[130px] pb-[54px]">
      <BreadcrumbSchema name={PAGE_NAME} path={CANONICAL_PATH} />
      <div className="py-[27px] w-[90%] md:w-[80%] mx-auto">
        <div className="aria-font">
          {/* Effective Date */}
          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500]">
            <em>Effective Date: 11-20-2024</em>
          </p>

          {/* Main Title */}
          <h1 className="text-[30px] text-[#333] pb-[10px] leading-[1em] font-[500]">
            Free For Charity Terms of Service
          </h1>
          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500]">&nbsp;</p>
          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500]">&nbsp;</p>

          {/* Empty spacing removed — use margin if needed */}

          {/* Introduction */}
          <h1 className="text-[30px] text-[#333] pb-[10px] leading-[1em] font-[500]">
            Introduction
          </h1>
          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500]">
            Welcome to Free For Charity! These Terms of Service (“Terms”) govern your access to and
            use of our website, services, and platforms (collectively, “Services”), provided by Free
            For Charity (“we,” “us,” or “our”). By accessing or using our Services, you agree to be
            bound by these Terms. If you do not agree to these Terms, please do not use our
            Services.
          </p>

          {/* Eligibility */}
          <h1 className="text-[30px] text-[#333] pb-[10px] leading-[1em] font-[500]">
            Eligibility
          </h1>
          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500]">
            Our Services are available only to individuals who are at least 18 years old. By using
            our Services, you represent and warrant that you are at least 18 years of age.
          </p>

          {/* Use of Services */}
          <h1 className="text-[30px] text-[#333] pb-[10px] leading-[1em] font-[500]">
            Use of Services
          </h1>

          <h2 className="text-[26px] text-[#333] pb-[10px] leading-[26px] font-[500]">
            Account Registration
          </h2>
          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500]">
            To access certain features of our Services, you may be required to register for an
            account. You agree to provide accurate, current, and complete information during the
            registration process and to update such information to keep it accurate, current, and
            complete. You are responsible for safeguarding your password and for any activities or
            actions under your account.
          </p>

          <h2 className="text-[26px] text-[#333] pb-[10px] leading-[26px] font-[500]">
            Prohibited Activities
          </h2>
          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500]">
            You agree not to use our Services for any unlawful purpose or in any way that could
            harm, disable, overburden, or impair the Services. Prohibited activities include, but
            are not limited to:
          </p>
          <ul className="list-inside ml-[1.5em] space-y-[4px]">
            <li className="text-[14px] text-[#666] leading-[24px] font-[500]">
              Engaging in any activity that violates any applicable law or regulation.
            </li>
            <li className="text-[14px] text-[#666] leading-[24px] font-[500]">
              Transmitting any harmful or malicious code, viruses, or malware.
            </li>
            <li className="text-[14px] text-[#666] leading-[24px] font-[500]">
              Interfering with or disrupting the integrity or performance of our Services.
            </li>
            <li className="text-[14px] text-[#666] leading-[24px] font-[500]">
              Collecting or storing personal data about other users without their consent.
            </li>
            <li className="text-[14px] text-[#666] leading-[24px] font-[500]">
              Using the Services to solicit funds outside the scope of Free For Charity’s mission.
            </li>
          </ul>

          {/* Donations */}
          <h1 className="text-[30px] text-[#333] pb-[10px] leading-[1em] font-[500]">Donations</h1>
          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500]">
            All donations made to Free For Charity are voluntary and non-refundable. By making a
            donation, you agree to our Donation Policy, which is incorporated by reference into
            these Terms.
          </p>

          {/* Payments */}
          <h1 className="text-[30px] text-[#333] pb-[10px] leading-[1em] font-[500]">Payments</h1>
          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500]">
            All payments made to Free For Charity are voluntary and non-refundable. No refunds will
            be given due to the nonprofit nature of Free For Charity.
          </p>

          {/* Intellectual Property */}
          <h1 className="text-[30px] text-[#333] pb-[10px] leading-[1em] font-[500]">
            Intellectual Property
          </h1>

          <h2 className="text-[26px] text-[#333] pb-[10px] leading-[26px] font-[500]">Ownership</h2>
          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500]">
            All content, trademarks, logos, and other intellectual property included in our Services
            are the property of Free For Charity or its licensors. You agree not to use, reproduce,
            distribute, or create derivative works based on our intellectual property without our
            express written consent.
          </p>

          <h2 className="text-[26px] text-[#333] pb-[10px] leading-[26px] font-[500]">
            User Content
          </h2>
          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500]">
            By submitting content to our Services, you grant us a non-exclusive, worldwide,
            royalty-free, and transferable license to use, reproduce, distribute, prepare derivative
            works of, and display such content in connection with our Services.
          </p>

          {/* Privacy */}
          <h1 className="text-[30px] text-[#333] pb-[10px] leading-[1em] font-[500]">Privacy</h1>
          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500]">
            Your privacy is important to us. Please review our Privacy Policy, which describes how
            we collect, use, and disclose information about you.
          </p>

          {/* Third-Party Links */}
          <h1 className="text-[30px] text-[#333] pb-[10px] leading-[1em] font-[500]">
            Third-Party Links
          </h1>
          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500]">
            Our Services may contain links to third-party websites or services that are not owned or
            controlled by Free For Charity. We are not responsible for the content, privacy
            policies, or practices of any third-party websites or services. You acknowledge and
            agree that Free For Charity shall not be liable for any damages or loss caused by or in
            connection with your use of any third-party websites or services.
          </p>

          {/* Disclaimer of Warranties */}
          <h1 className="text-[30px] text-[#333] pb-[10px] leading-[1em] font-[500]">
            Disclaimer of Warranties
          </h1>
          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500]">
            Our Services are provided on an “as is” and “as available” basis. Free For Charity makes
            no representations or warranties of any kind, express or implied, regarding the use or
            the results of our Services in terms of accuracy, reliability, or otherwise. Free For
            Charity disclaims all warranties, express or implied, including, but not limited to,
            implied warranties of merchantability, fitness for a particular purpose, and
            non-infringement.
          </p>

          {/* Limitation of Liability */}
          <h1 className="text-[30px] text-[#333] pb-[10px] leading-[1em] font-[500]">
            Limitation of Liability
          </h1>
          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500]">
            To the fullest extent permitted by law, Free For Charity shall not be liable for any
            indirect, incidental, special, consequential, or punitive damages, or any loss of
            profits or revenues, whether incurred directly or indirectly, or any loss of data, use,
            goodwill, or other intangible losses, resulting from:
          </p>
          <ul className="list-inside ml-[1.5em] space-y-[4px]">
            <li className="text-[14px] text-[#666] leading-[24px] font-[500]">
              Your use of or inability to use our Services.
            </li>
            <li className="text-[14px] text-[#666] leading-[24px] font-[500]">
              Any unauthorized access to or use of our servers and/or any personal information
              stored therein.
            </li>
            <li className="text-[14px] text-[#666] leading-[24px] font-[500]">
              Any interruption or cessation of transmission to or from our Services.
            </li>
            <li className="text-[14px] text-[#666] leading-[24px] font-[500]">
              Any bugs, viruses, trojan horses, or the like that may be transmitted to or through
              our Services by any third party.
            </li>
          </ul>

          {/* Indemnification */}
          <h1 className="text-[30px] text-[#333] pb-[10px] leading-[1em] font-[500]">
            Indemnification
          </h1>
          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500]">
            You agree to indemnify, defend, and hold harmless Free For Charity, its officers,
            directors, employees, and agents, from and against any and all claims, liabilities,
            damages, losses, and expenses, including reasonable attorneys’ fees, arising out of or
            in any way connected with your access to or use of our Services, or your violation of
            these Terms.
          </p>

          {/* Governing Law */}
          <h1 className="text-[30px] text-[#333] pb-[10px] leading-[1em] font-[500]">
            Governing Law
          </h1>
          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500]">
            These Terms shall be governed by and construed in accordance with the laws of the United
            States and the State of North Carolina, without regard to its conflict of law
            principles.
          </p>

          {/* Changes to Terms */}
          <h1 className="text-[30px] text-[#333] pb-[10px] leading-[1em] font-[500]">
            Changes to Terms
          </h1>
          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500]">
            We reserve the right to modify these Terms at any time. If we make changes, we will
            provide notice by updating the date at the top of these Terms and posting the modified
            Terms on our website. Your continued use of our Services after the effective date of the
            modified Terms will constitute your acceptance of the changes.
          </p>

          {/* Termination */}
          <h1 className="text-[30px] text-[#333] pb-[10px] leading-[1em] font-[500]">
            Termination
          </h1>
          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500]">
            We may terminate or suspend your access to our Services, without prior notice or
            liability, for any reason, including, without limitation, if you breach these Terms.
            Upon termination, your right to use our Services will immediately cease.
          </p>

          {/* Contact Us */}
          <h1 className="text-[30px] text-[#333] pb-[10px] leading-[1em] font-[500]">Contact Us</h1>
          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500]">
            If you have any questions about these Terms, please contact us at:
          </p>
          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500]">
            Free For Charity
          </p>
          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500]">
            Email:{' '}
            <a href="mailto:clarkemoyer@freeforcharity.org" className="text-[#0062CC] underline">
              clarkemoyer@freeforcharity.org
            </a>
          </p>
          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500]">
            Phone: 520-222-8104
          </p>
          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500]">
            Thank you for supporting Free For Charity and for complying with these Terms of Service.
          </p>
        </div>
      </div>
    </div>
  )
}
