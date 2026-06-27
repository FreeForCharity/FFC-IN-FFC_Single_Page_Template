import React from 'react'
import ResultCard from '@/components/ui/ResultCard'
import { results } from '@/data/results'

// The heading and stat cards are sourced from src/data/results.ts. To change
// the impact numbers or labels, edit that file — no need to touch this
// component.
const index = () => {
  return (
    <div id="results">
      <div className="w-[90%] mx-auto py-[52px] lg:px-[20px]">
        <h2 className="mt-[2px] pb-[10px] text-[30px] md:text-[48px] font-[400] leading-[46px]  text-center mb-[40px] faustina-font">
          {results.heading}
        </h2>
        <div className="pt-[30px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[20px]">
          {results.stats.map((stat) => (
            <ResultCard key={stat.label} title={stat.value} description={stat.label} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default index
