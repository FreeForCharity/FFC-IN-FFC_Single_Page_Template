import React from 'react'
import Hero from '@/components/home-page/Hero'
import Mission from '@/components/home-page/Mission'
import SupportFreeForCharity from '@/components/home-page/SupportFreeForCharity'
import EndowmentFeatures from '@/components/home-page/Endowment-Features'
import OurPrograms from '@/components/home-page/Our-Programs'
import VolunteerwithUs from '@/components/home-page/Volunteer-with-Us'
import Results2023 from '@/components/home-page/Results-2023'
import Testimonials from '@/components/home-page/Testimonials'
import TheFreeForCharityTeam from '@/components/home-page/TheFreeForCharityTeam'
import FrequentlyAskedQuestions from '@/components/home-page/FrequentlyAskedQuestions'
import Events from '@/components/home-page/Events'

const index = () => {
  return (
    <div>
      <Hero />
      <Mission />
      <Results2023 />
      <Testimonials />
      <VolunteerwithUs />
      <Events />
      <SupportFreeForCharity />
      <EndowmentFeatures />
      <OurPrograms />
      <FrequentlyAskedQuestions />
      <TheFreeForCharityTeam />
    </div>
  )
}

export default index
