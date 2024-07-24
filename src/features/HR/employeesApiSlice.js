import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice"

const employeesAdapter = createEntityAdapter({})

const initialState = employeesAdapter.getInitialState()

export const employeesApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getEmployees: builder.query({
            query: () => '/students/studentsEmployees/employees',//as defined in server.js
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            //keepUnusedDataFor: 5,//default when app is deployed is 60seconds
            transformResponse: responseData => {
                const loadedEmployees = responseData.map(employee => {
                    employee.id = employee._id
                    return employee
                });
                return employeesAdapter.setAll(initialState, loadedEmployees)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Employee', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Employee', id }))
                    ]
                } else return [{ type: 'Employee', id: 'LIST' }]
            }
        }),
        addNewEmployee: builder.mutation({
            query: initialEmployeeData => ({
                url: '/desk/employees',
                method: 'POST',
                body: {
                    ...initialEmployeeData,
                }
            }),
            invalidatesTags: [//forces the cache in RTK query to update
                { type: 'Employee', id: "LIST" }//the employee list will be unvalidated and updated
            ]
        }),
        updateEmployee: builder.mutation({
            query: initialEmployeeData => ({
                url: '/desk/employees',
                method: 'PATCH',
                body: {
                    ...initialEmployeeData,
                }
            }),
            invalidatesTags: (result, error, arg) => [//we re not updating all the list, butonly update the employee in the cache by using the arg.id
                { type: 'Employee', id: arg.id }
            ]
        }),
        deleteEmployee: builder.mutation({
            query: ({ id }) => ({
                url: '/desk/employees',
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Employee', id: arg.id }
            ]
        }),
    }),
})

export const {
    useGetEmployeesQuery,
    useAddNewEmployeeMutation,
    useUpdateEmployeeMutation,
    useDeleteEmployeeMutation,
} = employeesApiSlice

// returns the query result object
export const selectEmployeesResult = employeesApiSlice.endpoints.getEmployees.select()

// creates memoized selector
const selectEmployeesData = createSelector(
    selectEmployeesResult,
    employeesResult => employeesResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllEmployees,
    selectById: selectEmployeeById,
    selectIds: selectEmployeeIds
    // Pass in a selector that returns the employees slice of state
} = employeesAdapter.getSelectors(state => selectEmployeesData(state) ?? initialState)