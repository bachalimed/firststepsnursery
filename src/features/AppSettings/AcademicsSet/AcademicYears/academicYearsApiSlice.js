import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from '../../../../app/api/apiSlice'

// Initialize the entity adapter
const academicYearsAdapter = createEntityAdapter({})//we can iterate on the id but not on the entities
// Initial state using the adapter
const initialState = academicYearsAdapter.getInitialState()

// Inject endpoints into the apiSlice
export const academicYearsApiSlice = apiSlice.injectEndpoints({
    //define endpoints
    endpoints: builder => ({//a hook will be created automatically based on the end point :getacademicYears
        getAcademicYears: builder.query({
            query: () => '/settings/academicsSet/academicYears/',//this route is as defined in the backend server.js to give all academicYears
            validateStatus: (response, result) => {//to validate the status as per documentation
                return response.status === 200 && !result.isError
                
            },
            //keepUnusedDataFor: 5,//default is 60seconds or data will be removed from the cache
            transformResponse: responseData => {
                const{academicYears}=responseData
                
                //console.log('academicYears length  in the APIslice',responseData.total)
                //console.log('academicYears in the APIslice', academicYears)
                const newAcademicYears = academicYears.map(academicYear => { 
                    
                    academicYear.id = academicYear._id//changed the _id from mongoDB to id
                    delete academicYear._id//added to delete the extra original _id from mongo but careful when planning to save to db again
                    return academicYear
                })
                //sort by newst year
                const sortedList = newAcademicYears.sort((a, b) => b.title.localeCompare(a.title))
                //console.log('modifiedacademicYears in the APIslice', newAcademicYears)
                
               return academicYearsAdapter.setAll(initialState, sortedList)//loaded the academicYears into academicYearsadapter, setAll is responsible of creating ids and entities
             
            },
            providesTags:['academicYear'],
            // providesTags: (result, error, arg) => {
            //     if (result?.ids) {
            //         return [
            //             { type: 'AcademicYear', id: 'LIST' },
            //             ...result.ids.map(id => ({ type: 'AcademicYear', id }))
            //         ]
            //     } else return [{ type: 'AcademicYear', id: 'LIST' }]
            // }, 
        }),
        addNewAcademicYear: builder.mutation({
            query: initialAcademicYearData => ({
                url: '/settings/academicsSet/academicYears/',
                method: 'POST',
                body: {
                    ...initialAcademicYearData,
                }
            }),
            invalidatesTags:['academicYear'],
            // invalidatesTags: [//forces the cache in RTK query to update
                // { type: 'AcademicYear', id: "LIST" }//the academicYear list will be unvalidated and updated
            // ]
        }),
        updateAcademicYear: builder.mutation({
            query: initialAcademicYearData => ({
                url: '/settings/academicsSet/academicYears/',
                method: 'PATCH',
                body: {
                    ...initialAcademicYearData,
                }
            }),
            invalidatesTags:['academicYear'],
            // invalidatesTags: (result, error, arg) => [//we re not updating all the list, butonly update the academicYear in the cache by using the arg.id
            //     { type: 'AcademicYear', id: arg.id }
            // ]
        }),
        deleteAcademicYear: builder.mutation({
            query: ({ id }) => ({
                url: '/settings/academicsSet/academicYears/',
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags:['academicYear'],
            // invalidatesTags: (result, error, arg) => [
            //     { type: 'AcademicYear', id: arg.id }
            // ]
        }),
    }),
})
export const {//hooks created automatically from endpoint
    useGetAcademicYearsQuery,//this can be used whereven we want to fetch the data
    useAddNewAcademicYearMutation,
    useUpdateAcademicYearMutation,
    useDeleteAcademicYearMutation,
} = academicYearsApiSlice

// returns the query result object by using the endpoint already defined above and .select method
export const selectAcademicYearsResult = academicYearsApiSlice.endpoints.getAcademicYears.select()

// creates memoized selector
const selectAcademicYearsData = createSelector(
    selectAcademicYearsResult,
    academicYearsResult => academicYearsResult.data // normalized state object with ids & entities, this will grab the data from the selectacademicYears result
)//we did not export, just getting the selector ready to be used in the next part

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllAcademicYears,//the default selectAll is renamed to selectAllAcademicYears
    selectById: selectAcademicYearById,
    selectIds: selectAcademicYearIds
    // Pass in a selector that returns the academicYears slice of state
} = academicYearsAdapter.getSelectors(state => selectAcademicYearsData(state) ?? initialState)