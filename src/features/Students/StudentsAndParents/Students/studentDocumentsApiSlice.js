import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../../../app/api/apiSlice"
const studentDocumentsAdapter = createEntityAdapter({})
const initialState = studentDocumentsAdapter.getInitialState()

export const studentDocumentsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getStudentDocuments: builder.query({//this should be done with studetndocumentslists apiand not this one but it is ok
            query: () => '/students/studentsParents/studentDocuments/',//as defined in server.js
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },

            keepUnusedDataFor: 60,//default when app is deployed is 60seconds
            transformResponse: responseData => {
                const newLoadedStudentDocuments = responseData.map(studentDocument => { 
                    
                    studentDocument.id = studentDocument._id//changed the _id from mongoDB to id
                    delete studentDocument._id//added to delete the extra original _id from mongo but careful when planning to save to db again
                    return studentDocument
                })
                return studentDocumentsAdapter.upsertMany(initialState, newLoadedStudentDocuments)
            },
            providesTags:['studentDocument']
            // providesTags: (result, error, arg) => {
            //     if (result?.ids) {
            //         return [
            //             { type: 'studentsDocument', id: 'LIST' },
            //             ...result.ids.map(id => ({ type: 'studentsDocument', id }))
            //         ]
            //     } else return [{ type: 'studentsDocument', id: 'LIST' }]
            // }
        }),
        getStudentDocumentsByYear: builder.query({
            query: (params) =>{
                const queryString = new URLSearchParams(params).toString() 
                return `/students/studentsParents/studentDocuments?${queryString}`
                },
            
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
           
            transformResponse: responseData => {
                //const {loadedStudentDocuments} =
                
                //console.log('academicYears length  in the APIslice',responseData.total)
                //console.log('academicYears in the APIslice', academicYears)
                const newLoadedStudentDocuments = responseData.map(studentDocument => { 
                    
                    studentDocument.id = studentDocument._id//changed the _id from mongoDB to id
                    delete studentDocument._id//added to delete the extra original _id from mongo but careful when planning to save to db again
                    return studentDocument
                })
                return studentDocumentsAdapter.setAll(initialState, newLoadedStudentDocuments)
            },
            providesTags:['studentDocument']
           
            // providesTags: (result, error, arg) => {
                //     if (result?.ids) {
                    //         return [
                        //             { type: 'studentsDocument', id: 'LIST' },
                        //             ...result.ids.map(id => ({ type: 'studentsDocument', id }))
                        //         ]
                        //     } else return [{ type: 'studentsDocument', id: 'LIST' }]
                        // }
                    }),
            // getStudentDocumentsByYearById: builder.query({
            // query: (params) =>{
            //     const queryString = new URLSearchParams(params).toString() 
            //     return `/students/studentsParents/studentDocuments?${queryString}`
            // },
            
            // validateStatus: (response, result) => {
            //     return response.status === 200 && !result.isError
            // },
            
            
            // transformResponse: responseData => {
            //         return responseData
            //     },
            // providesTags:['studentDocument']
                
            // }),
            getStudentDocumentById: builder.query({
                query: (id) =>{
                    
                    return `/students/studentsParents/studentDocuments/${id}`
                },
                
                // responseHandler: (response) => response.blob(),
                
                
            }),
            deleteStudentDocument: builder.mutation({
                query: ( {id }) => ({
                    url: `/students/studentsParents/studentDocuments/`,
                    method: 'DELETE',
                    body: {id},
                    
                }),
                invalidatesTags:['studentDocument']
            }),
           
            addStudentDocuments: builder.mutation({
                query:  (formData) => ({
                    url: '/students/studentsParents/studentDocuments/',
                    method: 'POST',
                body: formData,
                
            }),
            invalidatesTags: ['studentDocument']
        }),
        updateStudentDocument: builder.mutation({
            query: initialStudentDocumentData => ({
                url: '/students/studentsParents/studentDocuments',
                method: 'PATCH',
                body: {
                    ...initialStudentDocumentData,
                }
            }),
            invalidatesTags:['studentDocument']
            // invalidatesTags: (result, error, arg) => [//we re not updating all the list, butonly update the studentsDocument in the cache by using the arg.id
            //     { type: 'studentsDocument', id: arg.id }
            // ]
        }),
    }),
})

export const {
    useGetStudentDocumentsQuery,
    useAddStudentDocumentsMutation,
    useUpdateStudentDocumentMutation,
    useDeleteStudentDocumentMutation,
    useGetStudentDocumentsByYearQuery,
    //useGetStudentDocumentsByYearByIdQuery,
    useGetStudentDocumentByIdQuery,
} = studentDocumentsApiSlice

// returns the query result object and not only the data we need for this reason we need the createselector!!! thsi selcetor decides which query is used??
export const selectStudentDocumentsResult = studentDocumentsApiSlice.endpoints.getStudentDocumentsByYear.select()


//this is specific for thequery byYear:
// export const selectStudentDocumentsByYearResult = studentDocumentsApiSlice.endpoints.getStudentDocumentsByYear.select(selectedYear)

// export const selectStudentDocumentByIdFromYear = (state, id, selectedYear) => {
//     const studentDocumentsResult = selectStudentDocumentsByYearResult(state, selectedYear)
//     return studentDocumentsResult?.data?.entities[id]
// }

// creates memoized selector that takes the inpput function selescStudentDocumentsREsult and gets the data from it which is ids and entities
const selectStudentDocumentsData = createSelector(selectStudentDocumentsResult,
    studentDocumentsResult => studentDocumentsResult.data // normalized state object with ids & entities
)


//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllStudentDocuments,
    selectById: selectStudentDocumentById,
    selectIds: selectStudentDocumentIds
    // Pass in a selector that returns the studentDocuments slice of state
} = studentDocumentsAdapter.getSelectors(state => selectStudentDocumentsData(state) ?? initialState)
