// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   employeeDocuments: [],
//   // Assuming you want to manage a list of documents
//   // You can also include other fields as needed
// };

// const employeeDocumentsSlice = createSlice({
//   name: "employeeDocument",
//   initialState,

//   reducers: {
//     setEmployeeDocuments: (state, action) => {
//       // Set the entire list of employee documents
//       state.employeeDocuments = action.payload;
//     },
//     setSomeEmployeeDocuments: (state, action) => {
//       // Add new employee documents to the existing list
//       state.employeeDocuments = [...state.employeeDocuments, ...action.payload];
//     },
//     updateEmployeeDocument: (state, action) => {
//       // Update a specific employee document
//       const { id, changes } = action.payload;
//       const index = state.employeeDocuments.findIndex((doc) => doc.id === id);
//       if (index !== -1) {
//         state.employeeDocuments[index] = {
//           ...state.employeeDocuments[index],
//           ...changes,
//         };
//       }
//     },
//     setResult: (state, action) => {
//       // Save the result to the state
//       const { list } = action.payload;
//       state.employeeDocuments = list;
//     },
//   },
// });

// // Export actions
// export const {
//   setEmployeeDocuments,
//   updateEmployeeDocument,
//   setResult,
//   setSomeEmployeeDocuments,
// } = employeeDocumentsSlice.actions;

// // Selector to get the employee documents from the state
// export const selectEmployeeDocuments = (state) =>
//   state.employeeDocument.employeeDocuments;

// // Export reducer
// export default employeeDocumentsSlice.reducer;
