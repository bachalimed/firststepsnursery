import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice"
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from "../features/auth/authSlice";
import usersReducer from "../features/Admin/UsersManagement/usersSlice";
import academicYearsReducer from "../features/AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import tasksReducer from "../features/Desk/Tasks/tasksSlice";
import studentsReducer from "../features/Students/StudentsAndParents/Students/studentsSlice";
import familiesReducer from "../features/Students/StudentsAndParents/Families/familiesSlice";
import sessionsReducer from "../features/Academics/Plannings/Sessions/sessionsSlice";

import employeeReducer from "../features/HR/Employees/employeesSlice";
import employeeDocumentsListReducer from "../features/AppSettings/HRSet/EmployeeDocumentsLists/EmployeeDocumentsListsSlice";

export const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    [apiSlice.reducerPath]: apiSlice.reducer, //what ever we name in the reducerpath will be given the name to this apislice, the default is 'api'
    auth: authReducer,//keep
    //user: usersReducer,
    academicYear: academicYearsReducer,//keeeeeeeeep
    student: studentsReducer,//keep
    //family: familiesReducer,
    //studentDocument: studentDocumentsReducer,
    //employeeDocument:employeeDocumentsListReducer,
    //employee: employeeReducer,
    //session: sessionsReducer,

    //studentDocumentsList:studentDocumentsListReducer,
    //task: tasksReducer,

    //imported from taskSlice
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware), //apislice.middleeware manages cache lifitimes and expirations
  devTools: false,////////////////changed to true for production
});
setupListeners(store.dispatch); //to allow refresh of data if using multiple computers so we don't use old deleted data
