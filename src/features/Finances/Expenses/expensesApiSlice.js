import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../../app/api/apiSlice";

// Initialize the entity adapter
const expensesAdapter = createEntityAdapter({}); //we can iterate on the id but not on the entities
// Initial state using the adapter
const initialState = expensesAdapter.getInitialState();

// Inject endpoints into the apiSlice
export const expensesApiSlice = apiSlice.injectEndpoints({
  //define endpoints
  endpoints: (builder) => ({
    //a hook will be created automatically based on the end point :getexpenses
    getExpenses: builder.query({
      query: () => "/academics/expenses/", //this route is as defined in the backend server.js to give all expenses
      validateStatus: (response, result) => {
        //to validate the status as per documentation
        return response.status === 200 && !result.isError;
      },
      //keepUnusedDataFor: 5,//default is 60seconds or data will be removed from the cache
      transformResponse: (responseData) => {
        const newLoadedExpenses = responseData.map(
          (expense) => {
            expense.id = expense._id; //changed the _id from mongoDB to id
            delete expense._id; //added to delete the extra original _id from mongo but careful when planning to save to db again
            return expense;
          }
        );
        return expensesAdapter.upsertMany(
          initialState,
          newLoadedExpenses
        );
      },
      providesTags: ["expense"],
    }),
    getExpenseById: builder.query({
      query: (params) => {
        const queryString = new URLSearchParams(params).toString();
        return `/academics/expenses?${queryString}`;
      },
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },

      providesTags: ["expense"],
    }),
    addNewExpense: builder.mutation({
      query: (initialExpenseData) => ({
        url: "/academics/expenses/",
        method: "POST",
        body: {
          ...initialExpenseData,
        },
      }),
      invalidatesTags: ["expense"],
    }),
    updateExpense: builder.mutation({
      query: (initialExpenseData) => ({
        url: "/academics/expenses/",
        method: "PATCH",
        body: {
          ...initialExpenseData,
        },
      }),
      invalidatesTags: ["expense"],
    }),
    deleteExpense: builder.mutation({
      query: ({ id }) => ({
        url: "/academics/expenses/",
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: ["expense"],
    }),
  }),
});
export const {
  //hooks created automatically from endpoint
  useGetExpensesQuery, //this can be used whereven we want to fetch the data
  useGetExpenseByIdQuery,
  useAddNewExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
} = expensesApiSlice;

// returns the query result object by using the endpoint already defined above and .select method
export const selectExpensesResult =
  expensesApiSlice.endpoints.getExpenses.select();

// creates memoized selector
const selectExpensesData = createSelector(
  selectExpensesResult,
  (expensesResult) => expensesResult.data // normalized state object with ids & entities, this will grab the data from the selectexpenses result
); //we did not export, just getting the selector ready to be used in the next part

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllExpenses, //the default selectAll is renamed to selectAllExpenses
  selectById: selectExpenseById,
  selectIds: selectExpenseIds,
  // Pass in a selector that returns the expenses slice of state
} = expensesAdapter.getSelectors(
  (state) => selectExpensesData(state) ?? initialState
);
