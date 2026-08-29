'use client'

import React from 'react'
import AnimatedNumber from '@/components/ui/AnimatedNumber'

interface ResultCardProps {
  title: string
  description: string
}

const ResultCard: React.FC<ResultCardProps> = ({ title, description }) => {
  const numericValue = /^\d+$/.test(title) ? parseInt(title, 10) : NaN

  return (
    <div className="w-full h-[300px] px-[20px] flex items-center justify-center flex-col border-[5px] border-[#F58629] rounded-[20px] shadow-[0px_16px_16px_0px_#11253E0F]">
      <h3 className="text-[64px] font-[400] faustina-font">
        {!isNaN(numericValue) ? <AnimatedNumber value={numericValue} /> : title}
      </h3>
      <p className="text-center text-[25px] font-[400] lato-font">{description}</p>
    </div>
  )
}

export default ResultCard
