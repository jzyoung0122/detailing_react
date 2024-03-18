import React from 'react'
import { Outlet } from 'react-router-dom'
import Nav from './../Nav/Nav';
import Footer from '../Footer/Footer';

export default function Bookings() {
  return (
    <div >
    <div className='sticky top-0 z-40'> <Nav/></div>
   
    <Outlet/>
    <Footer/>
    </div>
  )
}
