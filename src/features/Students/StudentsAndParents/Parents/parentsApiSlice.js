import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../../../app/api/apiSlice"

const parentsAdapter = createEntityAdapter({})

const initialState = parentsAdapter.getInitialState()

export const parentsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getParents: builder.query({
            query: () => '/students/studentsParents/parents/',//as defined in server.js
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            //keepUnusedDataFor: 5,//default when app is deployed is 60seconds
            transformResponse: responseData => {
                const loadedParents = responseData.map(parent => {
                    parent.id = parent._id
                    
                    return parent
                });
                return parentsAdapter.setAll(initialState, loadedParents)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'parent', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'parent', id }))
                    ]
                } else return [{ type: 'parent', id: 'LIST' }]
            }
        }),
        getParentsByYear: builder.query({
            query: (params) =>{
                const queryString = new URLSearchParams(params).toString() 
                return `/students/studentsParents/parents?${queryString}`
                },
            
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
           
            transformResponse: responseData => {
                
                const newLoadedParent = responseData.map(parent => { 
                    
                    parent.id = parent._id//changed the _id from mongoDB to id
                    delete parent._id//added to delete the extra original _id from mongo but careful when planning to save to db again
                    return parent
                })
                return parentsAdapter.setAll(initialState, newLoadedParent)
            },
            providesTags:['parent']
           
            // providesTags: (result, error, arg) => {
            //     if (result?.ids) {
            //         return [
            //             { type: 'parent', id: 'LIST' },
            //             ...result.ids.map(id => ({ type: 'parent', id }))
            //         ]
            //     } else return [{ type: 'parent', id: 'LIST' }]
            // }
        }),
        getParentById: builder.query({
            query: (params) =>{
                const queryString = new URLSearchParams(params).toString() 
                return `/students/studentsParents/parents?${queryString}`
                },
            
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
           
            transformResponse: responseData => {
                //const {loadedParent} =
                
                //console.log('academicYears length  in the APIslice',responseData.total)
                //console.log('academicYears in the APIslice', academicYears)
                const newLoadedParent = responseData.map(parent => { 
                    
                    parent.id = parent._id//changed the _id from mongoDB to id
                    delete parent._id//added to delete the extra original _id from mongo but careful when planning to save to db again
                    return parent
                })
                return parentsAdapter.upsertMany(initialState, newLoadedParent)
            },
            providesTags:['parent']
            // providesTags: (result, error, arg) => {
            //     if (result?.ids) {
            //         return [
            //             { type: 'parent', id: 'LIST' },
            //             ...result.ids.map(id => ({ type: 'parent', id }))
            //         ]
            //     } else return [{ type: 'parent', id: 'LIST' }]
            // }
        }),
        addNewParent: builder.mutation({
            query: initialParentData => ({
                url: '/students/studentsParents/parents/',
                method: 'POST',
                body: {
                    ...initialParentData,
                }
            }),
            invalidatesTags: ['parent']
        }),
        updateParent: builder.mutation({
            query: initialParentData => ({
                url: '/students/studentsParents/parents/',
                method: 'PATCH',
                body: {
                    ...initialParentData,
                }
            }),
            invalidatesTags: (result, error, arg) => [//we re not updating all the list, butonly update the parent in the cache by using the arg.id
                { type: 'parent', id: arg.id }
            ]
        }),
        deleteParent: builder.mutation({
            query: ({ id }) => ({
                url: '/students/studentsParents/parents/',
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'parent', id: arg.id }
            ]
        }),
    }),
})

export const {
    useGetParentsQuery,
    useAddNewParentMutation,
    useUpdateParentMutation,
    useDeleteParentMutation,
    useGetParentsByYearQuery,
    useGetParentByIdQuery
} = parentsApiSlice

// returns the query result object
export const selectParentsResult = parentsApiSlice.endpoints.getParents.select()

// creates memoized selector
const selectParentsData = createSelector(
    selectParentsResult,
    parentsResult => parentsResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllParents,
    selectById: selectParentById,
    selectIds: selectParentIds
    // Pass in a selector that returns the parents slice of state
} = parentsAdapter.getSelectors(state => selectParentsData(state) ?? initialState)