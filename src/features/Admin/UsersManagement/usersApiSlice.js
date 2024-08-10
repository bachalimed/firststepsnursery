import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../../app/api/apiSlice"

const usersAdapter = createEntityAdapter({})//we can iterate on the id but not on the entities

const initialState = usersAdapter.getInitialState()

export const usersApiSlice = apiSlice.injectEndpoints({//inject the ends points into apislice
    //define endpoints
    endpoints: builder => ({//a hook will be created automatically based on the end point :getusers
        getUsers: builder.query({
            query: () => '/admin/usersManagement/users/',//this route is as defined in the backend server.js
            validateStatus: (response, result) => {//to validate the status as per documentation
                return response.status === 200 && !result.isError
            },
            //keepUnusedDataFor: 5,//default is 60seconds or data will be  removed from the cache, this will make the page keeps reloading while editing the user after that time, this is solved by keeping an active subscription
            transformResponse: responseData => {
                const loadedUsers = responseData.map(user => {
                    user.id = user._id//changed the _id from mongoDB to id
                    return user
                });
                return usersAdapter.setAll(initialState, loadedUsers)//loaded the users into usersadapter into state
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'User', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'User', id }))
                    ]
                } else return [{ type: 'User', id: 'LIST' }]
            }
        }),
        addNewUser: builder.mutation({
            query: initialUserData => ({
                url: '/admin/usersManagement/photos/',//modified to target the muler route before newUser controller route
                method: 'POST',
                body: {
                    ...initialUserData,
                }
            }),
            invalidatesTags: [//forces the cache in RTK query to update
                { type: 'User', id: "LIST" }//the user list will be unvalidated and updated
            ]
        }),
        updateUser: builder.mutation({
            query: initialUserData => ({
                url: '/admin/usersManagement/:id',
                method: 'PATCH',
                body: {
                    ...initialUserData,
                }
            }),
            invalidatesTags: (result, error, arg) => [//we re not updating all the list, butonly update the user in the cache by using the arg.id
                { type: 'User', id: arg.id }
            ]
        }),
        deleteUser: builder.mutation({
            query: ({ id }) => ({
                url: '/admin/usersManagement/users',
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'User', id: arg.id }
            ]
        }),
        
    }),
})


export const {//hooks created automatically from endpoint
    useGetUsersQuery,
    useAddNewUserMutation,
    
    useUpdateUserMutation,
    useDeleteUserMutation,
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