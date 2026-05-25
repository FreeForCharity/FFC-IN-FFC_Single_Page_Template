'use client'

import React, { useState, useRef, useLayoutEffect } from 'react'
import Image from 'next/image'
import { assetPath } from '@/lib/assetPath'

interface AccordionItemProps {
  title: string
  children: React.ReactNode
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [height, setHeight] = useState('0px')
  const contentRef = useRef<HTMLDivElement>(null)

  // Using useLayoutEffect (not useEffect) for synchronous DOM measurement before paint
  // This is the correct React pattern to avoid visual flicker when measuring and updating height
  useLayoutEffect(() => {
    if (contentRef.current) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHeight(isOpen ? `${contentRef.current.scrollHeight}px` : '0px')
    }
  }, [isOpen])

  const toggle = () => setIsOpen(!isOpen)

  return (
    <div
      className="shadow-[0px_16px_16px_0px_#11253E0F] mb-5 p-2 border-[5px] border-[#F58629] rounded-[10px] overflow-hidden"
      id="lato-font"
    >
      {/* Header */}
      <button
        onClick={toggle}
        className={`w-full px-4 py-3 flex items-center justify-between text-left transition-colors duration-300 cursor-pointer ${
          isOpen ? 'bg-white/90' : 'bg-none'
        }`}
        aria-expanded={isOpen}
      >
        <span
          className={`font-[400] text-[28px] lg:text-[36px] leading-[100%] flex-1 pr-3 transition-colors duration-300`}
        >
          {title}
        </span>

        <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
          {isOpen ? (
            <Image width={51} height={51} src={assetPath('/Svgs/minus.svg')} alt="Minus" />
          ) : (
            <Image width={51} height={51} src={assetPath('/Svgs/plus.svg')} alt="Plus" />
          )}
        </span>
      </button>

      {/* Content */}
      <div
        className={`overflow-hidden transition-all duration-800 ease-in-out ${
          isOpen ? 'bg-white/90' : 'bg-white'
        }`}
        style={{ maxHeight: height }}
      >
        <div
          ref={contentRef}
          className="px-4 pb-4 pt-2 text-[22px] lg:text-[25px] font-[400]"
          id="lato-font"
        >
          {children}
        </div>
      </div>
    </div>
  )
}

export default AccordionItem
