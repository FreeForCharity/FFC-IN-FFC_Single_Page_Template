import React from 'react'
import Image from 'next/image'
import DomainCard from '@/components/ui/Domain-Card'
import { IoCall } from 'react-icons/io5'
import { IoMdMail } from 'react-icons/io'
import { assetPath } from '@/lib/assetPath'

const index = () => {
  return (
    <div className="py-[40px]">
      <div className="w-[90%] mx-auto">
        <div className="pt-[24px] pb-[3px] w-[80%] mx-auto">
          <h1
            className="mt-[2px] mb-[12px] pb-[10px] text-[30px] md:text-[35px] font-[700] leading-[46px] text-[#0d7ff8] text-center"
            id="cantata-font"
          >
            HOW TO VERIFY YOUR DOMAIN WITH ICANN
          </h1>
          <p
            className="mb-[13px] w-full lg:w-[85%] mx-auto font-[500] text-[20px] leading-[30px] text-center"
            id="raleway-font"
          >
            Please note that you will now own this domain but several emails from the domain
            registrar system will need to be accepted as they verify your account to own the domain.
          </p>
          <p
            className="mt-[30px] font-[600] text-[27px] leading-[35px] text-center"
            id="raleway-font"
          >
            What to do then?
          </p>
        </div>
      </div>

      <div className="w-[90%] md:w-[80%] max-w-[1080px] mx-auto pt-[22px]">
        <div className="mb-[13px] w-full md:w-fit max-w-[610px] text-[23px] text-black leading-[1.3em] rounded-[10px] overflow-hidden p-[30px] mx-auto bg-cover bg-center shadow-[0px_2px_18px_0px_rgba(0,0,0,0.3)]">
          <div className="flex flex-col md:flex-row items-center md:items-start">
            {/* Image */}
            <div className="mb-4 md:mb-0 md:mr-4">
              <div className="relative h-[100px] w-[100px]">
                <Image
                  src={assetPath('/Images/1.webp')}
                  fill
                  alt="domain verification email"
                  className="object-contain"
                />
              </div>
            </div>

            {/* Text */}
            <div className="text-center md:text-left">
              <h4 className="text-[31px] font-[700] leading-[31px] pb-[10px]" id="cantata-font">
                Step 1
              </h4>
              <p className="text-[23px] font-[500] leading-[30px]" id="raleway-font">
                Check for emails about verification to the email address you used to register this
                domain
              </p>
            </div>
          </div>
        </div>

        {/* Bottom note */}
        <p className="font-[500] text-[20px] leading-[30px] text-center" id="raleway-font">
          There are three main things to keep in mind.
        </p>
      </div>

      <div className="w-[87%] max-w-[1300px] mx-auto py-[22px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[35px] items-stretch">
        <DomainCard
          imageSrc={assetPath('/Images/1.webp')}
          imageAlt="Email verification icon"
          text="Check for emails about verification to the email address you used to register this domain"
        />
        <DomainCard
          imageSrc={assetPath('/Images/2.webp')}
          imageAlt="Email verification icon"
          text="FAILING TO RESPOND TO THESE EMAILS WILL RESULT IN SUSPENSION OF YOUR DOMAIN"
        />
        <DomainCard
          imageSrc={assetPath('/Images/3.webp')}
          imageAlt="Email verification icon"
          text="Free For Charity does not send or control these emails but we will be notified if you did not verify your ownership in the time provided."
        />
      </div>

      <div className="w-[90%] md:w-[80%] max-w-[1080px] mx-auto pt-[22px]">
        <div className="mb-[13px] w-full md:w-fit max-w-[610px] text-[23px] text-black leading-[1.3em] rounded-[10px] overflow-hidden p-[30px] mx-auto bg-cover bg-center shadow-[0px_2px_18px_0px_rgba(0,0,0,0.3)]">
          <div className="flex flex-col md:flex-row items-center md:items-start">
            {/* Image */}
            <div className="mb-4 md:mb-0 md:mr-4">
              <div className="relative h-[100px] w-[100px]">
                <Image
                  src={assetPath('/Images/2.webp')}
                  fill
                  alt="domain verification email"
                  className="object-contain"
                />
              </div>
            </div>

            {/* Text */}
            <div className="text-center md:text-left">
              <h4 className="text-[31px] font-[700] leading-[31px] pb-[10px]" id="cantata-font">
                Step 2
              </h4>
              <p className="text-[23px] font-[500] leading-[30px] pb-[1em]" id="raleway-font">
                You can manage your domain anytime by accessing our system with the account you
                created at checkout.
              </p>
              <a
                href="https://freeforcharity.org/hub/"
                id="raleway-font"
                className="italic text-[23px] font-[500] leading-[46px] break-all"
              >
                https://freeforcharity.org/hub
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="px-[30px] py-[50px] mt-[50px] md:w-[80%] max-w-[1080px] mx-auto flex flex-col lg:flex-row">
        {/* Left Column */}
        <div className="w-full lg:w-[47.25%] md:mr-[46px] mb-8 md:mb-0">
          <div className="mt-[2px] mb-[12px]">
            <h2
              className="pb-[10px] text-[#333] text-[35px] font-[700] leading-[46px] text-center"
              id="cantata-font"
            >
              Have any Question
            </h2>
          </div>
          <p
            className="w-full md:w-[85%] mx-auto text-[27px] font-[600] leading-[35px] text-center"
            id="raleway-font"
          >
            If at anytime 72 hours after your order has been placed you have any questions about
            these verifications please contact
          </p>
        </div>

        {/* Right Column */}
        <div className="w-full lg:w-auto md:pl-[15px] flex flex-col items-center lg:items-start">
          <h2
            className="pb-[10px] mt-2 mb-[12px] text-[35px] font-[700] leading-[46px] text-center lg:text-left"
            id="cantata-font"
          >
            Contact <br /> Clarke Moyer
          </h2>

          <div className="mb-[10px] flex items-center">
            <IoCall className="text-[34px] font-[400] leading-[34px] text-[#0580f8]" />
            <a
              href="tel:520-222-8104"
              className="pl-[15px] text-[28px] font-[500] leading-[42px] text-[#2ea3f2]"
              id="raleway-font"
            >
              520-222-8104
            </a>
          </div>
          <div className="mt-[3px] flex items-center">
            <IoMdMail className="text-[34px] font-[400] leading-[34px] text-[#0580f8]" />
            <a
              href="mailto:clarkemoyer@freeforcharity.org"
              className="text-center pl-[15px] text-[28px] font-[500] leading-[42px] text-[#2ea3f2] break-all  inline-block"
              id="raleway-font"
            >
              clarkemoyer@freeforcharity.org
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default index
