import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../../app/api/apiSlice";
const paymentsAdapter = createEntityAdapter({});

const initialState = paymentsAdapter.getInitialState();

export const paymentsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // getPayments: builder.query({
    //     query: () => '/payments/paymentsParents/payments',//as defined in server.js
    //     validateStatus: (response, result) => {
    //         return response.status === 200 && !result.isError
    //     },

    //     keepUnusedDataFor: 60,//default when app is deployed is 60seconds
    //     transformResponse: responseData => {
    //         const newLoadedPayments = responseData.map(payment => {

    //             payment.id = payment._id//changed the _id from mongoDB to id
    //             delete payment._id//added to delete the extra original _id from mongo but careful when planning to save to db again
    //             return payment
    //         })
    //         return paymentsAdapter.setAll(initialState, newLoadedPayments)
    //     },
    //     providesTags:['payment']
    //     // providesTags: (result, error, arg) => {
    //     //     if (result?.ids) {
    //     //         return [
    //     //             { type: 'payment', id: 'LIST' },
    //     //             ...result.ids.map(id => ({ type: 'payment', id }))
    //     //         ]
    //     //     } else return [{ type: 'payment', id: 'LIST' }]
    //     // }
    // }),
    getPaymentsByYear: builder.query({
      query: (params) => {
        const queryString = new URLSearchParams(params).toString();
        return `/finances/payments/?${queryString}`;
      },

      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },

      transformResponse: (responseData) => {
        // console.log('  in the APIslice',responseData.total)

        const newLoadedPayments = responseData.map((payment) => {
          payment.id = payment._id; //changed the _id from mongoDB to id
          delete payment._id; //added to delete the extra original _id from mongo but careful when planning to save to db again
          return payment;
        });
        return paymentsAdapter.setAll(initialState, newLoadedPayments);
      },
      providesTags: ["payment"],

      // providesTags: (result, error, arg) => {
      //     if (result?.ids) {
      //         return [
      //             { type: 'payment', id: 'LIST' },
      //             ...result.ids.map(id => ({ type: 'payment', id }))
      //         ]
      //     } else return [{ type: 'payment', id: 'LIST' }]
      // }
    }),
    getPaymentsStatsByYear: builder.query({
      query: (params) => {
        const queryString = new URLSearchParams(params).toString();
        return `/finances/payments?${queryString}`;
      },

      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      transformResponse: (responseData) => {
        // console.log('  in the APIslice',responseData.total)

        
        return responseData
      },

     
      providesTags: ["payment"],

     
    }),
    getPaymentById: builder.query({
      query: (params) => {
        const queryString = new URLSearchParams(params).toString();
        return `/finances/payments?${queryString}`;
      },

      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      
       //transformResponse: (responseData) => {
        // console.log(responseData,'responseData')
        //const {loadedPayments} =
      //   //console.log('academicYears length  in the APIslice',responseData.total)
      //   //console.log('academicYears in the APIslice', academicYears)
      //   const newLoadedPayments = responseData.map((payment) => {
      //     payment.id = payment._id; //changed the _id from mongoDB to id
      //     delete payment._id; //added to delete the extra original _id from mongo but careful when planning to save to db again

      //     //console.log(' newLoadedPayments in the APIslice',newLoadedPayments)
      //     return payment;
      //   });
      //   return paymentsAdapter.upsertOne(initialState, newLoadedPayments);
       //},
      providesTags: ["payment"],
      // providesTags: (result, error, arg) => {
      //     if (result?.ids) {
      //         return [
      //             { type: 'payment', id: 'LIST' },
      //             ...result.ids.map(id => ({ type: 'payment', id }))
      //         ]
      //     } else return [{ type: 'payment', id: 'LIST' }]
      // }
    }),
    addNewPayment: builder.mutation({
      query: (initialPaymentData) => ({
        url: "/finances/payments/",
        method: "POST",
        body: {
          ...initialPaymentData,
        },
      }),
      invalidatesTags: ["payment"],
    }),
    updatePayment: builder.mutation({
      query: (initialPaymentData) => ({
        url: "/finances/payments/",
        method: "PATCH",
        body: {
          ...initialPaymentData,
        },
      }),
      invalidatesTags: ["payment"],
      // invalidatesTags: (result, error, arg) => [//we re not updating all the list, butonly update the payment in the cache by using the arg.id
      //     { type: 'payment', id: arg.id }
      // ]
    }),
    deletePayment: builder.mutation({
      query: ({ id }) => ({
        url: "/finances/payments/",
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: ["payment"],
      // invalidatesTags: (result, error, arg) => [
      //     { type: 'payment', id: arg.id }
      // ]
    }),
  }),
});

export const {
  useGetPaymentsQuery,
  useGetPaymentsByYearQuery,
  useGetPaymentsStatsByYearQuery,
  useGetPaymentByIdQuery,
  useAddNewPaymentMutation,
  useUpdatePaymentMutation,
  useDeletePaymentMutation,
} = paymentsApiSlice;

// returns the query result object and not only the data we need for this reason we need the createselector!!! thsi selcetor decides which query is used??
export const selectPaymentsResult =
  paymentsApiSlice.endpoints.getPaymentsByYear.select();

//this is specific for thequery byYear:
// export const selectPaymentsByYearResult = paymentsApiSlice.endpoints.getPaymentsByYear.select(selectedYear)

// export const selectPaymentByIdFromYear = (state, id, selectedYear) => {
//     const paymentsResult = selectPaymentsByYearResult(state, selectedYear)
//     return paymentsResult?.data?.entities[id]
// }

// creates memoized selector that takes the inpput function selescPaymentsREsult and gets the data from it which is ids and entities
const selectPaymentsData = createSelector(
  selectPaymentsResult,
  (paymentsResult) => paymentsResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllPayments,
  selectById: selectPaymentById,
  selectIds: selectPaymentIds,
  // Pass in a selector that returns the payments slice of state
} = paymentsAdapter.getSelectors(
  (state) => selectPaymentsData(state) ?? initialState
);
