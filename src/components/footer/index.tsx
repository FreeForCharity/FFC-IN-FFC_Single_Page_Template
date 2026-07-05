'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FiMail, FiPhone, FiMapPin, FiArrowRight, FiLink2 } from 'react-icons/fi'
import { FaFacebookF, FaLinkedinIn, FaGithub } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import type { IconType } from 'react-icons'

import { siteConfig } from '@/lib/site.config'
import { assetPath } from '@/lib/assetPath'

// Maps a social link's label (as defined in siteConfig.social) to an icon.
// Unknown labels fall back to a generic link icon (FiLink2) so a charity
// that adds a new social network — Bluesky, Mastodon, YouTube, etc. — gets a
// sensible placeholder instead of a misleading GitHub mark.
const socialIconByLabel: Record<string, IconType> = {
  Facebook: FaFacebookF,
  'X (Twitter)': FaXTwitter,
  Twitter: FaXTwitter,
  X: FaXTwitter,
  LinkedIn: FaLinkedinIn,
  GitHub: FaGithub,
}

const Footer: React.FC = () => {
  const currentYear = React.useMemo(() => new Date().getFullYear(), [])
  const socialLinks = siteConfig.social.filter((s) => s.href)
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 py-12 px-4 md:px-6 lg:px-8">
        {/* Column 1: Endorsements */}
        <div className="space-y-6 px-4 sm:px-0">
          <h2 className="text-[28px] text-white">Endorsements</h2>

          <div className="space-y-4">
            <a
              href={siteConfig.guidestar.profileUrl}
              aria-label={`View ${siteConfig.name} GuideStar Profile`}
            >
              <Image
                src={assetPath('/Svgs/footerImage.svg')}
                alt="GuideStar Platinum Seal of Transparency"
                width={108}
                height={108}
              />
            </a>
            <Link
              href={siteConfig.guidestar.directProfileUrl}
              className="group relative my-4 flex w-full max-w-[230px] items-center justify-between
                border-2 border-[#2ea3f2] bg-black px-5 py-2.5 text-[#2ea3f2]
                transition-all duration-300 hover:border-transparent aria-font"
            >
              <span className="text-[17px] font-medium leading-tight sm:text-[18px] md:text-[20px] transition-transform duration-300 group-hover:-translate-x-1">
                Direct GuideStar Profile Link
              </span>

              <FiArrowRight
                className="h-8 w-8 translate-x-2 opacity-0 text-[#2ea3f2] transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                strokeWidth={2}
              />
            </Link>

            <p>
              <span className="font-[500] text-[22px]">
                {siteConfig.name} EIN: {siteConfig.ein}
              </span>
            </p>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="space-y-6 px-4 sm:px-0">
          <h2 className="text-[28px] text-white">Quick Links</h2>

          <nav aria-label="Quick links">
            <ul className="space-y-2 text-sm lato-font">
              {[
                { name: 'Home', href: '/#hero' },
                { name: 'Mission', href: '/#mission' },
                { name: 'Programs', href: '/#programs' },
                { name: 'Events', href: '/#events' },
                { name: 'Donate', href: '/#donate' },
                { name: 'Volunteer', href: '/#volunteer' },
                { name: 'FAQ', href: '/#faq' },
                { name: 'Team', href: '/#team' },
                // Only shown when this site is a project of a parent org with a hub.
                ...(siteConfig.parentOrg?.hubUrl
                  ? [{ name: 'Supported Charity Login', href: siteConfig.parentOrg.hubUrl }]
                  : []),
              ].map((link) => {
                const isExternal = link.href.startsWith('http')
                return (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      target={isExternal ? '_blank' : undefined}
                      rel={isExternal ? 'noopener noreferrer' : undefined}
                      className="hover:text-[#F58C23] hover:tracking-widest transition-all text-[16px] font-[500]"
                    >
                      {link.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="space-y-3">
            <h3 className="text-[28px] text-white">{siteConfig.name} Policy</h3>
            <nav aria-label="Policy links">
              <ul className="space-y-1 text-sm lato-font">
                {[
                  {
                    name: `${siteConfig.name} Donation Policy`,
                    href: '/free-for-charity-donation-policy',
                  },
                  {
                    name: 'Donation Policy',
                    href: '/donation-policy',
                  },
                  {
                    name: `${siteConfig.name} Privacy Policy`,
                    href: '/privacy-policy',
                  },
                  {
                    name: `${siteConfig.name} Cookie Policy`,
                    href: '/cookie-policy',
                  },
                  {
                    name: `${siteConfig.name} Terms of Service`,
                    href: '/terms-of-service',
                  },
                  {
                    name: `${siteConfig.name} Vulnerability Disclosure Policy`,
                    href: '/vulnerability-disclosure-policy',
                  },
                  {
                    name: `${siteConfig.name} Security Acknowledgement`,
                    href: '/security-acknowledgements',
                  },
                ].map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="hover:text-[#F58C23] hover:tracking-widest transition-all text-[16px] font-[500]"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* Column 3: Contact Us */}
        <div className="space-y-6 px-4 sm:px-0">
          <h2 className="text-[28px] text-white">Contact Us</h2>

          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <FiMail className="w-10 h-10 text-orange-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-[500] text-[22px]">E-mail</p>
                <a
                  href={`mailto:${siteConfig.contactEmail}`}
                  className="font-[500] text-[15px] hover:text-cyan-400 transition-colors break-all aria-font"
                >
                  {siteConfig.contactEmail}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FiPhone className="w-10 h-10 text-orange-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-[500] text-[22px]">Call Us Today</p>
                <a
                  href={`tel:${siteConfig.phone.tel}`}
                  className="font-[500] text-[16px] hover:text-cyan-400 transition-colors aria-font"
                >
                  {siteConfig.phone.display}
                </a>
              </div>
            </div>

            {siteConfig.addresses.map((address) => (
              <a
                key={address.label}
                href={address.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 hover:opacity-80 transition-opacity"
              >
                <FiMapPin className="w-10 h-10 text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-[500] text-[22px]">{address.label}</p>
                  <p className="font-[500] text-[16px] aria-font">
                    {address.lines.map((line, i) => (
                      <React.Fragment key={i}>
                        {i > 0 && <br />}
                        {line}
                      </React.Fragment>
                    ))}
                  </p>
                  {/* The accessible name must contain the visible text
                      (WCAG 2.5.3 label-in-name), so instead of an aria-label
                      that replaces it, append screen-reader-only context. */}
                  <span className="sr-only">(opens in Google Maps)</span>
                </div>
              </a>
            ))}

            <div className="flex gap-3 pt-4">
              {socialLinks.map(({ href, label }) => {
                const Icon = socialIconByLabel[label] ?? FiLink2
                return (
                  <a
                    key={`${label}-${href}`}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="bg-orange-500 p-2 rounded-full hover:bg-orange-600 transition-colors"
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-12 py-6 px-4 border-t border-gray-800 text-center text-[18px] font-[500] w-full aria-font">
        <p>
          © {currentYear} All Rights Are Reserved by {siteConfig.name} a US 501c3 Non Profit
          {siteConfig.parentOrg && (
            <>
              {' | A project of '}
              <Link
                href={siteConfig.parentOrg.url}
                className="underline text-[#2EA3F2] hover:text-[#2EA3F2] transition-colors"
              >
                {siteConfig.parentOrg.name}
              </Link>
            </>
          )}
        </p>
      </div>
    </footer>
  )
}

export default Footer
