import React from 'react'
import { assetPath } from '@/lib/assetPath'

const index = () => {
  return (
    <div id="mission" className="py-[52px]">
      <div className="w-[90%] mx-auto py-[27px] mb-[60px] max-w-[1280px]">
        <h1
          className="font-[400] text-[40px] lg:text-[48px] leading-[100%] tracking-[0] text-center w-full lg:w-[906px] mx-auto mb-[50px]"
          id="faustina-font"
        >
          Free For Charity has a simple mission with broad implications
        </h1>
        <p
          className="font-[700] text-[25px] leading-[150%] tracking-[0] text-center mb-[30px]"
          id="lato-font"
        >
          Reduce costs and increase revenues for nonprofits; putting that money back into their
          charitable mission where it belongs.
        </p>
        <p
          className="font-[500] text-[25px] leading-[150%] tracking-[0] text-center"
          id="lato-font"
        >
          This charity for charities seeks to replace as many functions as possible that current
          nonprofits pay for to for-profit companies with free or at cost work from our campus, on
          site projects, or partnerships with other entities.
        </p>
        <div className="mt-[50px] flex justify-center">
          <video
            className="w-full max-w-[800px] rounded-lg shadow-lg"
            controls
            playsInline
            preload="metadata"
            poster={assetPath('/videos/mission-video-poster.webp')}
            aria-label="Free For Charity mission video"
            title="Learn about Free For Charity's mission to help nonprofits reduce costs"
          >
            <source src={assetPath('/videos/mission-video.mp4')} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      <div className="w-[95%] mt-[50px] mx-auto border border-[#2B627B]"></div>
    </div>
  )
}

export default index
