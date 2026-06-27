import React from 'react'
import HomePage from '@/app/home-page'
import OrganizationSchema from '@/components/seo/OrganizationSchema'
import FaqSchema from '@/components/seo/FaqSchema'
import WebsiteSchema from '@/components/seo/WebsiteSchema'

const page = () => {
  return (
    <div>
      <OrganizationSchema />
      <WebsiteSchema />
      <FaqSchema />
      <HomePage />
    </div>
  )
}

export default page
