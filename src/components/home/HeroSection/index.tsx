import React from 'react'
import Image from 'next/image'
import { assetPath } from '@/lib/assetPath'

const Hero: React.FC = () => {
  return (
    <div className="hero min-h-screen flex items-center px-4 sm:px-6 md:px-10">
      <div className="w-full max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between pt-[50px]">
        {/* Left Text Section */}
        <div className="w-full md:w-[40%] text-center md:text-left mt-8 md:mt-0">
          <h1 className="font-semibold text-[#f27022] text-[40px] leading-[50px] sm:text-[50px] sm:leading-[65px] md:text-[60px] md:leading-[78px]">
            Welcome to Free For Charity
          </h1>
          <p
            id="lato-font"
            className="font-medium text-black text-[20px] leading-[30px] sm:text-[28px] sm:leading-[40px] md:text-[35px] md:leading-[49px] mt-4"
          >
            Connecting Students, Professionals, & Businesses with Charities in Need
          </p>
        </div>

        {/* Right Image Section */}
        <div className="w-full md:w-[60%] flex items-center justify-center md:justify-end pt-[50px] md:pt-[50px]">
          <Image
            src={assetPath('/Images/hero-image.webp')}
            alt="Hero"
            width={800}
            height={540}
            className="w-full max-w-[90%] h-auto max-h-[540px]"
            priority
          />
        </div>
      </div>
    </div>
  )
}

export default Hero
