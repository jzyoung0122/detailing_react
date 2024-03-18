import React, { useState } from 'react'
import {  Navbar } from 'flowbite-react';
import {useNavigate} from 'react-router-dom'

export default function AdminNav() {
    const navigate=useNavigate()
    const [active,setActive]=useState([1,0])
    return (
    <div>
        <Navbar fluid className='bg-slate-100 shadow-lg  bg-opacity-85'>
      <Navbar.Brand>
        <img src="./../../img/HAO_S-GARAGE.svg" className="mr-3 h-6 sm:h-9" alt="Flowbite React Logo" />
        {/* <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Flowbite React</span> */}
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse >
        <Navbar.Link onClick={()=>{navigate('/admin');setActive([1,0])}} active={active[0]}>
          Booking List
        </Navbar.Link>
        <Navbar.Link onClick={()=>{navigate('/admin/setTimeUnavailable');setActive([0,1])}} active={active[1]}>
            Set Time Unavailable
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
    </div>
  )
}
