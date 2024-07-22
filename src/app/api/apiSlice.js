

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
//fetchBaseQuery replaces axios

export const apiSlice = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3500' }),//this baseurl will be changed when deploying to the backend url and port
    tagTypes: ['Student', 'User', 'Parent', 'Task', 'employee', 'academicYear'],//will be used for cached data, maybe we need to put all the data that will be used: student...
    endpoints: builder => ({})
})