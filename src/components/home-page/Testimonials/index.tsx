'use client'

import React, { useState, useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay } from 'swiper/modules'
import type { Swiper as SwiperInstance } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos } from 'react-icons/md'
import Image from 'next/image'
import QuoteLeft from '../../../../public/Svgs/quote-left.svg'
import QuoteRight from '../../../../public/Svgs/quote-right.svg'
import { testimonials } from '@/data/testimonials'

// Testimonials are sourced from src/data/testimonials/*.json (aggregated in
// src/data/testimonials.ts). To change them, edit those JSON files — no need to
// touch this component.

const TestimonialSlider: React.FC = () => {
  const [swiperInstance, setSwiperInstance] = useState<SwiperInstance | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const prevRef = useRef<HTMLButtonElement>(null)
  const nextRef = useRef<HTMLButtonElement>(null)

  // Wire the external prev/next buttons to Swiper navigation. Done in
  // onBeforeInit (which receives Swiper's own instance) rather than mutating
  // the swiperInstance held in state — the latter trips the React Compiler
  // immutability rule and is the documented Swiper-for-React pattern for
  // custom navigation elements.
  const handleBeforeInit = (swiper: SwiperInstance) => {
    const nav = swiper.params.navigation
    if (nav && typeof nav !== 'boolean') {
      nav.prevEl = prevRef.current
      nav.nextEl = nextRef.current
    }
  }

  const handleSlideChange = (swiper: SwiperInstance) => {
    setActiveIndex(swiper.activeIndex)
  }

  const handleDotClick = (index: number) => {
    swiperInstance?.slideTo(index)
  }

  return (
    <section id="testimonials" className="py-16 pb-25 bg-[#FCFCFC]">
      <div className="container mx-auto px-4 max-w-[1150px] text-center">
        <h2 className="font-bold text-[#E16820] text-[40px] leading-[44px] mb-7">Testimonials</h2>

        {/* Carousel landmark so assistive tech announces this region and its
            role. aria-live is intentionally omitted: the carousel auto-rotates,
            and a live region on an auto-rotating carousel would announce every
            transition (ARIA APG guidance). The prev/next/dot controls already
            carry descriptive aria-labels. */}
        <div
          className="relative"
          role="region"
          aria-roledescription="carousel"
          aria-label="Testimonials"
        >
          <Swiper
            modules={[Navigation, Autoplay]}
            onSwiper={setSwiperInstance}
            onSlideChange={handleSlideChange}
            onBeforeInit={handleBeforeInit}
            navigation={{ enabled: true }}
            spaceBetween={30}
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
          >
            {testimonials.map((t, idx) => (
              <SwiperSlide key={idx}>
                <div className="px-12 md:px-20 relative">
                  {/* Left Quote */}
                  <div className="absolute left-[10px] md:left-[50px] top-0 opacity-20 w-6 md:w-9 h-6 md:h-9">
                    <Image src={QuoteLeft} alt="Opening quote" width={36} height={36} />
                  </div>

                  <h3 className="text-[22px] font-bold mb-[10px] text-[#333] leading-6 italic aria-font">
                    {t.heading}
                  </h3>
                  <p className="text-[17px] font-medium text-black italic px-0 sm:px-4 md:px-8 aria-font">
                    {t.text}
                  </p>

                  {t.name && (
                    <p className="text-[14px] font-medium my-2 text-[#666666] aria-font">
                      {t.name}
                    </p>
                  )}

                  {t.location &&
                    (t.locationUrl ? (
                      <a href={t.locationUrl}>
                        <p className="text-[14px] font-medium text-[#227AB5] aria-font">
                          {t.location}
                        </p>
                      </a>
                    ) : (
                      <p className="text-[14px] font-medium text-[#227AB5] aria-font">
                        {t.location}
                      </p>
                    ))}

                  {/* Right Quote */}
                  <div className="absolute right-[10px] md:right-[50px] bottom-0 opacity-20 w-6 md:w-9 h-6 md:h-9">
                    <Image src={QuoteRight} alt="Closing quote" width={36} height={36} />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Left Arrow */}
          <button
            type="button"
            ref={prevRef}
            disabled={activeIndex === 0}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            aria-label="Previous testimonial"
          >
            <MdOutlineArrowBackIos className="w-6 h-6" />
          </button>

          {/* Right Arrow */}
          <button
            type="button"
            ref={nextRef}
            disabled={activeIndex === testimonials.length - 1}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            aria-label="Next testimonial"
          >
            <MdOutlineArrowForwardIos className="w-6 h-6" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center mt-10 space-x-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleDotClick(i)}
              className="group flex h-6 min-w-[24px] cursor-pointer items-center justify-center"
              aria-label={`Go to testimonial ${i + 1}`}
            >
              <span
                className={`block h-2 rounded-full transition-all ${
                  activeIndex === i
                    ? 'w-8 bg-orange-600'
                    : 'w-2 bg-gray-300 group-hover:bg-gray-400'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TestimonialSlider
