import React from 'react'
import Image from 'next/image'
import OrangeFaqItem from '@/components/ui/OrangeFaqItem'
import ApplicationFormButton from '@/components/ui/ApplicationFormButton'
import { assetPath } from '@/lib/assetPath'

const index = () => {
  return (
    <div id="programs" className="py-[52px]">
      <div className="w-[90%] lg:px-[20px] mx-auto">
        <h1
          className="font-[400] text-[40px] lg:text-[48px]  tracking-[0] text-center mx-auto mb-[50px]"
          id="faustina-font"
        >
          Our Programs
        </h1>

        <div className="lg:pl-[50px]">
          <div className="mb-[40px]  flex items-center gap-[20px]">
            <div className="w-[100px] flex items-center justify-center p-2 h-[100px] bg-[#2A6682] rounded-full">
              <div className="relative w-[56px] h-[56px]">
                <Image
                  src={assetPath('/Svgs/FFC-Domains.svg')}
                  alt="FFC-Domains"
                  fill
                  loading="lazy"
                ></Image>
              </div>
            </div>
            <h1 className="text-[36px] font-[400] " id="lato-font">
              FFC Domains
            </h1>
          </div>
          <p className="text-[25px] font-[400] " id="lato-font">
            Provides free .org domain names, Microsoft 365 with Outlook email, & Microsoft Teams to
            501c3 charities.
          </p>
        </div>

        {/* faqs  */}
        <div>
          <OrangeFaqItem title=".org Domain Registration">
            <ul className="list-disc list-inside">
              <li className="">
                For You: Leverage a .org domain name to enhance your charitys credibility,
                trustworthiness, and online presence, making it easier to attract donors and
                supporters
              </li>
            </ul>
          </OrangeFaqItem>
          <OrangeFaqItem title="Cloudflare DNS">
            <ul className="list-disc list-inside">
              <li className="">For You: Faster website load times and enhanced security</li>
              <li className="">For Us: Centralized management and automation tools.</li>
            </ul>
          </OrangeFaqItem>
          <OrangeFaqItem title="Charity Email Address">
            <ul className="list-disc list-inside">
              <li className="">
                For You: Using a charity email address (e.g., yourname@yourcharity.org) enhances
                your organizations credibility and professionalism, making it easier to build trust
                with donors, volunteers, and stakeholders
              </li>
              <li className="">
                For Us: We benefit by ensuring charities use professional email addresses, which
                helps maintain our servers integrity and provides a more secure and reliable
                communication platform for our volunteers
              </li>
            </ul>
          </OrangeFaqItem>
          <OrangeFaqItem title="Microsoft 365">
            <ul className="list-disc list-inside">
              <li className="">For You: Professional email and collaboration tools</li>
              <li className="">For Us: Streamlined communication and support processes</li>
            </ul>
          </OrangeFaqItem>
        </div>

        <div className="mt-[60px]">
          <div className="lg:pl-[50px] mb-[40px]  flex items-center gap-[20px]">
            <div className="w-[100px] flex items-center justify-center p-2 h-[100px] bg-[#2A6682] rounded-full">
              <div className="relative w-[56px] h-[56px]">
                <Image
                  src={assetPath('/Svgs/FFC-Hosting.svg')}
                  alt="FFC-Domains"
                  fill
                  loading="lazy"
                ></Image>
              </div>
            </div>
            <h1 className="text-[36px] font-[400]  " id="lato-font">
              FFC Hosting
            </h1>
          </div>
          <p className="text-[25px] font-[400]  " id="lato-font">
            Free static site hosting for nonprofit organizations using Microsoft GitHub Pages, with
            websites built using GitHub Copilot AI:
          </p>
        </div>

        {/* faqs  */}
        <div>
          <OrangeFaqItem title="GitHub Pages Hosting">
            <ul className="list-disc list-inside">
              <li className="">
                For You: Free, reliable static site hosting with automatic HTTPS and custom domain
                support
              </li>
              <li className="">
                For Us: Simplified deployment and maintenance with version-controlled websites
              </li>
            </ul>
          </OrangeFaqItem>
          <OrangeFaqItem title="GitHub Copilot AI Development">
            <ul className="list-disc list-inside">
              <li className="">
                For You: Professional, modern websites built using AI-assisted development for
                faster delivery
              </li>
              <li className="">
                For Us: Efficient website creation and consistent code quality across all charity
                projects
              </li>
            </ul>
          </OrangeFaqItem>
          <OrangeFaqItem title="Static Site Architecture">
            <ul className="list-disc list-inside">
              <li className="">
                For You: Fast-loading, secure websites with no server maintenance required
              </li>
              <li className="">
                For Us: Zero hosting costs and reduced security vulnerabilities for partner
                organizations
              </li>
            </ul>
          </OrangeFaqItem>
          <OrangeFaqItem title="Modern Web Technologies">
            <ul className="list-disc list-inside">
              <li className="">
                For You: Beautiful, responsive websites built with React, Next.js, and Tailwind CSS
              </li>
              <li className="">
                For Us: Standardized tech stack enabling efficient support and training for our
                volunteers
              </li>
            </ul>
          </OrangeFaqItem>
        </div>

        <div className="mt-[60px]">
          <div className="lg:pl-[50px] mb-[40px]  flex items-center gap-[20px]">
            <div className="w-[100px] flex items-center justify-center p-2 h-[100px] bg-[#2A6682] rounded-full">
              <div className="relative w-[56px] h-[56px]">
                <Image
                  src={assetPath('/Svgs/FFC-Consulting.svg')}
                  alt="FFC-Domains"
                  fill
                  loading="lazy"
                ></Image>
              </div>
            </div>
            <h1 className="text-[36px] font-[400]  " id="lato-font">
              FFC Consulting
            </h1>
          </div>
          <p className="text-[25px] font-[400]  " id="lato-font">
            FFC Consulting is about helping charities get the most out of their digital
            infrastructure including from other charities for charities like ours or from partners.
            We introduce charities to each major service that supports the charity mission of our
            sponsored organizations. We benefit when you use these services as well as your
            organization benefiting.
          </p>
        </div>

        {/* faqs  */}
        <div>
          <OrangeFaqItem title="Northwest Registered Agent">
            <ul className="list-disc list-inside">
              <li className="">
                For You: Leverage Northwest Registered Agents services to maintain compliance with
                state requirements, including registered agent services, nonprofit corporation
                filing, and initial charity IRS application.
              </li>
              <li className="">
                For Us: Efficiently support charities by ensuring they meet legal requirements and
                train our volunteers on managing compliance, business formation processes, and IRS
                applications.
              </li>
            </ul>
          </OrangeFaqItem>
          <OrangeFaqItem title="Idealist.org / VolunteerMatch.org">
            <ul className="list-disc list-inside">
              <li className="">For You: Access to a large pool of potential volunteers</li>
              <li className="">For Us: Validation of your active community engagement</li>
            </ul>
          </OrangeFaqItem>
          <OrangeFaqItem title="TechSoup.org">
            <ul className="list-disc list-inside">
              <li className="">For You: Access to discounted software and technology resources</li>
              <li className="">For Us: Additional validation of your non-profit status</li>
            </ul>
          </OrangeFaqItem>
          <OrangeFaqItem title="PayPal / Zeffy">
            <ul className="list-disc list-inside">
              <li className="">For You: Easy, secure online donation processing</li>
              <li className="">
                For Us: Standardized financial transaction system for all partners
              </li>
            </ul>
          </OrangeFaqItem>
        </div>

        <div className="lg:w-[90%] mx-auto text-center pb-[54px] pt-[20px]">
          <h1 className="text-[36px] font-[400] pt-[22px] pb-[30px]" id="lato-font">
            Ready to Get Started Now?
          </h1>

          <div className="flex items-center justify-center">
            <ApplicationFormButton />
          </div>
        </div>
      </div>
    </div>
  )
}

export default index
