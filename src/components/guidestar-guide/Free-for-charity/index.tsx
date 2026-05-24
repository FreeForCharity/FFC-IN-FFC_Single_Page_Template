import React from 'react'
import Image from 'next/image'
import { assetPath } from '@/lib/assetPath'

const Index = () => {
  return (
    <div className="w-full pt-[27px] pb-[54px] bg-[#FCFCFC]">
      <div className="w-full max-w-[90%] mx-auto">
        {/* Red Divider Line */}
        <div className="h-px bg-[#7EBEC5] w-full mb-10"></div>

        {/* GuideStar Instruction Text */}
        <p
          className="text-[14px] text-[#666] font-semibold leading-relaxed mb-8"
          id="aria-font"
          aria-describedby="GuideStar is required for onboarding verification"
        >
          GuideStar is the main tool for helping you gather the information to complete our
          onboarding form. Your goal should be to reach the highest level of completion (GuideStar
          Platinum). Get the highest level you can with the data you have. It takes roughly 2–3
          hours to fully reach Platinum the first time and then 30 minutes a year to keep it
          updated.{' '}
          <strong>
            To be supported by Free For Charity, we require organizations to be at least Gold
          </strong>{' '}
          and to upload info for your board and IRS Designation Documents. See the highlighted areas
          below.
        </p>

        {/* Responsive Image with Proper Dimensions */}
        <div className="relative w-full h-auto">
          <Image
            src={assetPath('/Images/free-for-charity.webp')}
            alt="Free For Charity GuideStar onboarding requirements and highlighted fields"
            width={780}
            height={100}
            className="w-[780px] h-auto object-cover"
          />
        </div>
      </div>
    </div>
  )
}

export default Index
