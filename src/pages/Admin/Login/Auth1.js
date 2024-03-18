import React from 'react'
import { Card,TextInput,Label,Button,Checkbox } from 'flowbite-react'
import { useRef ,useState} from 'react'
import http from '../../../api'
import { useNavigate } from 'react-router-dom'

export default function Auth1() {
    const userName=useRef('')
    const password=useRef('')
    const [showMsg,setShowMsg]=useState(false)
    const [msg,setMsg]=useState('')
    const navigate=useNavigate()
    const submit=async(event)=>{
        event.preventDefault();
        console.log(userName.current.value,password.current.value)
        const res=await http.post('/login',{userName:userName.current.value,password:password.current.value})
        if(res.data.flag){
            setShowMsg(false)
            localStorage.setItem('ifAuth1',true)
            navigate('/login/auth2',{
                state:{
                    phone:res.data.phone
                }
            })
        }else{
            setMsg(res.data.message)
            setShowMsg(true)
        }
    }
    return (
    <div>
        <form className="flex max-w-md flex-col gap-4 mx-auto my-4 w-4/5" onSubmit={submit}>
                    <div>
                        <div className="mb-2 block">
                        <Label htmlFor="userName" value="Your Name" />
                        </div>
                        <TextInput id="userName" ref={userName} required />
                    </div>
                    <div>
                        <div className="mb-2 block">
                        <Label htmlFor="password1" value="Your password" />
                        </div>
                        <TextInput id="password1" type="password" ref={password} required />
                    </div>
                    <div className="flex items-center gap-2">
                        <Checkbox id="remember" />
                        <Label htmlFor="remember">Remember me</Label>
                    </div>
                    <Button type="submit" className='w-1/2 mx-auto'>Submit</Button>
                    {showMsg && (
                        <div className='mx-auto my-2 text-sm text-red-600'>{msg}</div>
                    )}
                </form>
    </div>
  )
}
