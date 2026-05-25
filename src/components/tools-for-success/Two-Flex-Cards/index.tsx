'use client'
import React, { useEffect, useRef } from 'react'
import Image from 'next/image'
import { IoIosArrowForward } from 'react-icons/io'
import { assetPath } from '@/lib/assetPath'

const Index = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const section = sectionRef.current
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            section?.classList.add('flip-once')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.3 }
    )
    if (section) observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="pt-[8px] pb-[54px]">
      <div
        ref={sectionRef}
        className="w-[90%] md:w-[80%] mx-auto max-w-[1080px] flex flex-col lg:flex-row items-stretch transition-transform duration-[1000ms] [transform-style:preserve-3d] gap-[40px] lg:gap-[0px]"
      >
        {/* Left Section */}
        <div className="w-[100%] lg:w-[47.25%] mr-[60px] rounded-[15px] shadow-[0px_2px_70px_-15px_rgba(0,0,0,0.3)] py-[40px] px-[20px] flex flex-col items-start">
          {/* Image */}
          <div className="relative w-full h-[260px] mb-[30px]">
            <Image
              src={assetPath('/Images/Volunteer-Card.webp')}
              alt="Placeholder Image"
              fill
              className="object-cover"
            />
          </div>

          {/* Text Content */}
          <div className="flex-1 text-left">
            <div className="flex mb-5">
              <div className="h-[3px] bg-[#e88d33] w-[18%]"></div>
            </div>

            <h3 className="text-[28px] text-[#333] font-[600] leading-[36px] pb-[10px]">
              Volunteer Match (Free basic account paid upgrades)
            </h3>

            <div className="text-[18px] leading-[24px] font-[500] text-[#666]" id="lato-font">
              The best volunteer sourcing tool. Links with linkedin.com, your website, and many
              other sources creating a job board for your charities needs. Create a profile and post
              offers for all your needs.
            </div>

            {/* Button */}
            <a
              href="volunteermatch.org"
              target="_blank"
              rel="noopener noreferrer"
              className="relative group inline-flex items-center justify-center gap-2 mt-[25px] px-[30px] py-[6px] text-white border border-[#f27022] rounded-[10px] text-[18px] bg-[#f27022] transition-all duration-300 ease-in-out shadow-md leading-[31px] font-[600] hover:shadow-[0px_12px_18px_-6px_#f27022]"
              id="montserrat-font"
            >
              <span className="transition-all duration-300 group-hover:translate-x-1">
                Get Started
              </span>
              <IoIosArrowForward className="opacity-0 translate-x-[-8px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-in-out w-[20px] h-[20px]" />
            </a>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-[100%] lg:w-[47.25%] rounded-[15px] shadow-[0px_2px_70px_-15px_rgba(0,0,0,0.3)] py-[40px] px-[20px] flex flex-col items-start">
          <div className="relative w-full h-[260px] mb-[30px]">
            <Image
              src={assetPath('/Images/Free-For-Charity-card.webp')}
              alt="Placeholder Image"
              fill
              className="object-cover"
            />
          </div>

          <div className="flex-1 text-left">
            <div className="flex mb-5">
              <div className="h-[3px] bg-[#e88d33] w-[18%]"></div>
            </div>

            <h3 className="text-[28px] font-[600] text-[#333] leading-[36px] pb-[10px]">
              FreeForCharity (No costs for anything we directly provide … really)
            </h3>

            <div className="text-[18px] leading-[24px] font-[500] text-[#666]" id="lato-font">
              My personal charity focused on bridging the gaps between the big players in the
              charity for charities section. Focus is on IT Project Management support and other
              business level support. Free For Charity leverages and simplifies the plethora of
              options each charity has to provide what is needed most by the individual
              organization.
            </div>

            <a
              href="https://staging.freeforcharity.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="relative group inline-flex items-center justify-center gap-2 mt-[25px] px-[30px] py-[6px] border border-[#f27022] rounded-[10px] text-[18px] bg-[#f27022] transition-all duration-300 ease-in-out text-white shadow-md leading-[31px] font-[600] hover:shadow-[0px_12px_18px_-6px_#f27022]"
              id="montserrat-font"
            >
              <span className="transition-all duration-300 group-hover:translate-x-1">
                Get Started
              </span>
              <IoIosArrowForward className="opacity-0 translate-x-[-8px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-in-out w-[20px] h-[20px]" />
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        .flip-once {
          animation: flipIn 1s ease-out forwards;
        }
        @keyframes flipIn {
          0% {
            transform: rotateY(90deg);
            opacity: 0;
          }
          100% {
            transform: rotateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}

export default Index
