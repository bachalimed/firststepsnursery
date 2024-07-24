import {
  createSelector,
  createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice"

const tasksAdapter = createEntityAdapter({})
//thsi will show the not completed tasks first in the table
// const tasksAdapter = createEntityAdapter({
//   sortComparer: (a, b) => (a.completed === b.completed) ? 0 : a.completed ? 1 : -1
// })

const initialState = tasksAdapter.getInitialState()

export const tasksApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
      getTasks: builder.query({
          query: () => '/desk/tasks',//as defined in server.js
          validateStatus: (response, result) => {
              return response.status === 200 && !result.isError
          },
          //keepUnusedDataFor: 5,//default when app is deployed is 60seconds
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
      addNewTask: builder.mutation({
        query: initialTaskData => ({
            url: '/desk/tasks',
            method: 'POST',
            body: {
                ...initialTaskData,
            }
        }),
        invalidatesTags: [//forces the cache in RTK query to update
            { type: 'Task', id: "LIST" }//the task list will be unvalidated and updated
        ]
    }),
    updateTask: builder.mutation({
        query: initialTaskData => ({
            url: '/desk/tasks',
            method: 'PATCH',
            body: {
                ...initialTaskData,
            }
        }),
        invalidatesTags: (result, error, arg) => [//we re not updating all the list, butonly update the task in the cache by using the arg.id
            { type: 'Task', id: arg.id }
        ]
    }),
    deleteTask: builder.mutation({
        query: ({ id }) => ({
            url: '/desk/tasks',
            method: 'DELETE',
            body: { id }
        }),
        invalidatesTags: (result, error, arg) => [
            { type: 'Task', id: arg.id }
        ]
    }),
  }),
})

export const {
  useGetTasksQuery,
  useAddNewTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
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