import React from 'react'
import Image from 'next/image'
import { assetPath } from '@/lib/assetPath'

const Index = () => {
  return (
    <div>
      <section className="py-[54px] w-[90%] md:w-[80%] mx-auto">
        <h1
          className="pt-[27px] mb-[10px] text-[32px] sm:text-[40px] md:text-[50px] text-[#111111] text-center font-[500] leading-[42px] sm:leading-[50px] md:leading-[60px] pb-[37px]"
          id="cinzel"
        >
          Our Mission: Empowering Charities
        </h1>

        <div className="flex flex-col-reverse md:flex-row items-center md:items-stretch mt-[40px] gap-[30px] md:gap-0">
          {/* Left Column (Text) */}
          <div className="w-full md:w-[47.25%] md:mr-[60px]">
            <p
              className="text-[15px] sm:text-[16px] text-[#000000a3] font-[500] leading-[26px] sm:leading-[28px] text-center md:text-left"
              id="fauna-font"
            >
              The Free For Charity Domain Program is dedicated to providing essential digital tools
              to charities at no cost. By offering free domain names and setting up Microsoft 365
              accounts, we help charities establish their online presence and streamline
              communication. Our mission is to ensure that every charity can focus on their cause
              without the burden of digital infrastructure costs. Through this program, we aim to
              empower charities to reach wider audiences and amplify their impact.
            </p>
          </div>

          {/* Right Column (Image) */}
          <div className="w-full md:w-[47.25%] h-[300px] sm:h-[400px] md:h-[500px]">
            <div className="relative w-full h-full">
              <Image
                src={assetPath('/Images/our-mission.webp')}
                alt="Our Mission"
                fill
                className="object-cover rounded-[6px]"
                priority
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Index
