import React from 'react'
import { siteConfig } from '@/lib/site.config'

const Events = () => {
  return (
    <div id="events" className="py-[52px]">
      <div className="w-[90%] mx-auto max-w-[1280px]">
        <h2 className="font-[400] text-[40px] lg:text-[48px] leading-[100%] tracking-[0] text-center mx-auto mb-[50px] faustina-font">
          Upcoming Events
        </h2>

        <div className="text-center mb-8">
          <p className="text-[20px] lg:text-[25px] font-[500] lato-font">
            Join us for upcoming volunteer opportunities, training sessions, and community events.
          </p>
        </div>

        {/* SociableKit Facebook Events Widget */}
        <div className="flex justify-center">
          <div className="relative w-full max-w-[1200px]">
            {/* CSS-only loading placeholder shown until the lazy iframe loads. */}
            <div
              className="absolute inset-0 animate-pulse bg-gray-100 rounded-lg pointer-events-none motion-reduce:animate-none"
              aria-hidden="true"
            />
            <iframe
              src={siteConfig.integrations.sociableKitEventsWidgetUrl}
              frameBorder={0}
              width="100%"
              height="1000"
              title="Facebook Events"
              loading="lazy"
              className="relative rounded-lg"
              sandbox="allow-scripts allow-same-origin"
            ></iframe>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-[18px] font-[400] text-gray-600 lato-font">
            <a
              href="https://www.facebook.com/freeforcharity"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#227AB5] underline"
            >
              View all events on Facebook
            </a>
          </p>
        </div>
      </div>

      <div className="w-[95%] mt-[50px] mx-auto border border-[#2B627B]"></div>
    </div>
  )
}

export default Events
