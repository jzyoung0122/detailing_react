import { createSlice } from "@reduxjs/toolkit";

const initialState={
    checkbox:[] 
}

const checkboxStore=createSlice({
    name:'checkbox',
    initialState,
    reducers:{
        setCheckbox(state,action){
            state.checkbox=action.payload
        },
        reset:()=>initialState
    }
})

const {setCheckbox,reset}=checkboxStore.actions
export{setCheckbox,reset}
const checkboxReducer=checkboxStore.reducer
export default checkboxReducer