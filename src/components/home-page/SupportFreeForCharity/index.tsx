import React, { CSSProperties, IframeHTMLAttributes } from 'react'
import Image from 'next/image'
import { assetPath } from '@/lib/assetPath'
import PendingNote from '@/components/ui/PendingNote'
import {
  donateHref,
  donationEmbedUrl,
  isPending,
  isSupportingOrgSite,
  siteConfig,
} from '@/lib/site.config'

interface ExtendedIframeProps extends IframeHTMLAttributes<HTMLIFrameElement> {
  allowpaymentrequest?: string
  allowtransparency?: string
}

const Index = () => {
  const donationFormStyle: CSSProperties = {
    position: 'absolute',
    border: '0',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: '100%',
    height: '100%',
  }

  // Only the supporting organization's own site embeds its (endowment) form;
  // a charity's site links to its own donation page, else emails the charity.
  const embedUrl = donationEmbedUrl()
  const donateLink = donateHref()
  // The email fallback needs an address to write to: with no donation URL and
  // no contact email (e.g. both pending) there is no link to offer at all.
  const hasDonateLink = /^https:/i.test(donateLink) || siteConfig.contactEmail.trim() !== ''
  const donationPending = isPending('donationUrl')
  const donationFormProps: ExtendedIframeProps = {
    title: 'Donation form powered by Zeffy',
    style: donationFormStyle,
    src: embedUrl ?? undefined,
    loading: 'lazy',
    allowpaymentrequest: '',
    allowtransparency: 'true',
  }

  return (
    <div id="donate">
      <div className="w-[90%] mx-auto py-[27px] mb-[60px] px-[20px] max-w-[1280px]">
        <h2 className="font-[400] text-[40px] lg:text-[48px] leading-[100%] tracking-[0] text-center mx-auto mb-[60px] faustina-font">
          Support {siteConfig.name}
        </h2>

        <div className="flex items-center flex-col lg:flex-row gap-[40px] lg:gap-[20px]">
          {/* Left side: Description and pointing hands image */}
          <div className="flex flex-col w-full lg:w-[50%]">
            <p className="mb-[20px] font-[400] text-[25px] leading-[150%] tracking-[0] text-center lg:text-left lato-font">
              {isSupportingOrgSite()
                ? 'By donating you help drive our mission and allow us to support more charities with our Domain, Website, and other services.'
                : `By donating you help drive ${siteConfig.name}'s mission.`}
            </p>
            {/* Pointing hands image - flipped horizontally to point toward the form on the right */}
            <div className="w-full flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[400px] aspect-[578/386]">
                <Image
                  src={assetPath('/Images/support-free-for-charity.webp')}
                  alt="support free for charity image"
                  fill
                  className="object-contain scale-x-[-1]"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Right side: the supporter's embedded Zeffy form, or a Donate link */}
          <div className="w-full lg:w-[50%] flex flex-col items-center gap-[16px]">
            {embedUrl ? (
              <div
                className="relative w-full max-w-[500px] h-[600px] bg-white rounded-lg shadow-lg overflow-hidden"
                role="region"
                aria-label="Donation form"
              >
                {/* CSS-only loading placeholder; the transparent Zeffy iframe
                    paints over it once the form loads. Purely decorative. */}
                <div
                  className="absolute inset-0 animate-pulse bg-gray-100 pointer-events-none motion-reduce:animate-none"
                  aria-hidden="true"
                />
                <iframe {...donationFormProps}></iframe>
              </div>
            ) : (
              hasDonateLink && (
                <a
                  href={donateLink}
                  {...(/^https:/i.test(donateLink)
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                  className="rounded-[27px] flex items-center justify-center px-[32px] py-[18px] text-white bg-[#2A6682] text-[20px] font-[400] lato-font"
                >
                  Donate to {siteConfig.name}
                </a>
              )
            )}
            {/* The charity's donation page is still to come: say so, as plain
                text, next to the email fallback (see PendingField). */}
            {!embedUrl && donationPending && (
              <PendingNote className="text-center text-[18px] text-gray-700 lato-font" />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Index
