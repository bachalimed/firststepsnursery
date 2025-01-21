import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";
const notificationsAdapter = createEntityAdapter({});

const initialState = notificationsAdapter.getInitialState();

export const notificationsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // getNotifications: builder.query({
    //     query: () => '/notifications/notificationsParents/notifications',//as defined in server.js
    //     validateStatus: (response, result) => {
    //         return response.status === 200 && !result.isError
    //     },

    //     keepUnusedDataFor: 60,//default when app is deployed is 60seconds
    //     transformResponse: responseData => {
    //         const newLoadedNotifications = responseData.map(notification => {

    //             notification.id = notification._id//changed the _id from mongoDB to id
    //             delete notification._id//added to delete the extra original _id from mongo but careful when planning to save to db again
    //             return notification
    //         })
    //         return notificationsAdapter.setAll(initialState, newLoadedNotifications)
    //     },
    //     providesTags:['notification']
    //     // providesTags: (result, error, arg) => {
    //     //     if (result?.ids) {
    //     //         return [
    //     //             { type: 'notification', id: 'LIST' },
    //     //             ...result.ids.map(id => ({ type: 'notification', id }))
    //     //         ]
    //     //     } else return [{ type: 'notification', id: 'LIST' }]
    //     // }
    // }),
    getNotificationsByYear: builder.query({
      query: (params) => {
        const queryString = new URLSearchParams(params).toString();
        return `/notifications/notifications?${queryString}`;
      },

      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },

      transformResponse: (responseData) => {
        // console.log('  in the APIslice',responseData.total)

        const newLoadedNotifications = responseData.map((notification) => {
          notification.id = notification._id; //changed the _id from mongoDB to id
          delete notification._id; //added to delete the extra original _id from mongo but careful when planning to save to db again
          return notification;
        });
        return notificationsAdapter.setAll(initialState, newLoadedNotifications);
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
    getNotificationById: builder.query({
      query: (params) => {
        const queryString = new URLSearchParams(params).toString();
        return `/notifications/notifications?${queryString}`;
      },

      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },

      transformResponse: (responseData) => {
        //const {loadedNotifications} =
        //console.log('academicYears length  in the APIslice',responseData.total)
        //console.log('academicYears in the APIslice', academicYears)
        const newLoadedNotifications = responseData.map((notification) => {
          notification.id = notification._id; //changed the _id from mongoDB to id
          delete notification._id; //added to delete the extra original _id from mongo but careful when planning to save to db again
          return notification;
        });
        return notificationsAdapter.upsertOne(initialState, newLoadedNotifications);
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
    addNewNotification: builder.mutation({
      query: (initialNotificationData) => ({
        url: "/notifications/notifications",
        method: "POST",
        body: {
          ...initialNotificationData,
        },
      }),
      invalidatesTags: ["notification"],
    }),
    updateNotification: builder.mutation({
      query: (initialNotificationData) => ({
        url: "/notifications/notifications",
        method: "PATCH",
        body: {
          ...initialNotificationData,
        },
      }),
      invalidatesTags: ["notification"],
      // invalidatesTags: (result, error, arg) => [//we re not updating all the list, butonly update the notification in the cache by using the arg.id
      //     { type: 'notification', id: arg.id }
      // ]
    }),
    deleteNotification: builder.mutation({
      query: ({ id }) => ({
        url: "/notifications/notifications",
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: ["notification"],
      // invalidatesTags: (result, error, arg) => [
      //     { type: 'notification', id: arg.id }
      // ]
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetNotificationsByYearQuery,
  useGetNotificationByIdQuery,
  useAddNewNotificationMutation,
  useUpdateNotificationMutation,
  useDeleteNotificationMutation,
} = notificationsApiSlice;

// returns the query result object and not only the data we need for this reason we need the createselector!!! thsi selcetor decides which query is used??
export const selectNotificationsResult =
  notificationsApiSlice.endpoints.getNotificationsByYear.select();

// creates memoized selector that takes the inpput function selescNotificationsREsult and gets the data from it which is ids and entities
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
