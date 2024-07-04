
import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice"

const tasksAdapter = createEntityAdapter({
    sortComparer: (a, b) => (a.completed === b.completed) ? 0 : a.completed ? 1 : -1
})

const initialState = tasksAdapter.getInitialState()

export const tasksApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getTasks: builder.query({
            query: () => '/tasks',
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            keepUnusedDataFor: 5,
            transformResponse: responseData => {
                const loadedTasks = responseData.map(task => {
                    task.id = task._id
                    return task
                });
                return tasksAdapter.setAll(initialState, loadedTasks)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Task', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Task', id }))
                    ]
                } else return [{ type: 'Task', id: 'LIST' }]
            }
        }),
    }),
})

export const {
    useGetTasksQuery,
} = tasksApiSlice

// returns the query result object
export const selectTasksResult = tasksApiSlice.endpoints.getTasks.select()

// creates memoized selector
const selectTasksData = createSelector(
    selectTasksResult,
    tasksResult => tasksResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllTasks,
    selectById: selectTaskById,
    selectIds: selectTaskIds
    // Pass in a selector that returns the tasks slice of state
} = tasksAdapter.getSelectors(state => selectTasksData(state) ?? initialState)
