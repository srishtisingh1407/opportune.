import { industries } from '@/data/industries'
import React from 'react'
import OnboardingForm from './_components/onboardingform'

const OnboardingPage = () => {
     
  return (
    <main>
        <OnboardingForm industries={industries}/>
    </main>
  )
}

export default OnboardingPage