'use client';

import { Button, Navbar } from 'flowbite-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import Bookings from './../Bookings/Bookings';

export default function Nav() {
  const navigate=useNavigate()
  
  return (
    <Navbar fluid className='bg-slate-100 shadow-lg bg-opacity-85 md:relative'> 
      <Navbar.Brand >
        <img src="./../../img/HAO_S-GARAGE.svg" className="mr-3 h-6 sm:h-9" alt="Flowbite React Logo" />
        {/* <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Flowbite React</span> */}
      </Navbar.Brand>
      
        <Navbar.Toggle />
     
      <Navbar.Collapse className=' md:absolute md:left-1/2 md:transform md:-translate-x-1/2 '>  
          <Navbar.Link className='text-gray-700 text-lg hover:text-cyan-700' onClick={()=>{navigate('/')}}>
            Home
          </Navbar.Link>
          <Navbar.Link className='text-gray-700 text-lg hover:text-cyan-700' onClick={()=>{navigate('/services')}}>Services</Navbar.Link>
          <Navbar.Link className='text-gray-700 text-lg hover:text-cyan-700' onClick={()=>{navigate('/booking')}}>Booking</Navbar.Link>   
      </Navbar.Collapse>
    </Navbar>
  );
}