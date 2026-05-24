import React from 'react'
import Image from 'next/image'
import { assetPath } from '@/lib/assetPath'

const Index = () => {
  return (
    <div className="relative pt-[79px] pb-[67px] bg-[#0580f8] overflow-hidden" id="setupstep2">
      {/* Top wave */}
      <div className="absolute top-0 left-0 w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDBweCIgdmlld0JveD0iMCAwIDEyODAgMTQwIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxnIGZpbGw9IiNmZmZmZmYiPjxwYXRoIGQ9Ik0wIDkwLjcybDE0MC0yOC4yOCAzMTUuNTIgMjQuMTRMNzk2LjQ4IDY1LjggMTE0MCAxMDQuODlsMTQwLTE0LjE3VjBIMHY5MC43MnoiIGZpbGwtb3BhY2l0eT0iLjUiLz48cGF0aCBkPSJNMCAwdjQ3LjQ0TDE3MCAwbDYyNi40OCA5NC44OUwxMTEwIDg3LjExbDE3MC0zOS42N1YwSDB6Ii8+PC9nPjwvc3ZnPg==')] bg-[length:100%_100px] bg-no-repeat h-[100px] z-[1] scale-[1]"></div>

      {/* Main content */}
      <div className="relative py-[27px] w-[90%] md:w-[80%] max-w-[1080px] mx-auto flex flex-col md:flex-row gap-[40px] md:gap-[0px] items-center z-[2]">
        <div className="w-full md:w-[48.5%] md:mr-[32px] text-[15px] leading-[1.6]">
          <ul
            className="list-disc pl-[20px] text-[17px] leading-[26px] font-[500] md:w-[85%] mx-auto "
            id="raleway-font"
          >
            <li>
              Go to{' '}
              <a
                href="https://nonprofit.microsoft.com/en-us/getting-started"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-white"
              >
                https://nonprofit.microsoft.com/en-us/getting-started
              </a>{' '}
              and register now or ‘login’
            </li>
            <li>Complete the Microsoft 365 forms and get your initial ‘approved’ status</li>
            <li>
              ‘Buy’ the Microsoft 365 Business Premium package <br />
              1. Currently, you get 10 free accounts
            </li>
            <li>
              NOTE: If you are Pre-501c3 or not a nonprofit then you can buy the plan directly{' '}
              <br />
              1.{' '}
              <a
                href="https://www.microsoft.com/en-us/microsoft-365/business/compare-all-microsoft-365-business-products?&activetab=tab:primaryr2"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-white"
              >
                https://www.microsoft.com/en-us/microsoft-365/business/compare-all-microsoft-365-business-products
              </a>
              <br />
              2. It’s worth the cost while you work to get 501(c)(3) Status
            </li>
          </ul>
        </div>

        <div className="col-span-2 relative w-full md:w-[48.5%] h-[350px] ">
          <Image
            src={assetPath('/Images/domains-blue-section.webp')}
            alt="domains-blue-section"
            fill
            className="object-contain rounded-[10px]"
          />
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDBweCIgdmlld0JveD0iMCAwIDEyODAgMTQwIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxnIGZpbGw9IiNmZmZmZmYiPjxwYXRoIGQ9Ik0wIDQ3LjQ0TDE3MCAwbDYyNi40OCA5NC44OUwxMTEwIDg3LjExbDE3MC0zOS42N1YxNDBIMFY0Ny40NHoiIGZpbGwtb3BhY2l0eT0iLjUiLz48cGF0aCBkPSJNMCA5MC43MmwxNDAtMjguMjggMzE1LjUyIDI0LjE0TDc5Ni40OCA2NS44IDExNDAgMTA0Ljg5bDE0MC0xNC4xN1YxNDBIMFY5MC43MnoiLz48L2c+PC9zdmc+')] bg-[length:100%_100px] bg-no-repeat h-[100px] z-[1] scale-[1]"></div>
    </div>
  )
}

export default Index
