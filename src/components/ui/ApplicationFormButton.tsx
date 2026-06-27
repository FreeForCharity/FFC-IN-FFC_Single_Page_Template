'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { siteConfig } from '@/lib/site.config'

interface ApplicationFormButtonProps {
  text?: string
  className?: string
  formUrl?: string
}

const ApplicationFormButton: React.FC<ApplicationFormButtonProps> = ({
  text = 'Apply to Become a Supported Charity',
  className = '',
  formUrl,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const modalRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  // Microsoft Form URL. Defaults to the configured form in siteConfig; callers
  // can override per-instance via the `formUrl` prop.
  // Format: https://forms.office.com/r/{formId}
  const microsoftFormUrl = formUrl || siteConfig.integrations.microsoftFormUrl

  const openPopup = useCallback(() => {
    setIsOpen(true)
    setIsLoading(true)
  }, [])

  const closePopup = useCallback(() => {
    setIsOpen(false)
    setIsLoading(true) // Reset loading state for next open
  }, [])

  const handleIframeLoad = () => {
    setIsLoading(false)
  }

  // Handle body scroll lock with cleanup
  useEffect(() => {
    if (isOpen) {
      // Store original overflow value
      const originalOverflow = document.body.style.overflow
      // Prevent body scroll when popup is open
      document.body.style.overflow = 'hidden'

      // Handle Escape key to close modal
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          closePopup()
        }
      }

      document.addEventListener('keydown', handleEscape)

      // Cleanup function to restore original overflow and remove event listener
      return () => {
        document.body.style.overflow = originalOverflow
        document.removeEventListener('keydown', handleEscape)
      }
    }
  }, [isOpen, closePopup])

  // Focus management for modal
  useEffect(() => {
    if (isOpen && modalRef.current) {
      // Store the previously focused element
      previousFocusRef.current = document.activeElement as HTMLElement

      // Focus the first focusable element in the modal (close button)
      const focusableElements = modalRef.current.querySelectorAll(
        'button:not([disabled]), [href]:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
      )
      if (focusableElements.length > 0) {
        ;(focusableElements[0] as HTMLElement).focus()
      }

      // Cleanup function to restore focus when modal closes
      return () => {
        if (previousFocusRef.current) {
          previousFocusRef.current.focus()
        }
      }
    }
  }, [isOpen])

  return (
    <>
      <button
        onClick={openPopup}
        className={`
          rounded-[20px] border-[5px] border-[#2A6682] flex items-center justify-center 
          text-black font-[400] text-[25px] px-[28px] py-[16px] 
          hover:bg-[#2A6682] hover:text-white transition-all duration-300
          ${className}
         lato-font`}
      >
        {text}
      </button>

      {/* Popup Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={closePopup}
          role="dialog"
          aria-modal="true"
          aria-labelledby="application-form-title"
        >
          <div
            ref={modalRef}
            className="relative w-full max-w-5xl h-[90vh] mx-4 bg-white rounded-lg shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Screen reader only heading for accessibility */}
            <h2 id="application-form-title" className="sr-only">
              Charity Application Form
            </h2>

            {/* Close button */}
            <button
              onClick={closePopup}
              className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Close application form"
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Loading indicator */}
            {isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white rounded-lg z-20">
                <div className="relative">
                  {/* Animated spinner */}
                  <div className="w-16 h-16 border-4 border-[#2A6682] border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="mt-4 text-lg text-gray-600 font-medium">
                  Loading application form...
                </p>
                <p className="mt-2 text-sm text-gray-500">This may take a few seconds</p>
              </div>
            )}

            {/* Microsoft Form iframe */}
            <iframe
              src={microsoftFormUrl}
              className="w-full h-full rounded-lg border-0"
              title="Charity Application Form"
              sandbox="allow-scripts allow-forms allow-popups allow-same-origin"
              allow="geolocation"
              onLoad={handleIframeLoad}
            />
          </div>
        </div>
      )}
    </>
  )
}

export default ApplicationFormButton
