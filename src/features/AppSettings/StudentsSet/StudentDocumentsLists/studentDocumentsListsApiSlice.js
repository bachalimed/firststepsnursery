import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../../../app/api/apiSlice";

// Initialize the entity adapter
const studentDocumentsListsAdapter = createEntityAdapter({}); //we can iterate on the id but not on the entities
// Initial state using the adapter
const initialState = studentDocumentsListsAdapter.getInitialState();

// Inject endpoints into the apiSlice
export const studentDocumentsListsApiSlice = apiSlice.injectEndpoints({
  //define endpoints
  endpoints: (builder) => ({
    //a hook will be created automatically based on the end point :getstudentDocumentsLists
    getStudentDocumentsLists: builder.query({
      query: () => "/settings/studentsSet/studentDocumentsLists/", //this route is as defined in the backend server.js to give all studentDocumentsLists
      validateStatus: (response, result) => {
        //to validate the status as per documentation
        return response.status === 200 && !result.isError;
      },
      //keepUnusedDataFor: 5,//default is 60seconds or data will be removed from the cache
      transformResponse: (responseData) => {
        const newLoadedStudentDocumentsLists = responseData.map(
          (studentDocumentsList) => {
            studentDocumentsList.id = studentDocumentsList._id; //changed the _id from mongoDB to id
            delete studentDocumentsList._id; //added to delete the extra original _id from mongo but careful when planning to save to db again
            return studentDocumentsList;
          }
        );
        return studentDocumentsListsAdapter.setAll(
          initialState,
          newLoadedStudentDocumentsLists
        );
      },
      providesTags: ["studentDocumentsList"],
    }),
    getStudentDocumentsByYearById: builder.query({
      //will get the list for that year and append studtn document id if exisits
      query: (params) => {
        const queryString = new URLSearchParams(params).toString();
        return `/students/studentsParents/studentDocuments?${queryString}`;
      },

      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },

      transformResponse: (responseData) => {
        return responseData;
      },
      providesTags: ["studentDocument"],
    }),
    updateStudentDocumentsList: builder.mutation({
      query: (initialStudentDocumentsListData) => ({
        url: "/settings/studentsSet/studentDocumentsLists/",
        method: "PATCH",
        body: {
          ...initialStudentDocumentsListData,
        },
      }),
      invalidatesTags: ["studentDocumentsList"],
    }),
    addNewStudentDocumentsList: builder.mutation({
      query: (initialStudentDocumentsListData) => ({
        url: "/settings/studentsSet/studentDocumentsLists/",
        method: "POST",
        body: {
          ...initialStudentDocumentsListData,
        },
      }),
      invalidatesTags: ["studentDocumentsList"],
    }),
    deleteStudentDocumentsList: builder.mutation({
      query: ({ id }) => ({
        url: "/settings/studentsSet/studentDocumentsLists/",
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: ["studentDocumentsList"],
    }),
  }),
});
export const {
  //hooks created automatically from endpoint
  useGetStudentDocumentsListsQuery, //this can be used whereven we want to fetch the data
  useGetStudentDocumentsByYearByIdQuery,
  useAddNewStudentDocumentsListMutation,
  useUpdateStudentDocumentsListMutation,
  useDeleteStudentDocumentsListMutation,
} = studentDocumentsListsApiSlice;

// returns the query result object by using the endpoint already defined above and .select method
export const selectStudentDocumentsListsResult =
  studentDocumentsListsApiSlice.endpoints.getStudentDocumentsLists.select();

// creates memoized selector
const selectStudentDocumentsListsData = createSelector(
  selectStudentDocumentsListsResult,
  (studentDocumentsListsResult) => studentDocumentsListsResult.data // normalized state object with ids & entities, this will grab the data from the selectstudentDocumentsLists result
); //we did not export, just getting the selector ready to be used in the next part

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllStudentDocumentsLists, //the default selectAll is renamed to selectAllStudentDocumentsLists
  selectById: selectStudentDocumentsListById,
  selectIds: selectStudentDocumentsListIds,
  // Pass in a selector that returns the studentDocumentsLists slice of state
} = studentDocumentsListsAdapter.getSelectors(
  (state) => selectStudentDocumentsListsData(state) ?? initialState
);
