'use client'

import React from 'react'
import Link from 'next/link'
import { Mail, Phone, MapPin, ArrowRight, Link2 } from 'lucide-react'

import { FaFacebookF, FaLinkedinIn, FaGithub } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import type { IconType } from 'react-icons'
import type { LucideIcon } from 'lucide-react'

import { siteConfig } from '@/lib/site.config'
import { assetPath } from '@/lib/assetPath'

// Maps a social link's label (as defined in siteConfig.social) to an icon.
// Unknown labels fall back to a generic link icon (Link2 from lucide-react)
// so a charity that adds a new social network — Bluesky, Mastodon, YouTube,
// etc. — gets a sensible placeholder instead of a misleading GitHub mark.
const socialIconByLabel: Record<string, IconType | LucideIcon> = {
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
          <h3 className="text-[28px] text-white">Endorsements</h3>

          <div className="space-y-4">
            <a
              href="https://www.guidestar.org/profile/46-2471893"
              aria-label={`View ${siteConfig.name} GuideStar Profile`}
            >
              <img
                src={assetPath('/Svgs/footerImage.svg')}
                alt="GuideStar Platinum Seal of Transparency"
              />
            </a>
            <Link
              href="https://www.guidestar.org/profile/shared/bbbe173a-87b9-4af9-a8a2-cae255a95742"
              className="group relative my-4 flex w-full max-w-[230px] items-center justify-between
                border-2 border-[#2ea3f2] bg-black px-5 py-2.5 text-[#2ea3f2]
                transition-all duration-300 hover:border-transparent"
              id="aria-font"
            >
              <span className="text-[17px] font-medium leading-tight sm:text-[18px] md:text-[20px] transition-transform duration-300 group-hover:-translate-x-1">
                Direct GuideStar Profile Link
              </span>

              <ArrowRight
                className="h-8 w-8 translate-x-2 opacity-0 text-[#2ea3f2] transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                strokeWidth={2}
              />
            </Link>

            <p>
              <span className="font-[500] text-[22px]">Free For Charity EIN: 46-2471893</span>
            </p>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="space-y-6 px-4 sm:px-0">
          <h3 className="text-[28px] text-white">Quick Links</h3>

          <ul className="space-y-2 text-sm" id="lato-font">
            {[
              { name: 'Home', href: '/#hero' },
              { name: 'Mission', href: '/#mission' },
              { name: 'Programs', href: '/#programs' },
              { name: 'Events', href: '/#events' },
              { name: 'Donate', href: '/#donate' },
              { name: 'Volunteer', href: '/#volunteer' },
              { name: 'FAQ', href: '/#faq' },
              { name: 'Team', href: '/#team' },
              {
                name: 'Supported Charity Login',
                href: 'https://freeforcharity.org/hub/',
              },
            ].map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  className="hover:text-[#F58C23] hover:tracking-widest transition-all text-[16px] font-[500]"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="space-y-3">
            <h4 className="text-[28px] text-white">Free For Charity Policy</h4>
            <ul className="space-y-1 text-sm" id="lato-font">
              {[
                {
                  name: 'Free For Charity Donation Policy',
                  href: '/free-for-charity-donation-policy',
                },
                {
                  name: 'Donation Policy',
                  href: '/donation-policy',
                },
                {
                  name: 'Free For Charity Privacy Policy',
                  href: '/privacy-policy',
                },
                {
                  name: 'Free For Charity Cookie Policy',
                  href: '/cookie-policy',
                },
                {
                  name: 'Free For Charity Terms of Service',
                  href: '/terms-of-service',
                },
                {
                  name: 'Free For Charity Vulnerability Disclosure Policy',
                  href: '/vulnerability-disclosure-policy',
                },
                {
                  name: 'Free For Charity Security Acknowledgement',
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
          </div>
        </div>

        {/* Column 3: Contact Us */}
        <div className="space-y-6 px-4 sm:px-0">
          <h3 className="text-[28px] text-white">Contact Us</h3>

          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <Mail className="w-10 h-10 text-orange-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-[500] text-[22px]">E-mail</p>
                <a
                  href={`mailto:${siteConfig.contactEmail}`}
                  className="font-[500] text-[15px] hover:text-cyan-400 transition-colors break-all"
                  id="aria-font"
                >
                  {siteConfig.contactEmail}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-10 h-10 text-orange-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-[500] text-[22px]">Call Us Today</p>
                <a
                  href="tel:5202228104"
                  className="font-[500] text-[16px] hover:text-cyan-400 transition-colors"
                  id="aria-font"
                >
                  (520) 222-8104
                </a>
              </div>
            </div>

            <a
              href="https://www.google.com/maps/search/?api=1&query=4030+Wake+Forrest+Road+Suite+349+Raleigh+NC+27609"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open main address in Google Maps"
              className="flex items-start gap-3 hover:opacity-80 transition-opacity"
            >
              <MapPin className="w-10 h-10 text-orange-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-[500] text-[22px]">Main Address</p>
                <p className="font-[500] text-[16px]" id="aria-font">
                  4030 Wake Forrest Road
                  <br />
                  Suite 349 Raleigh North
                  <br />
                  Carolina 27609
                </p>
              </div>
            </a>

            <a
              href="https://www.google.com/maps/place/Free+For+Charity/@40.7768455,-77.8963305,17z/data=!3m1!4b1!4m6!3m5!1s0x89cea944b44a2e01:0x6fc2d6bf09e00a0f!8m2!3d40.7768415!4d-77.8937556!16s%2Fg%2F11vzvbl2d7?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open PA office address in Google Maps"
              className="flex items-start gap-3 hover:opacity-80 transition-opacity"
            >
              <MapPin className="w-10 h-10 text-orange-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-[500] text-[22px]">PA Office Address</p>
                <p className="font-[500] text-[16px]" id="aria-font">
                  301 Science Park Road Suite
                  <br />
                  119 State College PA 16803
                </p>
              </div>
            </a>

            <div className="flex gap-3 pt-4">
              {socialLinks.map(({ href, label }) => {
                const Icon = socialIconByLabel[label] ?? Link2
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
      <div
        className="mt-12 py-6 px-4 border-t border-gray-800 text-center text-[18px] font-[500] w-full"
        id="aria-font"
      >
        <p>
          © {currentYear} All Rights Are Reserved by {siteConfig.name} a US 501c3 Non Profit | A
          project of{' '}
          <Link
            href="https://freeforcharity.org"
            className="underline text-[#2EA3F2] hover:text-[#2EA3F2] transition-colors"
          >
            https://freeforcharity.org
          </Link>
        </p>
      </div>
    </footer>
  )
}

export default Footer
