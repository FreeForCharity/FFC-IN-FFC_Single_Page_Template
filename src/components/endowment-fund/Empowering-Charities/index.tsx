import React from 'react'
import Image from 'next/image'
import ProgressBar from '@/components/ui/ProgressBar'
import { assetPath } from '@/lib/assetPath'

const Index = () => {
  return (
    <div>
      <section className="py-[54px] w-[90%] md:w-[80%] mx-auto">
        <h1
          className="pt-[27px] mb-[10px] text-[32px] sm:text-[42px] md:text-[50px] text-[#111111] text-center font-[500] leading-[42px] sm:leading-[52px] md:leading-[60px] pb-[37px]"
          id="cinzel"
        >
          Empowering Charities Through Endowment
        </h1>

        <div className="flex flex-col-reverse md:flex-row items-center md:items-stretch mt-[40px] gap-[30px] md:gap-0">
          {/* Image Column */}
          <div className="w-full md:w-[36.7%] md:mr-[60px] h-auto">
            <div className="relative w-full h-[280px] sm:h-[350px] md:h-[400px]">
              <Image
                src={assetPath('/Images/Empowering-Charities.webp')}
                alt="Empowering Charities"
                fill
                className="object-cover rounded-[6px]"
                priority
              />
            </div>
          </div>

          {/* Text + Progress Column */}
          <div className="w-full md:w-[57.8%] text-center md:text-left">
            <p
              className="text-[15px] sm:text-[16px] text-[#000000a3] font-[500] leading-[26px] sm:leading-[28px]"
              id="fauna-font"
            >
              Our Free For Charity Domain Program has already supported over 200 charitable
              organizations, providing them with essential digital tools to enhance their outreach
              and impact. With the establishment of the endowment we can sustainably maintain our
              current charities and support 100 new charities annually.
            </p>

            <div className="mt-[30px] space-y-[20px] md:space-y-[30px]">
              <ProgressBar title="Charities Supported" percentage={95} />
              <ProgressBar title="Projected Growth" percentage={85} />
              <ProgressBar title="Endowment Utilization" percentage={75} />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Index
