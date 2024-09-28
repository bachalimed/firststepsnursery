import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from '../../../../app/api/apiSlice'

// Initialize the entity adapter
const attendedSchoolsAdapter = createEntityAdapter({})//we can iterate on the id but not on the entities
// Initial state using the adapter
const initialState = attendedSchoolsAdapter.getInitialState()

// Inject endpoints into the apiSlice
export const attendedSchoolsApiSlice = apiSlice.injectEndpoints({
    //define endpoints
    endpoints: builder => ({//a hook will be created automatically based on the end point :getattendedSchools
        getAttendedSchools: builder.query({
            query: () => '/settings/academicsSet/attendedSchools/',//this route is as defined in the backend server.js to give all attendedSchools
            validateStatus: (response, result) => {//to validate the status as per documentation
                return response.status === 200 && !result.isError
            
            },
            //keepUnusedDataFor: 5,//default is 60seconds or data will be removed from the cache
            transformResponse: responseData => {
                const newLoadedAttendedSchools = responseData.map(attendedSchool => { 
                    
                    attendedSchool.id = attendedSchool._id//changed the _id from mongoDB to id
                    delete attendedSchool._id//added to delete the extra original _id from mongo but careful when planning to save to db again
                    return attendedSchool
                })
                return attendedSchoolsAdapter.upsertMany(initialState, newLoadedAttendedSchools)
            },
            providesTags:['attendedSchool']
        }),
        getAttendedSchoolById: builder.query({
            query: (params) => {
              const queryString = new URLSearchParams(params).toString();
              return `/settings/academicsSet/attendedSchools?${queryString}`;
            },
            validateStatus: (response, result) => {
              return response.status === 200 && !result.isError;
            },
            
            providesTags: ["attendedSchool"],
          }),
        addNewAttendedSchool: builder.mutation({
            query: initialAttendedSchoolData => ({
                url: '/settings/academicsSet/attendedSchools/',
                method: 'POST',
                body: {
                    ...initialAttendedSchoolData,
                }
            }),
            invalidatesTags: ['attendedSchool']
        }),
        updateAttendedSchool: builder.mutation({
            query: initialAttendedSchoolData => ({
                url: '/settings/academicsSet/attendedSchools/',
                method: 'PATCH',
                body: {
                    ...initialAttendedSchoolData,
                }
            }),
            invalidatesTags: ['attendedSchool']
        }),
        deleteAttendedSchool: builder.mutation({
            query: ({ id }) => ({
                url: '/settings/academicsSet/attendedSchools/',
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: ['attendedSchool']
        }),
    }),
})
export const {//hooks created automatically from endpoint
    useGetAttendedSchoolsQuery,//this can be used whereven we want to fetch the data
    useGetAttendedSchoolByIdQuery,
    useAddNewAttendedSchoolMutation,
    useUpdateAttendedSchoolMutation,
    useDeleteAttendedSchoolMutation,
} = attendedSchoolsApiSlice

// returns the query result object by using the endpoint already defined above and .select method
export const selectAttendedSchoolsResult = attendedSchoolsApiSlice.endpoints.getAttendedSchools.select()

// creates memoized selector
const selectAttendedSchoolsData = createSelector(
    selectAttendedSchoolsResult,
    attendedSchoolsResult => attendedSchoolsResult.data // normalized state object with ids & entities, this will grab the data from the selectattendedSchools result
)//we did not export, just getting the selector ready to be used in the next part

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllAttendedSchools,//the default selectAll is renamed to selectAllAttendedSchools
    selectById: selectAttendedSchoolById,
    selectIds: selectAttendedSchoolIds
    // Pass in a selector that returns the attendedSchools slice of state
} = attendedSchoolsAdapter.getSelectors(state => selectAttendedSchoolsData(state) ?? initialState)