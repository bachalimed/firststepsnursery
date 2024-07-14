import { configureStore } from "@reduxjs/toolkit"

import { apiSlice } from './api/apiSlice'


export const store = configureStore({
    reducer: {// Add the generated reducer as a specific top-level slice
        [apiSlice.reducerPath]: apiSlice.reducer,
        //imported from taskSlice
        
    },
     // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true
})