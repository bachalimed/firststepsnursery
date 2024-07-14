import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice"

const usersAdapter = createEntityAdapter({})//we can iterate on the id but not on the entities

const initialState = usersAdapter.getInitialState()

export const usersApiSlice = apiSlice.injectEndpoints({//inject the ends points into apislice
    //define endpoints
    endpoints: builder => ({//a hook will be created automatically based on the end point :getusers
        getUsers: builder.query({
            query: () => '/admin/users',//this route is as defined in the backend server.js
            validateStatus: (response, result) => {//to validate the status as per documentation
                return response.status === 200 && !result.isError
            },
            keepUnusedDataFor: 5,//default is 60seconds or data will be removed from the cache
            transformResponse: responseData => {
                const loadedUsers = responseData.map(user => {
                    user.id = user._id//changed the _id from mongoDB to id
                    return user
                });
                return usersAdapter.setAll(initialState, loadedUsers)//loaded the users into usersadapter
            },
            // providesTags: (result, error, arg) => {//not relevant, related to tags on blogs messages
            //     if (result?.ids) {
            //         return [
            //             { type: 'User', id: 'LIST' },
            //             ...result.ids.map(id => ({ type: 'User', id }))
            //         ]
            //     } else return [{ type: 'User', id: 'LIST' }]
            // }
        }),
    }),
})


export const {
    useGetUsersQuery,//hook created automatically from endpoint
} = usersApiSlice

// returns the query result object by using the endpoint already defined above and .select method
export const selectUsersResult = usersApiSlice.endpoints.getUsers.select()

// creates memoized selector
const selectUsersData = createSelector(
    selectUsersResult,
    usersResult => usersResult.data // normalized state object with ids & entities, this will grab the data from the selectusers result
)//we did not export, just getting the selector ready to be used in the next part

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllUsers,//the default selectAll is renamed to selectAllUsers
    selectById: selectUserById,
    selectIds: selectUserIds
    // Pass in a selector that returns the users slice of state
} = usersAdapter.getSelectors(state => selectUsersData(state) ?? initialState)