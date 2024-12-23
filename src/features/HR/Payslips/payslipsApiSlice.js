import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../../app/api/apiSlice";

const payslipsAdapter = createEntityAdapter({});

const initialState = payslipsAdapter.getInitialState();

export const payslipsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPayslips: builder.query({
      query: () => `/hr/payslips`, //as defined in server.js
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      //keepUnusedDataFor: 5,//default when app is deployed is 60seconds
      transformResponse: (responseData) => {
        const loadedPayslips = responseData.map((payslip) => {
          payslip.id = payslip._id;
          return payslip;
        });
        return payslipsAdapter.setAll(initialState, loadedPayslips);
      },
      providesTags: ["payslip"],
     
    }),
    getPayslipsByYear: builder.query({
      query: (params) => {
        const queryString = new URLSearchParams(params).toString();
        return `/hr/payslips?${queryString}`;
      },

      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },

      transformResponse: (responseData) => {
        //console.log('  in the APIslice',responseData.total)

        const newLoadedPayslips = responseData.map((payslip) => {
          payslip.id = payslip._id; //changed the _id from mongoDB to id
          delete payslip._id; //added to delete the extra original _id from mongo but careful when planning to save to db again
          return payslip;
        });
        return payslipsAdapter.setAll(initialState, newLoadedPayslips);
      },
      providesTags: ["payslip"],
    }),
    getPayslipById: builder.query({
      query: (params) => {
        const queryString = new URLSearchParams(params).toString();
        return `/hr/payslips?${queryString}`;
      },

      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },

    
      providesTags: ["payslip"],
    }),
    addNewPayslip: builder.mutation({
      query: (initialPayslipData) => ({
        url: "/hr/payslips",
        method: "POST",
        body: {
          ...initialPayslipData,
        },
      }),
      invalidatesTags: [
        //forces the cache in RTK query to update
        { type: "payslip", id: "LIST" }, //the payslip list will be unvalidated and updated
      ],
    }),
    updatePayslip: builder.mutation({
      query: (initialPayslipData) => ({
        url: "/hr/payslips",
        method: "PATCH",
        body: {
          ...initialPayslipData,
        },
      }),
      invalidatesTags: ["payslip"],
    }),
    deletePayslip: builder.mutation({
      query: ({ id }) => ({
        url: "/hr/payslips",
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: ["payslip"],
    }),
  }),
});

export const {
  useGetPayslipsQuery,
  useGetPayslipsByYearQuery,
  useGetPayslipByIdQuery,
  useAddNewPayslipMutation,
  useUpdatePayslipMutation,
  useDeletePayslipMutation,
} = payslipsApiSlice;

// returns the query result object
export const selectPayslipsResult =
  payslipsApiSlice.endpoints.getPayslips.select();

// creates memoized selector
const selectPayslipsData = createSelector(
  selectPayslipsResult,
  (payslipsResult) => payslipsResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllPayslips,
  selectById: selectPayslipById,
  selectIds: selectPayslipIds,
  // Pass in a selector that returns the payslips slice of state
} = payslipsAdapter.getSelectors(
  (state) => selectPayslipsData(state) ?? initialState
);
