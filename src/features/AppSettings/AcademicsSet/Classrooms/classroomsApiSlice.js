import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from '../../../../app/api/apiSlice'

// Initialize the entity adapter
const classroomsAdapter = createEntityAdapter({})//we can iterate on the id but not on the entities
// Initial state using the adapter
const initialState = classroomsAdapter.getInitialState()

// Inject endpoints into the apiSlice
export const classroomsApiSlice = apiSlice.injectEndpoints({
    //define endpoints
    endpoints: builder => ({//a hook will be created automatically based on the end point :getclassrooms
        getClassrooms: builder.query({
            query: () => '/settings/academicsSet/classrooms/',//this route is as defined in the backend server.js to give all classrooms
            validateStatus: (response, result) => {//to validate the status as per documentation
                return response.status === 200 && !result.isError
            
            },
            //keepUnusedDataFor: 5,//default is 60seconds or data will be removed from the cache
            transformResponse: responseData => {
                const newLoadedClassrooms = responseData.map(classroom => { 
                    
                    classroom.id = classroom._id//changed the _id from mongoDB to id
                    delete classroom._id//added to delete the extra original _id from mongo but careful when planning to save to db again
                    return classroom
                })
                return classroomsAdapter.upsertMany(initialState, newLoadedClassrooms)
            },
            providesTags:['classroom']
        }),
        getClassroomById: builder.query({
            query: (params) => {
              const queryString = new URLSearchParams(params).toString();
              return `/settings/academicsSet/classrooms?${queryString}`;
            },
            validateStatus: (response, result) => {
              return response.status === 200 && !result.isError;
            },
            
            providesTags: ["classroom"],
          }),
        addNewClassroom: builder.mutation({
            query: initialClassroomData => ({
                url: '/settings/academicsSet/classrooms/',
                method: 'POST',
                body: {
                    ...initialClassroomData,
                }
            }),
            invalidatesTags: ['classroom']
        }),
        updateClassroom: builder.mutation({
            query: initialClassroomData => ({
                url: '/settings/academicsSet/classrooms/',
                method: 'PATCH',
                body: {
                    ...initialClassroomData,
                }
            }),
            invalidatesTags: ['classroom']
        }),
        deleteClassroom: builder.mutation({
            query: ({ id }) => ({
                url: '/settings/academicsSet/classrooms/',
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: ['classroom']
        }),
    }),
})
export const {//hooks created automatically from endpoint
    useGetClassroomsQuery,//this can be used whereven we want to fetch the data
    useGetClassroomByIdQuery,
    useAddNewClassroomMutation,
    useUpdateClassroomMutation,
    useDeleteClassroomMutation,
} = classroomsApiSlice

// returns the query result object by using the endpoint already defined above and .select method
export const selectClassroomsResult = classroomsApiSlice.endpoints.getClassrooms.select()

// creates memoized selector
const selectClassroomsData = createSelector(
    selectClassroomsResult,
    classroomsResult => classroomsResult.data // normalized state object with ids & entities, this will grab the data from the selectclassrooms result
)//we did not export, just getting the selector ready to be used in the next part

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllClassrooms,//the default selectAll is renamed to selectAllClassrooms
    selectById: selectClassroomById,
    selectIds: selectClassroomIds
    // Pass in a selector that returns the classrooms slice of state
} = classroomsAdapter.getSelectors(state => selectClassroomsData(state) ?? initialState)