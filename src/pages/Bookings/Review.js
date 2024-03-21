import React,{useState} from 'react'
import { Card, Label,Button,Modal,} from 'flowbite-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { HiOutlineExclamationCircle } from 'react-icons/hi';

import showPeriod from '../../util/transferTime';
import dayjs from 'dayjs';
import http from '../../api';
import Stepper from './Stepper';


export default function Review() {
    const navigate=useNavigate()
    const dayjs = require('dayjs')
    const dispatch=useDispatch()
    const [openModal, setOpenModal] = useState(false);
    const [showTerms, setShowTerms]= useState(false)
    const [ifChecked,setIfChecked]=useState(false)
    const [showsubmitWarning,setshowsubmitWarning]=useState(false)
    
    const ifActive={
        step1:true,step2:true,step3:true,step4:true
      }

    const booking=useSelector(state=>state.booking)
    // const chekbox=useSelector(state=>state.chekbox)
    let totalCost=0
    
    //calculate total cost.
    booking.serviceList.map(item=>{
        const cost=item.selected.reduce((prev,curr)=>prev+curr.price,0)
        totalCost += cost
    })
  
    const submitBooking=()=>{
        if(!ifChecked){
            setshowsubmitWarning(true)
        }else{
            const{date,time,serviceList,firstName,lastName,phoneNumber,email,address,totalTime}=booking
            const timeForMailContent=`${showPeriod(Number(time))} ${dayjs(date).format('MMMM D, YYYY')}`    
            http.post('/submitBooking',{
                date:date,
                time:time,
                timeForMailContent:timeForMailContent,
                serviceList:serviceList,
                firstName:firstName,
                lastName:lastName,
                phoneNumber:phoneNumber,
                email:email,
                address:address,
                totalTime:totalTime,
                totalCost:totalCost
            }).then(res=>{
                if(res.data.flag){
                    dispatch({type:'booking/reset'})
                    dispatch({type:'checkbox/reset'})
                    navigate('/',{
                        state:{
                            submit:true
                        }
                    })
                }else{
                    setOpenModal(true)
                }
            }) 
        }           
    }

    return (
    <div>
    <div className='flex justify-center my-5'>
      <Stepper ifActive={ifActive}/>
    </div>

    <Card className="w-5/6 sm:max-w-lg mx-auto mt-6">
        <div className="bg-cyan-700 text-white font-bold rounded-t -mt-6 -mr-6 -ml-6 p-2 grid grid-cols-7 gap-4'" >
            <div className='col-span-6'> Chosen Services </div>
            {/* <div className='col-span-2'></div> */}
            <div className='col-span-1 text-xs sm:text-sm '>
            <Button color='dark' size='small' className='px-4' onClick={()=>{navigate('/booking')}}>edit</Button></div>
        </div>
        <div >
            {booking.serviceList.map(item=>
                ( <div key={item.type} className='grid grid-cols-3 gap-4'>
                    <span className='col-span-1'><Label className='font-bold '>{item.type}:</Label></span>
                
                    {item.selected.map((service,index)=>(<span key={service._id} className='lowercase col-span-2'>{service.name}{index !== item.selected.length - 1 && ','} </span>))}
                
                </div>)
            )}
        </div> 
        <div className='border-t-2 border-gray-500 mt-1'>
            <div className='text-right text-sm'><span className='font-semibold'>{booking.totalTime}</span> hours to finish</div>
            <div className='text-right text-sm'>Cost you <span className='font-semibold'>$AUD {totalCost}</span> </div>
        </div>
     
    </Card>

    <Card className="w-5/6 sm:max-w-lg mx-auto mt-6 ">
    <div className="bg-cyan-700 text-white font-bold rounded-t -mt-6 -mr-6 -ml-6 p-2 grid grid-cols-7 gap-4'" >
            <div className='col-span-6'> Time of appointment </div>
            {/* <div className='col-span-2'></div> */}
            <div className='col-span-1 text-xs sm:text-sm '>
                <Button color='dark' size='small' className='px-4' onClick={()=>{navigate('/booking/step2')}}>edit</Button>
            </div>
        </div>
        <div className='grid grid-cols-3 gap-4 pb-2'>
            <div className='col-span-1'><Label className='font-bold'>Time:</Label></div>
            <div className='col-span-2'> {showPeriod(Number(booking.time))} {dayjs(booking.date).format('MMMM D, YYYY')}</div>
        </div>
    
    </Card>

    <Card className="w-5/6 sm:max-w-lg mx-auto mt-6 ">
    <div className="bg-cyan-700 text-white font-bold rounded-t -mt-6 -mr-6 -ml-6 p-2 grid grid-cols-7 gap-4'" >
            <div className='col-span-6'> Your information </div>
            {/* <div className='col-span-2'></div> */}
            <div className='col-span-1 text-xs sm:text-sm '>
            <Button color='dark' size='small' className='px-4 ' onClick={()=>{navigate('/booking/step3')}}>edit</Button></div>
        </div>
    <div className='divide-y divide-gray-400 ' >
        
        <div className='grid grid-cols-3 gap-4 pb-2' >
            <div className='col-span-1'><Label className='font-bold'>Name:</Label></div> 
            <div className='col-span-2'>{booking.firstName} {booking.lastName}</div>
        </div>
        <div className='grid grid-cols-3 gap-4 py-2' >
            <div className='col-span-1'><Label className='font-bold'>Mobile number:</Label></div> 
            <div className='col-span-2'>{booking.phoneNumber} </div>
        </div>
        <div className='grid grid-cols-3 gap-4 py-2' >
            <div className='col-span-1'><Label className='font-bold'>Email:</Label></div> 
            <div className='col-span-2'>{booking.email} </div>
        </div>
        <div className='grid grid-cols-3 gap-4 py-2' >
            <div className='col-span-1'><Label className='font-bold'>Address:</Label></div> 
            <div className='col-span-2'>{booking.address.address1},{booking.address.address2?booking.address.address2+',':''}{booking.address.suburb},ACT,{booking.address.postCode}</div>
        </div> 
    </div>

    <div>   
    </div>
    
    </Card>

    <div className="flex items-center justify-center gap-2 mt-4">
        {/* <Checkbox id="agree" /> */}
        <input id="agree" type="checkbox" checked={ifChecked} onChange={()=>{setIfChecked(!ifChecked);setshowsubmitWarning(false)}} className=" w-4 h-4 bg-gray-100 checked:bg-cyan-700 border-gray-300 rounded ring-cyan-700 dark:checked:ring-cyan-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"></input>
        <span  className="flex text-base sm:text-md">
          I agree with the&nbsp;
          <a  className="text-cyan-600 hover:underline dark:text-cyan-500" onClick={()=>{setShowTerms(true)}}>
            terms and conditions
          </a>
        </span>
      </div>

    <div className='flex justify-center mt-4'><Button onClick={()=>{submitBooking()}}>Submit</Button></div>
    {showsubmitWarning && (
      <div className='text-red-600 flex justify-center my-2'>Sorry, you haven't chosen anything</div>
    )}

    <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
            Sorry,seems like the time has been chosen by someone else before you submit. Would you like to book another time?
            </h3>
            <div className="flex justify-center gap-4">
              <Button  onClick={() => {setOpenModal(false);navigate('/booking/step2')}}>
                {"Yes"}
              </Button>
              <Button color="failure" onClick={() => {
                setOpenModal(false); 
                dispatch({type:'booking/reset'});
                dispatch({type:'checkbox/reset'});
                navigate('/')
                }}>
                No, cancel this appointment
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal dismissible show={showTerms} onClose={() => setShowTerms(false)}>
        <Modal.Header>Terms of Service</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
            By making a booking, you acknowledge that you have accurately chosen the appropriate service and time duration for your vehicle's condition. 
            In the event that our team requires more time than initially allotted for your chosen service, an additional fee will be applied.
            </p>
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
            Regarding payment, we operate on a cash-on-delivery (COD) basis, similar to other car wash services. We also offer electronic funds transfer at point of sale (EFTPOS) facilities if needed.
            </p>
            <p className="text-base font-bold leading-relaxed text-gray-500 dark:text-gray-400">
            IMPORTANT : To successfully carry out the detailing service for your vehicle, we require access to water and a power supply. 
            Additionally, you need to provide a secure off-road parking space that complies with legal regulations, and this parking space should be arranged and provided by you, the vehicle owner.
            </p>
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
            When it comes to your personal information, Hao's Garage collects such information through customer-provided means, whether verbally or through online booking. 
            Rest assured that no personal customer information will be shared with any external party outside of the Hao's Garage business. The sole purpose of retaining customer details is to ensure the best possible customer service.
            </p>
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
            A protocol is in place for employees who are authorized and obligated to utilize body-worn cameras during vehicle detailing procedures. 
            The focus of this procedure is to maintain the privacy of individuals. Personal information, including license plates, captured by camera footage will be treated confidentially by all personnel who have access to it. This handling aligns with government privacy policies and legal requirements.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => {setShowTerms(false);setIfChecked(true);setshowsubmitWarning(false)}}>I accept</Button>
          <Button color="gray" onClick={() => setShowTerms(false)}>
            Decline
          </Button>
        </Modal.Footer>
      </Modal>

      {/* leave space for sticky footer */}
      <div className='h-32 sm:h-24'></div>

    </div>

    
  )
}
