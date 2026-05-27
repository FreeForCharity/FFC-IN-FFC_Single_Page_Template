import React from 'react'
import SlidingCard from '@/components/ui/SlidingCard'
import { assetPath } from '@/lib/assetPath'

const index = () => {
  return (
    <div>
      <div className="py-[54px] ">
        <div className="">
          <div className="w-[80%] mx-auto pt-[27px] pb-[35px] ">
            <h1
              className="mb-[11px] pb-[10px] text-[40px] font-[700] leading-[44px] text-center text-[#333] tracking-[1px]"
              id="faustina-font"
            >
              Tools for <span className="text-[#e88d33]">Businesses</span>
            </h1>
            <div className="w-[18%] mx-auto h-[5px] bg-[#E88D33]"></div>
          </div>

          <SlidingCard
            direction="right"
            subtitle="Wave Accounting (free: add supported)"
            description={
              <>
                Wave is the basic accounting that you need as an ultra small business or a
                consultant. Use this first and if you outgrow it and have to move to the very
                expensive QuickBooks later then it is no problem. Wave gets better every year and
                adds more and more features. I use this for several of my small businesses
              </>
            }
            buttonText="Available Here"
            buttonLink="https://www.waveapps.com/"
            imageSrc={assetPath('/Images/Wave-logo.webp')} // 👈 image passed as prop
          />
          <SlidingCard
            direction="right"
            subtitle="Shoeboxed (free with a paid premium version)"
            description={
              <>
                Shoeboxed is a North Carolina based document scanning company that takes basically
                any paper you get for your business and scans it with OCR and human oversight to
                ensure it is accurate. In the free version you have to upload the documents by
                tracking a picture but in the paid versions you can just put them in pre-paid
                envelopes and mail them in for processing. This is an amazing tool if you need more
                things scanned than just receipts and invoices like what is now included in the free
                wave accounting software. NOTE: I use the paid version of this for some of my
                businesses
              </>
            }
            buttonText="Available Here"
            buttonLink="https://www.shoeboxed.com/"
            imageSrc={assetPath('/Images/shoeboxed.webp')} // 👈 image passed as prop
          />

          <SlidingCard
            direction="right"
            subtitle="Google Apps ($5 a month)"
            description={
              <>
                This product I have used because I use Google for the personal side. This is the
                business version. Now that Office 365 has come out I am starting to think of moving
                my services over to that and may change this recommendation for office productivity
                and email on a budget. Microsoft Office was always expected on top of this and that
                moved the needle to thinking Office 365 may overtake it.
              </>
            }
            buttonText="Available Here"
            buttonLink="https://www.google.com/enterprise/apps/business/"
            imageSrc={assetPath('/Images/google.webp')} // 👈 image passed as prop
          />

          <SlidingCard
            direction="left"
            subtitle="Fiverr ($5 dollars minimum per gig)"
            description={
              <>
                Great site for dipping your feet into outsourcing tasks for your business. You can
                get almost any task done for $5 and many offer upgrades for larger projects.
                Streamlined billing with your business PayPal or standard credit card.
              </>
            }
            buttonText="Available Here"
            buttonLink="http://fiverr.com/"
            imageSrc={assetPath('/Images/fiverr.webp')} // 👈 image passed as prop
          />

          <SlidingCard
            direction="left"
            subtitle="UpWork (Pay per job)"
            description={
              <>
                This is the full services solution to getting access to skills you don’t have.
                Freelancers of every type and price point are here and you really have to spend the
                time picking the right people for the right jobs. Be careful with these sites.
              </>
            }
            buttonText="Available Here"
            buttonLink="https://www.odesk.com/"
            imageSrc={assetPath('/Images/upwork.webp')} // 👈 image passed as prop
          />
        </div>
      </div>
    </div>
  )
}

export default index
