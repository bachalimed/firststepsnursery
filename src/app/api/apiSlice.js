

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3500' }),//this baseurl will be changed when deploying to the backend url and port
    tagTypes: ['Note', 'User'],//will be used for cached data, maybe we need to put all the data that will be used: student...
    endpoints: builder => ({})
})