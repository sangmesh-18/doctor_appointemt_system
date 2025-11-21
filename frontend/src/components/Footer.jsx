import React from 'react'
import {assets} from '../assets/assets'

const Footer = () => {
  return (
    <div className='md:mx-10'>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
            <div>
                <img className='mb-5 w-40' src={assets.logo} alt="" />
                <p className='w-full md:w-2/3 text-gray-600 loading-6  '>Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi quaerat, debitis quia quas veritatis eveniet libero consectetur impedit facere a laborum ratione cumque neque odio deleniti. In officiis exercitationem quaerat?</p>
            </div>
            <div>
                <p className='text-xl font-medium mb-5'>Company</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li>Home</li>
                    <li>About us</li>
                    <li>Contact us</li>
                    <li>Privacy Policy</li>
                </ul>

            </div>
            <div>
                <p className='text-xl font-medium mb-5' >GET IN TOUCH</p>
                <ul  className='flex flex-col gap-2 text-gray-600'>
                    <li>+91 9325709822</li>
                    <li>xyz@gmail.com</li>
                </ul>

            </div>
            
        </div>   
        <div>
                <hr />
                <p className='py-10 text-sm text-center'>Copyright 2024@ Prescripto -All Right Reserved</p>
            </div> 
    </div>
  )
}

export default Footer
