import React, { CSSProperties, IframeHTMLAttributes } from 'react'
import Image from 'next/image'
import { assetPath } from '@/lib/assetPath'

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

  const donationFormProps: ExtendedIframeProps = {
    title: 'Donation form powered by Zeffy',
    style: donationFormStyle,
    src: 'https://www.zeffy.com/embed/donation-form/free-for-charity-endowment-fund',
    allowpaymentrequest: '',
    allowtransparency: 'true',
  }

  return (
    <div id="donate">
      <div className="w-[90%] mx-auto py-[27px] mb-[60px] px-[20px] max-w-[1280px]">
        <h1
          className="font-[400] text-[40px] lg:text-[48px] leading-[100%] tracking-[0] text-center mx-auto mb-[60px]"
          id="faustina-font"
        >
          Support Free For Charity
        </h1>

        <div className="flex items-center flex-col lg:flex-row gap-[40px] lg:gap-[20px]">
          {/* Left side: Description and pointing hands image */}
          <div className="flex flex-col w-full lg:w-[50%]">
            <p
              className="mb-[20px] font-[400] text-[25px] leading-[150%] tracking-[0] text-center lg:text-left"
              id="lato-font"
            >
              By donating you help drive our mission and allow us to support more charities with our
              Domain, Website, and other services.
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

          {/* Right side: Zeffy Donation Form */}
          <div className="w-full lg:w-[50%] flex justify-center">
            <div
              className="relative w-full max-w-[500px] h-[600px] bg-white rounded-lg shadow-lg overflow-hidden"
              role="region"
              aria-label="Donation form"
            >
              <iframe {...donationFormProps}></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Index
