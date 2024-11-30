import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../../app/api/apiSlice";

const leavesAdapter = createEntityAdapter({});

const initialState = leavesAdapter.getInitialState();

export const leavesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLeaves: builder.query({
      query: () => `/hr/leaves`, //as defined in server.js
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      //keepUnusedDataFor: 5,//default when app is deployed is 60seconds
      transformResponse: (responseData) => {
        const loadedLeaves = responseData.map((leave) => {
          leave.id = leave._id;
          return leave;
        });
        return leavesAdapter.setAll(initialState, loadedLeaves);
      },
      providesTags: ["leave"],
     
    }),
    getLeavesByYear: builder.query({
      query: (params) => {
        const queryString = new URLSearchParams(params).toString();
        return `/hr/leaves?${queryString}`;
      },

      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },

      transformResponse: (responseData) => {
        //console.log('  in the APIslice',responseData.total)

        const newLoadedLeaves = responseData.map((leave) => {
          leave.id = leave._id; //changed the _id from mongoDB to id
          delete leave._id; //added to delete the extra original _id from mongo but careful when planning to save to db again
          return leave;
        });
        return leavesAdapter.setAll(initialState, newLoadedLeaves);
      },
      providesTags: ["leave"],
    }),
    getLeaveById: builder.query({
      query: (params) => {
        const queryString = new URLSearchParams(params).toString();
        return `/hr/leaves?${queryString}`;
      },

      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },

      transformResponse: (responseData) => {
        return responseData;
      },
      providesTags: ["leave"],
    }),
    addNewLeave: builder.mutation({
      query: (initialLeaveData) => ({
        url: "/hr/leaves",
        method: "POST",
        body: {
          ...initialLeaveData,
        },
      }),
      invalidatesTags: [
        //forces the cache in RTK query to update
        { type: "leave", id: "LIST" }, //the leave list will be unvalidated and updated
      ],
    }),
    updateLeave: builder.mutation({
      query: (initialLeaveData) => ({
        url: "/hr/leaves",
        method: "PATCH",
        body: {
          ...initialLeaveData,
        },
      }),
      invalidatesTags: ["leave"],
    }),
    deleteLeave: builder.mutation({
      query: ({ id }) => ({
        url: "/hr/leaves",
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: ["leave"],
    }),
  }),
});

export const {
  useGetLeavesQuery,
  useGetLeavesByYearQuery,
  useGetLeaveByIdQuery,
  useAddNewLeaveMutation,
  useUpdateLeaveMutation,
  useDeleteLeaveMutation,
} = leavesApiSlice;

// returns the query result object
export const selectLeavesResult =
  leavesApiSlice.endpoints.getLeaves.select();

// creates memoized selector
const selectLeavesData = createSelector(
  selectLeavesResult,
  (leavesResult) => leavesResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllLeaves,
  selectById: selectLeaveById,
  selectIds: selectLeaveIds,
  // Pass in a selector that returns the leaves slice of state
} = leavesAdapter.getSelectors(
  (state) => selectLeavesData(state) ?? initialState
);
