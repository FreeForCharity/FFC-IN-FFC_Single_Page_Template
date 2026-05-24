import React from 'react'
import Image from 'next/image'
import { assetPath } from '@/lib/assetPath'

const Index = () => {
  return (
    <div className="relative pb-[74px]">
      {' '}
      {/* 👈 This makes bottom div position correctly */}
      <div className="w-[90%] md:w-[80%] max-w-[1080px] mx-auto relative z-[2]">
        <div className="relative py-[27px] flex flex-col md:flex-row items-start">
          {/* Image Section */}
          <div className="relative w-full md:w-[48.5%] h-[350px] mb-[25px] md:mb-0 md:mr-[32px]">
            <Image
              src={assetPath('/Images/domains-black-section.webp')}
              alt="domains-blue-section"
              fill
              className="object-contain rounded-[10px]"
            />
          </div>

          {/* Text Section */}
          <div className="w-full md:w-[48.5%] text-[15px] leading-[1.6]">
            <ul
              className="list-disc pl-[20px] text-[17px] leading-[26px] font-[500]"
              id="raleway-font"
            >
              <li>
                NOTE: Save the account name and password that you set up as well as the subdomain
                e.g. yourcharity.onmicrosoft.com
                <br />
                1. We use lastpass.com for our charity password management
              </li>
              <li>
                Link your new domain to the Microsoft 365 admin center
                <br />
                1. Follow all steps in the Microsoft Guide “Add a Domain to Microsoft 365”
                <br />
                2. (
                <a
                  href="https://docs.microsoft.com/en-us/microsoft-365/admin/setup/add-domain?view=o365-worldwide"
                  target="_blank"
                  rel="noopener"
                  className="text-[#0078D4] underline"
                >
                  https://docs.microsoft.com/en-us/microsoft-365/admin/setup/add-domain?view=o365-worldwide
                </a>
                )
                <br />
                3. You will need your Cloudflare Username and Password from before but if you are
                still logged in this will help
                <br />
                4. If you get stuck, you can put in a ticket with Microsoft and text Clarke Moyer at
                520-222-8104
              </li>
            </ul>
          </div>
        </div>

        <div className="py-[27px]">
          <p className="text-[14px] font-[500] leading-[24px] text-[#666] pt-[25px]" id="aria-font">
            DOMAIN NAME COUPON CODE Thank you for choosing us to help with your domain name and
            email setup. To get the code please complete the onboarding form for either 501c3 or
            pre-501c3 and you will see the code in the email confirmation that comes after you
            finish. If you run into any questions, contact Clarke Moyer (520) 222-8104.
          </p>
        </div>
      </div>
      {/* Background Wave */}
      <div className="bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDBweCIgdmlld0JveD0iMCAwIDEyODAgMTQwIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxnIGZpbGw9IiMwMDAwMDAiPjxwYXRoIGQ9Ik0wIDQ3LjQ0TDE3MCAwbDYyNi40OCA5NC44OUwxMTEwIDg3LjExbDE3MC0zOS42N1YxNDBIMFY0Ny40NHoiIGZpbGwtb3BhY2l0eT0iLjUiLz48cGF0aCBkPSJNMCA5MC43MmwxNDAtMjguMjggMzE1LjUyIDI0LjE0TDc5Ni40OCA2NS44IDExNDAgMTA0Ljg5bDE0MC0xNC4xN1YxNDBIMFY5MC43MnoiLz48L2c+PC9zdmc+')] bg-[length:100%_100px] h-[100px] absolute bottom-0 left-0 w-full z-[1] scale-[1]" />
    </div>
  )
}

export default Index
