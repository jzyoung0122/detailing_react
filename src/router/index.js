import {createBrowserRouter,createHashRouter} from 'react-router-dom'
import Home from '../pages/Home/Home'
import Bookings from '../pages/Bookings/Bookings'
import Step1 from '../pages/Bookings/Step1'
import Step2 from './../pages/Bookings/Step2';
import Step3 from '../pages/Bookings/Step3';
import Review from '../pages/Bookings/Review';
import Admin from '../pages/Admin/Admin';
import ShowBooings from '../pages/Admin/ShowBookings/ShowBooings';
import SetTimeUnavailable from '../pages/Admin/SetTimeUnavailable/SetTimeUnavailable';
import Services from '../pages/Services/Services';
import Login from '../pages/Admin/Login/Login';
import Auth1 from '../pages/Admin/Login/Auth1';
import Auth2 from '../pages/Admin/Login/Auth2';
import LoginRouterAuth from '../pages/Admin/Login/LoginRouterAuth';
import AdminRouterAuth from '../pages/Admin/AdminRouterAuth/AdminRouterAuth';
import Step2Auth from '../pages/Bookings/BookingRouterAuth/Step2Auth';
import Step3Auth from '../pages/Bookings/BookingRouterAuth/Step3Auth';
import ReviewAuth from '../pages/Bookings/BookingRouterAuth/ReviewAuth';

const router=createHashRouter([
    {
        path:'/',
        element:<Home/>
    },
    {
        path:'/booking',
        element:<Bookings/>,
        children:[
            {
                index:true,
                element:<Step1/>
            },
            {
                path:'step2',
                element:<Step2Auth><Step2/></Step2Auth>
            },
            {
                path:'step3',
                element:<Step3Auth><Step3/></Step3Auth>
            },
            {
                path:'review',
                element:<ReviewAuth><Review/></ReviewAuth>
            }
        ]
    },
    {
        path:'/admin',
        element:<AdminRouterAuth><Admin/></AdminRouterAuth>,
        children:[
            {
               index:true,
               element:<ShowBooings/>
            },
            {
                path:'setTimeUnavailable',
                element:<SetTimeUnavailable/>
            }
        ]
    },
    {
        path:'login',
        element:<Login/>,
        children:[
            {
                index:true,
                element:<Auth1/>
            },
            {
                path:'auth2',
                element:<LoginRouterAuth><Auth2/></LoginRouterAuth>
            }
        ]
    },
    {
        path:'/services',
        element:<Services/>
    }

])

export default router