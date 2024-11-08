import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../../app/api/apiSlice";
const enrolmentsAdapter = createEntityAdapter({});

const initialState = enrolmentsAdapter.getInitialState();

export const enrolmentsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // getEnrolments: builder.query({
    //     query: () => '/enrolments/enrolmentsParents/enrolments',//as defined in server.js
    //     validateStatus: (response, result) => {
    //         return response.status === 200 && !result.isError
    //     },

    //     keepUnusedDataFor: 60,//default when app is deployed is 60seconds
    //     transformResponse: responseData => {
    //         const newLoadedEnrolments = responseData.map(enrolment => {

    //             enrolment.id = enrolment._id//changed the _id from mongoDB to id
    //             delete enrolment._id//added to delete the extra original _id from mongo but careful when planning to save to db again
    //             return enrolment
    //         })
    //         return enrolmentsAdapter.setAll(initialState, newLoadedEnrolments)
    //     },
    //     providesTags:['enrolment']
    //     // providesTags: (result, error, arg) => {
    //     //     if (result?.ids) {
    //     //         return [
    //     //             { type: 'enrolment', id: 'LIST' },
    //     //             ...result.ids.map(id => ({ type: 'enrolment', id }))
    //     //         ]
    //     //     } else return [{ type: 'enrolment', id: 'LIST' }]
    //     // }
    // }),
    getEnrolmentsByYear: builder.query({
      query: (params) => {
        const queryString = new URLSearchParams(params).toString();
        return `/students/enrolments/enrolments?${queryString}`;
      },

      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },

      transformResponse: (responseData) => {
        // console.log('  in the APIslice',responseData.total)

        const newLoadedEnrolments = responseData.map((enrolment) => {
          enrolment.id = enrolment._id; //changed the _id from mongoDB to id
          delete enrolment._id; //added to delete the extra original _id from mongo but careful when planning to save to db again
          return enrolment;
        });
        return enrolmentsAdapter.setAll(initialState, newLoadedEnrolments);
      },
      providesTags: ["enrolment"],

      // providesTags: (result, error, arg) => {
      //     if (result?.ids) {
      //         return [
      //             { type: 'enrolment', id: 'LIST' },
      //             ...result.ids.map(id => ({ type: 'enrolment', id }))
      //         ]
      //     } else return [{ type: 'enrolment', id: 'LIST' }]
      // }
    }),
    getEnrolmentById: builder.query({
      query: (params) => {
        const queryString = new URLSearchParams(params).toString();
        return `/students/enrolments/enrolments?${queryString}`;
      },

      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },

      
      transformResponse: (responseData) => {
        //const {loadedEnrolments} =
        //console.log('academicYears length  in the APIslice',responseData.total)
        //console.log('academicYears in the APIslice', academicYears)
        const newLoadedEnrolments = responseData.map((enrolment) => {
          enrolment.id = enrolment._id; //changed the _id from mongoDB to id
          delete enrolment._id; //added to delete the extra original _id from mongo but careful when planning to save to db again

          //console.log(' newLoadedEnrolments in the APIslice',newLoadedEnrolments)
          return enrolment;
        });
        return enrolmentsAdapter.upsertOne(initialState, newLoadedEnrolments);
      },
      providesTags: ["enrolment"],
      // providesTags: (result, error, arg) => {
      //     if (result?.ids) {
      //         return [
      //             { type: 'enrolment', id: 'LIST' },
      //             ...result.ids.map(id => ({ type: 'enrolment', id }))
      //         ]
      //     } else return [{ type: 'enrolment', id: 'LIST' }]
      // }
    }),
    addNewEnrolment: builder.mutation({
      query: (initialEnrolmentData) => ({
        url: "/students/enrolments/enrolments/",
        method: "POST",
        body: {
          ...initialEnrolmentData,
        },
      }),
      invalidatesTags: ["enrolment"],
    }),
    updateEnrolment: builder.mutation({
      query: (initialEnrolmentData) => ({
        url: "/students/enrolments/enrolments/",
        method: "PATCH",
        body: {
          ...initialEnrolmentData,
        },
      }),
      invalidatesTags: ["enrolment"],
      // invalidatesTags: (result, error, arg) => [//we re not updating all the list, butonly update the enrolment in the cache by using the arg.id
      //     { type: 'enrolment', id: arg.id }
      // ]
    }),
    deleteEnrolment: builder.mutation({
      query: ({ id }) => ({
        url: "/students/enrolments/enrolments/",
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: ["enrolment"],
      // invalidatesTags: (result, error, arg) => [
      //     { type: 'enrolment', id: arg.id }
      // ]
    }),
  }),
});

export const {
  useGetEnrolmentsQuery,
  useGetEnrolmentsByYearQuery,
  useGetEnrolmentByIdQuery,
  useAddNewEnrolmentMutation,
  useUpdateEnrolmentMutation,
  useDeleteEnrolmentMutation,
} = enrolmentsApiSlice;

// returns the query result object and not only the data we need for this reason we need the createselector!!! thsi selcetor decides which query is used??
export const selectEnrolmentsResult =
  enrolmentsApiSlice.endpoints.getEnrolmentsByYear.select();

//this is specific for thequery byYear:
// export const selectEnrolmentsByYearResult = enrolmentsApiSlice.endpoints.getEnrolmentsByYear.select(selectedYear)

// export const selectEnrolmentByIdFromYear = (state, id, selectedYear) => {
//     const enrolmentsResult = selectEnrolmentsByYearResult(state, selectedYear)
//     return enrolmentsResult?.data?.entities[id]
// }

// creates memoized selector that takes the inpput function selescEnrolmentsREsult and gets the data from it which is ids and entities
const selectEnrolmentsData = createSelector(
  selectEnrolmentsResult,
  (enrolmentsResult) => enrolmentsResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllEnrolments,
  selectById: selectEnrolmentById,
  selectIds: selectEnrolmentIds,
  // Pass in a selector that returns the enrolments slice of state
} = enrolmentsAdapter.getSelectors(
  (state) => selectEnrolmentsData(state) ?? initialState
);
