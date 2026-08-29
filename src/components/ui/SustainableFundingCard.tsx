import Image from 'next/image'
import React from 'react'

interface SustainableFundingCardProps {
  imageUrl: string
  title: string
  text: string
}

export const SustainableFundingCard: React.FC<SustainableFundingCardProps> = ({
  imageUrl,
  title,
  text,
}) => {
  return (
    <div className="py-[30px] px-[16px] xl:w-[570px] rounded-[16px] overflow-hidden border-[3px] border-[#2A6682] h-full">
      {/* Image/Icon Section */}
      <div className="flex justify-center">
        <div className="relative w-[60px] h-[60px]">
          <Image src={imageUrl} alt={title} fill className="object-contain drop-shadow-md" />
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 text-center">
        <h3 className="text-[24px] lg:text-[28px] font-[400] text-[#000000] leading-[100%] mb-3 lato-font">
          {title}
        </h3>
        <p className="text-[16px] sm:text-[18px] font-[400] text-[#000000] leading-[140%] lato-font">
          {text}
        </p>
      </div>
    </div>
  )
}
