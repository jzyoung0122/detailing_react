import {createSlice} from '@reduxjs/toolkit'
import http from '../../api'
// import axios from 'axios'

const descripionStore=createSlice({
    name:'description',
    initialState:{
        descriptions:[]
    },
    reducers:{
        setDescriptions(state,action){
            state.descriptions=action.payload
        }
    }
})

const {setDescriptions}=descripionStore.actions
const getDescriptions=()=>{
    return async(dispatch)=>{
    const res= await http.post('/getDescription')
    // .then((res)=>{
    //       dispatch(setDescriptions(res.data.description))
    //    })
    dispatch(setDescriptions(res.data.description))
        
    }
}

export{getDescriptions,setDescriptions}
const descriptionReducer=descripionStore.reducer

export default descriptionReducer