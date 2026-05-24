import React from 'react'
import InfoCard from '../../ui/BlogCard'
import { assetPath } from '@/lib/assetPath'

interface Blog {
  heading: string
  date: string
  description: string
  imageUrl?: string
  href?: string // added href for dynamic link
}

const OutBlogs: React.FC = () => {
  const blogs: Blog[] = [
    {
      heading: 'We just updated for the 2022 GuideStar Platinum Seal',
      date: 'Jan 9, 2023',
      description:
        "We're excited to share that our organization has earned a 2022 Platinum Seal of Transparency with Candid! Now, you can support our work with trust and confidence by viewing our nonprofit profile Free For Charity - GuideStar Profile",
      imageUrl: assetPath('/Images/card-image.webp'),
      href: 'https://freeforcharity.org/we-just-updated-for-the-2022-guidestar-platinum-seal/', // example link
    },
    {
      heading: 'Our organization earned a 2021 Platinum Seal of Transparency!',
      date: 'Jun 1, 2021',
      description:
        'Our organization earned a 2021 Platinum Seal of Transparency! Now, everyone can see our strategy, metrics, and achievements. Check out our updated #NonprofitProfile on Candid https://www.guidestar.org/profile/46-2471893',
      href: 'https://freeforcharity.org/our-organization-earned-a-2021-platinum-seal-of-transparency/', // example link
    },
    {
      heading: 'What is the cost?',
      date: 'Aug 24, 2017',
      description:
        'You would be amazed at how frequently we get asked this question about our costs. For our consulting engagements we are actually 100% free. While there are many, many companies and some other nonprofits that charge for these services we provide them for free! Hence...',
      href: 'https://freeforcharity.org/what-is-the-cost/', // example link
    },
  ]

  return (
    <div className="py-10 pb-25 px-4 bg-white">
      <h2 className="text-center py-5 font-[700] text-[#F27022] text-[30px] md:text-[40px] leading-[44px] mb-7">
        Our Blogs
      </h2>
      <div className="w-full max-w-[1200px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 items-start">
        {blogs.map((blog, index) => (
          <InfoCard
            key={index}
            heading={blog.heading}
            date={blog.date}
            description={blog.description}
            imageUrl={blog.imageUrl}
            href={blog.href} // pass href to InfoCard
          />
        ))}
      </div>
    </div>
  )
}

export default OutBlogs
