import React from 'react'
import Image from 'next/image'
import { assetPath } from '@/lib/assetPath'

const Index = () => {
  return (
    <section className="relative overflow-hidden pt-[150px] pb-[46px]">
      {/* Top Background SVG */}
      <div className="absolute inset-0 z-[1] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMTI4MCAxNDAiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0iI2VhZWFlYSI+PHBhdGggZD0iTTAgMTQwaDEyODBDNTczLjA4IDE0MCAwIDAgMCAweiIgZmlsbC1vcGFjaXR5PSIuMyIvPjxwYXRoIGQ9Ik0wIDE0MGgxMjgwQzU3My4wOCAxNDAgMCAzMCAwIDMweiIgZmlsbC1vcGFjaXR5PSIuNSIvPjxwYXRoIGQ9Ik0wIDE0MGgxMjgwQzU3My4wOCAxNDAgMCA2MCAwIDYweiIvPjwvZz48L3N2Zz4=')] bg-[length:100%_100%] scale-[-1] origin-center"></div>

      {/* Main Content */}
      <div className="relative z-[5] w-[90%] max-w-[1300px] mx-auto flex flex-col md:flex-row items-start justify-between">
        {/* Left Section */}
        <div className="w-full md:w-[38.2%] mb-8 md:mb-0 md:mr-[39px]">
          <h1
            className="md:mt-[60px] mb-[20px] font-[700] text-[40px] md:text-[50px] leading-[50px] md:leading-[65px] text-[#1a2e35]"
            id="cantata-font"
          >
            Free For Charity <br />
            Hosting
          </h1>
          <p
            id="raleway-font"
            className="text-[18px] md:text-[20px] font-[600] leading-[28px] md:leading-[30px]"
          >
            Welcome to Free For Charity Hosting, a project of Free For Charity providing free
            domains and hosting services to other Non-Profit Organizations
          </p>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-[58%] relative h-[400px] md:h-[500px]">
          <Image
            src={assetPath('/Images/hero-charity.webp')}
            alt="hero image"
            fill
            className="object-cover w-full h-full"
            priority
          />
        </div>
      </div>

      {/* Bottom Blue Background SVG */}
      <div className="absolute bottom-0 inset-x-0 z-[2] h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMTI4MCAxNDAiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0iIzRmNmVmZiI+PHBhdGggZD0iTTAgMTQwaDEyODBDNTczLjA4IDE0MCAwIDAgMCAweiIgZmlsbC1vcGFjaXR5PSIuMyIvPjxwYXRoIGQ9Ik0wIDE0MGgxMjgwQzU3My4wOCAxNDAgMCAzMCAwIDMweiIgZmlsbC1vcGFjaXR5PSIuNSIvPjxwYXRoIGQ9Ik0wIDE0MGgxMjgwQzU3My4wOCAxNDAgMCA2MCAwIDYweiIvPjwvZz48L3N2Zz4=')] bg-[length:100%_100%]"></div>

      {/* White Curved Overlay */}
      <div className="h-[100px] w-full"></div>
    </section>
  )
}

export default Index
