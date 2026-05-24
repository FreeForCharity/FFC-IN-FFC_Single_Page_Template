import React from 'react'
import TrainingCard from '../../ui/trainingcard'
import BlueBtn from '../../ui/Bluebtn'
import Transparentbtn from '@/components/ui/Transparentbtn'
import { assetPath } from '@/lib/assetPath'

const SupportFreeForCharity: React.FC = () => {
  return (
    <>
      {/* ---------- TOP BANNER ---------- */}
      <section className="py-[70px] bg-[#FCFCFC]">
        <div className="container max-w-[1280px] mx-auto px-4 md:px-10 flex flex-col md:flex-row items-center md:items-start justify-start gap-6">
          {/* Left – Text */}
          <div className="text-center md:text-left">
            <h1 className="font-[700] text-[30px] md:text-[40px] leading-[44px] text-[#f27022] mb-4">
              SUPPORT FREE FOR CHARITY!
            </h1>
            <p
              className="w-full max-w-[650px] font-[500] text-[18px] leading-[27px] text-black"
              id="montserrat-font"
            >
              By donating you help drive our mission and allow us to support more charities with our
              Domain, Website, and other services.
            </p>
          </div>
          {/* Right – PayPal Donate button */}
          <Transparentbtn text="Donate With Paypal" href="/donate" />
        </div>
      </section>

      {/* ---------- THREE CARDS ---------- */}
      <section className="py-10">
        <div className="container max-w-[1100px] mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div>
            <h1
              className="text-center mb-10 font-[600] text-[18px] leading-[27px] text-black px-1"
              id="montserrat-font"
            >
              LOOKING TO GET FREE SKILLS TRAINING AND HELP CHARITIES AT THE SAME TIME? START A
              TRAINING PROGRAM.
            </h1>
            <TrainingCard
              src={assetPath('/Svgs/tickmark.svg')}
              heading="FREE TRAINING PROGRAMS"
              text="Are you looking to gain marketable skills in technology and business services? Are you looking to start building a portfolio showing real world support to small, medium, and large organizations? If so, this is the place for you."
            />
            <BlueBtn href="/free-training-programs" />
          </div>

          {/* Card 2 */}
          <div>
            <h1
              className="text-center mb-10 font-[600] text-[18px] leading-[27px] text-black px-1"
              id="montserrat-font"
            >
              CHARITY IN NEED OF HELP? GET FREE SUPPORT WITH YOUR ONLINE AND OFFLINE CRITICAL
              PROJECTS.
            </h1>
            <TrainingCard
              src={assetPath('/Svgs/home.svg')}
              heading="CHARITY ONBOARDING"
              text="If you are representing a charity or you currently work for a charity and want to improve your own skills start here to get help for your organization. You get instant access to many of our free tools and products right away!"
            />
            <BlueBtn href="/501c3" />
          </div>

          {/* Card 3 */}
          <div>
            <h1
              className="text-center mb-10 font-[600] text-[18px] leading-[27px] text-black px-1"
              id="montserrat-font"
            >
              ARE YOU A BUSINESS OR INDIVIDUAL LOOKING TO DONATE OR PARTNER WITH FREE FOR CHARITY?
            </h1>
            <TrainingCard
              src={assetPath('/Svgs/heart.svg')}
              heading="VOLUNTEER AND/OR DONATE"
              text="We are always looking for individuals and business to support our training programs. Both donations as well as performing volunteer work for our training programs are critical to the success of Free For Charity and it’s mission."
            />
            <BlueBtn href="/volunteer" />
          </div>
        </div>
      </section>
    </>
  )
}

export default SupportFreeForCharity
