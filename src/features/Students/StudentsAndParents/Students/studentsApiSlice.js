import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../../../app/api/apiSlice";
const studentsAdapter = createEntityAdapter({});

const initialState = studentsAdapter.getInitialState();

export const studentsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // getStudents: builder.query({
    //     query: () => '/students/studentsParents/students',//as defined in server.js
    //     validateStatus: (response, result) => {
    //         return response.status === 200 && !result.isError
    //     },

    //     keepUnusedDataFor: 60,//default when app is deployed is 60seconds
    //     transformResponse: responseData => {
    //         const newLoadedStudents = responseData.map(student => {

    //             student.id = student._id//changed the _id from mongoDB to id
    //             delete student._id//added to delete the extra original _id from mongo but careful when planning to save to db again
    //             return student
    //         })
    //         return studentsAdapter.setAll(initialState, newLoadedStudents)
    //     },
    //     providesTags:['student']
    //     // providesTags: (result, error, arg) => {
    //     //     if (result?.ids) {
    //     //         return [
    //     //             { type: 'student', id: 'LIST' },
    //     //             ...result.ids.map(id => ({ type: 'student', id }))
    //     //         ]
    //     //     } else return [{ type: 'student', id: 'LIST' }]
    //     // }
    // }),
    getStudentsByYear: builder.query({
      query: (params) => {
        const queryString = new URLSearchParams(params).toString();
        return `/students/studentsParents/students?${queryString}`;
      },

      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },

      transformResponse: (responseData) => {
        // console.log('  in the APIslice',responseData.total)

        const newLoadedStudents = responseData.map((student) => {
          student.id = student._id; //changed the _id from mongoDB to id
          delete student._id; //added to delete the extra original _id from mongo but careful when planning to save to db again
          return student;
        });
        return studentsAdapter.setAll(initialState, newLoadedStudents);
      },
      providesTags: ["student"],

      // providesTags: (result, error, arg) => {
      //     if (result?.ids) {
      //         return [
      //             { type: 'student', id: 'LIST' },
      //             ...result.ids.map(id => ({ type: 'student', id }))
      //         ]
      //     } else return [{ type: 'student', id: 'LIST' }]
      // }
    }),
    getStudentsStatsByYear: builder.query({
      query: (params) => {
        const queryString = new URLSearchParams(params).toString();
        return `/students/studentsParents/students?${queryString}`;
      },

      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      transformResponse: (responseData) => {
        // console.log('  in the APIslice',responseData.total)

        
        return responseData
      },

     
      providesTags: ["studentsStats"],

     
    }),
    getStudentById: builder.query({
      query: (params) => {
        const queryString = new URLSearchParams(params).toString();
        return `/students/studentsParents/students?${queryString}`;
      },

      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },

      transformResponse: (responseData) => {
        //const {loadedStudents} =

        //console.log('academicYears length  in the APIslice',responseData.total)
        //console.log('academicYears in the APIslice', academicYears)
        const newLoadedStudents = responseData.map((student) => {
          student.id = student._id; //changed the _id from mongoDB to id
          delete student._id; //added to delete the extra original _id from mongo but careful when planning to save to db again
          return student;
        });
        return studentsAdapter.upsertMany(initialState, newLoadedStudents);
      },
      providesTags: ["student"],
      // providesTags: (result, error, arg) => {
      //     if (result?.ids) {
      //         return [
      //             { type: 'student', id: 'LIST' },
      //             ...result.ids.map(id => ({ type: 'student', id }))
      //         ]
      //     } else return [{ type: 'student', id: 'LIST' }]
      // }
    }),
    addNewStudent: builder.mutation({
      query: (initialStudentData) => ({
        url: "/students/studentsParents/students/",
        method: "POST",
        body: {
          ...initialStudentData,
        },
      }),
      invalidatesTags: ["student"],
    }),
    updateStudent: builder.mutation({
      query: (initialStudentData) => ({
        url: "/students/studentsParents/students",
        method: "PATCH",
        body: {
          ...initialStudentData,
        },
      }),
      invalidatesTags: ["student"],
      // invalidatesTags: (result, error, arg) => [//we re not updating all the list, butonly update the student in the cache by using the arg.id
      //     { type: 'student', id: arg.id }
      // ]
    }),
    deleteStudent: builder.mutation({
      query: ({ id }) => ({
        url: "/students/studentsParents/students",
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: ["student"],
      // invalidatesTags: (result, error, arg) => [
      //     { type: 'student', id: arg.id }
      // ]
    }),
  }),
});

export const {
  useGetStudentsQuery,
  useAddNewStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
  useGetStudentsByYearQuery,
  useGetStudentsStatsByYearQuery,
  useGetStudentByIdQuery,
} = studentsApiSlice;

// returns the query result object and not only the data we need for this reason we need the createselector!!! thsi selcetor decides which query is used??
export const selectStudentsResult =
  studentsApiSlice.endpoints.getStudentsByYear.select();

//this is specific for thequery byYear:
// export const selectStudentsByYearResult = studentsApiSlice.endpoints.getStudentsByYear.select(selectedYear)

// export const selectStudentByIdFromYear = (state, id, selectedYear) => {
//     const studentsResult = selectStudentsByYearResult(state, selectedYear)
//     return studentsResult?.data?.entities[id]
// }

// creates memoized selector that takes the inpput function selescStudentsREsult and gets the data from it which is ids and entities
const selectStudentsData = createSelector(
  selectStudentsResult,
  (studentsResult) => studentsResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllStudents,
  selectById: selectStudentById,
  selectIds: selectStudentIds,
  // Pass in a selector that returns the students slice of state
} = studentsAdapter.getSelectors(
  (state) => selectStudentsData(state) ?? initialState
);
