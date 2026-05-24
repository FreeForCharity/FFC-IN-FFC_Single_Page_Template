import Link from 'next/link'
import type { Metadata } from 'next'
import { siteConfig } from '@/lib/site.config'

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: `The page you requested could not be found on ${siteConfig.name}.`,
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <div
      className="pt-[130px] pb-[80px] min-h-[60vh] flex items-center"
      aria-labelledby="not-found-heading"
    >
      <div className="w-[90%] md:w-[80%] mx-auto text-center">
        <p className="text-[14px] font-semibold tracking-widest text-[#0073e6] uppercase">404</p>
        <h1
          id="not-found-heading"
          className="mt-4 text-[34px] md:text-[42px] font-bold text-[#333]"
        >
          We can&apos;t find that page
        </h1>
        <p className="mt-6 text-[16px] leading-[26px] text-[#666] max-w-[560px] mx-auto">
          The link you followed may be broken, or the page may have been moved. Head back to the
          homepage to keep exploring {siteConfig.name}.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
          <Link
            href="/"
            className="inline-flex items-center justify-center bg-[#0073e6] hover:bg-[#005BB7] text-white px-6 py-3 text-[16px] font-semibold transition-colors"
          >
            Go to homepage
          </Link>
          <Link
            href={siteConfig.vulnerabilityDisclosurePath}
            className="inline-flex items-center justify-center border border-[#0073e6] text-[#0073e6] hover:bg-[#0073e6] hover:text-white px-6 py-3 text-[16px] font-semibold transition-colors"
          >
            Report an issue
          </Link>
        </div>
      </div>
    </div>
  )
}
