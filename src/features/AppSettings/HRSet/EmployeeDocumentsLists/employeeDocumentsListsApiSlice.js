// import {
//     createSelector,
//     createEntityAdapter
// } from "@reduxjs/toolkit";
// import { apiSlice } from '../../../../app/api/apiSlice'

// // Initialize the entity adapter
// const employeeDocumentsListsAdapter = createEntityAdapter({})//we can iterate on the id but not on the entities
// // Initial state using the adapter
// const initialState = employeeDocumentsListsAdapter.getInitialState()

// // Inject endpoints into the apiSlice
// export const employeeDocumentsListsApiSlice = apiSlice.injectEndpoints({
//     //define endpoints
//     endpoints: builder => ({//a hook will be created automatically based on the end point :getemployeeDocumentsLists
//         getEmployeeDocumentsLists: builder.query({
//             query: () => '/settings/employeesSet/employeeDocumentsLists/',//this route is as defined in the backend server.js to give all employeeDocumentsLists
//             validateStatus: (response, result) => {//to validate the status as per documentation
//                 return response.status === 200 && !result.isError

//             },
//             //keepUnusedDataFor: 5,//default is 60seconds or data will be removed from the cache
//             transformResponse: responseData => {
//                 const newLoadedEmployeeDocumentsLists = responseData.map(employeeDocumentsList => {

//                     employeeDocumentsList.id = employeeDocumentsList._id//changed the _id from mongoDB to id
//                     delete employeeDocumentsList._id//added to delete the extra original _id from mongo but careful when planning to save to db again
//                     return employeeDocumentsList
//                 })
//                 return employeeDocumentsListsAdapter.setAll(initialState, newLoadedEmployeeDocumentsLists)
//             },
//             providesTags:['employeeDocumentsList']
//         }),
//         getEmployeeDocumentsByYearById: builder.query({//will get the list for that year and append studtn document id if exisits
//             query: (params) =>{
//                 const queryString = new URLSearchParams(params).toString()
//                 return `/employees/employeesParents/employeeDocuments?${queryString}`
//             },

//             validateStatus: (response, result) => {
//                 return response.status === 200 && !result.isError
//             },

//             transformResponse: responseData => {
//                     return responseData
//                 },
//             providesTags:['employeeDocument']

//             }),
//         updateEmployeeDocumentsList: builder.mutation({
//             query: initialEmployeeDocumentsListData => ({
//                 url: '/settings/employeesSet/employeeDocumentsLists/',
//                 method: 'PATCH',
//                 body: {
//                     ...initialEmployeeDocumentsListData,
//                 }
//             }),
//             invalidatesTags: ['employeeDocumentsList']
//         }),
//         addNewEmployeeDocumentsList: builder.mutation({
//             query: initialEmployeeDocumentsListData => ({
//                 url: '/settings/employeesSet/employeeDocumentsLists/',
//                 method: 'POST',
//                 body: {
//                     ...initialEmployeeDocumentsListData,
//                 }
//             }),
//             invalidatesTags: ['employeeDocumentsList']
//         }),
//         deleteEmployeeDocumentsList: builder.mutation({
//             query: ({ id }) => ({
//                 url: '/settings/employeesSet/employeeDocumentsLists/',
//                 method: 'DELETE',
//                 body: { id }
//             }),
//             invalidatesTags: ['employeeDocumentsList']
//         }),
//     }),
// })
// export const {//hooks created automatically from endpoint
//     useGetEmployeeDocumentsListsQuery,//this can be used whereven we want to fetch the data
//     useGetEmployeeDocumentsByYearByIdQuery,
//     useAddNewEmployeeDocumentsListMutation,
//     useUpdateEmployeeDocumentsListMutation,
//     useDeleteEmployeeDocumentsListMutation,
// } = employeeDocumentsListsApiSlice

// // returns the query result object by using the endpoint already defined above and .select method
// export const selectEmployeeDocumentsListsResult = employeeDocumentsListsApiSlice.endpoints.getEmployeeDocumentsLists.select()

// // creates memoized selector
// const selectEmployeeDocumentsListsData = createSelector(
//     selectEmployeeDocumentsListsResult,
//     employeeDocumentsListsResult => employeeDocumentsListsResult.data // normalized state object with ids & entities, this will grab the data from the selectemployeeDocumentsLists result
// )//we did not export, just getting the selector ready to be used in the next part

// //getSelectors creates these selectors and we rename them with aliases using destructuring
// export const {
//     selectAll: selectAllEmployeeDocumentsLists,//the default selectAll is renamed to selectAllEmployeeDocumentsLists
//     selectById: selectEmployeeDocumentsListById,
//     selectIds: selectEmployeeDocumentsListIds
//     // Pass in a selector that returns the employeeDocumentsLists slice of state
// } = employeeDocumentsListsAdapter.getSelectors(state => selectEmployeeDocumentsListsData(state) ?? initialState)
