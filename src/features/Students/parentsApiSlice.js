import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice"

const parentsAdapter = createEntityAdapter({})

const initialState = parentsAdapter.getInitialState()

export const parentsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getParents: builder.query({
            query: () => '/students/studentsParents/parents',//as defined in server.js
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            keepUnusedDataFor: 5,//default when app is deployed is 60seconds
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
                        { type: 'Parent', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Parent', id }))
                    ]
                } else return [{ type: 'Parent', id: 'LIST' }]
            }
        }),
    }),
})

export const {
    useGetParentsQuery,
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