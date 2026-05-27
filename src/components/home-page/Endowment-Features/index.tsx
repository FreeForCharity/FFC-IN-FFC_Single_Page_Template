import React from 'react'
import { SustainableFundingCard } from '@/components/ui/SustainableFundingCard'
import { assetPath } from '@/lib/assetPath'

const Home: React.FC = () => {
  return (
    <div className="pb-[30px]">
      <div className="w-[90%] mx-auto lg:px-[20px] max-w-[1280px]">
        <div>
          <h1
            className="font-[400] text-[40px] lg:text-[48px] leading-[100%] tracking-[0] text-center mx-auto mb-[30px]"
            id="faustina-font"
          >
            Free For Charity Endowment Features
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px]">
            <SustainableFundingCard
              imageUrl={assetPath('/Svgs/sustainable-funding.svg')}
              title="Sustainable Funding"
              text="The Endowment ensures that only the investment gains are used, providing a sustainable funding source for the Free For Charity Domain Program."
            />
            <SustainableFundingCard
              imageUrl={assetPath('/Svgs/Long-Term-Impact.svg')}
              title="Long-Term Impact"
              text="By supporting the Endowment, you contribute to a lasting legacy that will continuously support charities in need of digital resources."
            />
            <SustainableFundingCard
              imageUrl={assetPath('/Svgs/Goal-of-$1,000,000.svg')}
              title="Goal of $1,000,000"
              text="Our target is to raise $1,000,000 to secure the future of the program, ensuring ongoing support for countless charities."
            />
            <SustainableFundingCard
              imageUrl={assetPath('/Svgs/Be-a-Champion.svg')}
              title="Be a Champion for Change"
              text="By taking donations on our behalf, you become an essential part of our mission, creating a ripple effect of generosity and support."
            />
          </div>
        </div>
      </div>
      <div className="w-[95%] mt-[50px] mx-auto border border-[#2B627B]"></div>
    </div>
  )
}

export default Home
