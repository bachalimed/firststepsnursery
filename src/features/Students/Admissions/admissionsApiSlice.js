import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../../app/api/apiSlice";
const admissionsAdapter = createEntityAdapter({});

const initialState = admissionsAdapter.getInitialState();

export const admissionsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // getAdmissions: builder.query({
    //     query: () => '/admissions/admissionsParents/admissions',//as defined in server.js
    //     validateStatus: (response, result) => {
    //         return response.status === 200 && !result.isError
    //     },

    //     keepUnusedDataFor: 60,//default when app is deployed is 60seconds
    //     transformResponse: responseData => {
    //         const newLoadedAdmissions = responseData.map(admission => {

    //             admission.id = admission._id//changed the _id from mongoDB to id
    //             delete admission._id//added to delete the extra original _id from mongo but careful when planning to save to db again
    //             return admission
    //         })
    //         return admissionsAdapter.setAll(initialState, newLoadedAdmissions)
    //     },
    //     providesTags:['admission']
    //     // providesTags: (result, error, arg) => {
    //     //     if (result?.ids) {
    //     //         return [
    //     //             { type: 'admission', id: 'LIST' },
    //     //             ...result.ids.map(id => ({ type: 'admission', id }))
    //     //         ]
    //     //     } else return [{ type: 'admission', id: 'LIST' }]
    //     // }
    // }),
    getAdmissionsByYear: builder.query({
      query: (params) => {
        const queryString = new URLSearchParams(params).toString();
        return `/students/admissions/admissions?${queryString}`;
      },

      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },

      transformResponse: (responseData) => {
        // console.log('  in the APIslice',responseData.total)

        const newLoadedAdmissions = responseData.map((admission) => {
          admission.id = admission._id; //changed the _id from mongoDB to id
          delete admission._id; //added to delete the extra original _id from mongo but careful when planning to save to db again
          return admission;
        });
        return admissionsAdapter.setAll(initialState, newLoadedAdmissions);
      },
      providesTags: ["admission"],

      // providesTags: (result, error, arg) => {
      //     if (result?.ids) {
      //         return [
      //             { type: 'admission', id: 'LIST' },
      //             ...result.ids.map(id => ({ type: 'admission', id }))
      //         ]
      //     } else return [{ type: 'admission', id: 'LIST' }]
      // }
    }),
    getAdmissionById: builder.query({
      query: (params) => {
        const queryString = new URLSearchParams(params).toString();
        return `/students/admissions/admissions?${queryString}`;
      },

      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },

      transformResponse: (responseData) => {
        //const {loadedAdmissions} =
        //console.log('academicYears length  in the APIslice',responseData.total)
        //console.log('academicYears in the APIslice', academicYears)
        const newLoadedAdmissions = responseData.map((admission) => {
          admission.id = admission._id; //changed the _id from mongoDB to id
          delete admission._id; //added to delete the extra original _id from mongo but careful when planning to save to db again
          return admission;
        });
        return admissionsAdapter.upsertOne(initialState, newLoadedAdmissions);
      },
      providesTags: ["admission"],
      // providesTags: (result, error, arg) => {
      //     if (result?.ids) {
      //         return [
      //             { type: 'admission', id: 'LIST' },
      //             ...result.ids.map(id => ({ type: 'admission', id }))
      //         ]
      //     } else return [{ type: 'admission', id: 'LIST' }]
      // }
    }),
    addNewAdmission: builder.mutation({
      query: (initialAdmissionData) => ({
        url: "/students/admissions/admissions/",
        method: "POST",
        body: {
          ...initialAdmissionData,
        },
      }),
      invalidatesTags: ["admission"],
    }),
    updateAdmission: builder.mutation({
      query: (initialAdmissionData) => ({
        url: "/students/admissions/admissions/",
        method: "PATCH",
        body: {
          ...initialAdmissionData,
        },
      }),
      invalidatesTags: ["admission"],
      // invalidatesTags: (result, error, arg) => [//we re not updating all the list, butonly update the admission in the cache by using the arg.id
      //     { type: 'admission', id: arg.id }
      // ]
    }),
    deleteAdmission: builder.mutation({
      query: ({ id }) => ({
        url: "/students/admissions/admissions/",
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: ["admission"],
      // invalidatesTags: (result, error, arg) => [
      //     { type: 'admission', id: arg.id }
      // ]
    }),
  }),
});

export const {
  useGetAdmissionsQuery,
  useGetAdmissionsByYearQuery,
  useGetAdmissionByIdQuery,
  useAddNewAdmissionMutation,
  useUpdateAdmissionMutation,
  useDeleteAdmissionMutation,
} = admissionsApiSlice;

// returns the query result object and not only the data we need for this reason we need the createselector!!! thsi selcetor decides which query is used??
export const selectAdmissionsResult =
  admissionsApiSlice.endpoints.getAdmissionsByYear.select();

//this is specific for thequery byYear:
// export const selectAdmissionsByYearResult = admissionsApiSlice.endpoints.getAdmissionsByYear.select(selectedYear)

// export const selectAdmissionByIdFromYear = (state, id, selectedYear) => {
//     const admissionsResult = selectAdmissionsByYearResult(state, selectedYear)
//     return admissionsResult?.data?.entities[id]
// }

// creates memoized selector that takes the inpput function selescAdmissionsREsult and gets the data from it which is ids and entities
const selectAdmissionsData = createSelector(
  selectAdmissionsResult,
  (admissionsResult) => admissionsResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllAdmissions,
  selectById: selectAdmissionById,
  selectIds: selectAdmissionIds,
  // Pass in a selector that returns the admissions slice of state
} = admissionsAdapter.getSelectors(
  (state) => selectAdmissionsData(state) ?? initialState
);
