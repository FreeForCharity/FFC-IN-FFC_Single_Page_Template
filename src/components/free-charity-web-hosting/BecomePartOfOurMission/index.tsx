import React from 'react'
import BecomePartOfOurMissionCard from '@/components/ui/BecomePartOfOurMissionCard'
import { assetPath } from '@/lib/assetPath'

const index = () => {
  return (
    <div className="py-[40px]">
      <div className="w-[90%] lg:w-[80%] mx-auto pt-[27px]">
        <h1
          className="mt-[2px] mb-[12px] pb-[10px] text-[31px] font-[700] leading-[31px] text-[#0d7ff8] text-center"
          id="cantata-font"
        >
          Become a part of our Mission
        </h1>
      </div>
      <div className="w-[90%] lg:w-[80%] mx-auto pt-[27px] flex flex-col md:flex-row gap-[32px]">
        <BecomePartOfOurMissionCard
          bgImage={assetPath('/Images/help-us.webp')}
          heading="HELP US"
          description1="INDIVIDUALS OR BUSINESSES LOOKING"
          description2="FOR A DOMAIN NAME PACKAGE"
          buttonText="Get Started"
          buttonLink="https://freeforcharity.org/hub/store/free-for-charity-individual-supporter-package"
        />

        <BecomePartOfOurMissionCard
          bgImage={assetPath('/Images/help-team.webp')}
          heading="HELP THEM"
          description1="FREE FOR CHARITY DOMAIN PACKAGE"
          description2="(NOT-FOR-PROFIT, PRE-501(C)3, FULL 501(C)3)"
          buttonText="Get Started"
          buttonLink="/501c3"
        />
      </div>
    </div>
  )
}

export default index
