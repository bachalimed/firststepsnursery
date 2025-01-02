// //not an API slice but a traditional slice to work with redux this where we devide our state for t

// import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";

// //const initialState=[]
// const sessionsAdapter = createEntityAdapter(); //this was added
// const initialState = sessionsAdapter.getInitialState();
// const sessionsSlice = createSlice({
//   name: "session",
//   initialState,

//   reducers: {
//     setSessions: (state, action) => {
//       //get and sort the items
//       sessionsAdapter.setAll(state, action.payload);
//     },
//     setSomeSessions: (state, action) => {
//       sessionsAdapter.upsertMany(state, action.payload);
//     }, //will ad d to the state

//     updateSession: (state, action) => {
//       sessionsAdapter.updateOne(state, action.payload);
//     },
//     setResult: (state, action) => {
//       //save to teh state??
//       const { list } = action.payload;
//       state.session = list;
//     },
//   },
//   extraReducers: (builder) => {
//     // Extra reducers will handle actions from the query
//   },
// });
// //export actions
// export const { setSessions, updateSession, setResult, setSomeSessions } =
//   sessionsSlice.actions; //to be used with dispatch in the components

// export const currentSessionsList = (state) => state.session;
// //export reducer
// export default sessionsSlice.reducer; //to be sent to the store
// //export selectors
// export const { selectAll: selectAllSessions, selectById: selectSessionById } =
//   sessionsAdapter.getSelectors((state) => state.session); //added this one
