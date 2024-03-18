import React, { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
export default function Step2Auth({children}) {
    const booking = useSelector(state=>state.booking)
    if(booking.totalTime>0){
        return <>{children}</> 
    }else{
        return <Navigate to='/booking'></Navigate>
    }
}
