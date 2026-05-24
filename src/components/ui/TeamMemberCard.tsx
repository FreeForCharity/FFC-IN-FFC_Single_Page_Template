'use client'

import React from 'react'
import Image from 'next/image'
import { assetPath } from '@/lib/assetPath'

interface TeamMemberCardProps {
  imageUrl: string
  name: string
  title: string
  linkedinUrl: string
}

export default function TeamMemberCard({
  imageUrl,
  name,
  title,
  linkedinUrl,
}: TeamMemberCardProps) {
  return (
    <>
      <div className="flex flex-col items-center max-w-[388px] w-full mx-auto">
        {/* Circular Image Container */}
        <div className="relative w-[300px] h-[300px] mb-6 rounded-full overflow-hidden ring-4 ring-white shadow-xl">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 192px"
            loading="lazy"
          />
        </div>

        {/* Text Content */}
        <div className="text-center space-y-2">
          <h3 className="text-[32px] font-[400]" id="lato-font">
            {name}
          </h3>
          <p className="text-[25px] font-[400]" id="lato-font">
            {title}
          </p>
        </div>

        {/* LinkedIn Button */}
        <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="mt-6">
          <Image
            src={assetPath('/Svgs/linkedin-icon.svg')}
            width={63}
            height={63}
            alt="linkedin icon"
            loading="lazy"
          ></Image>
        </a>
      </div>

      {/* Optional: Add global styles if needed */}
      <style jsx global>{`
        .ring-4 {
          box-shadow: 0 0 0 4px white;
        }
      `}</style>
    </>
  )
}
