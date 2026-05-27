'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { siteConfig } from '@/lib/site.config'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Render error:', error)
    }
  }, [error])

  return (
    <div
      className="pt-[130px] pb-[80px] min-h-[60vh] flex items-center"
      aria-labelledby="error-heading"
    >
      <div className="w-[90%] md:w-[80%] mx-auto text-center">
        <p className="text-[14px] font-semibold tracking-widest text-[#b91c1c] uppercase">
          Something went wrong
        </p>
        <h1 id="error-heading" className="mt-4 text-[34px] md:text-[42px] font-bold text-[#333]">
          We hit an unexpected error
        </h1>
        <p className="mt-6 text-[16px] leading-[26px] text-[#666] max-w-[560px] mx-auto">
          You can try the action again, or return to the {siteConfig.name} homepage. If the problem
          persists, please report it via our{' '}
          <Link
            href={siteConfig.vulnerabilityDisclosurePath}
            className="text-[#0073e6] underline decoration-dotted hover:decoration-solid"
          >
            disclosure form
          </Link>
          .
        </p>
        {error.digest ? (
          <p className="mt-2 text-[12px] text-[#888]">Reference ID: {error.digest}</p>
        ) : null}
        <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center bg-[#0073e6] hover:bg-[#005BB7] text-white px-6 py-3 text-[16px] font-semibold transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center border border-[#0073e6] text-[#0073e6] hover:bg-[#0073e6] hover:text-white px-6 py-3 text-[16px] font-semibold transition-colors"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  )
}
