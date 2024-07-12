import { configureStore } from "@reduxjs/toolkit"
import taskReducer from "../features/Desk/taskSlice"
import { apiSlice } from './api/apiSlice'


export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        taskReducer,//imported from taskSlice
        
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true
})