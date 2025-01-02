// //not an API slice but a traditional slice to work with redux this where we devide our state for t

// import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";

// //const initialState=[]
// const notificationsAdapter = createEntityAdapter(); //this was added
// const initialState = notificationsAdapter.getInitialState();
// const notificationsSlice = createSlice({
//   name: "notification",
//   initialState,

//   reducers: {
//     setNotifications: (state, action) => {
//       //get and sort the items
//       notificationsAdapter.setAll(state, action.payload);
//     },
//     setSomeNotifications: (state, action) => {
//       notificationsAdapter.upsertMany(state, action.payload);
//     }, //will ad d to the state

//     updateNotification: (state, action) => {
//       notificationsAdapter.updateOne(state, action.payload);
//     },
//     setResult: (state, action) => {
//       //save to teh state??
//       const { list } = action.payload;
//       state.notification = list;
//     },
//   },
//   extraReducers: (builder) => {
//     // Extra reducers will handle actions from the query
//   },
// });
// //export actions
// export const { setNotifications, updateNotification, setResult, setSomeNotifications } =
//   notificationsSlice.actions; //to be used with dispatch in the components

// export const currentNotificationsList = (state) => state.notification;
// //export reducer
// export default notificationsSlice.reducer; //to be sent to the store
// //export selectors
// export const { selectAll: selectAllNotifications, selectById: selectNotificationById } =
//   notificationsAdapter.getSelectors((state) => state.notification); //added this one
