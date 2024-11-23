import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../../../app/api/apiSlice";

const expenseCategoriesAdapter = createEntityAdapter({});

const initialState = expenseCategoriesAdapter.getInitialState();

export const expenseCategoriesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getExpenseCategories: builder.query({
      query: () => `/settings/financesSet/expenseCategories`, //as defined in server.js
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      //keepUnusedDataFor: 5,//default when app is deployed is 60seconds
      transformResponse: (responseData) => {
        const loadedExpenseCategories = responseData.map((expenseCategory) => {
          expenseCategory.id = expenseCategory._id;
          return expenseCategory;
        });
        return expenseCategoriesAdapter.setAll(initialState, loadedExpenseCategories);
      },
      providesTags: ["expenseCategory"],
      // providesTags: (result, error, arg) => {
      //     if (result?.ids) {
      //         return [
      //             { type: 'expenseCategory', id: 'LIST' },
      //             ...result.ids.map(id => ({ type: 'expenseCategory', id }))
      //         ]
      //     } else return [{ type: 'expenseCategory', id: 'LIST' }]
      // }
    }),
    getExpenseCategoriesByYear: builder.query({
      query: (params) => {
        const queryString = new URLSearchParams(params).toString();
        return `/settings/financesSet/expenseCategories?${queryString}`;
      },

      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },

      transformResponse: (responseData) => {
        //console.log('  in the APIslice',responseData.total)

        const newLoadedExpenseCategories = responseData.map((expenseCategory) => {
          expenseCategory.id = expenseCategory._id; //changed the _id from mongoDB to id
          delete expenseCategory._id; //added to delete the extra original _id from mongo but careful when planning to save to db again
          return expenseCategory;
        });
        return expenseCategoriesAdapter.setAll(initialState, newLoadedExpenseCategories);
      },
      providesTags: ["expenseCategory"],
    }),
    getExpenseCategoryById: builder.query({
      query: (params) => {
        const queryString = new URLSearchParams(params).toString();
        return `/settings/financesSet/expenseCategories?${queryString}`;
      },

      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },

      transformResponse: (responseData) => {
        return responseData;
      },
      providesTags: ["expenseCategory"],
    }),
    addNewExpenseCategory: builder.mutation({
      query: (initialExpenseCategoryData) => ({
        url: "/settings/financesSet/expenseCategories",
        method: "POST",
        body: {
          ...initialExpenseCategoryData,
        },
      }),
      invalidatesTags: [
        //forces the cache in RTK query to update
        { type: "expenseCategory", id: "LIST" }, //the expenseCategory list will be unvalidated and updated
      ],
    }),
    updateExpenseCategory: builder.mutation({
      query: (initialExpenseCategoryData) => ({
        url: "/settings/financesSet/expenseCategories",
        method: "PATCH",
        body: {
          ...initialExpenseCategoryData,
        },
      }),
      invalidatesTags: ["expenseCategory"],
    }),
    deleteExpenseCategory: builder.mutation({
      query: ({ id }) => ({
        url: "/settings/financesSet/expenseCategories",
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: ["expenseCategory"],
    }),
  }),
});

export const {
  useGetExpenseCategoriesQuery,
  useGetExpenseCategoriesByYearQuery,
  useGetExpenseCategoryByIdQuery,
  useAddNewExpenseCategoryMutation,
  useUpdateExpenseCategoryMutation,
  useDeleteExpenseCategoryMutation,
} = expenseCategoriesApiSlice;

// returns the query result object
export const selectExpenseCategoriesResult =
  expenseCategoriesApiSlice.endpoints.getExpenseCategories.select();

// creates memoized selector
const selectExpenseCategoriesData = createSelector(
  selectExpenseCategoriesResult,
  (expenseCategoriesResult) => expenseCategoriesResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllExpenseCategories,
  selectById: selectExpenseCategoryById,
  selectIds: selectExpenseCategoryIds,
  // Pass in a selector that returns the expenseCategories slice of state
} = expenseCategoriesAdapter.getSelectors(
  (state) => selectExpenseCategoriesData(state) ?? initialState
);
