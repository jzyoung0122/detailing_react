import React from 'react'
import { Navigate } from 'react-router-dom'
export default function AdminRouterAuth({children}) {
    const ifAuth=localStorage.getItem('ifAuth')
    if(ifAuth){
        return <>{children}</> 
    }else{
        return <Navigate to='/login'></Navigate>
    }
}
