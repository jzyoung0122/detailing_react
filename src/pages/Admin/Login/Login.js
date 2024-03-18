import React from 'react'
import { Card,TextInput,Label,Button,Checkbox } from 'flowbite-react'
import { useRef ,useState} from 'react'
import http from '../../../api'
import { Outlet } from 'react-router-dom'

export default function Login() {
    // const userName=useRef('')
    // const passWord=useRef('')
    // const [showMsg,setShowMsg]=useState(false)
    // const [msg,setMsg]=useState('')

    // const submit=async(event)=>{
    //     event.preventDefault();
    //     console.log(userName.current.value,passWord.current.value)
    //     const res=await http.post('/login',{userName:userName.current.value,passWord:passWord.current.value})
    //     if(res.data.flag){
    //         setShowMsg(false)
    //     }else{
    //         setMsg(res.data.message)
    //         setShowMsg(true)
    //     }
    // }

    return (
    <div>
        <div className='relative'>
            <Card className=' bg-gray-100  w-2/3 md:w-1/2 absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-1/2'>
                <div className='mx-auto'>
                <img src="./../../img/HAO_S-GARAGE.svg" className="mr-3 h-6 sm:h-9"/>
                </div>

                {/* <form className="flex max-w-md flex-col gap-4 mx-auto my-4 w-4/5" onSubmit={submit}>
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
                        <TextInput id="password1" type="password" ref={passWord} required />
                    </div>
                    <div className="flex items-center gap-2">
                        <Checkbox id="remember" />
                        <Label htmlFor="remember">Remember me</Label>
                    </div>
                    <Button type="submit" className='w-1/2 mx-auto'>Submit</Button>
                    {showMsg && (
                        <div className='mx-auto my-2 text-sm text-red-600'>{msg}</div>
                    )}
                </form> */}
                <Outlet/>
            </Card>
        </div>
    </div>
  )
}
