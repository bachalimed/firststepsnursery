import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../../../app/api/apiSlice";
const employeeDocumentsAdapter = createEntityAdapter({});
const initialState = employeeDocumentsAdapter.getInitialState();

export const employeeDocumentsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEmployeeDocuments: builder.query({
      //this should be done with studetndocumentslists apiand not this one but it is ok
      query: () => "/hr/employees/employeeDocuments/", //as defined in server.js
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },

      keepUnusedDataFor: 60, //default when app is deployed is 60seconds
      transformResponse: (responseData) => {
        const newLoadedEmployeeDocuments = responseData.map(
          (employeeDocument) => {
            employeeDocument.id = employeeDocument._id; //changed the _id from mongoDB to id
            delete employeeDocument._id; //added to delete the extra original _id from mongo but careful when planning to save to db again
            return employeeDocument;
          }
        );
        return employeeDocumentsAdapter.upsertMany(
          initialState,
          newLoadedEmployeeDocuments
        );
      },
      providesTags: ["employeeDocument"],
      // providesTags: (result, error, arg) => {
      //     if (result?.ids) {
      //         return [
      //             { type: 'employeesDocument', id: 'LIST' },
      //             ...result.ids.map(id => ({ type: 'employeesDocument', id }))
      //         ]
      //     } else return [{ type: 'employeesDocument', id: 'LIST' }]
      // }
    }),
    getEmployeeDocumentsByYear: builder.query({
      query: (params) => {
        const queryString = new URLSearchParams(params).toString();
        return `/hr/employees/employeeDocuments?${queryString}`;
      },

      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },

      transformResponse: (responseData) => {
        //const {loadedEmployeeDocuments} =

        //console.log('academicYears length  in the APIslice',responseData.total)
        //console.log('academicYears in the APIslice', academicYears)
        const newLoadedEmployeeDocuments = responseData.map(
          (employeeDocument) => {
            employeeDocument.id = employeeDocument._id; //changed the _id from mongoDB to id
            delete employeeDocument._id; //added to delete the extra original _id from mongo but careful when planning to save to db again
            return employeeDocument;
          }
        );
        return employeeDocumentsAdapter.setAll(
          initialState,
          newLoadedEmployeeDocuments
        );
      },
      providesTags: ["employeeDocument"],

      // providesTags: (result, error, arg) => {
      //     if (result?.ids) {
      //         return [
      //             { type: 'employeesDocument', id: 'LIST' },
      //             ...result.ids.map(id => ({ type: 'employeesDocument', id }))
      //         ]
      //     } else return [{ type: 'employeesDocument', id: 'LIST' }]
      // }
    }),
    // getEmployeeDocumentsByYearById: builder.query({
    // query: (params) =>{
    //     const queryString = new URLSearchParams(params).toString()
    //     return `/hr/employees/employeeDocuments?${queryString}`
    // },

    // validateStatus: (response, result) => {
    //     return response.status === 200 && !result.isError
    // },

    // transformResponse: responseData => {
    //         return responseData
    //     },
    // providesTags:['employeeDocument']

    // }),
    getEmployeeDocumentById: builder.query({
      query: (id) => {
        return `/hr/employees/employeeDocuments/${id}`;
      },

      // responseHandler: (response) => response.blob(),
    }),
    deleteEmployeeDocument: builder.mutation({
      query: ({ id }) => ({
        url: `/hr/employees/employeeDocuments/`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: ["employeeDocument"],
    }),

    addEmployeeDocuments: builder.mutation({
      query: (formData) => ({
        url: "/hr/employees/employeeDocuments/",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["employeeDocument"],
    }),
    updateEmployeeDocument: builder.mutation({
      query: (initialEmployeeDocumentData) => ({
        url: "/hr/employees/employeeDocuments",
        method: "PATCH",
        body: {
          ...initialEmployeeDocumentData,
        },
      }),
      invalidatesTags: ["employeeDocument"],
      // invalidatesTags: (result, error, arg) => [//we re not updating all the list, butonly update the employeesDocument in the cache by using the arg.id
      //     { type: 'employeesDocument', id: arg.id }
      // ]
    }),
  }),
});

export const {
  useGetEmployeeDocumentsQuery,
  useAddEmployeeDocumentsMutation,
  useUpdateEmployeeDocumentMutation,
  useDeleteEmployeeDocumentMutation,
  useGetEmployeeDocumentsByYearQuery,
  //useGetEmployeeDocumentsByYearByIdQuery,
  useGetEmployeeDocumentByIdQuery,
} = employeeDocumentsApiSlice;

// returns the query result object and not only the data we need for this reason we need the createselector!!! thsi selcetor decides which query is used??
export const selectEmployeeDocumentsResult =
  employeeDocumentsApiSlice.endpoints.getEmployeeDocumentsByYear.select();

//this is specific for thequery byYear:
// export const selectEmployeeDocumentsByYearResult = employeeDocumentsApiSlice.endpoints.getEmployeeDocumentsByYear.select(selectedYear)

// export const selectEmployeeDocumentByIdFromYear = (state, id, selectedYear) => {
//     const employeeDocumentsResult = selectEmployeeDocumentsByYearResult(state, selectedYear)
//     return employeeDocumentsResult?.data?.entities[id]
// }

// creates memoized selector that takes the inpput function selescEmployeeDocumentsREsult and gets the data from it which is ids and entities
const selectEmployeeDocumentsData = createSelector(
  selectEmployeeDocumentsResult,
  (employeeDocumentsResult) => employeeDocumentsResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllEmployeeDocuments,
  selectById: selectEmployeeDocumentById,
  selectIds: selectEmployeeDocumentIds,
  // Pass in a selector that returns the employeeDocuments slice of state
} = employeeDocumentsAdapter.getSelectors(
  (state) => selectEmployeeDocumentsData(state) ?? initialState
);
