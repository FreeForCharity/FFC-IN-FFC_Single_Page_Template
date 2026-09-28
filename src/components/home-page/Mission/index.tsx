import React from 'react'
import MissionVideo from './MissionVideo'
import { isSupportingOrgSite, siteConfig } from '@/lib/site.config'

const index = () => {
  // The statement, strapline and video below are the supporting organization's
  // own. Any other site states its own mission, from siteConfig.description.
  if (!isSupportingOrgSite()) {
    return (
      <div id="mission" className="py-[52px]">
        <div className="w-[90%] mx-auto py-[27px] mb-[60px] max-w-[1280px]">
          <h2 className="font-[400] text-[40px] lg:text-[48px] leading-[100%] tracking-[0] text-center w-full lg:w-[906px] mx-auto mb-[50px] faustina-font">
            Our Mission
          </h2>
          <p className="font-[500] text-[25px] leading-[150%] tracking-[0] text-center lato-font">
            {siteConfig.description}
          </p>
        </div>

        <div className="w-[95%] mt-[50px] mx-auto border border-[#2B627B]"></div>
      </div>
    )
  }

  return (
    <div id="mission" className="py-[52px]">
      <div className="w-[90%] mx-auto py-[27px] mb-[60px] max-w-[1280px]">
        <h2 className="font-[400] text-[40px] lg:text-[48px] leading-[100%] tracking-[0] text-center w-full lg:w-[906px] mx-auto mb-[50px] faustina-font">
          {siteConfig.name} has a simple mission with broad implications
        </h2>
        <p className="font-[700] text-[25px] leading-[150%] tracking-[0] text-center mb-[30px] lato-font">
          Reduce costs and increase revenues for nonprofits; putting that money back into their
          charitable mission where it belongs.
        </p>
        <p className="font-[500] text-[25px] leading-[150%] tracking-[0] text-center lato-font">
          This charity for charities seeks to replace as many functions as possible that current
          nonprofits pay for to for-profit companies with free or at cost work from our campus, on
          site projects, or partnerships with other entities.
        </p>
        <div className="mt-[50px] flex justify-center">
          <MissionVideo />
        </div>
      </div>

      <div className="w-[95%] mt-[50px] mx-auto border border-[#2B627B]"></div>
    </div>
  )
}

export default index
