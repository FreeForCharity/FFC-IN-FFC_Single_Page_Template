'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { siteConfig } from '@/lib/site.config'
import { useDialogLightDismiss } from '@/lib/useDialogLightDismiss'

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
  const dialogRef = useRef<HTMLDialogElement>(null)

  // Microsoft Form URL. Defaults to the configured form in siteConfig; callers
  // can override per-instance via the `formUrl` prop.
  // Format: https://forms.office.com/r/{formId}
  const microsoftFormUrl = formUrl || siteConfig.integrations.microsoftFormUrl

  const openPopup = useCallback(() => {
    setIsOpen(true)
    setIsLoading(true)
  }, [])

  // Runs on every way the native dialog closes: the close button, Escape,
  // the mobile back gesture, and clicking the backdrop.
  const handleClose = useCallback(() => {
    setIsOpen(false)
    setIsLoading(true) // Reset loading state for next open
  }, [])

  const closePopup = useCallback(() => {
    dialogRef.current?.close()
  }, [])

  const handleIframeLoad = () => {
    setIsLoading(false)
  }

  // Open as a native modal dialog (Modern Web Guidance: ui-components/dialog).
  // showModal() gives us, from the browser: top layer, inert page behind,
  // focus moved into the dialog and returned to the trigger on close, and
  // Escape handling. No hand-written focus trap, Escape handler or body
  // overflow lock is needed.
  useEffect(() => {
    const dialog = dialogRef.current
    if (isOpen && dialog && !dialog.open) {
      dialog.showModal()
    }
  }, [isOpen])

  // Backdrop-click fallback for browsers without <dialog closedby="any">.
  const lightDismiss = useDialogLightDismiss(dialogRef)

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

      {/* Popup Modal: native <dialog> opened with showModal() */}
      {isOpen && (
        <dialog
          ref={dialogRef}
          // closedby="any" enables click-outside-to-close natively; React
          // passes the lowercase attribute through untouched.
          {...{ closedby: 'any' }}
          onClose={handleClose}
          {...lightDismiss}
          aria-labelledby="application-form-title"
          className="m-auto w-[calc(100%-2rem)] max-w-5xl h-[90vh] p-0 bg-white rounded-lg shadow-xl"
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
              <p className="mt-4 text-lg text-gray-600 font-medium">Loading application form...</p>
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
        </dialog>
      )}
    </>
  )
}

export default ApplicationFormButton
