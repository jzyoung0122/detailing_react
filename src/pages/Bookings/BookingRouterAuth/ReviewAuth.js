import React from 'react'
import { Navigate } from 'react-router-dom'
export default function ReviewAuth({children}) {
    const isBookingDone=localStorage.getItem('isBookingDone')
    if(isBookingDone){
        return <>{children}</> 
    }else{
        return <Navigate to='/booking/step3'></Navigate>
    }
}
