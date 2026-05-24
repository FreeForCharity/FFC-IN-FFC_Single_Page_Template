'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useReducedMotion } from 'framer-motion'
import { assetPath } from '@/lib/assetPath'

export default function TestimonialSlider() {
  const prefersReducedMotion = useReducedMotion()
  const testimonials = [
    {
      name: 'Name',
      text: '“Thanks to Free For Charity, our organization now has a professional online presence, which has significantly increased our visibility and donor engagement.”',
      rating: 5,
    },
    {
      name: 'Name',
      text: '“The free domain and email setup provided by Free For Charity have been invaluable in helping us streamline our communications and expand our reach.”',
      rating: 5,
    },
    {
      name: 'Name',
      text: '“We are grateful for the support from Free For Charity. Their services have allowed us to focus more on our core mission and less on administrative tasks.”',
      rating: 5,
    },
  ]

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  // Auto-scroll behavior. Disabled entirely when the user prefers reduced
  // motion (WCAG 2.3.3) — slides only change when they tap a pagination
  // dot. Also disabled while a pointer hovers the slider (existing behavior).
  useEffect(() => {
    if (isPaused || prefersReducedMotion) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 4000) // Change slide every 4 seconds

    return () => clearInterval(interval)
  }, [isPaused, prefersReducedMotion, testimonials.length])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <>
      <div className="py-[30px]">
        <h1
          className="font-[400] text-[40px] lg:text-[48px]  tracking-[0] text-center mx-auto mb-[50px]"
          id="faustina-font"
        >
          Voices of Gratitude
        </h1>
        <div className="bg-[#2A6682] ">
          <div className="w-[90%] mx-auto">
            <div className="w-full mx-auto lg:p-8">
              <div
                className="relative overflow-hidden"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                {/* Slider Container */}
                <div
                  className="flex transition-transform duration-700 ease-in-out"
                  style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                  {testimonials.map((testimonial, index) => (
                    <div key={index} className="w-full flex-shrink-0 px-4">
                      <div
                        className={`lg:p-8 text-white transition-all duration-500 ${
                          index === currentIndex ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                        }`}
                        style={{ minHeight: '200px' }}
                      >
                        <p className="text-center font-[400] text-[28px] mb-3" id="fauna-font">
                          {testimonial.name}
                        </p>
                        <div className="flex justify-center mb-3">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Image
                              key={i}
                              src={assetPath('/Svgs/start-icon.svg')}
                              width={29}
                              height={29}
                              alt="start icon"
                              className="mx-[5px]"
                              loading="lazy"
                            ></Image>
                          ))}
                        </div>

                        <p className="text-center text-[21px] font-[400]" id="fauna-font">
                          {testimonial.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination Dots */}
                <div className="flex justify-center space-x-2 py-1">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`transition-all duration-300 rounded-full ${
                        index === currentIndex
                          ? 'w-3 h-3 bg-[#D9D9D9] scale-150'
                          : 'w-3 h-3 bg-white bg-opacity-50 hover:bg-opacity-75'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <style jsx>{`
              .scale-0 {
                transform: scale(0.95);
                opacity: 0;
              }
            `}</style>
          </div>
        </div>
      </div>
    </>
  )
}
