import React from 'react'
import SlidingCard from '@/components/ui/SlidingCard'
import { assetPath } from '@/lib/assetPath'

const index = () => {
  return (
    <div>
      <div className="py-[54px] ">
        <div className="">
          <div className="w-[80%] mx-auto pt-[27px] pb-[35px] ">
            <h1
              className="mb-[11px] pb-[10px] text-[40px] font-[700] leading-[44px] text-center text-[#333] tracking-[1px]"
              id="faustina-font"
            >
              Tools for <span className="text-[#e88d33]">Non-Profits</span>
            </h1>
            <div className="w-[18%] mx-auto h-[5px] bg-[#E88D33]"></div>
          </div>

          <SlidingCard
            direction="left"
            subtitle="Guidestar (free with paid options)"
            description={
              <>
                This charity provides profiles of nearly every charity in the world. It also
                provides an API that lets others check on the nonprofit status of any charity by
                name, EIN, or other metrics. Many of the charity for charity sites as well as
                indirect sites that provide discounts to nonprofits require a completed profile on
                Guide Star before giving free or discounted items to your organization. Create your
                profile and have it validated at the highest level possible here before seeking the
                other services.
              </>
            }
            buttonText="Available Here"
            buttonLink="https://www.guidestar.org/"
            imageSrc={assetPath('/Images/guidestar.webp')} // 👈 image passed as prop
          />
          <SlidingCard
            direction="left"
            subtitle="Techsoup (Free to join, admin fees for most items offered)"
            description={
              <>
                My personal charity focused on bridging the gaps between the big players in the
                charity for charities section. Focus is on IT Project Management support and other
                business level support. Free For Charity leverages and simplifies the plethora of
                options each charity has to provide what is needed most by the individual
                organization.
              </>
            }
            buttonText="Available Here"
            buttonLink="https://www.techsoup.org/"
            imageSrc={assetPath('/Images/TechSouplogo.webp')} // 👈 image passed as prop
          />

          <div className="py-[6px] w-[80%] mx-auto">
            <div className="bg-[#E48B32] h-[3px] w-full"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default index
