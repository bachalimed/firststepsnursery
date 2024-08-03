//not an API slice but a traditional slice to work with redux

import { createSlice } from '@reduxjs/toolkit'

const academicYearsSlice = createSlice({
    name: 'academicYears',
    initialState: { academicYears: [] },
    reducers: {
        getAcademicYears: (state, action) => {//replaces setCredentials of authslice
            const { academicYears } = action.payload
            state.academicYears = academicYears
        },
        

        // logOut: (state, action) => {
        //     state.academicYears = []
        // },
    }
})

export const { getAcademicYears } = academicYearsSlice.actions

export default academicYearsSlice.reducer//to be sent to the store

// export const selectCurrentToken = (state) => state.academicYear.token
export const currentAcademicYearsList = (state) => state.academicYears.academicYears