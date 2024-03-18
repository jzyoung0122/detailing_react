import { configureStore } from '@reduxjs/toolkit'
import descriptionReducer from './modules/descriptions'
import bookingReducer from './modules/booking'
import checkboxReducer from './modules/checkbox';
import { combineReducers } from 'redux';
import {persistStore, persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage'


const reducers=combineReducers({
    description:descriptionReducer,
    booking:bookingReducer,
    checkbox:checkboxReducer
})
const persistConfig = {
    key: 'root',
    storage: storage,
}

const persisitedReduer = persistReducer(persistConfig,reducers)

const store=configureStore({
    reducer:persisitedReduer,
    middleware:(getDefaultMiddleware)=>getDefaultMiddleware(
        {
            serializableCheck: false
          }
    )
})

export default store