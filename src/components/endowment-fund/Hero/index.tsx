import React from 'react'
import Link from 'next/link'
import { assetPath } from '@/lib/assetPath'

const Index = () => {
  return (
    <div className="bg-[#003566]">
      <section className="min-h-screen pt-[160px] pb-[80px] w-[90%] md:w-[80%] mx-auto">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-[30px]">
          {/* Left Column: Heading */}
          <div className="text-center md:text-left md:mr-[35px]">
            <h1
              className="text-[42px] sm:text-[54px] md:text-[72px] font-[500] leading-[50px] sm:leading-[65px] md:leading-[83px] text-white"
              id="cinzel"
            >
              Empower Charities with Free Domains
            </h1>
          </div>

          {/* Right Column: Button */}
          <div className="flex justify-center md:justify-start items-center mt-[25px] md:mt-0">
            <Link
              href="/free-for-charity-endowment-fund"
              className="whitespace-nowrap px-[20px] sm:px-[24px] py-[10px] sm:py-[12px] hover:bg-gray-100 transition shadow-lg text-[#003566] !border-0 rounded-full text-[14px] font-[700] leading-[24px] bg-white"
              id="fauna-font"
            >
              Support the Endowment
            </Link>
          </div>
        </div>

        {/* Image Section */}
        <div className="flex justify-center md:justify-start pt-[50px] md:pt-[64px]">
          <img
            src={assetPath('/Images/hero-img.webp')}
            alt="Person signing donation agreement"
            className="w-full max-w-[512px] rounded-[6px] shadow-2xl object-cover"
          />
        </div>
      </section>
    </div>
  )
}

export default Index
