import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
export default function Step3Auth({children}) {
    const booking = useSelector(state=>state.booking)
    if(booking.time>-1){
        return <>{children}</> 
    }else{
        return <Navigate to='/booking/step2'></Navigate>
    }
}
