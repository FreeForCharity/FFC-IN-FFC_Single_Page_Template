'use client'

import React from 'react'
import Image from 'next/image'
import { assetPath } from '@/lib/assetPath'

const HeroSection = () => {
  return (
    <section className="relative pb-[49px] bg-[#4f6eff]">
      {/* Main Container */}
      <div className="relative w-[90%] md:w-[80%] max-w-[1080px] mx-auto flex flex-col md:flex-row items-center gap-[60px] py-[27px]">
        {/* Left Section - Text */}
        <div className="w-full md:w-[47%] mx-auto mb-8 md:mb-0 text-center">
          <h1
            className="mt-[48px] mb-[12px] text-white text-[31px] font-[700] leading-[37px] pb-[10px]"
            id="cantata-font"
          >
            Free For Charity <br /> Hosting
          </h1>
          <p className="text-white text-[18px] font-[600] leading-[29px]" id="raleway-font">
            FFC HOSTING IS THE FIRST US BASED 501C3 NONPROFIT ‘CHARITY FOR CHARITIES’ providing free
            domains and hosting services to other Non-Profit Organizations
          </p>
        </div>

        {/* Right Section - Hero Image */}
        <div className="w-full md:w-[47%] mx-auto">
          <div className="w-full md:w-[80%] mx-auto relative h-[400px] md:h-[272px] rounded-[15px] overflow-hidden shadow-[0px_2px_18px_0px_rgba(0,0,0,0.3)]">
            <Image
              src={assetPath('/Images/heart-in-hands.webp')}
              alt="hero image"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
      {/* Bottom SVG Overlay */}
      <div
        className="absolute bottom-0 w-full h-[100px] z-[1] bg-no-repeat"
        style={{
          backgroundImage:
            "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDBweCIgdmlld0JveD0iMCAwIDEyODAgMTQwIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxnIGZpbGw9IiNmZmZmZmYiPjxwYXRoIGQ9Ik0wIDkwLjcybDE0MC0yOC4yOCAzMTUuNTIgMjQuMTRMNzk2LjQ4IDY1LjggMTE0MCAxMDQuODlsMTQwLTE0LjE3VjBIMHY5MC43MnoiIGZpbGwtb3BhY2l0eT0iLjUiLz48cGF0aCBkPSJNMCAwdjQ3LjQ0TDE3MCAwbDYyNi40OCA5NC44OUwxMTEwIDg3LjExbDE3MC0zOS42N1YwSDB6Ii8+PC9nPjwvc3ZnPg==')",
          backgroundSize: '100% 100px',
          transform: 'scale(1, -1)',
        }}
      ></div>
    </section>
  )
}

export default HeroSection
