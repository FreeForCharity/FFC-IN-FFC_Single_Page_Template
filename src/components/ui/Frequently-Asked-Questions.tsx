import React from 'react'
import Image from 'next/image'
import { assetPath } from '@/lib/assetPath'

interface AccordionItemProps {
  title: string
  children: React.ReactNode
}

// Built on native <details>/<summary> (Modern Web Guidance:
// ui-components/accordion). The browser handles the open/closed state, its
// accessibility (summary is exposed as an expandable button), keyboard
// support, and keeps closed answers in the HTML (Chromium also opens the
// matching answer for find-in-page), so the component needs no client
// JavaScript. The open/close slide is CSS (.faq-details in globals.css) and is
// progressive enhancement: browsers without interpolate-size toggle instantly.
const FrequentlyAskedQuestions: React.FC<AccordionItemProps> = ({ title, children }) => {
  return (
    <details className="faq-details group mb-5 border-b-[2px] border-[#B7B7B7] lato-font">
      <summary className="w-full px-4 py-3 flex items-center justify-between text-left cursor-pointer list-none [&::-webkit-details-marker]:hidden">
        {/* Text takes remaining space */}
        <span className="font-[400] text-[20px] md:text-[32px] flex-1 pr-3 lato-font">{title}</span>

        {/* Decorative icon; the open state is announced from <details> itself */}
        <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center" aria-hidden="true">
          <Image
            src={assetPath('/Svgs/down-arrow.svg')}
            alt=""
            width={40}
            height={16}
            className="group-open:hidden"
          />
          <Image
            src={assetPath('/Svgs/up-arrow.svg')}
            alt=""
            width={40}
            height={13}
            className="hidden group-open:block"
          />
        </span>
      </summary>

      <div className="px-4 pb-4 pt-2 text-[#555555] text-[20px] md:text-[25px] font-[400] lato-font">
        {children}
      </div>
    </details>
  )
}

export default FrequentlyAskedQuestions
