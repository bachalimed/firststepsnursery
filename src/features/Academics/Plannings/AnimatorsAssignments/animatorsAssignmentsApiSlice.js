import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../../../app/api/apiSlice";

// Initialize the entity adapter
const animatorsAssignmentsAdapter = createEntityAdapter({}); //we can iterate on the id but not on the entities
// Initial state using the adapter
const initialState = animatorsAssignmentsAdapter.getInitialState();

// Inject endpoints into the apiSlice
export const animatorsAssignmentsApiSlice = apiSlice.injectEndpoints({
  //define endpoints
  endpoints: (builder) => ({
    //a hook will be created automatically based on the end point :getanimatorsAssignments
    getAnimatorsAssignments: builder.query({
      query: () => "/academics/animatorsAssignments/", //this route is as defined in the backend server.js to give all animatorsAssignments
      validateStatus: (response, result) => {
        //to validate the status as per documentation
        return response.status === 200 && !result.isError;
      },
      //keepUnusedDataFor: 5,//default is 60seconds or data will be removed from the cache
      transformResponse: (responseData) => {
        const newLoadedAnimatorsAssignments = responseData.map(
          (animatorsAssignment) => {
            animatorsAssignment.id = animatorsAssignment._id; //changed the _id from mongoDB to id
            delete animatorsAssignment._id; //added to delete the extra original _id from mongo but careful when planning to save to db again
            return animatorsAssignment;
          }
        );
        return animatorsAssignmentsAdapter.upsertMany(
          initialState,
          newLoadedAnimatorsAssignments
        );
      },
      providesTags: ["animatorsAssignment"],
    }),
    getAnimatorsAssignmentsByYear: builder.query({
      query: (params) => {
        const queryString = new URLSearchParams(params).toString();
        return `/academics/animatorsAssignments?${queryString}`;
      },

      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },

      transformResponse: (responseData) => {
        //console.log('  in the APIslice',responseData)

        const newLoadedAnimatorsAssignments = responseData.map((animatorsAssignment) => {
          animatorsAssignment.id = animatorsAssignment._id; //changed the _id from mongoDB to id
          delete animatorsAssignment._id; //added to delete the extra original _id from mongo but careful when planning to save to db again
          return animatorsAssignment;
        });
        return animatorsAssignmentsAdapter.setAll(initialState, newLoadedAnimatorsAssignments);
      },
      providesTags: ["animatorsAssignment"],
    }),
    getAnimatorsAssignmentById: builder.query({
      query: (params) => {
        const queryString = new URLSearchParams(params).toString();
        return `/academics/animatorsAssignments?${queryString}`;
      },
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },

      providesTags: ["animatorsAssignment"],
    }),
    addNewAnimatorsAssignment: builder.mutation({
      query: (initialAnimatorsAssignmentData) => ({
        url: "/academics/animatorsAssignments/",
        method: "POST",
        body: {
          ...initialAnimatorsAssignmentData,
        },
      }),
      invalidatesTags: ["animatorsAssignment"],
    }),
    updateAnimatorsAssignment: builder.mutation({
      query: (initialAnimatorsAssignmentData) => ({
        url: "/academics/animatorsAssignments/",
        method: "PATCH",
        body: {
          ...initialAnimatorsAssignmentData,
        },
      }),
      invalidatesTags: ["animatorsAssignment"],
    }),
    deleteAnimatorsAssignment: builder.mutation({
      query: ({ id }) => ({
        url: "/academics/animatorsAssignments/",
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: ["animatorsAssignment"],
    }),
  }),
});
export const {
  //hooks created automatically from endpoint
  useGetAnimatorsAssignmentsQuery, //this can be used whereven we want to fetch the data
  useGetAnimatorsAssignmentsByYearQuery,
  useGetAnimatorsAssignmentByIdQuery,
  useAddNewAnimatorsAssignmentMutation,
  useUpdateAnimatorsAssignmentMutation,
  useDeleteAnimatorsAssignmentMutation,
} = animatorsAssignmentsApiSlice;

// returns the query result object by using the endpoint already defined above and .select method
export const selectAnimatorsAssignmentsResult =
  animatorsAssignmentsApiSlice.endpoints.getAnimatorsAssignments.select();

// creates memoized selector
const selectAnimatorsAssignmentsData = createSelector(
  selectAnimatorsAssignmentsResult,
  (animatorsAssignmentsResult) => animatorsAssignmentsResult.data // normalized state object with ids & entities, this will grab the data from the selectanimatorsAssignments result
); //we did not export, just getting the selector ready to be used in the next part

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllAnimatorsAssignments, //the default selectAll is renamed to selectAllAnimatorsAssignments
  selectById: selectAnimatorsAssignmentById,
  selectIds: selectAnimatorsAssignmentIds,
  // Pass in a selector that returns the animatorsAssignments slice of state
} = animatorsAssignmentsAdapter.getSelectors(
  (state) => selectAnimatorsAssignmentsData(state) ?? initialState
);
