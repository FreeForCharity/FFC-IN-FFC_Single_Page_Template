import React from 'react'
import AccordionBold from '@/components/ui/AccordionBold'
import Image from 'next/image'
import Transparentbtn from '@/components/ui/Transparentbtn'
import { assetPath } from '@/lib/assetPath'

const index = () => {
  return (
    <div className="w-full">
      <div className="w-[90%] mx-auto py-[40px] ">
        <div className="pt-[26px] w-full max-w-[90%] sm:max-w-[90%] mx-auto">
          <h1 className="text-[25px] md:text-[30px] font-[500] text-[#333] pb-[1em]" id="aria-font">
            1. Achieving Gold or Platinum Seal of Transparency
          </h1>
          <AccordionBold number="1" title=" Claim Your Nonprofit Profile">
            <ul className="list-disc list-inside space-y-1 pb-[1em]">
              <li>
                <strong className="text-[#666]">Create an account:</strong> Go to the{' '}
                <a href="https://www.guidestar.org/" className="text-[#2ea3f2]">
                  Candid website
                </a>{' '}
                and create a free account if you don’t have one.
              </li>
              <li>
                <strong className="text-[#666]">Find your nonprofit profile:</strong> Search for
                your organization using its name or Employer Identification Number (EIN).
              </li>
              <li>
                <strong className="text-[#666]"> Claim the profile:</strong> Follow the prompts to
                verify your connection to the nonprofit. Only a designated staff member can claim
                the profile, but you can invite others later to manage it​ (
                <a
                  href="https://www.guidestar.org/UpdateNonprofitProfile/get-platinum"
                  className="text-[#2ea3f2]"
                >
                  GuideStar
                </a>
                )​(
                <a
                  href="https://help.candid.org/s/article/How-to-Earn-a-Platinum-Seal-of-Transparency"
                  className="text-[#2ea3f2]"
                >
                  Candid
                </a>
                ).
              </li>
            </ul>
            <p>
              NOTE: If you nonprofit is already claimed then the current management has to “Add
              Managers” to allow your email to update the profile.
            </p>
          </AccordionBold>

          <AccordionBold number="2" title=" Earn a Bronze Seal of Transparency">
            <ul className="list-disc list-inside space-y-1 pb-[1em]">
              <li>
                <strong className="text-[#666]">Basic organizational details:</strong> Complete the
                fundamental information for your nonprofit, including:
                <ul className="list-disc list-inside space-y-1 pl-[20px] pb-[20px]">
                  <li>Mission statement</li>
                  <li>Address and contact info</li>
                  <li>Tax ID (EIN)</li>
                </ul>
              </li>
              <li>
                <strong className="text-[#666]">Leadership information:</strong> Provide the names
                and titles of key staff members and board members​ ({' '}
                <a
                  href="https://blog.candid.org/post/what-is-a-seal-of-transparency-your-questions-about-candid-seals-answered/"
                  className="text-[#2ea3f2]"
                >
                  Candid insights
                </a>{' '}
                ).
              </li>
              <li>
                <strong className="text-[#666]"> Publication:</strong> Once all required fields are
                completed, publish your updates to earn the Bronze Seal​ ​ (
                <a
                  href="https://www.guidestar.org/UpdateNonprofitProfile/get-platinum"
                  className="text-[#2ea3f2]"
                >
                  GuideStar
                </a>
                )​(
                <a
                  href="https://help.candid.org/s/article/How-to-Earn-a-Platinum-Seal-of-Transparency"
                  className="text-[#2ea3f2]"
                >
                  Candid
                </a>
                ).
              </li>
            </ul>
          </AccordionBold>

          <AccordionBold number="3" title=" Earn a Silver Seal of Transparency">
            <ul className="list-disc list-inside space-y-1 pb-[1em]">
              <li>
                <strong className="text-[#666]">Program details:</strong> Add information about your
                nonprofit’s programs, including:
                <ul className="list-disc list-inside space-y-1 pl-[20px] pb-[20px]">
                  <li>Program names</li>
                  <li>Descriptions of the services provided</li>
                  <li>Geographic areas served</li>
                </ul>
              </li>
              <li>
                <strong className="text-[#666]">Goals and beneficiaries: </strong> Share key
                objectives and the target population that benefits from your services​ ({' '}
                <a
                  href="https://www.guidestar.org/UpdateNonprofitProfile/profile-best-practices/"
                  className="text-[#2ea3f2]"
                >
                  GuideStart
                </a>{' '}
                ).
              </li>
              <li>
                <strong className="text-[#666]"> Publication:</strong> After entering these details,
                publish to earn the Silver Seal​​ ​ (
                <a
                  href="https://www.guidestar.org/UpdateNonprofitProfile/get-platinum"
                  className="text-[#2ea3f2]"
                >
                  GuideStar
                </a>
                )​(
                <a
                  href="blog.candid.org/post/what-is-a-seal-of-transparency-your-questions-about-candid-seals-answered/"
                  className="text-[#2ea3f2]"
                >
                  Candid insights
                </a>
                ).
              </li>
            </ul>
          </AccordionBold>

          <AccordionBold number="4" title=" Earn a Gold Seal of Transparency">
            <ul className="list-disc list-inside space-y-1 pb-[1em]">
              <li>
                <strong className="text-[#666]">Financial information:</strong> Upload detailed
                financial documents such as:
                <ul className="list-disc list-inside space-y-1 pl-[20px] pb-[20px]">
                  <li>Audited financial statements (if available)</li>
                  <li>IRS Form 990</li>
                  <li>Fiscal year details, including revenue, expenses, assets, and liabilities</li>
                </ul>
              </li>
              <li>
                <strong className="text-[#666]">Diversity, Equity, and Inclusion (DEI): </strong>{' '}
                Include DEI data for your organization to further demonstrate your transparency.
              </li>
              <li>
                <strong className="text-[#666]"> Publication:</strong> After Once financials and DEI
                data are in place, publish your profile to obtain the Gold Seal​​ ​ (
                <a
                  href="https://www.guidestar.org/UpdateNonprofitProfile/profile-best-practices/"
                  className="text-[#2ea3f2]"
                >
                  GuideStar
                </a>
                )​(
                <a
                  href="https://www.guidestar.org/UpdateNonprofitProfile/get-platinum"
                  className="text-[#2ea3f2]"
                >
                  GuideStar
                </a>
                ).
              </li>
            </ul>
          </AccordionBold>

          <AccordionBold number="5" title=" Earn a Platinum Seal of Transparency">
            <ul className="list-disc list-inside space-y-1 pb-[1em]">
              <li>
                <strong className="text-[#666]">Impact metrics:</strong> Provide quantitative data
                that shows the impact of your nonprofit’s work. Some examples include:
                <ul className="list-disc list-inside space-y-1 pl-[20px] pb-[20px]">
                  <li>Number of individuals served</li>
                  <li>
                    Outcomes from specific programs (e.g., scholarships awarded, animals
                    rehabilitated, etc.)
                  </li>
                  <li>Any relevant performance indicators specific to your mission</li>
                </ul>
              </li>
              <li>
                <strong className="text-[#666]">Strategic goals: </strong> Upload a strategic plan
                or similar document, or use past grant applications or board reports to outline your
                nonprofit’s goals and strategies​ ({' '}
                <a
                  href="https://www.guidestar.org/UpdateNonprofitProfile/get-platinum"
                  className="text-[#2ea3f2]"
                >
                  GuideStart
                </a>{' '}
                ).
              </li>
              <li>
                <strong className="text-[#666]"> Publication:</strong> After After inputting impact
                metrics and goals, publish your updates to earn the highest level, the Platinum Seal
                (
                <a
                  href="https://www.guidestar.org/UpdateNonprofitProfile/get-platinum"
                  className="text-[#2ea3f2]"
                >
                  GuideStar
                </a>
                )​(
                <a
                  href="https://candid.org/blogs/what-is-a-seal-of-transparency-your-questions-about-candid-seals-answered/"
                  className="text-[#2ea3f2]"
                >
                  Candid insights
                </a>
                ).
              </li>
            </ul>
          </AccordionBold>
        </div>

        <div className="pt-[26px] max-w-[90%] sm:max-w-[90%] mx-auto">
          <h1 className="text-[25px] md:text-[30px] font-[500] text-[#333] pb-[1em]" id="aria-font">
            2. Preparing to share your profile with Free For Charity
          </h1>
          <p className="text-[14px] font-[500] text-[#666] mb-[30px]" id="aria-font">
            Once you have published your report you will then be given a link to share your profile
            as well as some option for posting this badge to your website that we will need later.
          </p>
          <Image
            src={assetPath('/Images/preparing-to-share.webp')}
            alt="Free For Charity GuideStar onboarding requirements and highlighted fields"
            width={780}
            height={100}
            className="w-[780px] h-auto object-cover"
          />
        </div>

        <div className="pt-[26px] w-[90%] mx-auto text-[14px]" id="aria-font">
          <p className="font-[700] text-[#666] pb-[1em]">
            Here is an example of the links to copy into the FFC onboarding form:
          </p>
          <p className="font-[700] text-[#666] pb-[1em]">
            (These are examples only, please copy the links from your GuideStar profile.)
          </p>
          <p className="font-[500] text-[#666] pb-[1em]">FFC ‘Full Profile’ GuideStar Link:</p>
          <a
            href="https://www.guidestar.org/profile/shared/bbbe173a-87b9-4af9-a8a2-cae255a95742"
            className="break-all font-[500] text-[#2ea3f2]"
          >
            https://www.guidestar.org/profile/shared/bbbe173a-87b9-4af9-a8a2-cae255a95742
          </a>
          <p className="font-[500] text-[#666] pb-[1em] pt-[1em]">
            FFC ‘Public Profile’ GuideStar Link:
          </p>
          <a
            href="https://www.guidestar.org/profile/46-2471893"
            className="text-[#2ea3f2] break-all"
          >
            https://www.guidestar.org/profile/46-2471893
          </a>
          <p className="font-[500] text-[#666] pb-[1em] pt-[1em]">
            FFC GuideStar Seal Code (This isn’t needed for the onboarding form, but will be needed
            later):
          </p>
          <p
            className="text-center text-[#2ea3f2] pb-[1em]"
            dangerouslySetInnerHTML={{
              __html:
                '<a href="https://www.guidestar.org/profile/shared/bbbe173a-87b9-4af9-a8a2-cae255a95742" target="_blank" rel="noopener noreferrer">' +
                '<img src="https://widgets.guidestar.org/TransparencySeal/9326392" alt="GuideStar Transparency Seal" />' +
                '</a>',
            }}
          />
          <p className="font-[500] text-[#666] pb-[1em]">
            Please keep your GuideStar profile handy while filling out the FFC onboarding form. A
            significant portion of the information we require can be copied over from what you
            provided to GuideStar while achieving your Seal of Transparency.
          </p>
        </div>

        <div className="pt-[26px] max-w-[90%] sm:max-w-[90%] mx-auto text-[14px] flex items-center justify-center">
          <Transparentbtn text="Continue Onboarding with Free For Charity" href="/501c3" />
        </div>
      </div>
    </div>
  )
}

export default index
