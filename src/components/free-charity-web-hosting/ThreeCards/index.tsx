'use client'

import React from 'react'
import Image from 'next/image'
import { assetPath } from '@/lib/assetPath'

const DonateSection: React.FC = () => {
  return (
    <div className="py-[40px]">
      <div className="pt-[27px] w-[90%] lg:w-[80%] mx-auto flex flex-col md:flex-row gap-[32px]">
        {/* Donate Now Card */}
        <div className="w-full bg-[#0d7ff8] rounded-[10px] overflow-hidden pt-[30px] pr-[20px] pb-[30px] pl-[20px] shadow-[0px_2px_18px_0px_rgba(0,0,0,0.3)] flex flex-col items-center">
          <div className="mb-[30px] w-full relative h-[128px]">
            <Image
              src={assetPath('/Images/donate-now.webp')}
              alt="Donate Now"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1
            className="text-[31px] leading-[31px] font-bold text-white text-center"
            id="cantata-font"
          >
            <a href="/donate">Donate Now</a>
          </h1>
        </div>

        {/* Help Us Card */}
        <div className="w-full rounded-[10px] overflow-hidden pt-[30px] pr-[20px] pb-[30px] pl-[20px] shadow-[0px_2px_18px_0px_rgba(0,0,0,0.3)] flex flex-col items-center">
          <h1
            className="text-[31px] leading-[31px] font-bold text-[#0d7ff8] text-center pb-[10px]"
            id="cantata-font"
          >
            Help us in our cause
          </h1>
          <p className="text-[18px] leading-[32px] font-medium text-center" id="raleway-font">
            If you don’t need a domain name today but want to support us please share this page or
            donate directly so we can provide more and more services to non-profits
          </p>
        </div>

        {/* Volunteer Card */}
        <div className="w-full bg-[#0d7ff8] rounded-[10px] overflow-hidden pt-[30px] pr-[20px] pb-[30px] pl-[20px] shadow-[0px_2px_18px_0px_rgba(0,0,0,0.3)] flex flex-col items-center">
          <div className="mb-[30px] w-full relative h-[128px]">
            <Image
              src={assetPath('/Images/Be-a-volunteer.webp')}
              alt="Be a Volunteer"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1
            className="text-[31px] leading-[31px] font-bold text-white text-center"
            id="cantata-font"
          >
            <a href="/volunteer">Be a Volunteer</a>
          </h1>
        </div>
      </div>
    </div>
  )
}

export default DonateSection
