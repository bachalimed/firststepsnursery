import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../../app/api/apiSlice"

// Initialize the entity adapter
const academicYearsAdapter = createEntityAdapter({})//we can iterate on the id but not on the entities
// Initial state using the adapter
const initialState = academicYearsAdapter.getInitialState()


// Inject endpoints into the apiSlice
export const academicYearsApiSlice = apiSlice.injectEndpoints({
    //define endpoints
    endpoints: builder => ({//a hook will be created automatically based on the end point :getacademicYears
        getAcademicYears: builder.query({
            query: () => '/settings/academicsSet/academicYears/',//this route is as defined in the backend server.js
            validateStatus: (response, result) => {//to validate the status as per documentation
                return response.status === 200 && !result.isError
            },
            //keepUnusedDataFor: 5,//default is 60seconds or data will be removed from the cache
            transformResponse: responseData => {
                const loadedAcademicYears = responseData.map(academicYear => {
                    academicYear.id = academicYear._id//changed the _id from mongoDB to id
                    return academicYear
                });
                return academicYearsAdapter.setAll(initialState, loadedAcademicYears)//loaded the academicYears into academicYearsadapter
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'AcademicYear', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'AcademicYear', id }))
                    ]
                } else return [{ type: 'AcademicYear', id: 'LIST' }]
            }
        }),
        addNewAcademicYear: builder.mutation({
            query: initialAcademicYearData => ({
                url: '/settings/academicsSet/academicYears/',
                method: 'POST',
                body: {
                    ...initialAcademicYearData,
                }
            }),
            invalidatesTags: [//forces the cache in RTK query to update
                { type: 'AcademicYear', id: "LIST" }//the academicYear list will be unvalidated and updated
            ]
        }),
        updateAcademicYear: builder.mutation({
            query: initialAcademicYearData => ({
                url: '/settings/academicsSet/academicYears/',
                method: 'PATCH',
                body: {
                    ...initialAcademicYearData,
                }
            }),
            invalidatesTags: (result, error, arg) => [//we re not updating all the list, butonly update the academicYear in the cache by using the arg.id
                { type: 'AcademicYear', id: arg.id }
            ]
        }),
        deleteAcademicYear: builder.mutation({
            query: ({ id }) => ({
                url: '/settings/academicsSet/academicYears/',
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'AcademicYear', id: arg.id }
            ]
        }),
    }),
})

export const {//hooks created automatically from endpoint
    useGetAcademicYearsQuery,
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