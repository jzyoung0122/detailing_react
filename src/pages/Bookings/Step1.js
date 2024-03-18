import React,{useMemo, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { setServiceList,setTotalTime } from '../../store/modules/booking';
import { setCheckbox } from '../../store/modules/checkbox';
import { Button,Label,Tabs,Card,Modal,Table,Spinner} from 'flowbite-react';
import http from './../../api/index';
import '../../index.css'
import {FaCheck} from 'react-icons/fa'
import { GiShoppingCart } from "react-icons/gi"
import { SlArrowRight } from "react-icons/sl";
import Stepper from './Stepper';
import { FaInfoCircle } from "react-icons/fa";




export default function Step1() {
    const navigate=useNavigate()
    const dispatch=useDispatch()
    const [checkbox, setCheckbox]=useState([])
    const [openModal, setOpenModal] = useState(false);
    const [isTransitioned, setIsTransitioned] = useState(false);

    const descriptions=useSelector(state=>state.description.descriptions)
    //store description to be shown
    const [description,setDescription]=useState([])
    const [title,setTitle]=useState('')

    const [showDescription,setshowDescription]=useState(false)

    //control the stepper CSS
    const ifActive={step1:true,step2:false,step3:false,step4:false}
    
    const checkboxFromRedux=useSelector(state=>state.checkbox)
    const deepCopyArray = JSON.parse(JSON.stringify(checkboxFromRedux.checkbox))

    const [showsubmitWarning,setshowsubmitWarning]=useState(false)
    
    const selectedServices=useMemo(()=>{
      let ifEmpty=true
      let selectedList=[]  
        checkbox.map((item)=>{
          let typeObj={type:item.type,selected:[]}
          typeObj.selected=item.service.filter((service)=>
            service.checked==true
          )
          if(typeObj.selected.length !=0){
            ifEmpty=false
            selectedList.push(typeObj)
          } 
        })

        if(!ifEmpty){
          setIsTransitioned(true)
        }else{
          setIsTransitioned(false)
        }
      
      return {ifEmpty:ifEmpty,selectedList:selectedList}
    },[checkbox])

    const totalTime =useMemo(()=>{
      let totalTime=0
    
        checkbox.map((item)=>{
          item.service.map(service=>{
            if(service.checked===true){
              totalTime+=service.time
            }
          })
        })
      
      return totalTime
    })
    
    useEffect(()=>{
    //  setIsTransitioned(true)
     if(deepCopyArray.length!=0){
        setCheckbox(deepCopyArray)
     }else{

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
            setCheckbox(tmpCheckbox)
            }
        )
        } catch (error) {
          console.error(error.message)
        }
      }
      getServices()
     }
      
    }
    ,[])


    const handleChanckboxChange=(type,id)=>{
      let tmp=[...checkbox]
      // if(tmp.length!==0){
      //   const newCheckbox=tmp.map(item=>{
      //   if(item.type==type){
      //     console.log(item.service,typeof item.service)
      //     const newService=item.service.map(service=>
      //     service.id===id? {...service,checked:!service.checked}:service  
      //       )
      //     return newService
      //   }
      //   return item;
      // })
      for(let i=0;i<tmp.length;i++){
        if(tmp[i].type==type){
          for(let j=0;j<tmp[i].service.length;j++){
            if(tmp[i].service[j]._id==id){
              tmp[i].service[j].checked=!tmp[i].service[j].checked
            }
          }
        }
      }
      setCheckbox(tmp)  
      
      if(showsubmitWarning) setshowsubmitWarning(false)
      }
      
      const handleRemove=(type,id)=>{  
        let tmp=[...checkbox]
        for(let i of tmp){
          console.log(i.type)
          if(i.type===type){       
            for(let service of i.service){
              if(service._id===id){
                service.checked=!service.checked
              }
            }
          }
        }
        setCheckbox(tmp)
      }

      //enable redux to get selected services and total duration of services
      const submitServiceList=(selectedServices,totalTime,checkbox)=>{
        if(selectedServices.ifEmpty==true){
          // alert("Sorry. You haven't chosen anything")
          setshowsubmitWarning(true)
        }else{
          setshowsubmitWarning(false)
          dispatch({type:'booking/setServiceList',payload:selectedServices.selectedList})
          dispatch({type:'booking/setTotalTime',payload:totalTime})
          dispatch({type:'checkbox/setCheckbox',payload:checkbox})
          navigate('/booking/step2');
        }
      }

      const handleIconClick=(title)=>{
        setTitle(title)
        for(let desc of descriptions){
          if(title==desc.title){
            setDescription(desc.description)
            break
          }
        }
        setshowDescription(true)
      }
      
    return (
    <div>
     
     {/* tab bar */}
    <div>
    <div className='flex justify-center my-5'>
      <Stepper ifActive={ifActive}/>
    </div>

    {/* <div className='w-3/4 sm:w-1/3 mx-auto  my-2'>
      
    </div> */}

    <Card className='w-3/4 sm:w-1/3 mx-auto relative'>
    <span className='font-semibold  text-gray-500 text-base  '><SlArrowRight className='inline-block'/> Please choose car body styles and services</span>
    <div className={`absolute -top-2 -right-2 rounded-full bg-red-600 text-3xl sm:text-4xl p-1 text-white 
    transition-opacity duration-1000 ease-in-out ${isTransitioned ? 'opacity-100' : 'opacity-0'}`}>    
    
      <GiShoppingCart onClick={() => setOpenModal(true)}/>

    </div> 
   
    {/* show Cart */}
    <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Chosen Services</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
              {selectedServices.selectedList.map(item=>(
                <div key={item.type}>
                  <div className='text-base font-semibold sm:text-lg ml-2 mb-2'>{item.type}</div>           
                  <Table>
                    <Table.Head>
                      <Table.HeadCell>Service</Table.HeadCell>
                      <Table.HeadCell>Price</Table.HeadCell>
                      <Table.HeadCell>duration</Table.HeadCell>
                      <Table.HeadCell>
                        <span className="sr-only">Edit</span>
                      </Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                      {item.selected.map(service=>(
                        <Table.Row key={service._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                          <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                            {service.name}
                          </Table.Cell>
                          <Table.Cell>${service.price}</Table.Cell>
                          <Table.Cell>{service.time}h</Table.Cell>
                          <Table.Cell>
                            <a href="#" className="font-medium text-cyan-600 hover:underline dark:text-cyan-500" onClick={()=>{handleRemove(item.type,service._id)}}>
                              Remove
                            </a>
                          </Table.Cell>
                        </Table.Row>
                      ))}                    
                    </Table.Body>
                  </Table>            
                </div>              
              ))}
          </div>

        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setOpenModal(false)}>I accept</Button>
          <Button color="gray" onClick={() => setOpenModal(false)}>
            Decline
          </Button>
        </Modal.Footer>
      </Modal>

    <Tabs style="underline" className='flex justify-center '>
        {checkbox.map(item=><Tabs.Item key={item._id} title={item.type} >
          <div className="flex max-w-md flex-col gap-4 m-auto ">
          {item.service.map(service=>(
            <Label htmlFor={service._id} key={service._id} className={`checkbox-wrapper ${service.checked ? 'checked' : ''}`}> 
            <input type='checkbox' 
              id={service._id} 
              onChange={()=>handleChanckboxChange(item.type,service._id)}
              checked={service.checked}  
              className="opacity-0 absolute h-0 w-0"
              />
              <div  className={service.checked?("rounded-lg border-2 border-gray-500 cursor-pointer p-2 relative"):("rounded-lg border-2 border-gray-200 cursor-pointer p-2 relative")} >
                {service.checked && (
                  <div><FaCheck className=" text-2xl  text-cyan-700 sm:text-4xl absolute -right-2 -top-2 " /></div>
                )}
                <div className='text-base font-semibold sm:text-lg ' ><span >{`${service.name} `} 
                  
                    <FaInfoCircle onClick={(event) => {event.preventDefault();handleIconClick(service.name)}}  className='inline-block -mt-1 ml-1  text-gray-500 '/>
                    
                </span></div>
                <div className='flex flex-row-reverse'>{`price:$AUD ${service.price} durition:${service.time}h`}</div>
              </div>
            </Label>
          )             
          )}
          </div>
        </Tabs.Item>)}
      </Tabs>

    </Card>

    {/* show descriptions of services              */}
    <Modal dismissible show={showDescription} onClose={() => {setshowDescription(false);setDescription([]);setTitle('')}}>
            <Modal.Header>{title}</Modal.Header>
            <Modal.Body>
              <div className="space-y-4">
              {description.length==0 && (
                <div>
                <Spinner aria-label="Extra large spinner example" size="xl" />
                </div>
              )
              }
              
              {description.length!=0 && description.map(desc=>(<p key={desc} className=" text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                  - {desc}
              </p>))}
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={() =>{setshowDescription(false);setDescription([]);setTitle('')}}>Understood</Button>
              {/* <Button color="gray" onClick={() => setOpenModal(false)}>
                Decline
              </Button> */}
            </Modal.Footer>
          </Modal>

      
    </div>

    

    <Button  onClick={()=>{submitServiceList(selectedServices,totalTime,checkbox)}} className='mx-auto mt-4'>NEXT</Button>
    {showsubmitWarning && (
      <div className='text-red-600 flex justify-center my-2'>Sorry, you haven't chosen anything</div>
    )}
    
    
    
    </div>
  )
}
