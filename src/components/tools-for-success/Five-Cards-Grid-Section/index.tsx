'use client'

import React from 'react'
import EducationalSitesCard from '@/components/ui/EducationalSitesCard'
import { motion, Variants } from 'framer-motion'
import { assetPath } from '@/lib/assetPath'

const cardVariants: Variants = {
  offscreen: { opacity: 0, scale: 0.8 },
  onscreen: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', bounce: 0.3, duration: 0.6 },
  },
}

const index = () => {
  const firstGrid = [
    {
      imageSrc: assetPath('/Images/upwork.webp'),
      title: 'ittybiz.com Great site for ultra small business info',
      link: 'http://ittybiz.com/about/',
    },
    {
      imageSrc: assetPath('/Images/upwork.webp'),
      title: 'earn1k.com Program for earning your for $1000 on the side by Ramit',
      link: 'http://earn1k.com/',
    },
    {
      imageSrc: assetPath('/Images/upwork.webp'),
      title: 'appsumo.com Another program for earning your first money online',
      link: 'https://appsumo.com/courses-learning/',
    },
  ]

  const secondGrid = [
    {
      imageSrc: assetPath('/Images/upwork.webp'),
      title: '100startup.com First book on starting a business',
      link: 'https://100startup.com/',
    },
    {
      imageSrc: assetPath('/Images/upwork.webp'),
      title: 'theleanstartup.com The next step up book on starting a business',
      link: 'http://theleanstartup.com/',
    },
  ]

  return (
    <div className="bg-[linear-gradient(180deg,rgba(232,141,51,0.5)_0%,rgba(44,96,118,0.89)_100%),url('https://staging.freeforcharity.org/wp-content/uploads/2021/07/pexels-serpstat-572056.jpg'))] bg-cover bg-center pt-[67px] pb-[67px]">
      <div className="py-[27px] w-[80%] mx-auto">
        <h1 className="text-center pb-[10px] tracking-[1px] mb-[11px] text-[30px] md:text-[40px] text-[#333] font-[700] leading-[44px]">
          Educational Sites for Starting a Business
        </h1>
        <div className="w-[18%] mx-auto h-[5px] bg-[#E88D33]"></div>
      </div>

      {/* First Grid */}
      <div className="py-[27px] w-[90%] lg:w-[80%] mx-auto max-w-[1080px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[20px] lg:gap-[60px] items-start">
        {firstGrid.map((card, idx) => (
          <motion.div
            key={idx}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.3 }}
            variants={cardVariants}
          >
            <EducationalSitesCard {...card} />
          </motion.div>
        ))}
      </div>

      {/* Second Grid */}
      <div className="py-[27px] w-[90%] md:w-[70%] lg:w-[50%] mx-auto max-w-[1080px] grid grid-cols-1 sm:grid-cols-2 gap-[20px] lg:gap-[60px] items-start">
        {secondGrid.map((card, idx) => (
          <motion.div
            key={idx}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.3 }}
            variants={cardVariants}
          >
            <EducationalSitesCard {...card} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default index
