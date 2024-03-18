import {createSlice} from '@reduxjs/toolkit'

const initialState={
    date:'',
        time:-1,
        serviceList:[],
        firstName:'',
        lastName:'',
        phoneNumber:'',
        email:'',
        address:{
            address1:'',
            address2:'',
            suburb:'',
            state:'ACT',
            postCode:''
        },
        totalTime:0
}

const bookingStore=createSlice({
    name:'booking',
    initialState:initialState,
    reducers:{
        setServiceList(state,action){
            return {...state,
                serviceList:action.payload.slice(0)
            }        
        },

        setTotalTime(state,action){
            state.totalTime=action.payload
   
        },

        setDate(state,action){
            state.date=action.payload
        },

        setTime(state,action){
            state.time=action.payload
        },

        setForm(state,action){
            state.firstName=action.payload.firstName
            state.lastName=action.payload.lastName
            state.phoneNumber=action.payload.phoneNumber
            state.email=action.payload.email
            state.address.address1=action.payload.address1
            state.address.address2=action.payload.address2
            state.address.suburb=action.payload.suburb
            state.address.postCode=action.payload.postCode
        },

        reset(state){
            Object.assign(state,initialState)
        }
    }
})

const {setServiceList,setTotalTime,setTime,setDate,setForm,reset} = bookingStore.actions
export{setServiceList,setTotalTime,setTime,setDate,setForm,reset}
const bookingReducer=bookingStore.reducer
export default bookingReducer