import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../../app/api/apiSlice";
const invoicesAdapter = createEntityAdapter({});

const initialState = invoicesAdapter.getInitialState();

export const invoicesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // getInvoices: builder.query({
    //     query: () => '/invoices/invoicesParents/invoices',//as defined in server.js
    //     validateStatus: (response, result) => {
    //         return response.status === 200 && !result.isError
    //     },

    //     keepUnusedDataFor: 60,//default when app is deployed is 60seconds
    //     transformResponse: responseData => {
    //         const newLoadedInvoices = responseData.map(invoice => {

    //             invoice.id = invoice._id//changed the _id from mongoDB to id
    //             delete invoice._id//added to delete the extra original _id from mongo but careful when planning to save to db again
    //             return invoice
    //         })
    //         return invoicesAdapter.setAll(initialState, newLoadedInvoices)
    //     },
    //     providesTags:['invoice']
    //     // providesTags: (result, error, arg) => {
    //     //     if (result?.ids) {
    //     //         return [
    //     //             { type: 'invoice', id: 'LIST' },
    //     //             ...result.ids.map(id => ({ type: 'invoice', id }))
    //     //         ]
    //     //     } else return [{ type: 'invoice', id: 'LIST' }]
    //     // }
    // }),
    getInvoicesByYear: builder.query({
      query: (params) => {
        const queryString = new URLSearchParams(params).toString();
        return `/finances/invoices/?${queryString}`;
      },

      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },

      transformResponse: (responseData) => {
        // console.log('  in the APIslice',responseData.total)

        const newLoadedInvoices = responseData.map((invoice) => {
          invoice.id = invoice._id; //changed the _id from mongoDB to id
          delete invoice._id; //added to delete the extra original _id from mongo but careful when planning to save to db again
          return invoice;
        });
        return invoicesAdapter.setAll(initialState, newLoadedInvoices);
      },
      providesTags: ["invoice"],

      // providesTags: (result, error, arg) => {
      //     if (result?.ids) {
      //         return [
      //             { type: 'invoice', id: 'LIST' },
      //             ...result.ids.map(id => ({ type: 'invoice', id }))
      //         ]
      //     } else return [{ type: 'invoice', id: 'LIST' }]
      // }
    }),
    getInvoiceById: builder.query({
      query: (params) => {
        const queryString = new URLSearchParams(params).toString();
        return `/finances/invoices?${queryString}`;
      },

      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      
      transformResponse: (responseData) => {
        //const {loadedInvoices} =
        //console.log('academicYears length  in the APIslice',responseData.total)
        //console.log('academicYears in the APIslice', academicYears)
        const newLoadedInvoices = responseData.map((invoice) => {
          invoice.id = invoice._id; //changed the _id from mongoDB to id
          delete invoice._id; //added to delete the extra original _id from mongo but careful when planning to save to db again

          //console.log(' newLoadedInvoices in the APIslice',newLoadedInvoices)
          return invoice;
        });
        return invoicesAdapter.upsertOne(initialState, newLoadedInvoices);
      },
      providesTags: ["invoice"],
      // providesTags: (result, error, arg) => {
      //     if (result?.ids) {
      //         return [
      //             { type: 'invoice', id: 'LIST' },
      //             ...result.ids.map(id => ({ type: 'invoice', id }))
      //         ]
      //     } else return [{ type: 'invoice', id: 'LIST' }]
      // }
    }),
    addNewInvoice: builder.mutation({
      query: (initialInvoiceData) => ({
        url: "/finances/invoices/",
        method: "POST",
        body: {
          ...initialInvoiceData,
        },
      }),
      invalidatesTags: ["invoice"],
    }),
    updateInvoice: builder.mutation({
      query: (initialInvoiceData) => ({
        url: "/finances/invoices/",
        method: "PATCH",
        body: {
          ...initialInvoiceData,
        },
      }),
      invalidatesTags: ["invoice"],
      // invalidatesTags: (result, error, arg) => [//we re not updating all the list, butonly update the invoice in the cache by using the arg.id
      //     { type: 'invoice', id: arg.id }
      // ]
    }),
    deleteInvoice: builder.mutation({
      query: ({ id }) => ({
        url: "/finances/invoices/",
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: ["invoice"],
      // invalidatesTags: (result, error, arg) => [
      //     { type: 'invoice', id: arg.id }
      // ]
    }),
  }),
});

export const {
  useGetInvoicesQuery,
  useGetInvoicesByYearQuery,
  useGetInvoiceByIdQuery,
  useAddNewInvoiceMutation,
  useUpdateInvoiceMutation,
  useDeleteInvoiceMutation,
} = invoicesApiSlice;

// returns the query result object and not only the data we need for this reason we need the createselector!!! thsi selcetor decides which query is used??
export const selectInvoicesResult =
  invoicesApiSlice.endpoints.getInvoicesByYear.select();

//this is specific for thequery byYear:
// export const selectInvoicesByYearResult = invoicesApiSlice.endpoints.getInvoicesByYear.select(selectedYear)

// export const selectInvoiceByIdFromYear = (state, id, selectedYear) => {
//     const invoicesResult = selectInvoicesByYearResult(state, selectedYear)
//     return invoicesResult?.data?.entities[id]
// }

// creates memoized selector that takes the inpput function selescInvoicesREsult and gets the data from it which is ids and entities
const selectInvoicesData = createSelector(
  selectInvoicesResult,
  (invoicesResult) => invoicesResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllInvoices,
  selectById: selectInvoiceById,
  selectIds: selectInvoiceIds,
  // Pass in a selector that returns the invoices slice of state
} = invoicesAdapter.getSelectors(
  (state) => selectInvoicesData(state) ?? initialState
);
