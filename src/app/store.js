import { configureStore } from "@reduxjs/toolkit"
import { apiSlice } from './api/apiSlice'
import { setupListeners } from "@reduxjs/toolkit/query"
import authReducer from "../features/auth/authSlice"
import academicYearsReducer from '../features/AppSettings/AcademicsSet/AcademicYears/academicYearsSlice'
import tasksReducer from '../features/Desk/Tasks/tasksSlice'
import studentsReducer from  '../features/Students/StudentsAndParents/studentsSlice'
import parentsReducer from  '../features/Students/StudentsAndParents/parentsSlice'

export const store = configureStore({
    reducer: {// Add the generated reducer as a specific top-level slice
        [apiSlice.reducerPath]: apiSlice.reducer,//what ever we name in the reducerpath will be given the name to this apislice, the default is 'api'
        auth: authReducer,
        academicYear: academicYearsReducer,
        student: studentsReducer,
        parent: parentsReducer,
        //task: tasksReducer,
        
        //imported from taskSlice
        
    },
     // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(apiSlice.middleware),//apislice.middleeware manages cache lifitimes and expirations
    devTools: true
})
setupListeners(store.dispatch)//to allow refresh of data if using multiple computers so we don't use old deleted data