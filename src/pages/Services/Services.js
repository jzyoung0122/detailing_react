
import React, { useEffect,useRef,useState } from "react";
import LazyLoad from "react-lazyload";
import Nav from '../Nav/Nav';
import { useSelector,useDispatch } from "react-redux";
import http from "../../api";
import SmoothFadeIn from "./SmoothFadeIn";
import { Button, Modal } from 'flowbite-react';
import {FaCheck} from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import Footer from "../Footer/Footer";

export default function Services() {
  //require the names of images
  const imgContext = require.context('./../../img', true, /\.(jpg|jpeg)$/);
  const imgPath=imgContext.keys()

  const description=useSelector(state=>state.description.descriptions)
  const [services,setServices]=useState([])
 

  const [openModal, setOpenModal] = useState(false);
  const [fullTitle,setFullTitle]=useState('')
  const [type,setType]=useState('')
  const [service,setService]=useState('')
  // const [price,setPrice]=useState(null)
  // const [time,setTime]=useState(null)
  const [descriptionList,setDescriptionList]=useState([])

  const dispatch=useDispatch()
  const navigate=useNavigate()
  
  useEffect(() => {
    const getServices=()=>{
        try {
          http.get('/getServices').then((res)=>{    
            const tmpCheckbox=res.data.map((item)=>{
              const updatedService=item.service.map(service=>({
                ...service,
                checked:false
              }))
              return {...item, service:updatedService}
            })
            setServices(tmpCheckbox)
            }
        )
        } catch (error) {
          console.error(error.message)
        }
      }
    getServices()
   
  }, []);

  const handleChanckboxChange=(type,id)=>{
    let tmp=[...services]
    for(let i=0;i<tmp.length;i++){
      if(tmp[i].type==type){
        for(let j=0;j<tmp[i].service.length;j++){
          if(tmp[i].service[j]._id==id){
            tmp[i].service[j].checked=!tmp[i].service[j].checked
          }
        }
      }
    }
    setServices(tmp)  
    
    }

    const handleClick=(type,fullTitle,service)=>{    
      setType(type)
      setFullTitle(fullTitle)
      setService(service)
      for(let desc of description){
        if(service.name==desc.title){
          setDescriptionList(desc.description)
        }
      }
      setOpenModal(true)
    }

    const handleBook=(type,service,checkbox)=>{
      handleChanckboxChange(type,service._id)
      dispatch({type:'booking/reset'});
      dispatch({type:'checkbox/reset'});
      dispatch({type:'booking/setServiceList',payload:[{type:type,selected:[service]}]})
      dispatch({type:'booking/setTotalTime',payload:service.time})
      dispatch({type:'checkbox/setCheckbox',payload:checkbox})
      navigate('/booking/step2')

    }
  
    return (
    <div>
        <div className='sticky top-0 z-20'><Nav/></div>
        <div>
            {services.map((service,index)=>(             
                <div key={index} className="mb-10 p-5" >
                    <SmoothFadeIn>
                    <div className="bg-cyan-700 w-full text-white text-base sm:text-2xl text-center p-2 my-2 ">{service.fullTitle}</div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-20">
                        {service.service.map((subService,idx)=>(
                            <div key={idx} onClick={()=>{handleClick(service.type,service.fullTitle,subService)}}>                       
                            <LazyLoad className="w-full h-full">
                                <img
                                src={require('../../img'+imgPath[idx].slice(1))}
                                alt='...'
                                className="w-full h-full object-cover tranform scale-100 hover:scale-105 transition-transform duration-300 ease-in-out"
                                />
                            </LazyLoad>
                            <div className="h-auto w-full mt-4 text-center text-gray-500 text-sm sm:text-md "><span className=" hover:text-cyan-600">{subService.name}</span></div>
                            <div className="h-auto w-full mt-1 text-center text-gray-500 text-sm sm:text-md ">${subService.price}</div>
                            </div>
                        ))}
                    </div>
                    </SmoothFadeIn>
                </div>
            )              
            )}
        </div>

         {/* leave space for sticky footer */}
      <div className='h-32 sm:h-24'></div>
      <Footer/>

        <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header >
          <div className="text-cyan-700 font-medium">{service.name} for {fullTitle}</div>
          <div className="flex text-base text-gray-500 mt-2 justify">price:${service.price} duration:{service.time}h</div>
        </Modal.Header>
        <Modal.Body>
          <div><p className="text-base sm:text-lg text-cyan-700">Includes:</p></div>
          <div className="space-y-4">
            {descriptionList.map((desc,idx)=>(
              <p key={idx} className="text-base leading-relaxed text-gray-500 dark:text-gray-400"><FaCheck className="text-cyan-700 inline-block mr-2"/>{desc}</p>
            ))}
            
            
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => {setOpenModal(false);handleBook(type,service,services)}}>Choose a time slot</Button>
          <Button color="gray" onClick={() => setOpenModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
