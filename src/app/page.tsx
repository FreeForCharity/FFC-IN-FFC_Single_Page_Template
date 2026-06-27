import React from 'react'
// import HomePage from './Home/page'
import HomePage from '@/app/home-page'
import OrganizationSchema from '@/components/seo/OrganizationSchema'
import FaqSchema from '@/components/seo/FaqSchema'

const page = () => {
  return (
    <div>
      <OrganizationSchema />
      <FaqSchema />
      {/* <HomePage /> */}
      <HomePage />
    </div>
  )
}

export default page
