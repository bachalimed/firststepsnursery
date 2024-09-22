import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../../app/api/apiSlice"

const employeesAdapter = createEntityAdapter({})

const initialState = employeesAdapter.getInitialState()

export const employeesApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getEmployees: builder.query({
            query: () => `/hr/employees`,//as defined in server.js
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
            providesTags: ['employee']
            // providesTags: (result, error, arg) => {
            //     if (result?.ids) {
            //         return [
            //             { type: 'employee', id: 'LIST' },
            //             ...result.ids.map(id => ({ type: 'employee', id }))
            //         ]
            //     } else return [{ type: 'employee', id: 'LIST' }]
            // }
        }),
        getEmployeesByYear: builder.query({
            query: (params) =>{
                const queryString = new URLSearchParams(params).toString() 
                return `/hr/employees?${queryString}`
                },
            
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
           
            transformResponse: responseData => {
             
                console.log('  in the APIslice',responseData.total)
               
                const newLoadedEmployees = responseData.map(employee => { 

                    employee.id = employee._id//changed the _id from mongoDB to id
                    delete employee._id//added to delete the extra original _id from mongo but careful when planning to save to db again
                    return employee
                })
                return employeesAdapter.setAll(initialState, newLoadedEmployees)
            },
            providesTags:['employee']
           
           
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
                { type: 'employee', id: "LIST" }//the employee list will be unvalidated and updated
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
            invalidatesTags: ['employee']
        }),
        deleteEmployee: builder.mutation({
            query: ({ id }) => ({
                url: '/desk/employees',
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: ['employee']
        }),
    }),
})

export const {
    useGetEmployeesQuery,
    useGetEmployeesByYearQuery,
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