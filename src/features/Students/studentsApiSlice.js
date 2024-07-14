import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice"

const studentsAdapter = createEntityAdapter({})

const initialState = studentsAdapter.getInitialState()

export const studentsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getStudents: builder.query({
            query: () => '/students/studentsParents/students',//as defined in server.js
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            keepUnusedDataFor: 5,//default when app is deployed is 60seconds
            transformResponse: responseData => {
                const loadedStudents = responseData.map(student => {
                    student.id = student._id
                    return student
                });
                return studentsAdapter.setAll(initialState, loadedStudents)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Student', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Student', id }))
                    ]
                } else return [{ type: 'Student', id: 'LIST' }]
            }
        }),
        addNewStudent: builder.mutation({
            query: initialStudentData => ({
                url: '/desk/students',
                method: 'POST',
                body: {
                    ...initialStudentData,
                }
            }),
            invalidatesTags: [//forces the cache in RTK query to update
                { type: 'Student', id: "LIST" }//the student list will be unvalidated and updated
            ]
        }),
        updateStudent: builder.mutation({
            query: initialStudentData => ({
                url: '/desk/students',
                method: 'PATCH',
                body: {
                    ...initialStudentData,
                }
            }),
            invalidatesTags: (result, error, arg) => [//we re not updating all the list, butonly update the student in the cache by using the arg.id
                { type: 'Student', id: arg.id }
            ]
        }),
        deleteStudent: builder.mutation({
            query: ({ id }) => ({
                url: '/desk/students',
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Student', id: arg.id }
            ]
        }),
    }),
})

export const {
    useGetStudentsQuery,
    useAddNewStudentMutation,
    useUpdateStudentMutation,
    useDeleteStudentMutation,
} = studentsApiSlice

// returns the query result object
export const selectStudentsResult = studentsApiSlice.endpoints.getStudents.select()

// creates memoized selector
const selectStudentsData = createSelector(
    selectStudentsResult,
    studentsResult => studentsResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllStudents,
    selectById: selectStudentById,
    selectIds: selectStudentIds
    // Pass in a selector that returns the students slice of state
} = studentsAdapter.getSelectors(state => selectStudentsData(state) ?? initialState)