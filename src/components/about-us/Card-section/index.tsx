import React from 'react'
import Image from 'next/image'
import { assetPath } from '@/lib/assetPath'

const Index = () => {
  return (
    <div className="pt-[50px] pb-[32px]">
      <div className="w-[90%] mx-auto pt-[19px]">
        <div className="flex flex-col md:flex-row gap-10 items-start">
          {/* Left Content */}
          <div className="w-full md:w-[58.8%] md:mr-[32px] rounded-[15px] overflow-hidden p-[30px] shadow-[0_2px_18px_rgba(0,0,0,0.3)]">
            <h1 className="text-[30px] md:text-[36px] font-[700] leading-[36px] md:leading-[40px] text-center text-[#f27022]">
              Some things we are working to get to free or at cost to non profits and charity groups
              are:
            </h1>
            <ul
              className="mt-[20px] md:mt-[30px] list-disc text-[16px] md:text-[18px] font-[500] leading-[28px] md:leading-[31px] pb-[10px] pl-[1.5em]"
              id="lato-font"
            >
              <li>1 on 1 Charity / Nonprofit Consulting</li>
              <li>Free Charity Domain Name</li>
              <li>Free Microsoft 365 grant assistance and setup support</li>
              <li>
                Free charity website hosting and web hosting support with tons of for-profit paid
                products included free for charities
              </li>
              <li>
                Unbiased technology recommendations focused on helping you find the software and
                tools you need
              </li>
            </ul>
          </div>

          {/* Right Image */}
          <div className="w-full md:w-[38.2%] flex justify-center md:justify-start">
            <Image
              src={assetPath('/Images/about-us-card-section-image.webp')}
              width={500}
              height={500}
              alt="About Us Card Section Image"
              className="w-[100%] h-auto rounded-[15px]"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Index
