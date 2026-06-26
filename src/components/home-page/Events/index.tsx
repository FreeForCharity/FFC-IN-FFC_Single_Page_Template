import React from 'react'

const Events = () => {
  return (
    <div id="events" className="py-[52px]">
      <div className="w-[90%] mx-auto max-w-[1280px]">
        <h2
          className="font-[400] text-[40px] lg:text-[48px] leading-[100%] tracking-[0] text-center mx-auto mb-[50px]"
          id="faustina-font"
        >
          Upcoming Events
        </h2>

        <div className="text-center mb-8">
          <p className="text-[20px] lg:text-[25px] font-[500]" id="lato-font">
            Join us for upcoming volunteer opportunities, training sessions, and community events.
          </p>
        </div>

        {/* SociableKit Facebook Events Widget */}
        <div className="flex justify-center">
          <iframe
            src="https://widgets.sociablekit.com/facebook-page-events/iframe/25631700"
            frameBorder={0}
            width="100%"
            height="1000"
            style={{ maxWidth: '1200px' }}
            title="Facebook Events"
            loading="lazy"
            className="rounded-lg"
            sandbox="allow-scripts allow-same-origin"
          ></iframe>
        </div>

        <div className="text-center mt-8">
          <p className="text-[18px] font-[400] text-gray-600" id="lato-font">
            <a
              href="https://www.facebook.com/freeforcharity"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2EA3F2] hover:underline"
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
