import React from 'react'
import Image from 'next/image'
import { assetPath } from '@/lib/assetPath'

const CharityHeroBackground = () => {
  return (
    <div id="hero" className="relative w-full pb-[100px] overflow-hidden">
      {/* 1. Base Blue Layer */}
      <div className="absolute inset-0 bg-[#2E6F8E]" />
      {/* 2. ULTRA-THIN White Diagonal Strip - HALF HEIGHT */}
      <div
        className="absolute inset-0 bg-white"
        style={{
          clipPath: 'polygon(0% 108%, 100% 32%, 100% 35%, 0% 111%)',
        }}
      />

      {/* 3. Orange Bottom-Right Section - Starts exactly where white ends */}
      <div
        className="absolute inset-0 bg-[#F57C20]"
        style={{
          clipPath: 'polygon(0% 111%, 100% 35%, 100% 100%, 0% 100%)',
        }}
      />

      <div className="hero-container flex flex-col lg:flex-row gap-[40px] lg:gap-[0px] items-center justify-between relative z-10 text-white pt-[130px] w-[90%] mx-auto max-w-[1280px] lg:px-[20px]">
        <div className="w-full lg:w-[565px]">
          <h1
            className="text-[50px] lg:text-[60px] font-[500] text-[#FFFFFF] leading-[120%] mb-[20px]"
            id="faustina-font"
          >
            Welcome to <br /> Free For Charity
          </h1>
          <p
            className="text-[24px] font-[400] leading-[120%] text-[#FFFFFF] mb-[20px]"
            id="lato-font"
          >
            Connecting Students, Professionals, & Businesses with Charities in Need
          </p>
          <a
            href="#volunteer"
            className="top-[378px] w-[300px] lg:w-[351px] h-[54px] opacity-100 rounded-[27px] px-[32px] py-[18px] flex items-center justify-center gap-[10px] bg-[#FFFFFF] text-[#113563] text-[20px] font-[400] leading-[100%] mb-[10px] whitespace-nowrap"
            id="lato-font"
          >
            Volunteer
          </a>
          <div className="flex gap-[5px]">
            <a
              href="#donate"
              className="top-[442px] w-[130px] lg:w-[173px] h-[54px] opacity-100 rounded-[27px] px-[32px] py-[18px] flex items-center justify-center gap-[10px] bg-[#FFFFFF] text-[#113563] text-[20px] font-[400] leading-[100%] whitespace-nowrap"
              id="lato-font"
            >
              Donate
            </a>
            <a
              href="#programs"
              className="top-[442px] w-[173px] h-[54px] opacity-100 rounded-[27px] px-[32px] py-[18px] flex items-center justify-center gap-[10px] bg-[#FFFFFF] text-[#113563] text-[20px] font-[400] leading-[100%] whitespace-nowrap"
              id="lato-font"
            >
              Our Programs
            </a>
          </div>
        </div>

        {/* Fixed right side image section */}
        <div className="relative w-full max-w-[445px] aspect-square bg-white rounded-full p-12 flex items-center justify-center">
          <div className="relative w-full h-full">
            <Image
              src={assetPath('/Images/figma-hero-img.webp')}
              alt="Hero image"
              fill
              className="object-contain"
              priority
              sizes="(max-width: 1024px) 100vw, 445px"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CharityHeroBackground
