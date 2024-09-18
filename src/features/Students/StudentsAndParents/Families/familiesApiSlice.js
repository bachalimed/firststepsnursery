import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../../../app/api/apiSlice"

const familiesAdapter = createEntityAdapter({})

const initialState = familiesAdapter.getInitialState()

export const familiesApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getFamilies: builder.query({
            query: () => '/students/studentsParents/families/',//as defined in server.js
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            //keepUnusedDataFor: 5,//default when app is deployed is 60seconds
            transformResponse: responseData => {
                const loadedFamilies = responseData.map(family => {
                    family.id = family._id
                    
                    return family
                });
                return familiesAdapter.setAll(initialState, loadedFamilies)
            },
            providesTags: ['family']
        }),
        getFamiliesByYear: builder.query({
            query: (params) =>{
                const queryString = new URLSearchParams(params).toString() 
                return `/students/studentsParents/families?${queryString}`
                },
            
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
           
            transformResponse: responseData => {
                
                const newLoadedFamily = responseData.map(family => { 
                    
                    family.id = family._id//changed the _id from mongoDB to id
                    delete family._id//added to delete the extra original _id from mongo but careful when planning to save to db again
                    return family
                })
                return familiesAdapter.setAll(initialState, newLoadedFamily)
            },
            providesTags:['family']
           
            // providesTags: (result, error, arg) => {
            //     if (result?.ids) {
            //         return [
            //             { type: 'parent', id: 'LIST' },
            //             ...result.ids.map(id => ({ type: 'parent', id }))
            //         ]
            //     } else return [{ type: 'parent', id: 'LIST' }]
            // }
        }),
        getFamilyById: builder.query({
            query: (params) =>{
                const queryString = new URLSearchParams(params).toString() 
                return `/students/studentsParents/families?${queryString}`
                },
            
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
           
            transformResponse: responseData => {
                //const {loadedParent} =
                
                //console.log('academicYears length  in the APIslice',responseData.total)
                //console.log('academicYears in the APIslice', academicYears)
                const newLoadedFamily = responseData.map(family => { 
                    
                    family.id = family._id//changed the _id from mongoDB to id
                    delete family._id//added to delete the extra original _id from mongo but careful when planning to save to db again
                    return family
                })
                return familiesAdapter.upsertMany(initialState, newLoadedFamily)
            },
            providesTags:['family']
          
        }),
        addNewFamily: builder.mutation({
            query: initialFamilyData => ({
                url: '/students/studentsParents/families/',
                method: 'POST',
                body: {
                    ...initialFamilyData,
                }
            }),
            invalidatesTags: ['family']
        }),
        updateParent: builder.mutation({
            query: initialParentData => ({
                url: '/students/studentsParents/families/',
                method: 'PATCH',
                body: {
                    ...initialParentData,
                }
            }),
            invalidatesTags: ['family']
        }),
        deleteFamily: builder.mutation({
            query: ({ id }) => ({
                url: '/students/studentsParents/families/',
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags:['family']
        }),
    }),
})

export const {
    useGetFamiliesQuery,
    useAddNewFamilyMutation,
    useUpdateFamilyMutation,
    useDeleteFamilyMutation,
    useGetFamiliesByYearQuery,
    useGetFamilyByIdQuery
} = familiesApiSlice

// returns the query result object
export const selectFamiliesResult = familiesApiSlice.endpoints.getFamilies.select()

// creates memoized selector
const selectFamiliesData = createSelector(
    selectFamiliesResult,
    familiesResult => familiesResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllFamilies,
    selectById: selectFamilyById,
    selectIds: selectFamilyIds
    // Pass in a selector that returns the parents slice of state
} = familiesAdapter.getSelectors(state => selectFamiliesData(state) ?? initialState)