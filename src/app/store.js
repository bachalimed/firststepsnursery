import { configureStore } from "@reduxjs/toolkit"

import { apiSlice } from './api/apiSlice'


export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        //imported from taskSlice
        
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true
})