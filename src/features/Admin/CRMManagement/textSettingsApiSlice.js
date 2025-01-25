// import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
// import { apiSlice } from "../../../app/api/apiSlice";

// const textSettingsAdapter = createEntityAdapter({}); //we can iterate on the id but not on the entities

// const initialState = textSettingsAdapter.getInitialState();

// export const textSettingsApiSlice = apiSlice.injectEndpoints({
//   //inject the ends points into apislice
//   //define endpoints
//   endpoints: (builder) => ({
//     //a hook will be created automatically based on the end point :gettextSettings
//     getTextSettings: builder.query({
//       query: () => "/admin/crmManagement/textSettings/", //this route is as defined in the backend server.js
//       validateStatus: (response, result) => {
//         //to validate the status as per documentation
//         return response.status === 200 && !result.isError;
//       },
//       //keepUnusedDataFor: 5,//default is 60seconds or data will be  removed from the cache, this will make the page keeps reloading while editing the textSetting after that time, this is solved by keeping an active subscription
//       transformResponse: (responseData) => {
//         const loadedTextSettings = responseData.map((textSetting) => {
//           textSetting.id = textSetting._id; //changed the _id from mongoDB to id
//           return textSetting;
//         });
//         return textSettingsAdapter.setAll(initialState, loadedTextSettings); //loaded the textSettings into textSettingsadapter into state
//       },
//       providesTags: ["textSetting"],
//     }),
//     getTextSettingById: builder.query({
//       query: (params) => {
//         const queryString = new URLSearchParams(params).toString();
//         return `/admin/crmManagement/textSettings/?${queryString}`;
//       },

//       validateStatus: (response, result) => {
//         return response.status === 200 && !result.isError;
//       },

//       transformResponse: (responseData) => {
//         //console.log(responseData, 'responsedataaaaaaa')
//         // Handle the single textSetting object directly
//         const textSetting = { ...responseData };
//         textSetting.id = textSetting._id;  // Change `_id` from MongoDB to `id`
//         delete textSetting._id;      // Delete the original `_id` from MongoDB
    
//         // Use `upsertOne` to add or update the single textSetting object in the state
//         return textSettingsAdapter.upsertOne(initialState, textSetting);
//     },
//       providesTags: ["textSetting"],
     
//     }),
//     addNewTextSetting: builder.mutation({
//       query: (initialTextSettingData) => ({
//         url: "/admin/crmManagement/newTextSetting/", //modified to target the muler route before newTextSetting controller route
//         method: "POST",
//         body: {
//           ...initialTextSettingData,
//         },
//       }),
//       invalidatesTags: ["textSetting"],
//     }),
//     updateTextSetting: builder.mutation({
//       query: (initialTextSettingData) => ({
//         url: "/admin/crmManagement/:id",
//         method: "PATCH",
//         body: {
//           ...initialTextSettingData,
//         },
//       }),
//       invalidatesTags: ["textSetting"],
//     }),
//     updateTextSettingPhoto: builder.mutation({
//       query: (initialTextSettingData) => ({
//         url: "/admin/crmManagement/photos",
//         method: "PATCH",
//         body: {
//           ...initialTextSettingData,
//         },
//       }),
//       invalidatesTags: ["textSetting"],
//     }),
//     deleteTextSetting: builder.mutation({
//       query: ({ id }) => ({
//         url: "/admin/crmManagement/textSettings",
//         method: "DELETE",
//         body: { id },
//       }),
//       invalidatesTags: (result, error, arg) => [{ type: "textSetting", id: arg.id }],
//     }),
//   }),
// });

// export const {
//   //hooks created automatically from endpoint
//   useGetTextSettingsQuery,
//   useGetTextSettingByIdQuery,
//   useAddNewTextSettingMutation,
//   useUpdateTextSettingPhotoMutation,
//   useUpdateTextSettingMutation,
//   useDeleteTextSettingMutation,
// } = textSettingsApiSlice;

// // returns the query result object by using the endpoint already defined above and .select method
// export const selectTextSettingsResult = textSettingsApiSlice.endpoints.getTextSettings.select();

// // creates memoized selector
// const selectTextSettingsData = createSelector(
//   selectTextSettingsResult,
//   (textSettingsResult) => textSettingsResult.data // normalized state object with ids & entities, this will grab the data from the selecttextSettings result
// ); //we did not export, just getting the selector ready to be used in the next part

// //getSelectors creates these selectors and we rename them with aliases using destructuring
// export const {
//   selectAll: selectAllTextSettings, //the default selectAll is renamed to selectAllTextSettings
//   selectById: selectTextSettingById,
//   selectIds: selectTextSettingIds,
//   // Pass in a selector that returns the textSettings slice of state
// } = textSettingsAdapter.getSelectors(
//   (state) => selectTextSettingsData(state) ?? initialState
// );
