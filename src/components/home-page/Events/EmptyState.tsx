import React from 'react'

export default function EmptyState() {
  return (
    <div
      data-testid="events-empty-state"
      className="mx-auto max-w-2xl rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center"
    >
      <h3 className="mb-3 text-2xl font-semibold text-gray-900" id="lato-font">
        No upcoming events right now
      </h3>
      <p className="mb-6 text-gray-600" id="lato-font">
        We&apos;re between sessions. Follow us on social to be the first to know when the next event
        drops.
      </p>
      <a
        href="https://www.facebook.com/freeforcharity"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center rounded-md bg-[#2B627B] px-5 py-2.5 text-sm font-[500] text-white hover:bg-[#1f4a5d] transition-colors"
        id="lato-font"
      >
        Follow us on Facebook
      </a>
    </div>
  )
}
