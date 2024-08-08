import { configureStore } from "@reduxjs/toolkit"
import { apiSlice } from './api/apiSlice'
import { setupListeners } from "@reduxjs/toolkit/query"
import authReducer from "../features/auth/authSlice"
import academicYearsReducer from '../features/AppSettings/AcademicsSet/AcademicYears/academicYearsSlice'

export const store = configureStore({
    reducer: {// Add the generated reducer as a specific top-level slice
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducer,
        academicYears: academicYearsReducer,
        //imported from taskSlice
        
    },
     // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true
})
setupListeners(store.dispatch)//to allow refresh of data if using multiple computers so we don't use old deleted data