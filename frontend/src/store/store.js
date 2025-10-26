import { configureStore } from "@reduxjs/toolkit"
import authReducer from "../slices/authSlice"   
import chatReducer from '../slices/chatSlice' 
import threadsReducer from '../slices/threadsSlice'
import uiReducer from '../slices/uiSlice'

 export const store = configureStore({
    reducer: {
        auth: authReducer,
        chat: chatReducer,
        threads: threadsReducer,
        ui: uiReducer
    }
 })