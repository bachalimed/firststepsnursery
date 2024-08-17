import {createSelector, createEntityAdapter } from '@reduxjs/toolkit';
import { apiSlice } from '../api/apiSlice';

// Assume you have already created a studentsAdapter in your slice file
const studentsAdapter = createEntityAdapter();

// Define the getStudentsByYear query
const studentsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getStudentsByYear: builder.query({
            query: (params) => {
                const queryString = new URLSearchParams(params).toString();
                return `/students/studentsParents/students?${queryString}`;
            },
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError;
            },
            transformResponse: responseData => {
                const loadedStudents = responseData.map(student => {
                    student.id = student._id;
                    return student;
                });
                return studentsAdapter.setAll(studentsAdapter.getInitialState(), loadedStudents);
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'student', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'student', id }))
                    ];
                } else return [{ type: 'student', id: 'LIST' }];
            }
        }),
    }),
});

// Export the auto-generated hook for the query
export const { useGetStudentsByYearQuery } = studentsApiSlice;

// Create selectors
export const selectStudentsResult = studentsApiSlice.endpoints.getStudentsByYear.select();

const studentsSelectors = studentsAdapter.getSelectors(state => selectStudentsResult(state)?.data ?? studentsAdapter.getInitialState());

export const {
    selectAll: selectAllStudents,
    selectById: selectStudentById,
    selectIds: selectStudentIds,
} = studentsSelectors;