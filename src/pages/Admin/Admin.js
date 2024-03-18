import React from 'react'
import { Outlet } from 'react-router-dom'
import AdminNav from './AdminNav/AdminNav'

export default function Admin() {
  return (
    <div>
    <div className='sticky top-0 z-20'><AdminNav/></div>
     <Outlet/>
    </div>  
  )
}
