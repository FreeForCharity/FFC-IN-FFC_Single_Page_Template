import React from 'react'
import Image from 'next/image'
import { FaInfoCircle, FaChartPie, FaCreditCard } from 'react-icons/fa'
import { assetPath } from '@/lib/assetPath'

const Index = () => {
  return (
    <div>
      <section className="py-[54px] w-[90%] md:w-[80%] mx-auto">
        <div className="flex flex-col-reverse md:flex-row items-center md:items-stretch mt-[40px] gap-[30px] md:gap-0">
          {/* Right Column – Image */}
          <div className="w-full md:w-[47.25%] md:mr-[60px]">
            <div className="relative w-full h-[350px] sm:h-[500px] md:h-[685px]">
              <Image
                src={assetPath('/Images/Endowment-Features.webp')}
                alt="Endowment Features"
                fill
                className="object-cover rounded-[6px] shadow-[0px_40px_112px_-24px_rgba(0,0,0,0.12)]"
                priority
              />
            </div>
          </div>

          {/* Left Column – Text Content */}
          <div className="w-full md:w-[47.25%]">
            <h1
              className="mb-[20px] text-[32px] sm:text-[40px] md:text-[50px] text-[#111111] font-[500] leading-[42px] sm:leading-[50px] md:leading-[60px] text-center md:text-left"
              id="cinzel"
            >
              Endowment Features
            </h1>

            <div className="space-y-[30px]">
              {/* Feature 1 */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left">
                <FaInfoCircle className="text-[#003566] text-[36px] sm:text-[40px] flex-shrink-0 mb-[10px] sm:mb-0" />
                <div className="sm:pl-[15px]">
                  <h2 className="text-[18px] text-[#111111] pb-[10px] font-[500]" id="cinzel">
                    Sustainable Funding
                  </h2>
                  <p
                    className="text-[15px] sm:text-[16px] text-[#000000a3] font-[500] leading-[26px] sm:leading-[28px]"
                    id="fauna-font"
                  >
                    The Endowment ensures that only the investment gains are used, providing a
                    sustainable funding source for the Free For Charity Domain Program.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left">
                <FaChartPie className="text-[#003566] text-[40px] sm:text-[44px] flex-shrink-0 mb-[10px] sm:mb-0" />
                <div className="sm:pl-[15px]">
                  <h2 className="text-[18px] text-[#111111] pb-[10px] font-[500]" id="cinzel">
                    Long-Term Impact
                  </h2>
                  <p
                    className="text-[15px] sm:text-[16px] text-[#000000a3] font-[500] leading-[26px] sm:leading-[28px]"
                    id="fauna-font"
                  >
                    By supporting the Endowment, you contribute to a lasting legacy that will
                    continuously support charities in need of digital resources.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left">
                <FaCreditCard className="text-[#003566] text-[44px] sm:text-[50px] flex-shrink-0 mb-[10px] sm:mb-0" />
                <div className="sm:pl-[15px]">
                  <h2 className="text-[18px] text-[#111111] pb-[10px] font-[500]" id="cinzel">
                    Goal of $1,000,000
                  </h2>
                  <p
                    className="text-[15px] sm:text-[16px] text-[#000000a3] font-[500] leading-[26px] sm:leading-[28px]"
                    id="fauna-font"
                  >
                    Our target is to raise $1,000,000 to secure the future of the program, ensuring
                    ongoing support for countless charities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Index
