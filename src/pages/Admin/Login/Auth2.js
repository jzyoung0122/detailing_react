import React ,{useState,useEffect,useRef }from 'react'
import { useNavigate,useLocation} from 'react-router-dom'
import { Label,TextInput,Button } from 'flowbite-react'
import http from '../../../api'

export default function Auth2() {
    const [phone,setPhone]=useState()
    const [showWarning,setShowWarning]=useState(false)
    const location=useLocation()
    
    const code=useRef('')
    const navigate=useNavigate()
    
    useEffect(()=>{
        const sendCode=async(phone)=>{
            const res=await http.post('/sendCode',{phone:phone})
        }

        if(location.state){
          setPhone(location.state.phone)
          sendCode(location.state.phone)
        }
      },[location])
    
    const verify=async()=>{
        const res=await http.post('verifyCode',{phone:phone,code:code.current.value})
        if(res.data){
            localStorage.removeItem('ifAuth1')
            localStorage.setItem('ifAuth',true)
            navigate('/admin')
        }else{
            setShowWarning(true)
        }
    }
    return (
    <div>
            <div className='my-4 w-4/5 mx-auto'>
                <div className="mb-2 block">
                    <Label htmlFor="small" value="Plese enter the verification code" />
                </div>
                <div className='mx-auto w-full'>
                    <TextInput id="small" ref={code} type="text" sizing="md"/>
                </div>               
                <div>
                    <Button className='mx-auto w-1/2 my-4' onClick={()=>verify()}>Verify</Button>
                </div>
                {showWarning && (
                        <div className='mx-auto my-2 text-sm text-red-600'>Sorry, the code dosen't match</div>
                    )}
            </div>      
    </div>
  )
}
