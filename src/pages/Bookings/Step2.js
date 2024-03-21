import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {Card, Radio,Label,Button,Spinner} from 'flowbite-react'
import DatePicker from "react-datepicker"
import { useDispatch,useSelector } from 'react-redux';
// import { setDate,setTime } from '../../store/modules/booking';
import {useQuery} from 'react-query'
import http from '../../api'
import showPeriod from '../../util/transferTime'
import {FaCheck} from 'react-icons/fa'
import { SlArrowRight } from "react-icons/sl";
import Stepper from './Stepper';
import "react-datepicker/dist/react-datepicker.css";



export default function Step2() {
  const navigate=useNavigate()
  const dayjs = require('dayjs')
  const dispatch=useDispatch()
  const booking = useSelector(state=>state.booking)
  const [date,setDate]=useState(null)
  const [time,setTime]=useState(-1)
  const [showsubmitWarning,setshowsubmitWarning]=useState(false)

  const ifActive={
    step1:true,step2:true,step3:false,step4:false
  }
  
  const getAvailableTime=async(date,totalTime)=>{
   return await http.post('/getAvailableTime',{date:date,totalTime:totalTime})
  }

  //Set startDay of Datepicker.
  useEffect(()=>{
    if(booking.time!=-1){
      setDate(new Date(booking.date))
      setTime(booking.time)
    }else{
      const today=new Date()
      if(today.getDay()>=0 && today.getDay()<6){
        const diff = 6 - today.getDay() 
        setDate(dayjs(new Date(today.setDate(today.getDate() + diff))).format("YYYY-MM-DD"))
          }else if(today.getDay()==6){
        setDate(dayjs(new Date(new Date().getTime() + 24 * 60 * 60 * 1000)).format("YYYY-MM-DD"))
        }
    }
  },[])

  //get available appointment
  const {isLoading,data,refetch} =useQuery
  (['availableTime',date,booking.totalTime],
  ()=>getAvailableTime(dayjs(date).format("YYYY-MM-DD"),booking.totalTime),
  // {enabled:false}
  )

  // useEffect(()=>{
  //   refetch();
  // },[date,refetch])
 
  //handle the change of datepicher
  const handleDateChange=(newDate)=>{
    console.log('change',newDate)
    setTime(-1)
    setDate(newDate)
    // setTime(data.data.availableTime[0])
  }

  const handleRadioChange=(e)=>{
    setTime(e.target.value)
    if(showsubmitWarning){
      setshowsubmitWarning(false)
    }
  }

  const submitDateAndTime=(date,time)=>{
    if(time===-1){
      setshowsubmitWarning(true)
    }else{
       dispatch({type:'booking/setDate',payload:dayjs(date).format("YYYY-MM-DD")})
      dispatch({type:'booking/setTime',payload:time})
      navigate('/booking/step3')
    }
   
  }

  return (
    <div>
    
    <div className='flex justify-center my-8'>
        <Stepper ifActive={ifActive}/>
    </div>

    <Card className="w-3/4 sm:w-1/3 m-auto">
    <span className=' text-gray-500 text-base  '><SlArrowRight className='inline-block'/> Please choose a date</span>
        <div className='mx-auto z-10'>
        <DatePicker 
          selected={date} 
          onChange={handleDateChange} 
          filterDate={date=>(date.getDay()==0 || date.getDay()==6)}  
          minDate={new Date(new Date().getTime() + 24 * 60 * 60 * 1000)} 
          
          />
        </div>
        
    </Card>

    {isLoading && (
      <div className='flex justify-center my-10 w-full'>
      <Spinner className='mx-auto' size="xl" />
      </div>
    )}

    {isLoading===false && 
    (<div>
      
      <Card className="w-3/4 sm:w-1/3 mx-auto my-4">
        <span className='  text-gray-500 text-base  '><SlArrowRight className='inline-block'/> Please choose a time</span>
        <fieldset className="flex w-3/4 mx-auto justify-center flex-col gap-4">
        {/* <legend className="mb-4">Choose your time</legend> */}
        
            {data.data.availableTime.map(item=>(
              <Label htmlFor={item} key={item} className={time==item?("rounded-lg border-2 border-gray-500 cursor-pointer p-2 relative"):("rounded-lg border-2 border-gray-200 cursor-pointer p-2 relative")}>
              <input type='radio' id={item} name="chosenTime" value={item} checked={time==item} onChange={handleRadioChange} className="opacity-0 absolute h-0 w-0" />
              <div className='text-base sm:text-md pl-2 text-center' >{showPeriod(item)} </div>
              {time==item?(<div><FaCheck className=" text-2xl  text-green-500 sm:text-4xl absolute -right-2 -top-2 " /></div>):''}
                    
              </Label>     
            ))}
          </fieldset>
        </Card>
    
      <Button onClick={()=>{submitDateAndTime(date,time)}} className='m-auto'>Next</Button>
      </div>)}
      {showsubmitWarning && (
      <div className='text-red-600 flex justify-center my-2'>Sorry, you haven't chosen anything</div>
    )}

      {/* leave space for sticky footer */}
      <div className='h-32 sm:h-24'></div>

    </div>
  )
}
