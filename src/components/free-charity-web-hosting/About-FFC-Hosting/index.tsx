import React from 'react'
import { assetPath } from '@/lib/assetPath'

const index = () => {
  return (
    <div className="pt-[10px] pb-[40px] ">
      <div className="pb-[3px] pt-[27px] w-[90%] lg:w-[80%] mx-auto flex flex-col md:flex-row gap-[40px] md:gap-[0px]">
        <div className="w-full md:w-[38.2%] mr-[32px]">
          <div className="rounded-[15px] overflow-hidden shadow-[0px_2px_18px_0px_rgba(0,0,0,0.3)] w-full">
            <img
              src={assetPath('/Images/About-FFC-Hosting.webp')}
              alt="Example"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
        <div className="w-full md:w-[58.8%]">
          <h1
            className="mb-[12px] mt-[2px] pb-[10px] font-[700] text-[31px] leading-[31px] text-black text-center"
            id="cantata-font"
          >
            About FFC Hosting
          </h1>
          <p className="text-[18px] font-[500] leading-[29px] text-center" id="raleway-font">
            FFCHosting is a project of Free For Charity. After seeing how small nonprofits were
            often unaware of the resources available to them as it related to technology and
            observing how charities were preyed upon while in the up to 18 months leading up to IRS
            501(c)3 designation; Free For Charity was founded to help charities avoid these costly
            problems and focus on doing the great work they need to do.
          </p>
        </div>
      </div>
    </div>
  )
}

export default index
