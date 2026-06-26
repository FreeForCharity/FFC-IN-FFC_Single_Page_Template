import React from 'react'
import ResultCard from '@/components/ui/ResultCard'

const index = () => {
  return (
    <div id="results">
      <div className="w-[90%] mx-auto py-[52px] lg:px-[20px]">
        <h2
          className="mt-[2px] pb-[10px] text-[30px] md:text-[48px] font-[400] leading-[46px]  text-center mb-[40px]"
          id="faustina-font"
        >
          Results - 2023
        </h2>
        <div className="pt-[30px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[20px]">
          <ResultCard title="221" description="Organizational partners" />
          <ResultCard title="3" description="Total volunteers" />
          <ResultCard
            title="221"
            description="Organizations accessing technical assistance offerings"
          />
          <ResultCard title="25" description="Volunteer hours contributed to the organization" />
        </div>
      </div>
    </div>
  )
}

export default index
