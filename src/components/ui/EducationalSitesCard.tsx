'use client' // if using Next 13+ App Router

import React from 'react'
import Image from 'next/image'
import { IoIosArrowForward } from 'react-icons/io'
import { assetPath } from '@/lib/assetPath'

interface EducationalSitesCardProps {
  imageSrc?: string
  title?: string
  link?: string
}

const EducationalSitesCard: React.FC<EducationalSitesCardProps> = ({
  imageSrc = assetPath('/Images/free-for-charity.webp'),
  title = 'ittybiz.com Great site for ultra small business info',
  link = 'https://iwillteachyoutoberich.com',
}) => {
  return (
    <div className="bg-[rgba(255,255,255,0.82)] rounded-[20px] overflow-hidden pt-[30px] pr-[20px] pb-[30px] pl-[20px] shadow-[0px_2px_18px_0px_rgba(0,0,0,0.3)]">
      <div className="mb-[25px] flex flex-col items-center">
        <div className="relative w-[200px] h-[105px] mb-[30px]">
          <Image src={imageSrc} alt={title} fill className="object-contain" />
        </div>

        <h4 className="text-[22px] font-[700] leading-[29px] text-[#333] text-center pb-[10px]">
          {title}
        </h4>
      </div>

      <div className="mt-[25px] flex flex-col items-center">
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="
            relative group inline-flex items-center justify-center gap-2
            px-[30px] py-[6px]
            text-white border border-[#2583ab] rounded-[10px]
            text-[18px] bg-[#2583ab]
            transition-all duration-300 ease-in-out
            shadow-md leading-[31px] font-[600]
            hover:shadow-[0px_12px_18px_-6px_#f27022] w-fit
          "
          id="montserrat-font"
        >
          <span className="transition-all duration-300 group-hover:translate-x-1">Check Here!</span>
          <IoIosArrowForward
            className="
              opacity-0 translate-x-[-8px]
              group-hover:opacity-100 group-hover:translate-x-0
              transition-all duration-300 ease-in-out
              w-[20px] h-[20px]
            "
          />
        </a>
      </div>
    </div>
  )
}

export default EducationalSitesCard
