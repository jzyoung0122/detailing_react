import React from 'react'
import { Navigate } from 'react-router-dom'
export default function LoginRouterAuth({children}) {
    const ifAuth1=localStorage.getItem('ifAuth1')
    if(ifAuth1){
        return <>{children}</> 
    }else{
        return <Navigate to='/login'></Navigate>
    }
}