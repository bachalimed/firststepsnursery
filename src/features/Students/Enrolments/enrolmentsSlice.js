// //not an API slice but a traditional slice to work with redux this where we devide our state for t

// import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";

// //const initialState=[]
// const enrolmentsAdapter = createEntityAdapter(); //this was added
// const initialState = enrolmentsAdapter.getInitialState();
// const enrolmentsSlice = createSlice({
//   name: "enrolment",
//   initialState,

//   reducers: {
//     setEnrolments: (state, action) => {
//       //get and sort the items
//       enrolmentsAdapter.setAll(state, action.payload);
//     },
//     setSomeEnrolments: (state, action) => {
//       enrolmentsAdapter.upsertMany(state, action.payload);
//     }, //will ad d to the state

//     updateEnrolment: (state, action) => {
//       enrolmentsAdapter.updateOne(state, action.payload);
//     },
//     setResult: (state, action) => {
//       //save to teh state??
//       const { list } = action.payload;
//       state.enrolment = list;
//     },
//   },
//   extraReducers: (builder) => {
//     // Extra reducers will handle actions from the query
//   },
// });
// //export actions
// export const { setEnrolments, updateEnrolment, setResult, setSomeEnrolments } =
//   enrolmentsSlice.actions; //to be used with dispatch in the components

// export const currentEnrolmentsList = (state) => state.enrolment;
// //export reducer
// export default enrolmentsSlice.reducer; //to be sent to the store
// //export selectors
// export const { selectAll: selectAllEnrolments, selectById: selectEnrolmentById } =
//   enrolmentsAdapter.getSelectors((state) => state.enrolment); //added this one
