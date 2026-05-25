'use client'

import React from 'react'
import Image from 'next/image'
import { IoIosArrowForward } from 'react-icons/io'
import { motion, Variants } from 'framer-motion'
import { assetPath } from '@/lib/assetPath'

const cardVariants: Variants = {
  offscreen: { opacity: 0, scale: 0.8 },
  onscreen: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', bounce: 0.3, duration: 1 }, // slower duration
  },
}

const EducationalSitesSection = () => {
  const cards = [
    {
      title: 'iwillteachyoutoberich.com Best for automation and earning more',
      link: 'https://www.iwillteachyoutoberich.com/blog/',
      image: assetPath('/Images/googleLogo.webp'),
    },
    {
      title: 'fourhourworkweek.com Another prime automation book and website',
      link: 'https://tim.blog/overview/',
      image: assetPath('/Images/googleLogo.webp'),
    },
  ]

  return (
    <div className="py-[91px] bg-[linear-gradient(180deg,#0068b7_0%,rgba(44,96,118,0.75)_100%),url('https://staging.freeforcharity.org/wp-content/uploads/2021/07/pexels-cottonbro-4064840.jpg')] bg-[#0f82af] bg-cover bg-center bg-no-repeat">
      <div className="w-[80%] mx-auto flex flex-col items-center">
        {/* Heading */}
        <h2
          className="text-[40px] font-[700] text-white text-center leading-[44px] mb-4 [font-variant:small-caps] tracking-[1px]"
          id="lato-font"
        >
          Educational Sites for
          <span className="text-[#e88d33]"> Everyone</span>
        </h2>

        <div className="h-[5px] bg-[#e88d33] w-[195px] mx-auto mb-12"></div>

        {/* Cards Container */}
        <div className="flex flex-col md:flex-row gap-12 w-full justify-center">
          {cards.map((card, idx) => (
            <motion.div
              key={idx}
              className="w-full md:w-[46%] flex flex-col items-center text-center"
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, amount: 0.3 }}
              variants={cardVariants}
            >
              {/* Icon */}
              <div className="relative w-full h-[180px] mb-6">
                <Image src={card.image} alt="Automation" fill className="object-contain" />
              </div>

              {/* Text */}
              <div className="flex-1">
                <h3
                  className="text-[24px] font-[700] text-white leading-[31px] pb-[10px]"
                  id="faustina-font"
                >
                  {card.title}
                </h3>

                {/* Button */}
                <a
                  href={card.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    relative group inline-flex items-center justify-center gap-2
                    mt-[25px] px-[30px] py-[6px]
                    text-white border border-[#f27022] rounded-[10px]
                    text-[18px] bg-[#f27022]
                    transition-all duration-300 ease-in-out
                    shadow-md leading-[31px] font-[600]
                    hover:shadow-[0px_12px_18px_-6px_#f27022]
                  "
                  id="montserrat-font"
                >
                  <span className="transition-all duration-300 group-hover:translate-x-1">
                    Check Here!
                  </span>
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
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default EducationalSitesSection
