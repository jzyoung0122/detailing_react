import React, { useState,useRef,useEffect } from 'react'
import {  Card,Badge,Button,Pagination,Modal } from 'flowbite-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import http from '../../../api';
import showPeriod from '../../../util/transferTime';
import { SlArrowRight } from "react-icons/sl";
import { HiOutlineExclamationCircle } from 'react-icons/hi';


export default function ShowBooings() {
    const dayjs = require('dayjs')
    const [bookings,setBookings]=useState([])
    const [date,setDate]=useState(dayjs(new Date()).format("YYYY-MM-DD")) 
    const tab=useRef(null)
    const [searchInput,setSearchInput]=useState('')
    const [showSearchWarning,setShowSearchWarning]=useState(false)
    const [openModal, setOpenModal] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [bookingID,setBookingID]=useState('')

    const [currentPage, setCurrentPage] = useState(1);
    const onPageChange = (page) => {setCurrentPage(page);window.scrollTo({ top: 0, behavior: 'smooth' })};

    const handleDateChange=(type,date)=>{
        setDate(date)
        const selectedDate=new Date(date)
       
        if(type==='month'){
            getBookingsByMonths(selectedDate)
        }else(
            getBookingsByDates(selectedDate)
        )        

    }

    

    const handleTabClick = (tabIndex) => {
      setActiveTab(tabIndex);
      if(tabIndex==0){
        getBookingsByMonths(new Date(date))
      }else if(tabIndex==1){
        getBookingsByDates(new Date(date))
      }else{
        setBookings([])
      }
  
    };

    const getBookingsByMonths=async (date)=>{
        const month=date.getMonth()
        const year=date.getFullYear()
        const res=await http.post('/getBookingsByMonths',{month,year})
        // console.log(res.data.flag,res.data.bookings[0])
        if(res.data.flag){
          
            setBookings(res.data.bookings)
            
        }else{
            console.log(res.data.message)
            setBookings([])
        }
        
    }

    const getBookingsByDates=async(date)=>{
        const res=await http.post('/getBookingsByDates',{date})
        if(res.data.flag){
            setBookings(res.data.bookings)
        }else{
            setBookings([])
        }
    }

    const deleteBooking=async()=>{
        await http.post('/deleteBooking',{id:bookingID})
        handleTabClick(activeTab)

    }

    const onSearch=async()=>{
        function isValidEmail(email) {
            const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
            return emailRegex.test(email);
          }
        
        if(isValidEmail(searchInput)){
            setShowSearchWarning(false)
            const res=await http.post('/getBookingsByEmail',{email:searchInput})
            if(res.data.flag){
                setBookings(res.data.bookings)
            }else{
                setBookings([])
            }
        }else{
            setShowSearchWarning(true)
        }
    }

    useEffect(() => {
        
        if (tab.current) {
            console.log(date)
          tab.current.click();
        }
      }, []); 


    return (
    <div>
        
        <div className='w-3/4 sm:w-2/3 mx-auto my-4'>
            <Card>
            <span className='font-semibold  text-gray-500 text-base  '><SlArrowRight className='inline-block'/> Choose a way to retrieve bookings</span>
                <Button.Group className='flex justify-center'>
                    <Button  size="lg" color="gray" ref={tab} onClick={() => handleTabClick(0)}>Month</Button>
                    <Button  size="lg" color="gray" onClick={() => handleTabClick(1)}>Date</Button>
                    <Button size="lg" color="gray" onClick={() => handleTabClick(2)}> Search </Button>
                </Button.Group>

            {/* <span className='font-semibold  text-gray-500 text-base  '><SlArrowRight className='inline-block'/> Choose a month or date</span> */}
                <div className='my-4 mx-auto'>
                {activeTab==0 && (
                    <div className='flex justify-center'>
                    <DatePicker
                            selected={date}
                            onChange={(date) => handleDateChange('month',dayjs(date).format("YYYY-MM-DD"))}
                            dateFormat="MMM/yyyy" 
                            showMonthYearPicker 
                            
                        />
                    </div>
                )}
                {activeTab==1 && (
                    <div className='flex justify-center'>
                    <DatePicker
                            selected={date}
                            onChange={(date) => handleDateChange('date',dayjs(date).format("YYYY-MM-DD"))}
                            dateFormat="dd/MMM/yyyy"
                            filterDate={date=>(date.getDay()==0 || date.getDay()==6)} 
                        />     
                    </div>
                )}
                {activeTab==2 && (
                    <div className=' w-full'>   
                        <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                </svg>
                            </div>
                            <input type="search" value={searchInput} onChange={(e)=>{setSearchInput(e.target.value)}} id="default-search" className="block w-72 sm:w-80 p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-cyan-700 focus:border-cyan-700 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-cyan-700 dark:focus:border-cyan-700" placeholder="Please enter the email" required />
                            <button onClick={onSearch} className="text-white absolute end-2.5 bottom-2.5 bg-cyan-700 hover:bg-cyan-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-cyan-700 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800">Search</button>  
                        </div> 
                        {showSearchWarning && <div className='font-small text-red-700 mt-2'><span>Please input a valid email address</span></div>}             
                    </div>                                      
                )}
            </div>
            </Card>
        </div>
        
        <div className='w-3/4 sm:w-2/3 mx-auto '>
            {bookings.length!==0 && (
                <div class="inline-flex items-center justify-center w-full">
                    <hr class="w-64 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"/>
                    <span class="absolute px-3 font-medium text-gray-700 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900">BOOKING LIST</span>
                </div>
            )}
            {bookings.slice((currentPage - 1) * 10, currentPage * 10).map(item=>(
                <div className='mt-4' key={item._id}>
                <Card >
                    <div className='grid grid-flow-row  gap-1 sm:grid-flow-col sm:gap-2 '>
                        <div className='  '>
                            <div>
                                <Badge size="sm" color="info" className='inline-block m-1'>Name</Badge>
                                {item.firstName+' '+item.lastName}
                            </div>
                            <div>
                                <Badge size="sm" color="info" className='inline-block m-1'>Phone</Badge>
                                {item.phoneNumber}
                            </div>                 

                        </div>

                        <div className=' '>
                        <div>
                                <Badge size="sm" color="info" className='inline-block m-1'>Email</Badge>
                                {item.email}
                            </div>
                            <div>
                                <Badge size="sm" color="info" className='inline-block m-1'>Address</Badge>
                                {`${item.address.address1},${item.address.address2?item.address.address2+',':''}${item.address.suburb},ACT,${item.address.postCode}`}
                            </div>
                        </div>

                        <div>
                            <div>
                                <Badge size="sm" color="info" className='inline-block m-1'>Time</Badge>
                                {showPeriod(Number(item.time))+' '+dayjs(item.date).format('YYYY-MM-DD')}
                            </div>
                            <div>
                                <Badge size="sm" color="info" className='inline-block m-1'>Services</Badge>

                                {item.serviceList.map(type=>(
                                    <div key={type.type}>
                                        {type.type}:{type.selected.map((service,index)=>(
                                            <span key={service._id}>{service.name}{index!=type.selected.length-1 && ','}</span>
                                        )
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        
                    </div>
                    <div className='border-t-2 border-gray-500 mt-1'>
                        <div className='flex flex-row-reverse mt-2'>
                            <Button onClick={()=>{setOpenModal(true);setBookingID(item._id)}}>Delete</Button>
                        </div>
                        </div>
                </Card>
                </div>
            ))}
            
            {bookings.length>10 && (
                <div className="flex overflow-x-auto my-4 sm:justify-center ">
                    <Pagination currentPage={currentPage} totalPages={Math.ceil(bookings.length/10)} onPageChange={onPageChange}  showIcons />
                </div>
            )}
        </div>

        {bookings.length===0 && (
            <div className='flex items-center justify-center text-center h-64 '>
                <span className=' text-3xl text-gray-600  '>NO BOOKINGS</span>
            </div>
        )}

       
        <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
            <Modal.Header />
            <Modal.Body>
            <div className="text-center">
                <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Are you sure you want to delete this booking?
                </h3>
                <div className="flex justify-center gap-4">
                <Button color="failure" onClick={() => {deleteBooking();setOpenModal(false)}}>
                    {"Yes, I'm sure"}
                </Button>
                <Button color="gray" onClick={() => setOpenModal(false)}>
                    No, cancel
                </Button>
                </div>
            </div>
            </Modal.Body>
        </Modal>

    </div>
  )
}
