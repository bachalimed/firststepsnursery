// //not an API slice but a traditional slice to work with redux this where we devide our state for t

// import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";

// //const initialState=[]
// const payeesAdapter = createEntityAdapter(); //this was added
// const initialState = payeesAdapter.getInitialState();
// const payeesSlice = createSlice({
//   name: "payee",
//   initialState,

//   reducers: {
//     setPayees: (state, action) => {
//       //get and sort the items
//       payeesAdapter.setAll(state, action.payload);
//     },
//     setSomePayees: (state, action) => {
//       payeesAdapter.upsertMany(state, action.payload);
//     }, //will ad d to the state

//     updatePayee: (state, action) => {
//       payeesAdapter.updateOne(state, action.payload);
//     },
//     setResult: (state, action) => {
//       //save to teh state??
//       const { list } = action.payload;
//       state.payee = list;
//     },
//   },
//   extraReducers: (builder) => {
//     // Extra reducers will handle actions from the query
//   },
// });
// //export actions
// export const { setPayees, updatePayee, setResult, setSomePayees } =
//   payeesSlice.actions; //to be used with dispatch in the components

// export const currentPayeesList = (state) => state.payee;
// //export reducer
// export default payeesSlice.reducer; //to be sent to the store
// //export selectors
// export const { selectAll: selectAllPayees, selectById: selectPayeeById } =
//   payeesAdapter.getSelectors((state) => state.payee); //added this one
