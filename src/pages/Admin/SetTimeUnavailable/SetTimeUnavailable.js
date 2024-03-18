import React, { useState } from 'react'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Label,Button} from 'flowbite-react';
import {useQuery} from 'react-query'
import { Spinner } from 'flowbite-react';
import http from '../../../api'
import '../../../index.css'
import {FaCheck} from 'react-icons/fa'
import showPeriod from '../../../util/transferTime';

export default function SetTimeUnavailable() {
  const dayjs=require('dayjs')
  const [date,setDate]=useState(dayjs(new Date()).format("YYYY-MM-DD"))
  const [selectedTime,setSelectedTime]=useState([])
  
    
  const getTimeByAdmin=async(date)=>{
    return await http.post('/getTimeByAdmin',{date:date})
   }

  
 
  const {isLoading,data,refetch} =useQuery
  (['getTimeByAdmin',date],
  ()=>getTimeByAdmin(date),
  // {enabled:false}
  )

  const handleCheckbox=(time)=>{
    let tmp=[...selectedTime]
    if(tmp.includes(time)){
      const index=tmp.indexOf(time)
      tmp.splice(index,1)
    }else(
      tmp.push(time)
    )  
    setSelectedTime(tmp)
  }

  const onSubmit=async(date,selectedTime)=>{
    const chosenTime=[...selectedTime]
    await http.post('/setTimeUnavailable',{date,chosenTime})
    refetch()
  }

  return (
    <div>
        <div className='flex justify-center my-4'>
          <DatePicker
            selected={date}
            onChange={(date) => {setDate(dayjs(date).format("YYYY-MM-DD"));setSelectedTime([])}}
            dateFormat="dd/MMM/yyyy"
            filterDate={date=>(date.getDay()===0 || date.getDay()===6)} 
              />     
          </div>
        
        {isLoading && (
          <div className="text-center my-4">
            <Spinner aria-label="Center-aligned spinner" size='xl' />
         </div>
        )}
         
         {data && (
          <div className='flex flex-col gap-4 mx-auto w-2/3 sm:w-1/3' >
         {data.data.availableTime.map(item=>(
          <Label key={item} htmlFor={item} className={`checkbox-wrapper ${ selectedTime.includes(item) ? 'checked' : ''}`}>
            <input type="checkbox" id={item} className="opacity-0 absolute h-0 w-0" onChange={()=>handleCheckbox(item)}/>
            <div className={selectedTime.includes(item)?("rounded-lg border-2 border-gray-500 cursor-pointer p-2 relative"):("rounded-lg border-2 border-gray-200 cursor-pointer p-2 relative")} >
                {selectedTime.includes(item) && (
                  <div><FaCheck className=" text-2xl  text-cyan-700 sm:text-4xl absolute -right-2 -top-2 " /></div>
                )}
                <div className='text-base text-center font-semibold sm:text-lg '><span>{showPeriod(item)} </span></div>
            
              </div>
            </Label> 
         ))}
        <div className='my-4 mx-auto' onClick={()=>onSubmit(date,selectedTime)}><Button>Submit</Button></div>
         </div>) } 
    </div>
    
  )
}
