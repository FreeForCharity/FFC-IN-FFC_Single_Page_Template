'use client'

import ToolCard from '@/components/ui/ToolCard'
import { assetPath } from '@/lib/assetPath'

export default function ToolsPage() {
  const topRow = [
    {
      logo: assetPath('/Images/quickbooksLogo.webp'),
      title: 'QuickBooks Online ($75 per year with 5 users)',
      description:
        'If your accounting is not right a lot will suffer. Techsoup offers the discounts for QuickBooks the industry leader in accounting. Both online and offline versions are offered at the same price.',
      link: 'https://www.techsoup.org/products/quickbooks-online-plus--1-year-initial-subscription--5-users--G-49616--',
    },
    {
      logo: assetPath('/Images/googleLogo.webp'),
      title: 'Google Workspace for non-profits (free with paid plans)',
      description:
        'apps including Gmail and grant options for free AdWords advertisements. If you do not like or have not used outlook choose this for Gmail and free storage space with google drive.',
      link: 'https://www.google.com/nonprofits/',
    },
    {
      logo: assetPath('/Images/officeLogo.webp'),
      title: 'Microsoft Office 365 enterprise for non-profits (free with paid packages)',
      description:
        'NOTE: FFC Recomended — Incredible discounts for non profits at rates better than even students get for advanced enterprise features. This should be the first product you seek to get.',
      link: 'https://nonprofit.microsoft.com/en-us/getting-started',
    },
  ]

  const bottomRow = [
    {
      logo: assetPath('/Images/upwork.webp'),
      title: 'Salesforce (free to nonprofits up to 10 seats per year)',
      description:
        'Worlds best CRM available. NOTE: Microsoft offer now includes CRM for an all in one solution.',
      link: 'http://www.salesforcefoundation.org/nonprofit/',
    },
    {
      logo: assetPath('/Images/grantstationLogo.webp'),
      title: 'GrantStation (199$ per year)',
      description:
        'Best tool if you have a dedicated grant writer or a grant worthy type of charity.',
      link: 'http://www.techsoup.org/products/grantstation-%28discounted%29--G-2575-',
    },
    {
      logo: assetPath('/Images/mailchimpLogo.webp'),
      title: 'MailChimp(offers multiple packages paid ones are 15% off for non-profits)',
      description: 'mailchimp is an always-on marketing platform for small businesses.',
      link: 'https://mailchimp.com/pricing/marketing/',
    },
  ]

  return (
    <div className="py-[54px]  bg-[#535353]">
      <div className="py-[27px] w-[90%] lg:w-[80%] mx-auto max-w-[1080px] ">
        {/* Top Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[32px] mb-8">
          {topRow.map((tool, index) => (
            <ToolCard key={index} {...tool} />
          ))}
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bottomRow.map((tool, index) => (
            <ToolCard key={index} {...tool} />
          ))}
        </div>
      </div>
    </div>
  )
}
