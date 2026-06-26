import React from 'react'
import { MdEmail, MdLocationOn, MdPhone } from 'react-icons/md'

const ContactSection = () => {
  return (
    <div className="pt-[60px] pb-[50px]">
      <div className="w-full max-w-[90%] mx-auto">
        <div className="pt-[20px] w-[100%] md:w-[80%] mx-auto">
          <h1 className="text-[#f27022] text-[40px] leading-[44px] font-[700] mb-[27px] text-center">
            Contact Us
          </h1>
          <p
            className="text-[18px] font-[500] leading-[27px] text-black text-center"
            id="lato-font"
          >
            Have questions about consultation or hosting? Want to know more about nonprofits?
            Looking to chat? Give a real person a call:
          </p>
        </div>

        <div className="mt-[30px] grid grid-cols-1 md:grid-cols-3 gap-8 mb-6 py-6">
          {/* Email */}
          <div className="w-full  text-center">
            <MdEmail className="w-[55px] h-[55px] text-[#2680A7] mx-auto mb-4" />
            <p className="font-[600] text-[24px] text-black mb-2">Email</p>
            <a
              href="mailto:clarkemoyer@freeforcharity.org"
              className="font-[600] text-[#2ea3f2] text-[18px] break-all "
              id="lato-font"
            >
              clarkemoyer@freeforcharity.org
            </a>
          </div>

          {/* Main Address */}
          <div className="flex flex-col gap-6">
            <div className="w-full text-center">
              <MdLocationOn className="w-[55px] h-[55px] text-[#2680A7] mx-auto mb-4" />
              <p className="font-[600] text-[24px] text-black mb-2">Main Address</p>
              <p className="font-[600] text-[18px] text-[#666666]" id="lato-font">
                4030 Wake Forrest Road STE 349 Raleigh North Carolina 27609
              </p>
            </div>

            <div className="text-center">
              <MdLocationOn className="w-[55px] h-[55px] text-[#2680A7] mx-auto mb-4" />
              <p className="font-[600] text-[24px] text-black mb-2">PA Office Address</p>
              <p className="font-[600] text-[18px] text-[#666666]" id="lato-font">
                301 Science Park Road Suite 119 State College PA 16803
              </p>
            </div>
          </div>

          {/* Phone */}
          <div className="w-full text-center">
            <MdPhone className="w-[55px] h-[55px] text-[#2680A7] mx-auto mb-4" />
            <p className="font-[600] text-[24px] text-black mb-2">Call</p>
            <a
              href="tel:+5202228104"
              className="font-[600] text-[#2ea3f2] text-[18px]"
              id="lato-font"
            >
              (520) 222-8104
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactSection
