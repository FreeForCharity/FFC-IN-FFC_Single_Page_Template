import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookie Policy | Free For Charity',
  description: 'Cookie Policy for Free For Charity website',
}

// Update this date when the policy changes
const LAST_UPDATED = 'December 7, 2025'

export default function CookiePolicy() {
  return (
    <div className="pt-[140px] pb-[54px]">
      <div className="py-[27px] w-[90%] md:w-[80%] mx-auto">
        <div id="aria-font">
          <h1 className="text-[30px] text-[#333] pb-[10px] leading-[1em] font-[500]">
            <strong>Cookie Policy</strong>
          </h1>
          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500]">
            <em>Last Updated: {LAST_UPDATED}</em>
          </p>

          {/* Section 1 */}
          <ol className="list-decimal list-inside pb-[1em]">
            <li>
              <h2 className="text-[26px] leading-[26px] font-[700] text-[#333] mb-[10px]">
                <strong>What Are Cookies?</strong>
              </h2>
            </li>
          </ol>
          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500]">
            Cookies are small text files that are placed on your device when you visit a website.
            They are widely used to make websites work more efficiently and provide information to
            website owners. Cookies can be &quot;persistent&quot; or &quot;session&quot; cookies.
            Persistent cookies remain on your device after you close your browser, while session
            cookies are deleted when you close your browser.
          </p>

          {/* Section 2 */}
          <ol className="list-decimal list-inside pb-[1em]" start={2}>
            <li>
              <h2 className="text-[26px] leading-[26px] font-[700] text-[#333] mb-[10px]">
                <strong>How We Use Cookies</strong>
              </h2>
            </li>
          </ol>
          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500]">
            When you visit our website, we use cookies to:
          </p>
          <ul className="list-disc list-inside space-y-[4px] pb-[1em]">
            <li className="text-[14px] text-[#666] leading-[24px] font-[500]">
              Remember your cookie consent preferences
            </li>
            <li className="text-[14px] text-[#666] leading-[24px] font-[500]">
              Understand how you use our website (with your consent)
            </li>
            <li className="text-[14px] text-[#666] leading-[24px] font-[500]">
              Analyze website traffic and user behavior (with your consent)
            </li>
            <li className="text-[14px] text-[#666] leading-[24px] font-[500]">
              Improve our website and user experience
            </li>
          </ul>

          {/* Section 3 */}
          <ol className="list-decimal list-inside pb-[1em]" start={3}>
            <li>
              <h2 className="text-[26px] leading-[26px] font-[700] text-[#333] mb-[10px]">
                <strong>Types of Cookies We Use</strong>
              </h2>
            </li>
          </ol>

          {/* 3.1 Necessary Cookies */}
          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500]">
            <strong>3.1 Necessary Cookies (Always Active)</strong>
          </p>
          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500]">
            These cookies are essential for the website to function properly. They enable basic
            features like storing your cookie consent preferences. These cookies do not store any
            personally identifiable information and cannot be disabled.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg mb-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 pr-4 text-[#333]">Cookie Name</th>
                  <th className="text-left py-2 pr-4 text-[#333]">Purpose</th>
                  <th className="text-left py-2 text-[#333]">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 pr-4 font-mono text-[#666]">cookie-consent</td>
                  <td className="py-2 pr-4 text-[#666]">Stores your cookie preferences</td>
                  <td className="py-2 text-[#666]">12 months</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 3.2 Functional Cookies */}
          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500] mt-[1em]">
            <strong>3.2 Functional Cookies (Always Active)</strong>
          </p>
          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500]">
            These cookies enable essential functionality such as donation processing and application
            forms. They are necessary for these services to work and cannot be disabled if you wish
            to use these features.
          </p>

          {/* Microsoft Forms */}
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h4 className="font-semibold mb-2 text-[#333]">Microsoft Forms</h4>
            <p className="text-sm mb-2 text-[#666]">
              Used for our charity application form. Microsoft Forms may load additional third-party
              services (including HubSpot) for form analytics and feedback collection. These
              services are controlled by Microsoft.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 pr-4 text-[#333]">Service</th>
                    <th className="text-left py-2 pr-4 text-[#333]">Purpose</th>
                    <th className="text-left py-2 text-[#333]">Load Trigger</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 pr-4 font-mono text-[#666]">Microsoft Forms</td>
                    <td className="py-2 pr-4 text-[#666]">Charity application form processing</td>
                    <td className="py-2 text-[#666]">When application modal opened</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-mono text-[#666]">
                      HubSpot (via Microsoft Forms)
                    </td>
                    <td className="py-2 pr-4 text-[#666]">Form analytics and feedback</td>
                    <td className="py-2 text-[#666]">Loaded by Microsoft Forms</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs mt-2 text-gray-600">
              Privacy Policy:{' '}
              <a
                href="https://privacy.microsoft.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                https://privacy.microsoft.com/
              </a>
            </p>
            <p className="text-xs mt-1 text-gray-600">
              HubSpot Privacy:{' '}
              <a
                href="https://legal.hubspot.com/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                https://legal.hubspot.com/privacy-policy
              </a>
            </p>
          </div>

          {/* Zeffy */}
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h4 className="font-semibold mb-2 text-[#333]">Zeffy Donation Platform</h4>
            <p className="text-sm mb-2 text-[#666]">
              Zero-fee donation processing platform embedded on our website to accept donations.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 pr-4 text-[#333]">Service</th>
                    <th className="text-left py-2 pr-4 text-[#333]">Purpose</th>
                    <th className="text-left py-2 text-[#333]">Load Trigger</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 pr-4 font-mono text-[#666]">Zeffy</td>
                    <td className="py-2 pr-4 text-[#666]">Donation form and payment processing</td>
                    <td className="py-2 text-[#666]">Embedded on donation section</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs mt-2 text-gray-600">
              Privacy Policy:{' '}
              <a
                href="https://support.zeffy.com/legal-data-privacy-security"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                https://support.zeffy.com/legal-data-privacy-security
              </a>
            </p>
          </div>

          {/* 3.3 Analytics Cookies */}
          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500] mt-[1em]">
            <strong>3.3 Analytics Cookies (Requires Consent)</strong>
          </p>
          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500]">
            These cookies help us understand how visitors interact with our website by collecting
            and reporting information anonymously. We use this information to improve our website
            and user experience.
          </p>

          {/* Google Analytics */}
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h4 className="font-semibold mb-2 text-[#333]">Google Analytics</h4>
            <p className="text-sm mb-2 text-[#666]">
              Google Analytics is a web analytics service offered by Google that tracks and reports
              website traffic. We use Google Analytics to understand how users interact with our
              website.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 pr-4 text-[#333]">Cookie Name</th>
                    <th className="text-left py-2 pr-4 text-[#333]">Purpose</th>
                    <th className="text-left py-2 text-[#333]">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 pr-4 font-mono text-[#666]">_ga</td>
                    <td className="py-2 pr-4 text-[#666]">Distinguishes unique users</td>
                    <td className="py-2 text-[#666]">2 years</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pr-4 font-mono text-[#666]">_ga_*</td>
                    <td className="py-2 pr-4 text-[#666]">Maintains session state</td>
                    <td className="py-2 text-[#666]">2 years</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-mono text-[#666]">_gid</td>
                    <td className="py-2 pr-4 text-[#666]">Distinguishes users</td>
                    <td className="py-2 text-[#666]">24 hours</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs mt-2 text-gray-600">
              Privacy Policy:{' '}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                https://policies.google.com/privacy
              </a>
            </p>
          </div>

          {/* Microsoft Clarity */}
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h4 className="font-semibold mb-2 text-[#333]">Microsoft Clarity</h4>
            <p className="text-sm mb-2 text-[#666]">
              Microsoft Clarity is a user behavior analytics tool that helps us understand how users
              interact with our website through session recordings and heatmaps.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 pr-4 text-[#333]">Cookie Name</th>
                    <th className="text-left py-2 pr-4 text-[#333]">Purpose</th>
                    <th className="text-left py-2 text-[#333]">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 pr-4 font-mono text-[#666]">_clck</td>
                    <td className="py-2 pr-4 text-[#666]">Persists Clarity User ID</td>
                    <td className="py-2 text-[#666]">1 year</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-mono text-[#666]">_clsk</td>
                    <td className="py-2 pr-4 text-[#666]">Session cookie</td>
                    <td className="py-2 text-[#666]">1 day</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs mt-2 text-gray-600">
              Privacy Policy:{' '}
              <a
                href="https://privacy.microsoft.com/en-us/privacystatement"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                https://privacy.microsoft.com/privacystatement
              </a>
            </p>
          </div>

          {/* 3.4 Marketing Cookies */}
          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500] mt-[1em]">
            <strong>3.4 Marketing Cookies (Requires Consent)</strong>
          </p>
          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500]">
            These cookies are used to track visitors across websites. The intention is to display
            ads that are relevant and engaging for users and thereby more valuable for publishers
            and advertisers.
          </p>

          {/* Meta Pixel */}
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h4 className="font-semibold mb-2 text-[#333]">Meta Pixel (Facebook Pixel)</h4>
            <p className="text-sm mb-2 text-[#666]">
              The Meta Pixel is an analytics tool that helps us measure the effectiveness of
              advertising by understanding the actions people take on our website.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 pr-4 text-[#333]">Cookie Name</th>
                    <th className="text-left py-2 pr-4 text-[#333]">Purpose</th>
                    <th className="text-left py-2 text-[#333]">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 pr-4 font-mono text-[#666]">_fbp</td>
                    <td className="py-2 pr-4 text-[#666]">Tracks user behavior for advertising</td>
                    <td className="py-2 text-[#666]">3 months</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-mono text-[#666]">fr</td>
                    <td className="py-2 pr-4 text-[#666]">Enables ad delivery and targeting</td>
                    <td className="py-2 text-[#666]">3 months</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs mt-2 text-gray-600">
              Privacy Policy:{' '}
              <a
                href="https://www.facebook.com/privacy/policy/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                https://www.facebook.com/privacy/policy/
              </a>
            </p>
          </div>

          {/* Section 4 */}
          <ol className="list-decimal list-inside pb-[1em]" start={4}>
            <li>
              <h2 className="text-[26px] leading-[26px] font-[700] text-[#333] mb-[10px]">
                <strong>How to Manage Cookies</strong>
              </h2>
            </li>
          </ol>

          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500]">
            You have several options for managing cookies:
          </p>

          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500]">
            <strong>4.1 Cookie Consent Banner</strong>
          </p>
          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500]">
            When you first visit our website, you&apos;ll see a cookie consent banner. You can:
          </p>
          <ul className="list-disc list-inside space-y-[4px] pb-[1em]">
            <li className="text-[14px] text-[#666] leading-[24px] font-[500]">
              <strong>Accept All:</strong> Allow all cookies including analytics and marketing
            </li>
            <li className="text-[14px] text-[#666] leading-[24px] font-[500]">
              <strong>Decline All:</strong> Only essential cookies will be used
            </li>
            <li className="text-[14px] text-[#666] leading-[24px] font-[500]">
              <strong>Customize:</strong> Choose which types of cookies you want to allow
            </li>
          </ul>

          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500] mt-[1em]">
            <strong>4.2 Browser Settings</strong>
          </p>
          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500]">
            Most web browsers allow you to control cookies through their settings. You can
            typically:
          </p>
          <ul className="list-disc list-inside space-y-[4px] pb-[1em]">
            <li className="text-[14px] text-[#666] leading-[24px] font-[500]">
              View what cookies are stored and delete them individually
            </li>
            <li className="text-[14px] text-[#666] leading-[24px] font-[500]">
              Block third-party cookies
            </li>
            <li className="text-[14px] text-[#666] leading-[24px] font-[500]">
              Block all cookies from specific websites
            </li>
            <li className="text-[14px] text-[#666] leading-[24px] font-[500]">
              Block all cookies from being set
            </li>
            <li className="text-[14px] text-[#666] leading-[24px] font-[500]">
              Delete all cookies when you close your browser
            </li>
          </ul>
          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500]">
            Please note that if you block all cookies, you may not be able to use all features of
            our website.
          </p>

          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500] mt-[1em]">
            <strong>4.3 Opt-Out Links</strong>
          </p>
          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500]">
            You can opt out of specific third-party cookies:
          </p>
          <ul className="list-disc list-inside space-y-[4px] pb-[1em]">
            <li className="text-[14px] text-[#666] leading-[24px] font-[500]">
              <strong>Google Analytics:</strong>{' '}
              <a
                href="https://tools.google.com/dlpage/gaoptout"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Google Analytics Opt-out Browser Add-on
              </a>
            </li>
            <li className="text-[14px] text-[#666] leading-[24px] font-[500]">
              <strong>Meta (Facebook):</strong>{' '}
              <a
                href="https://www.facebook.com/settings/?tab=ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Facebook Ad Settings
              </a>
            </li>
          </ul>

          {/* Section 5 */}
          <ol className="list-decimal list-inside pb-[1em]" start={5}>
            <li>
              <h2 className="text-[26px] leading-[26px] font-[700] text-[#333] mb-[10px]">
                <strong>Do Not Track Signals</strong>
              </h2>
            </li>
          </ol>
          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500]">
            Some browsers have a &quot;Do Not Track&quot; feature that lets you tell websites that
            you do not want to have your online activities tracked. At this time, we do not respond
            to browser &quot;Do Not Track&quot; signals. However, you can control cookies through
            our cookie consent banner.
          </p>

          {/* Section 6 */}
          <ol className="list-decimal list-inside pb-[1em]" start={6}>
            <li>
              <h2 className="text-[26px] leading-[26px] font-[700] text-[#333] mb-[10px]">
                <strong>Updates to This Cookie Policy</strong>
              </h2>
            </li>
          </ol>
          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500]">
            We may update this Cookie Policy from time to time to reflect changes in our practices
            or for other operational, legal, or regulatory reasons. Please review this policy
            periodically for changes.
          </p>

          {/* Section 7 */}
          <ol className="list-decimal list-inside pb-[1em]" start={7}>
            <li>
              <h2 className="text-[26px] leading-[26px] font-[700] text-[#333] mb-[10px]">
                <strong>Contact Us</strong>
              </h2>
            </li>
          </ol>
          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500]">
            If you have questions about our use of cookies, please contact us:
          </p>
          <ul className="list-inside list-disc space-y-[4px] pb-[1em]">
            <li className="text-[14px] text-[#666] leading-[24px] font-[500]">
              <strong>Email:</strong>{' '}
              <a href="mailto:privacy@freeforcharity.org" className="text-blue-600 hover:underline">
                privacy@freeforcharity.org
              </a>
            </li>
            <li className="text-[14px] text-[#666] leading-[24px] font-[500]">
              <strong>Emergency Contact:</strong> Clarke Moyer
            </li>
            <li className="text-[14px] text-[#666] leading-[24px] font-[500]">
              <strong>Phone:</strong>{' '}
              <a href="tel:520-222-8104" className="text-blue-600 hover:underline">
                520-222-8104
              </a>
            </li>
          </ul>

          {/* Section 8 */}
          <ol className="list-decimal list-inside pb-[1em]" start={8}>
            <li>
              <h2 className="text-[26px] leading-[26px] font-[700] text-[#333] mb-[10px]">
                <strong>More Information</strong>
              </h2>
            </li>
          </ol>
          <p className="text-[14px] text-[#666] pb-[10px] leading-[24px] font-[500]">
            For more information about how we handle your personal data, please see our{' '}
            <a href="/privacy-policy" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
