import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../../../app/api/apiSlice"

const sessionsAdapter = createEntityAdapter({});

const initialState = sessionsAdapter.getInitialState();

export const sessionsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSessions: builder.query({
      query: () => `/academics/sessions`, //as defined in server.js
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      //keepUnusedDataFor: 5,//default when app is deployed is 60seconds
      transformResponse: (responseData) => {
        const loadedSessions = responseData.map((session) => {
          session.id = session._id;
          return session;
        });
        return sessionsAdapter.setAll(initialState, loadedSessions);
      },
      providesTags: ["session"],
      // providesTags: (result, error, arg) => {
      //     if (result?.ids) {
      //         return [
      //             { type: 'session', id: 'LIST' },
      //             ...result.ids.map(id => ({ type: 'session', id }))
      //         ]
      //     } else return [{ type: 'session', id: 'LIST' }]
      // }
    }),
    getSessionsByYear: builder.query({
      query: (params) => {
        const queryString = new URLSearchParams(params).toString();
        return `/academics/sessions?${queryString}`;
      },

      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },

      transformResponse: (responseData) => {
        //console.log('  in the APIslice',responseData.total)

        const newLoadedSessions = responseData.map((session) => {
          session.id = session._id; //changed the _id from mongoDB to id
          delete session._id; //added to delete the extra original _id from mongo but careful when planning to save to db again
          return session;
        });
        return sessionsAdapter.setAll(initialState, newLoadedSessions);
      },
      providesTags: ["session"],
    }),
    addNewSession: builder.mutation({
      query: (initialSessionData) => ({
        url: "/academics/sessions",
        method: "POST",
        body: {
          ...initialSessionData,
        },
      }),
      invalidatesTags: [
        //forces the cache in RTK query to update
        { type: "session", id: "LIST" }, //the session list will be unvalidated and updated
      ],
    }),
    updateSession: builder.mutation({
      query: (initialSessionData) => ({
        url: "/academics/sessions",
        method: "PATCH",
        body: {
          ...initialSessionData,
        },
      }),
      invalidatesTags: ["session"],
    }),
    deleteSession: builder.mutation({
      query: ({ id }) => ({
        url: "/academics/sessions",
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: ["session"],
    }),
  }),
});

export const {
  useGetSessionsQuery,
  useGetSessionsByYearQuery,
  useAddNewSessionMutation,
  useUpdateSessionMutation,
  useDeleteSessionMutation,
} = sessionsApiSlice;

// returns the query result object
export const selectSessionsResult =
  sessionsApiSlice.endpoints.getSessions.select();

// creates memoized selector
const selectSessionsData = createSelector(
  selectSessionsResult,
  (sessionsResult) => sessionsResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllSessions,
  selectById: selectSessionById,
  selectIds: selectSessionIds,
  // Pass in a selector that returns the sessions slice of state
} = sessionsAdapter.getSelectors(
  (state) => selectSessionsData(state) ?? initialState
);
