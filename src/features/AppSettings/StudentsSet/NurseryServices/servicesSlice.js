// //not an API slice but a traditional slice to work with redux this where we devide our state for t

// import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";

// //const initialState=[]
// const servicesAdapter = createEntityAdapter(); //this was added
// const initialState = servicesAdapter.getInitialState();
// const servicesSlice = createSlice({
//   name: "service",
//   initialState,

//   reducers: {
//     setServices: (state, action) => {
//       //get and sort the items
//       servicesAdapter.setAll(state, action.payload);
//     },
//     setSomeServices: (state, action) => {
//       servicesAdapter.upsertMany(state, action.payload);
//     }, //will ad d to the state

//     updateService: (state, action) => {
//       servicesAdapter.updateOne(state, action.payload);
//     },
//     setResult: (state, action) => {
//       //save to teh state??
//       const { list } = action.payload;
//       state.service = list;
//     },
//   },
//   extraReducers: (builder) => {
//     // Extra reducers will handle actions from the query
//   },
// });
// //export actions
// export const { setServices, updateService, setResult, setSomeServices } =
//   servicesSlice.actions; //to be used with dispatch in the components

// export const currentServicesList = (state) => state.service;
// //export reducer
// export default servicesSlice.reducer; //to be sent to the store
// //export selectors
// export const { selectAll: selectAllServices, selectById: selectServiceById } =
//   servicesAdapter.getSelectors((state) => state.service); //added this one
