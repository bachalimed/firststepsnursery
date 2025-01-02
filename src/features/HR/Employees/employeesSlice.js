// //not an API slice but a traditional slice to work with redux this where we devide our state for t

// import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";

// //const initialState=[]
// const employeesAdapter = createEntityAdapter(); //this was added
// const initialState = employeesAdapter.getInitialState();
// const employeesSlice = createSlice({
//   name: "employee",
//   initialState,

//   reducers: {
//     setEmployees: (state, action) => {
//       //get and sort the items
//       employeesAdapter.setAll(state, action.payload);
//     },
//     setSomeEmployees: (state, action) => {
//       employeesAdapter.upsertMany(state, action.payload);
//     }, //will ad d to the state

//     updateEmployee: (state, action) => {
//       employeesAdapter.updateOne(state, action.payload);
//     },
//     setResult: (state, action) => {
//       //save to teh state??
//       const { list } = action.payload;
//       state.employee = list;
//     },
//   },
//   extraReducers: (builder) => {
//     // Extra reducers will handle actions from the query
//   },
// });
// //export actions
// export const { setEmployees, updateEmployee, setResult, setSomeEmployees } =
//   employeesSlice.actions; //to be used with dispatch in the components

// export const currentEmployeesList = (state) => state.employee;
// //export reducer
// export default employeesSlice.reducer; //to be sent to the store
// //export selectors
// export const { selectAll: selectAllEmployees, selectById: selectEmployeeById } =
//   employeesAdapter.getSelectors((state) => state.employee); //added this one
