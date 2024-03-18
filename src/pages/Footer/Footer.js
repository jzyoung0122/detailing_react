import React from 'react'
import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { MdOutlineAccessTimeFilled } from "react-icons/md";

export default function Footer() {
  return (
    <div>
        <footer className="fixed bottom-0 left-0 z-20 w-full p-4 bg-slate-100 shadow-lg  bg-opacity-85 border-t border-gray-200 md:flex md:items-center md:justify-between md:p-6 dark:bg-gray-800 dark:border-gray-600">
    <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023 Hao's Garage. All Rights Reserved.
    </span>
    <ul className="flex flex-wrap items-center mt-3  text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
        <li className='me-4 md:me-6'>
        <FaPhoneAlt className='inline-block mr-2'/> 0478618287
        </li>
        <li className='me-4 md:me-6'> 
        <MdEmail className='inline-block mr-2'/> haosgarage4car@gmail.com
        </li>
        <li className='me-4 md:me-6'> 
        <MdOutlineAccessTimeFilled className='inline-block mr-2'/> Weekends from 7:30 to 18:30
        </li>
        
    </ul>
</footer>
    </div>
  )
}
