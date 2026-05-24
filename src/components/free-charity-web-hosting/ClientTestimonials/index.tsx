'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { assetPath } from '@/lib/assetPath'

const testimonials = [
  {
    id: 1,
    text: 'Chris Rae has been a mentor for the Buena High School robotics team for the three years I have been involved with the team. His service to the team continues to be vital to the growth of the team. He uses his knowledge and expertise to teach our young programmers what they need to be successful in our program and beyond. His work with Free for Charity has also benefited the team in many ways, including the donation of several computers to the team. I rely on his knowledge of non-profit organizations and the community as well as his technical ability constantly',
    author: 'Nathan Bogardt',
    role: 'Head Coach, FRC Team 1726',
  },
  {
    id: 2,
    text: 'When the Grafton Historical Society started in 2016, we needed a web presence. But as a new non-profit organization, we did not have any funds. As we searched for non-profit support services, we found Free for Charity. Free for Charity was able to provide and setup our domain and web site builder at no cost for us. The sign-up process was easy and I was able to create and publish our site right away. When I needed help, the Free for Charity team was always there to assist me. A year later, we still rely on Free for Charity and we use the funds we save towards the preservation of history for Grafton, Wisconsin.',
    author: 'John Bernd',
    role: 'Board Member, Grafton Historical Society',
  },
]

export default function TestimonialSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [transitioning, setTransitioning] = useState(false)

  const startTransition = useCallback((getNextIndex: (prev: number) => number) => {
    setTransitioning(true)
    setTimeout(() => {
      setCurrentIndex(getNextIndex)
      setTimeout(() => setTransitioning(false), 300)
    }, 300)
  }, [])

  const handleNext = useCallback(() => {
    startTransition((prev) => (prev + 1) % testimonials.length)
  }, [startTransition])

  const handlePrev = useCallback(() => {
    startTransition((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }, [startTransition])

  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => handleNext(), 5000)
      return () => clearInterval(interval)
    }
  }, [isHovered, handleNext])

  return (
    <div className="py-16 bg-white">
      <div className="w-[90%] md:w-[85%] max-w-[1300px] mx-auto text-center">
        <h1
          className="mt-[2px] mb-[42px] pb-[10px] text-[31px] font-[700] leading-[31px] text-[#0d7ff8] text-center"
          id="cantata-font"
        >
          Client Testimonials
        </h1>

        <div
          className="relative mx-auto rounded-[10px] overflow-hidden shadow-xl px-[20px] lg:px-[78px]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-bottom"
            style={{
              backgroundImage: `url('${assetPath('/Images/client-section-bg-image.webp')}')`,
            }}
          ></div>

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/1"></div>

          {/* Fade-to-white overlay during transition */}
          <div
            className={`absolute inset-0 bg-white transition-opacity duration-500 pointer-events-none ${
              transitioning ? 'opacity-70' : 'opacity-0'
            }`}
          ></div>

          {/* Testimonial Content */}
          <div className="relative z-20 text-white pt-[35px] pb-[53px] lg:px-[91px]">
            <div className="relative h-[auto] min-h-[520px] sm:min-h-[350] md:min-h-[300px] lg:min-h-[240px] flex items-center justify-center">
              {testimonials.map((testimonial, idx) => (
                <div
                  key={testimonial.id}
                  className={`absolute inset-0 transition-all duration-700 ease-in-out flex flex-col items-center justify-center ${
                    idx === currentIndex
                      ? 'opacity-100 translate-y-0 delay-200'
                      : 'opacity-0 translate-y-6'
                  }`}
                >
                  <p
                    className="text-[16px] leading-[25px] sm:text-[17px] sm:leading-[27px] font-[400] w-full"
                    id="raleway-font"
                  >
                    {testimonial.text}
                  </p>

                  <div className="mt-5">
                    <h4
                      className="text-[22px] leading-[22px] font-[500] pb-[10px]"
                      id="raleway-font"
                    >
                      {testimonial.author}
                    </h4>
                    <p
                      className="text-[14px] font-[500] leading-[14px] text-[#fff]"
                      id="raleway-font"
                    >
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Dots Pagination */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-30">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => startTransition(() => idx)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    idx === currentIndex ? 'bg-white' : 'bg-white/40'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Navigation Icons */}
          <button
            onClick={handlePrev}
            className={`cursor-pointer absolute left-4 top-1/2 -translate-y-1/2 z-30 transition-all duration-300 text-white ${
              isHovered ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
            }`}
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-10 h-10" />
          </button>

          <button
            onClick={handleNext}
            className={`cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 z-30 transition-all duration-300 text-white ${
              isHovered ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
            }`}
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-10 h-10" />
          </button>
        </div>
      </div>
    </div>
  )
}
