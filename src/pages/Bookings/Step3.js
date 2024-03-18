import React, { useEffect, useState ,useRef} from 'react'
import { Card,Label, TextInput,Button} from 'flowbite-react';
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import Stepper from './Stepper';


export default function Step3() {
    const navigate=useNavigate()

    const ifActive={
        step1:true,step2:true,step3:true,step4:false
      }

    const { register, handleSubmit, formState: { errors },trigger,setValue } = useForm();
    const handleInputChange = async (fieldName) => {
        await trigger(fieldName);
      };
    const [isFocused,setFocused]=useState(false)  
    const handleFocus = (id) => {
        setFocused((prev) => ({ ...prev, [id]: true }));
      };
    
    const handleBlur = (id) => {
        setFocused((prev) => ({ ...prev, [id]: false }));
      };

    const onSubmit=(data)=>{
        dispatch({type:'booking/setForm',payload:data} )
        localStorage.setItem('isBookingDone',true)
        navigate('/booking/review')
    }

    
    const booking=useSelector(state=>state.booking)
    useEffect(()=>{
        if(booking.firstName!=''){
            setValue('firstName',booking.firstName)
            setValue('lastName',booking.lastName)
            setValue('phoneNumber',booking.phoneNumber)
            setValue('email',booking.email)
            setValue('address1',booking.address.address1)
            setValue('address2',booking.address.address2)
            setValue('suburb',booking.address.suburb)
            setValue('postCode',booking.address.postCode)

        }
    },[])

    const dispatch=useDispatch()
      
    return (
    <div>

    <div className='flex justify-center my-5'>
        <Stepper ifActive={ifActive}/>
    </div>

    <Card className="max-w-md m-auto">
        <form className="flex max-w-md flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
                <div className="mb-2 block">
                <Label htmlFor="firstName" value="Your First Name" />
                </div>
                <TextInput 
                    id='firstName' 
                    placeholder={isFocused['firstName']?'':'First Name'} 
                    {...register("firstName", { required: 'Please enter your first name'})}
                    onBlur={() => {handleInputChange('firstName');handleBlur('firstName')}}
                    onFocus={()=>{handleFocus('firstName')}}
                    color={`${errors.firstName && 'failure'}`}
                    helperText={ errors.firstName &&
                            <>
                            <span className="font-small">{errors.firstName.message}</span> 
                            </>
                        }
                    
                    
                    />
            </div>
            
            <div>
                <div className="mb-2 block">
                <Label htmlFor="lastName" value="Your Last Name" />
                </div>
                <TextInput id='lastName' 
                    placeholder={isFocused['lastName']?'':'Last Name'} 
                    {...register("lastName", { required:'Please enter your last name'})}
                    onBlur={() => {handleInputChange('lastName');handleBlur('lastName')}}
                    onFocus={()=>{handleFocus('lastName')}}
                    color={`${errors.lastName && 'failure'}`}
                    helperText={ errors.lastName &&
                            <>
                            <span className="font-small">{errors.lastName.message}</span> 
                            </>
                        }
                />
            </div>
            <div>
                <div className="mb-2 block">
                <Label htmlFor="phoneNumber" value="Your Mobile Number" />
                </div>
                <TextInput id='phoneNumber' placeholder={isFocused['phoneNumber']?'':'Mobile Number'} 
                    {...register("phoneNumber", { 
                        required: 'Please enter your mobile number.',
                        pattern:{
                            value:/^(?:\+?61|0)[2-478](?:[ -]?[0-9]){8}$/,
                            message:'Please enter a valid Australian mobile number'
                        }
                        })}
                    onBlur={() => {handleInputChange('phoneNumber');handleBlur('phoneNumber')}}
                    onFocus={()=>{handleFocus('phoneNumber')}}
                    color={`${errors.phoneNumber && 'failure'}`}
                    helperText={ errors.phoneNumber &&
                            <>
                            <span className="font-small">{errors.phoneNumber.message}</span> 
                            </>
                        }
                />
            </div>
            <div>
                <div className="mb-2 block">
                <Label htmlFor="email" value="Your Email" />
                </div>
                <TextInput id="email" type="email" placeholder={isFocused['email']?'':"name@gmail.com"} 
                    {...register("email", { 
                        required: 'Please enter your email.',
                        pattern:{
                            value:/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                            message:'Sorry,the email address is invalid.'
                        }
                        })}
                    onBlur={() => {handleInputChange('email');handleBlur('email')}}
                    onFocus={()=>{handleFocus('email')}}
                    color={`${errors.email && 'failure'}`}
                    helperText={ errors.email &&
                            <>
                            <span className="font-small">{errors.email.message}</span> 
                            </>
                        } />
            </div>
            <div>
                <div className="mb-2 block">
                <Label htmlFor="address1" value="Address 1" />
                </div>
                <TextInput id='address1' placeholder={isFocused['address1']?'':'Address1'} 
                    {...register('address1', { 
                        required: 'Please enter your address.',
                        
                        })}
                    onBlur={() => {handleInputChange('address1');handleBlur('address1')}}
                    onFocus={()=>{handleFocus('address1')}}
                    color={`${errors.address1 && 'failure'}`}
                    helperText={ errors.address1 &&
                            <>
                            <span className="font-small">{errors.address1.message}</span> 
                            </>
                        }
                    
                />
            </div>
            <div>
                <div className="mb-2 block">
                <Label htmlFor="address2" value="Address 2" />
                </div>
                <TextInput id='address2' placeholder={isFocused['address2']?'':'Address2 (optional)'}
                    {...register('address2')}
                    onBlur={() => {handleInputChange('address2');handleBlur('address2')}}
                    onFocus={()=>{handleFocus('address2')}}
                 />
            </div>
            <div>
                <div className="mb-2 block">
                <Label htmlFor="suburb" value="Suburb" />
                </div>
                <TextInput id='suburb' placeholder={isFocused['suburb'?'':'Suburb']} 
                {...register('suburb', { 
                        required: 'Please enter the surburb.',
                        
                        })}
                    onBlur={() => {handleInputChange('suburb');handleBlur('suburb')}}
                    onFocus={()=>{handleFocus('suburb')}}
                    color={`${errors.suburb && 'failure'}`}
                    helperText={ errors.suburb &&
                            <>
                            <span className="font-small">{errors.suburb.message}</span> 
                            </>
                        } />
            </div>
            <div>
                <div className="mb-2 block">
                <Label htmlFor="state" value="State" />
                </div>
                <TextInput id='state'  value='ACT' 
                    {...register('state')}
                    onBlur={() => {handleInputChange('state');handleBlur('state')}}
                    onFocus={()=>{handleFocus('state')}}
                    disabled
                    
                />
            </div>
            <div>
                <div className="mb-2 block">
                <Label htmlFor="postCode" value="Post Code" />
                </div>
                <TextInput id='postCode' placeholder={isFocused['postCode']? '':'Post Code' }
                    {...register('postCode', { 
                        required: 'Please enter the post code.',
                        
                        })}
                    onBlur={() => {handleInputChange('postCode');handleBlur('postCode')}}
                    onFocus={()=>{handleFocus('postCode')}}
                    color={`${errors.postCode && 'failure'}`}
                    helperText={ errors.postCode &&
                            <>
                            <span className="font-small">{errors.postCode.message}</span> 
                            </>
                        }
                 />
            </div>
            <Button type='submit'>Next</Button> 
        </form>
    </Card>

     {/* leave space for sticky footer */}
     <div className='h-32 sm:h-24'></div>

    </div>
  )
}
