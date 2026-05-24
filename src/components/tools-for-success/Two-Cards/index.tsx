import React from 'react'
import SlidingCard from '@/components/ui/SlidingCard'
import { assetPath } from '@/lib/assetPath'

const index = () => {
  return (
    <div>
      <div className="py-[54px] ">
        <div className="">
          <SlidingCard
            direction="right"
            subtitle="Linkedin (free with a paid premium version)"
            description={
              <>
                Linkedin is a critical tool for managing contacts. Think of this as a proverbial
                online rolodex that tracks people instead of emails and phone numbers. A person’s
                data changes over time but if they are on Linkedin the connection remains. It also
                serves as an inspirational tool. You can look up the profiles of people in your
                extended network and see what education, classes, skills, and positions led them to
                that point. You can then start obtaining those things to get yourself on the same
                path. NOTE: I have the paid access to linkedin.com
              </>
            }
            buttonText="Available Here"
            buttonLink="https://nonprofit.linkedin.com/"
            imageSrc={assetPath('/Images/Linkedin-logo.webp')} // 👈 image passed as prop
          />
          <SlidingCard
            direction="right"
            subtitle="Dragon Naturally Speaking ($200)"
            description={
              <>
                This is the most expensive and most controversial recommendation on my list. I have
                been using dragon naturally speaking for many years. I have a love and hate
                relationship with the product. Where I can use it (i.e. install it and have a quite
                place to write) it is amazing. I finished most of all my college papers with this
                and credit my fast competition to this tool. Also I am dyslexic and cannot spell.
                This software fixes both of these options. If I ever get a full office to myself and
                can use this at work the world needs to look out. I highly recommend this tool.
                NOTE: In the course of my use of this software I have spent around $1000 total for
                all version and microphones to increase accuracy.
              </>
            }
            buttonText="Available Here"
            buttonLink="https://www.nuance.com/dragon.html"
            imageSrc={assetPath('/Images/dragon-logo.webp')} // 👈 image passed as prop
          />
        </div>
      </div>
    </div>
  )
}

export default index
