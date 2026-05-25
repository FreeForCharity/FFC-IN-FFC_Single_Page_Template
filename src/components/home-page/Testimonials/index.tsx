'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay } from 'swiper/modules'
import type { Swiper as SwiperInstance } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import { MdOutlineArrowBackIos, MdOutlineArrowForwardIos } from 'react-icons/md'
import Image from 'next/image'
import QuoteLeft from '../../../../public/Svgs/quote-left.svg'
import QuoteRight from '../../../../public/Svgs/quote-right.svg'

interface Testimonial {
  heading: string
  text: string
  name?: string
  location?: string
}

const testimonials: Testimonial[] = [
  {
    heading: 'American Legion Ahwatukee Post 64',
    text: 'Knowing that I can reach out to the owner of another veteran to aid with our website’s charities’ needs completely across the country has been amazing for this disabled veteran.',
    name: 'David Green, Public Affairs Officer',
    location: 'American Legion Ahwatukee Post 64',
  },
  {
    heading: 'TaShonda Payne',
    text: '…I’m so glad the universe aligned me with you',
    name: 'Melanin Magic Foundation',
  },
  {
    heading: 'Pardhasaradhi Namburi',
    text: 'Free For Charity was absolutely and outstanding — they really did a terrific job for us, they provided us the proper tech guidance and tools in order to help support the nonprofits that we support at Online Impacts.',
  },
  {
    heading: 'Keith Ray',
    text: 'An awesome charity that helps and supports other charities with technology support',
  },
]

const TestimonialSlider: React.FC = () => {
  const [swiperInstance, setSwiperInstance] = useState<SwiperInstance | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const prevRef = useRef<HTMLButtonElement>(null)
  const nextRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (swiperInstance && prevRef.current && nextRef.current) {
      if (swiperInstance.params.navigation) {
        const navigationParams = swiperInstance.params.navigation as {
          prevEl?: HTMLElement | null
          nextEl?: HTMLElement | null
        }
        navigationParams.prevEl = prevRef.current
        navigationParams.nextEl = nextRef.current
      }
      swiperInstance.navigation.init()
      swiperInstance.navigation.update()
    }
  }, [swiperInstance])

  const handleSlideChange = (swiper: SwiperInstance) => {
    setActiveIndex(swiper.activeIndex)
  }

  const handleDotClick = (index: number) => {
    swiperInstance?.slideTo(index)
  }

  return (
    <section id="testimonials" className="py-16 pb-25 bg-[#FCFCFC]">
      <div className="container mx-auto px-4 max-w-[1150px] text-center">
        <h2 className="font-bold text-[#F27022] text-[40px] leading-[44px] mb-7">Testimonials</h2>

        <div className="relative">
          <Swiper
            modules={[Navigation, Autoplay]}
            onSwiper={setSwiperInstance}
            onSlideChange={handleSlideChange}
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

                  <h3
                    className="text-[22px] font-bold mb-[10px] text-[#333] leading-6 italic"
                    id="aria-font"
                  >
                    {t.heading}
                  </h3>
                  <p
                    className="text-[17px] font-medium text-black italic px-0 sm:px-4 md:px-8"
                    id="aria-font"
                  >
                    {t.text}
                  </p>

                  {t.name && (
                    <p className="text-[14px] font-medium my-2 text-[#666666]" id="aria-font">
                      {t.name}
                    </p>
                  )}

                  {t.location && (
                    <a href="https://americanlegionpost64.org/">
                      <p className="text-[14px] font-medium text-[#2EA3F2]" id="aria-font">
                        {t.location}
                      </p>
                    </a>
                  )}

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
            ref={prevRef}
            disabled={activeIndex === 0}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            aria-label="Previous testimonial"
          >
            <MdOutlineArrowBackIos className="w-6 h-6" />
          </button>

          {/* Right Arrow */}
          <button
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
              onClick={() => handleDotClick(i)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                activeIndex === i ? 'bg-orange-600 w-8' : 'bg-gray-300 w-2 hover:bg-gray-400'
              }`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default TestimonialSlider
