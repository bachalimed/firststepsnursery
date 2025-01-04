
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setCredentials } from '../../features/auth/authSlice'
//fetchBaseQuery replaces axios

//basequery to use jwx and refresh tokens
const baseQuery = fetchBaseQuery({
    //baseUrl: 'http://localhost:3500',
   baseUrl: 'https://firststepsnursery-api.onrender.com',//the api address
    credentials: 'include',//we will always send the cookie containing our refresh token
    prepareHeaders: (headers, { getState }) => {//destructured api.getState , prepareheaders is function that will be applied to every request we send maybe add the selected year here
        const token = getState().auth.token//getting the token from the state getStateAPI which is already defined

        if (token) {
            headers.set("authorization", `Bearer ${token}`)//setting the token in the headers preceded with Bearer 
        }
        return headers
    }
})

const baseQueryWithReauth = async (args, api, extraOptions) => {
    // console.log(args) // request url, method, body
    // console.log(api) // signal, dispatch, getState()
    // console.log(extraOptions) //custom like {shout: true}

    //original request that might success if access token is not expired, else we try using refresh token to get another access token
    let result = await baseQuery(args, api, extraOptions)

    // If you want, handle other status codes, too
    if (result?.error?.status === 403) {
        console.log('sending refresh token')

        // send refresh token to get new access token 
        const refreshResult = await baseQuery('/auth/refresh', api, extraOptions)

        if (refreshResult?.data) {

            // store the new token 
            api.dispatch(setCredentials({ ...refreshResult.data }))

            // retry original query with new access token
            result = await baseQuery(args, api, extraOptions)
        } else {

            if (refreshResult?.error?.status === 403) {
                refreshResult.error.data.message = "Your login has expired."
            }
            return refreshResult
        }
    }

    return result
}

export const apiSlice = createApi({
  
    
    baseQuery: baseQueryWithReauth,
    tagTypes: ['student', 'user', 'family', 'task', 'employee', 'session', 'academicYear', 'studentDocument',  'employeeDocument',  'service'],//will be used for cached data so when we invalidate data, it will updated
    endpoints: builder => ({})//the extended ApiSlices will be the actual endpoints]
})