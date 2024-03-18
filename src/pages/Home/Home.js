import React,{useEffect, useState} from 'react'
import Nav from './../Nav/Nav';
import Footer from '../Footer/Footer';
import { Carousel,Modal,Button,Card,Alert } from 'flowbite-react';
import { useDispatch,useSelector } from 'react-redux';
import { getDescriptions } from './../../store/modules/descriptions'
import { useNavigate,useLocation } from 'react-router-dom'
import {FaCheck} from 'react-icons/fa'


export default function Home() {
  const navigate=useNavigate()
  const location=useLocation()

  const [openModal, setOpenModal] = useState(false)
    //set title and context of Model when clicking the Carousel
  const [descriptionList,setList] =useState([])
  const [title,setTitle]=useState('')
  const handleModel=(title)=>{
    description.descriptions.forEach(item=>{
      if(item.title==title){
        setTitle(title)
        setList(item.description)
      }
    })
  }

  //require the names of images
  const imgContext = require.context('./../../img', true, /\.(jpg|jpeg)$/);
  const imgPath=imgContext.keys()
 

  //get descriptions of services
  const dispatch=useDispatch()
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(()=>{
    dispatch(getDescriptions())  
  },[])

  useEffect(()=>{
    if(location.state){
      console.log(location.state)
      localStorage.removeItem('isBookingDone')
      showSuccessAlert()
    }
  },[location])

  
  const description=useSelector(state=>state.description)

  const showSuccessAlert=()=>{
    setIsVisible(true)
    
    const timerToShow = setTimeout(() => {
      setIsVisible(true);
    }, 1000);
    
    const timerToHide = setTimeout(() => {
      setIsVisible(false);
    }, 6000);
    return () => {
      clearTimeout(timerToShow)  
      clearTimeout(timerToHide);
      };
  }
 
  return (
    
    <div>
    <div className={`transition-transform duration-300 transform ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full '
      } p-4  fixed top-0 left-0 right-0 z-40`}>
      <Alert color="info">
        <span className="font-medium">Successfully created your booking!</span> You'll receive a confirmation email very soon.
      </Alert>
    </div>
    
    <div className='sticky top-0 z-20'><Nav/></div>
    <div  className='mt-4  w-full  mx-auto'>
    <div className="w-full h-48    mx-auto sm:h-64  xl:h-80 2xl:h-144 relative" >
      <Carousel>
        {description.descriptions.map((item,index)=>(
          <div key={item._id} className='flex h-full items-center justify-center bg-gray-400 dark:bg-gray-700 dark:text-white' onClick={()=>{setOpenModal(true);handleModel(item.title)}}>  
            <img src={require('../../img'+imgPath[index].slice(1))} alt="..." className="block absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2 brightness-50 object-cover"  />
            <div className="p-2 absolute top-2/5 left-1/2  font-semibold text-gray-200 text-opacity-80 -translate-x-1/2 -translate-y-1/2 text-2xl w-full text-center sm:text-5xl lg:text-8xl    dark:text-gray-800">{item.title}</div>
            <div className="absolute bottom-8 sm:bottom-10 md:bottom-12 lg:bottom-20 left-1/2 font-semibold text-gray-200 text-opacity-80 -translate-x-1/2 -translate-y-1/2 text-base w-full text-center sm:text-md lg:text-lg    dark:text-gray-800">click to see more</div>
            
        </div>
        )

        )}
      </Carousel>

      <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
            <Modal.Header ><span className='text-cyan-700'>{title}</span></Modal.Header>
            <Modal.Body>
              <div className="space-y-4">
              {descriptionList.map(desc=>(<p key={desc} className=" text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                  <FaCheck className='text-cyan-700 mr-2 inline-block'/> {desc}
              </p>))}
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={() => setOpenModal(false)}>Understood</Button>
              {/* <Button color="gray" onClick={() => setOpenModal(false)}>
                Decline
              </Button> */}
            </Modal.Footer>
          </Modal>

         
    </div>
    <div className='mt-4 flex justify-center'><Button  onClick={()=>{navigate('/booking')}} className='w-1/2 sm:w-1/5 '><span className='text-md sm:text-xl '>Make an Appointment</span></Button></div>
    </div>
    

    <Card className='mt-4 w-3/4 sm:w-5/6 mx-auto relative' >
          <div className='absolute w-1/4 sm:w-1/6 top-4 left-4 '   >
            <img src="../../img/HAO_S-GARAGE.svg" alt="logo" />
            </div>
            <div className='text-xl sm:text-4xl mx-auto my-4 font-semibold'>ABOUT US</div>
            <div className="w-6/7 sm:w-3/5 text-sm sm:text-lg m-auto"><span>Hao's Garage, Canberra based mobile detailing service. We care about every car we clean. We have tried and tested numerous brands of car care products available on the market and have carefully selected a range of premium car detailing products that we believe deliver exceptional results.
            </span>
              </div>
            <div className="w-6/7 sm:w-3/5 text-sm sm:text-lg m-auto"><span>Our commitment to excellence means we prioritize using only the finest products for rejuvenating and maintaining your vehicle's appearance. These selected premium car detailing products have proven their effectiveness in providing superior cleaning and protection, ensuring that your vehicle receives the highest level of care and attention.</span></div>
      </Card>

    {/* leave space for sticky footer */}
      <div className='h-32 sm:h-24'></div>

      <Footer/>
    </div>
  )
}
