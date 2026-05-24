'use client'
import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { assetPath } from '@/lib/assetPath'

interface Step {
  number: number
  title: string
  description: string
  linkText: string
  innerbg: string
  outerbg: string
  linkUrl: string
}

const StepCard: React.FC<{ step: Step }> = ({ step }) => {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.disconnect()
          }
        })
      },
      { threshold: 0.3 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`${step.outerbg} rounded-[10px] overflow-hidden shadow-[0px_2px_18px_0px_rgba(0,0,0,0.3)] px-[20px] py-[30px]`}
    >
      <div
        className={`${step.innerbg} text-black text-center`}
        style={{ fontFamily: 'Raleway, sans-serif' }}
      >
        <div className="flex justify-center mb-[30px]">
          <div className="relative w-[100px] h-[100px]">
            <Image
              src={assetPath(`/Images/${step.number}.webp`)}
              alt={`Step ${step.number}`}
              fill
              className={`object-contain drop-shadow-lg transition-all duration-700 ${
                isVisible ? 'animate-fadeTop' : 'opacity-0 translate-y-6'
              }`}
            />
          </div>
        </div>

        <h4 className="text-[31px] font-bold leading-[31px] pb-[10px]" id="cantata-font">
          {step.title}
        </h4>

        <p className="text-[25px] font-bold leading-[33px] pb-[1em]" id="raleway-font">
          {step.description}
        </p>

        <a
          href={step.linkUrl}
          className="text-[30px] font-bold text-white leading-[33px]"
          id="raleway-font"
        >
          {step.linkText}
        </a>
      </div>
    </div>
  )
}

export default StepCard
