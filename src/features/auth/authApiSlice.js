import { apiSlice } from "../../app/api/apiSlice";
import { logOut, setCredentials } from "./authSlice"; //logOut is called action creator since it is exported from .actions

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    sendLogout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        //auery called inside the endpoint
        try {
          const { data } = await queryFulfilled;
          // console.log(data);
          dispatch(logOut());
          setTimeout(() => {
            //this will let the time to unsubscribe the components when it unmounts but if we logout from users page it takes time compared to othe rpages so we give it time to do it
            dispatch(apiSlice.util.resetApiState()); //clear the cache and query subscriptions
          }, 1000);
        } catch (err) {
          console.log(err);
        }
      },
    }),
    refresh: builder.mutation({
      query: () => ({
        url: "/auth/refresh",
        method: "GET",
       
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          //console.log('refresh of authapislice',data)
          const { accessToken } = data;
          dispatch(setCredentials({ accessToken }));
        } catch (err) {
          console.log(err);
        }
      },
    }),
  }),
});

export const { useLoginMutation, useSendLogoutMutation, useRefreshMutation } =
  authApiSlice;
