import React from 'react'
import {assets} from '../assets/assets'

const About = () => {
  return (
    <div>
      <div className='text-center text-2xl pt-10 text-gray-500'>
        <p>ABOUT <span className='text-gray-700 font-medium'>US</span></p>
      </div>
      <div className='my-10 flex flex-col md:flex-row gap-12'>
        <img className='w-full md:max-w-[360px]' src={assets.about_image} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gary-600 '>
          <p>Welcom to Prescripto,Your Trusted Partner in Managing Your Healthcare Needs Conveniently And Efficiently At Prescripto,We Understand the challenge Individuals Face When it Comes to Scheduling Doctor Appointment and Managing Their Health Records. </p>
          <p> Prescripto is Committed to Excellence in Healthcare Technology. We Continuously Strive To Enchance Our Platform,Intergating the latest Advancements to empower user experience And Deliver Superior Service.Whether You're Booking Your First Appointment or Managing Ongoing Care,Prescripto is Here To Support You Every Step of the Way</p>
          <b className='text-gray-800'>Our Vision</b>
          <p>Our Vision At Prescripto Is to Create Seamless Healthcare Experience For Every USer.We Aim To Bridge The Gap Between Patients And Healthcare Providers,It Easier For You To Access The CAre You Need,When You Need It. </p>
        </div>
      </div>

      <div className='text-xl my-4'>
        <p>WHY <span className='text-gray-700 font-semibold'>CHOOSE US</span> </p>

      </div>

      <div className='flex flex-col md:flex-row mb-20'>
        <div className='border px-10 mf:px-16 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>Efficiency:</b>
          <p>StreamLined Appointment Scheduling  that fits into your busy lifestyle. </p>
          
        </div>
        <div className='border px-10 mf:px-16 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>Convenience:</b>
          <p>Access to a network trusted healthcare professionals in your area</p>

        </div>
        <div className='border px-10 mf:px-16 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>Personlization</b>
          <p>Tailored recommendations and reminders to help you stay on top of your health</p>

        </div>
      </div>
      
    </div>
  )
}

export default About
