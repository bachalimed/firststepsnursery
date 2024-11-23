import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../../../app/api/apiSlice";

const payeesAdapter = createEntityAdapter({});

const initialState = payeesAdapter.getInitialState();

export const payeesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPayees: builder.query({
      query: () => `/settings/financesSet/payees`, //as defined in server.js
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      //keepUnusedDataFor: 5,//default when app is deployed is 60seconds
      transformResponse: (responseData) => {
        const loadedPayees = responseData.map((payee) => {
          payee.id = payee._id;
          return payee;
        });
        return payeesAdapter.setAll(initialState, loadedPayees);
      },
      providesTags: ["payee"],
      // providesTags: (result, error, arg) => {
      //     if (result?.ids) {
      //         return [
      //             { type: 'payee', id: 'LIST' },
      //             ...result.ids.map(id => ({ type: 'payee', id }))
      //         ]
      //     } else return [{ type: 'payee', id: 'LIST' }]
      // }
    }),
    getPayeesByYear: builder.query({
      query: (params) => {
        const queryString = new URLSearchParams(params).toString();
        return `/settings/financesSet/payees?${queryString}`;
      },

      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },

      transformResponse: (responseData) => {
        //console.log('  in the APIslice',responseData.total)

        const newLoadedPayees = responseData.map((payee) => {
          payee.id = payee._id; //changed the _id from mongoDB to id
          delete payee._id; //added to delete the extra original _id from mongo but careful when planning to save to db again
          return payee;
        });
        return payeesAdapter.setAll(initialState, newLoadedPayees);
      },
      providesTags: ["payee"],
    }),
    getPayeeById: builder.query({
      query: (params) => {
        const queryString = new URLSearchParams(params).toString();
        return `/settings/financesSet/payees?${queryString}`;
      },

      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },

      transformResponse: (responseData) => {
        return responseData;
      },
      providesTags: ["payee"],
    }),
    addNewPayee: builder.mutation({
      query: (initialPayeeData) => ({
        url: "/settings/financesSet/payees",
        method: "POST",
        body: {
          ...initialPayeeData,
        },
      }),
      invalidatesTags: [
        //forces the cache in RTK query to update
        { type: "payee", id: "LIST" }, //the payee list will be unvalidated and updated
      ],
    }),
    updatePayee: builder.mutation({
      query: (initialPayeeData) => ({
        url: "/settings/financesSet/payees",
        method: "PATCH",
        body: {
          ...initialPayeeData,
        },
      }),
      invalidatesTags: ["payee"],
    }),
    deletePayee: builder.mutation({
      query: ({ id }) => ({
        url: "/settings/financesSet/payees",
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: ["payee"],
    }),
  }),
});

export const {
  useGetPayeesQuery,
  useGetPayeesByYearQuery,
  useGetPayeeByIdQuery,
  useAddNewPayeeMutation,
  useUpdatePayeeMutation,
  useDeletePayeeMutation,
} = payeesApiSlice;

// returns the query result object
export const selectPayeesResult =
  payeesApiSlice.endpoints.getPayees.select();

// creates memoized selector
const selectPayeesData = createSelector(
  selectPayeesResult,
  (payeesResult) => payeesResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllPayees,
  selectById: selectPayeeById,
  selectIds: selectPayeeIds,
  // Pass in a selector that returns the payees slice of state
} = payeesAdapter.getSelectors(
  (state) => selectPayeesData(state) ?? initialState
);
