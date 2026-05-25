import React from 'react'
import GeneralDonationCard from '@/components/ui/General-Donation-Card'
import { assetPath } from '@/lib/assetPath'

const index = () => {
  return (
    <div>
      <div className="w-[90%] md:w-[80%] mx-auto pb-[80px]">
        <h1
          className="text-center pt-[40px] pb-[45px] text-[#333] leading-[30px] text-[30px] font-[500]"
          id="aria-font"
        >
          General Donations
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-3  gap-[32px]">
          <GeneralDonationCard
            title="Monthly Donations"
            description="Monthly donations help by providing a predictable cash flow and are generally put towards expenses that are paid by free for charity each month like hosting and software licenses. By matching up our monthly bills to our monthly donations we can then scale up in tandem to produce more and more for charities."
            img={assetPath('/Images/payment.gif')}
            href="/donate"
          />
          <GeneralDonationCard
            title="One Time Donations"
            description="On time donations of any amount are placed in the general fund and used to help fund special projects as they become available throughout the year."
            img={assetPath('/Images/payment.gif')}
            href="/donate"
          />
          <GeneralDonationCard
            title="Large Donations"
            description="For large donations we can work directly with the donor and earmark the funds for a particular project of personal significance. This can be as simple as saying that your donation should be used for the technology programs vs. the business programs or more involved such as that the funds should be used to assist one particular local charity you support"
            img={assetPath('/Images/payment.gif')}
            href="https://example.com/donate"
          />
        </div>
      </div>
    </div>
  )
}

export default index
