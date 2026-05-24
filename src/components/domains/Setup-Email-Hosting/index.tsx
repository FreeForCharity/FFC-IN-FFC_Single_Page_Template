import React from 'react'
import Image from 'next/image'
import { assetPath } from '@/lib/assetPath'

const index = () => {
  return (
    <div className="pt-[40px] pb-[81px] ">
      <div className="w-[80%] mx-auto">
        <div className="pt-[24px] pb-[3px]">
          <h1
            className="mt-[2px] mb-[12px] pb-[10px] text-[30px] md:text-[35px] font-[700] leading-[46px] text-[#0d7ff8] text-center"
            id="cantata-font"
          >
            HOW TO SET UP EMAIL HOSTING FOR THE NEW DOMAIN
          </h1>
          <p
            className="mb-[13px] w-[85%] mx-auto font-[500] text-[20px] leading-[30px] text-center"
            id="raleway-font"
          >
            Email hosting means that you can have email addresses at your domain name. e.g.
          </p>
        </div>
      </div>

      <div className="w-[90%] md:w-[87%] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-between py-[27px] mx-auto gap-[35px]">
        <a
          href="mailto:yourname@yourdomain.org"
          className="bg-white rounded-[8px] shadow-[0px_2px_18px_0px_rgba(0,0,0,0.3)] 
    border-l-[8px] border-[#0d7ff8]
    p-[20px] text-center text-[20px] md:text-[22px] font-[600] leading-[31px] text-[#0d7ff8]
    break-words inline-block"
          id="raleway-font"
        >
          yourname@yourdomain.org
        </a>

        <a
          href="mailto:contactus@yourdomain.org"
          className="bg-white rounded-[8px] shadow-[0px_2px_18px_0px_rgba(0,0,0,0.3)] 
    border-l-[8px] border-[#0d7ff8]
    p-[20px] text-center text-[20px] md:text-[22px] font-[600] leading-[31px] text-[#0d7ff8]
    break-words inline-block"
          id="raleway-font"
        >
          contactus@yourdomain.org
        </a>

        <a
          href="mailto:board@yourdomain.org"
          className="bg-white rounded-[8px] shadow-[0px_2px_18px_0px_rgba(0,0,0,0.3)] 
    border-l-[8px] border-[#0d7ff8]
    p-[20px] text-center text-[20px] md:text-[22px] font-[600] leading-[31px] text-[#0d7ff8]
    break-words inline-block"
          id="raleway-font"
        >
          board@yourdomain.org
        </a>
      </div>

      <div className="w-[90%] md:w-[80%] max-w-[1080px] mx-auto grid grid-cols-1 md:grid-cols-2 py-[27] gap-[33px] items-stretch justify-between">
        <div className="p-[20px] text-center bg-white rounded-[10px] overflow-hidden pt-[30px] pr-[20px] pb-[30px] pl-[20px] shadow-[0px_2px_18px_0px_rgba(0,0,0,0.3)]">
          {/* Circle Image */}
          <div className="mx-auto flex-shrink-0 w-[100px] h-[100px] overflow-hidden mb-[30px]">
            <Image
              src={assetPath('/Images/1.webp')}
              alt="Step Illustration"
              width={56}
              height={56}
              className="w-full h-full object-contain rounded-full"
            />
          </div>

          <h4
            className="text-[31px] font-[700] leading-[31px] pb-[30px] text-[#0d7ff8]"
            id="cantata-font"
          >
            Step 1
          </h4>
          <p
            className="text-[#333] text-[22px] font-[700] leading-[22px] text-center pb-[10px]"
            id="raleway-font"
          >
            Select an email provider
          </p>

          {/* Text Content */}
          <p className="text-[18px] leading-[32px] font-[500]" id="raleway-font">
            Free For Charity recommends Microsoft as your email provider as it is free to charities
            and comes with many additional services at no cost
          </p>
        </div>

        <div className="p-[20px] text-center bg-white rounded-[10px] overflow-hidden pt-[30px] pr-[20px] pb-[30px] pl-[20px] shadow-[0px_2px_18px_0px_rgba(0,0,0,0.3)]">
          {/* Circle Image */}
          <div className="mx-auto flex-shrink-0 w-[100px] h-[100px] overflow-hidden mb-[30px]">
            <Image
              src={assetPath('/Images/2.webp')}
              alt="Step Illustration"
              width={56}
              height={56}
              className="w-full h-full object-contain rounded-full"
            />
          </div>

          <h4
            className="text-[31px] font-[700] leading-[31px] pb-[30px] text-[#0d7ff8]"
            id="cantata-font"
          >
            Step 2
          </h4>
          <p
            className="text-[#333] text-[22px] font-[700] leading-[22px] text-center pb-[10px]"
            id="raleway-font"
          >
            Set up a Microsoft 365 Business Premium account
          </p>

          {/* Text Content */}
          <p className="text-[18px] leading-[32px] font-[500] pb-[1em]" id="raleway-font">
            Follow the following simple steps to set up your Microsoft 365 Business Premium Account
          </p>
          <a
            href="domains/#setupstep2"
            className="text-[25px] leading-[32px] font-[600] text-[#0580f8]"
            id="raleway-font"
          >
            Click here
          </a>
        </div>
      </div>
    </div>
  )
}

export default index
