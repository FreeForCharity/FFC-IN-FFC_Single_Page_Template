import React from 'react'
import { assetPath } from '@/lib/assetPath'

interface SupportMissionSectionProps {
  title?: string
  description1?: string
  description2?: string
}

const SupportMissionSection: React.FC<SupportMissionSectionProps> = ({
  title = 'Support Our Mission',
  description1 = 'Join us in reaching our $1,000,000 Endowment goal to ensure sustainable support for our US based 501c3 charities.',
  description2 = 'Your contribution will help provide free domain names and essential email services to nonprofits, enabling them to focus on their missions without the burden of digital costs. Every donation brings us closer to empowering more charities with the tools they need to succeed.',
}) => {
  return (
    <section
      className="pt-[90px] pb-[90px] bg-[#003566] md:min-h-screen flex items-center justify-center p-6
      sm:pt-[60px] sm:pb-[60px] sm:p-4"
      style={{
        backgroundImage: `
          linear-gradient(90deg, #003566 40%, rgba(0, 0, 0, 0.5) 100%),
          url(${assetPath('/Images/support-mission-bg.webp')})
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div
        className="bg-white rounded-[6px] shadow-[0px_24px_72px_-12px_rgba(0,0,0,0.12)] p-[40px] max-w-[540px] text-center
      sm:p-[24px] sm:max-w-[540px] w-[100%]"
      >
        <h1
          className="text-[32px] font-[500] text-gray-900 mb-[10px] pb-[10px] sm:leading-[60px]
          sm:text-[50px] leading-[40px]"
          id="cinzel"
        >
          {title}
        </h1>
        <p
          className="sm:text-[16px] font-[500] text-[#000000a3] mb-6 sm:leading-[28px]
          text-[14px] leading-[24px]"
          id="fauna-font"
        >
          {description1}
        </p>
        <p
          className="sm:text-[16px] font-[500] text-[#000000a3] mb-6 sm:leading-[28px]
          text-[14px] leading-[24px]"
          id="fauna-font"
        >
          {description2}
        </p>
      </div>
    </section>
  )
}

export default SupportMissionSection
