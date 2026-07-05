import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema'
import { pageMetadata } from '@/lib/page-metadata'

const PAGE_NAME = 'Security Acknowledgements'
const CANONICAL_PATH = '/security-acknowledgements'

// Bare page name as title (the root layout template appends the brand);
// per-page OG/Twitter handling is documented in src/lib/page-metadata.ts.
export const metadata: Metadata = pageMetadata({
  title: PAGE_NAME,
  description: 'Security Acknowledgements for Free For Charity website',
  canonical: CANONICAL_PATH,
})

const index = () => {
  return (
    <div className="pt-[130px] pb-[54px]">
      <BreadcrumbSchema name={PAGE_NAME} path={CANONICAL_PATH} />
      <div className="py-[27px] w-[90%] md:w-[80%] mx-auto">
        <div className="border-t-[5px] border-[#0073e6] pt-[25px] lato-font">
          <h2 className="text-[30px] leading-[30px] font-[700] text-[#333] mt-[20px] mb-[25px]">
            Security Acknowledgements
          </h2>
          <p className="mb-[20px] pb-[10px] text-[14px] font-[500] leading-[25px] text-[#666]">
            Free For Charity would like to extend our sincere gratitude to the following security
            researchers for their invaluable contributions in helping us keep our platform safe. By
            responsibly disclosing vulnerabilities, they have played a crucial role in protecting
            our users and our data.
          </p>
          <div className="bg-[#f9f9f9] border-l-[5px] border-[#cccccc] p-[20px] mt-[30px] mb-[30px] lato-font">
            <p className="mb-[10px]  text-[14px] font-[500] leading-[25px] text-[#666]">
              As of now, we have not received any vulnerability reports that qualify for public
              acknowledgment. This page will be updated to credit researchers as reports are
              submitted and validated according to our policy.
            </p>
          </div>
          <p className="mb-[10px] text-[14px] font-[500] leading-[25px] text-[#666]">
            If you believe you have found a security vulnerability, please refer to our{' '}
            <Link
              href="/vulnerability-disclosure-policy"
              className="text-[#005BB7] font-[700] underline decoration-dotted hover:decoration-solid transition-all"
            >
              Vulnerability Disclosure Policy
            </Link>{' '}
            for instructions on how to report it.
          </p>
        </div>
      </div>
    </div>
  )
}

export default index
