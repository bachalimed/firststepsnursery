import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../../app/api/apiSlice";

const notificationsAdapter = createEntityAdapter({});

const initialState = notificationsAdapter.getInitialState();

export const notificationsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: () => `/hr/notifications`, //as defined in server.js
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      //keepUnusedDataFor: 5,//default when app is deployed is 60seconds
      transformResponse: (responseData) => {
        const loadedNotifications = responseData.map((notification) => {
          notification.id = notification._id;
          return notification;
        });
        return notificationsAdapter.setAll(initialState, loadedNotifications);
      },
      providesTags: ["notification"],
      // providesTags: (result, error, arg) => {
      //     if (result?.ids) {
      //         return [
      //             { type: 'notification', id: 'LIST' },
      //             ...result.ids.map(id => ({ type: 'notification', id }))
      //         ]
      //     } else return [{ type: 'notification', id: 'LIST' }]
      // }
    }),
    getNotificationsByYear: builder.query({
      query: (params) => {
        const queryString = new URLSearchParams(params).toString();
        return `/hr/notifications?${queryString}`;
      },

      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },

      transformResponse: (responseData) => {
        //console.log('  in the APIslice',responseData.total)

        const newLoadedNotifications = responseData.map((notification) => {
          notification.id = notification._id; //changed the _id from mongoDB to id
          delete notification._id; //added to delete the extra original _id from mongo but careful when planning to save to db again
          return notification;
        });
        return notificationsAdapter.setAll(initialState, newLoadedNotifications);
      },
      providesTags: ["notification"],
    }),
    addNewNotification: builder.mutation({
      query: (initialNotificationData) => ({
        url: "/hr/notifications",
        method: "POST",
        body: {
          ...initialNotificationData,
        },
      }),
      invalidatesTags: [
        //forces the cache in RTK query to update
        { type: "notification", id: "LIST" }, //the notification list will be unvalidated and updated
      ],
    }),
    updateNotification: builder.mutation({
      query: (initialNotificationData) => ({
        url: "/hr/notifications",
        method: "PATCH",
        body: {
          ...initialNotificationData,
        },
      }),
      invalidatesTags: ["notification"],
    }),
    deleteNotification: builder.mutation({
      query: ({ id }) => ({
        url: "/hr/notifications",
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: ["notification"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetNotificationsByYearQuery,
  useAddNewNotificationMutation,
  useUpdateNotificationMutation,
  useDeleteNotificationMutation,
} = notificationsApiSlice;

// returns the query result object
export const selectNotificationsResult =
  notificationsApiSlice.endpoints.getNotifications.select();

// creates memoized selector
const selectNotificationsData = createSelector(
  selectNotificationsResult,
  (notificationsResult) => notificationsResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllNotifications,
  selectById: selectNotificationById,
  selectIds: selectNotificationIds,
  // Pass in a selector that returns the notifications slice of state
} = notificationsAdapter.getSelectors(
  (state) => selectNotificationsData(state) ?? initialState
);
