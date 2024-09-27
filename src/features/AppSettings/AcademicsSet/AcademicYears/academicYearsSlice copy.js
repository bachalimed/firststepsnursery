//not an API slice but a traditional slice to work with redux this where we devide our state for the academic years
import { createSlice, createEntityAdapter } from '@reduxjs/toolkit'

// Create entity adapter
const academicYearsAdapter = createEntityAdapter()

const initialState = academicYearsAdapter.getInitialState({
    selectedAcademicYearId: null, // store the selected academic year
})

const academicYearsSlice = createSlice({
    name: 'academicYear',
    initialState,
    reducers: {
        setAcademicYears: (state, action) => {
            academicYearsAdapter.setAll(state, action.payload)
        },
        academicYearSelected: (state, action) => {
            const { id } = action.payload
            state.selectedAcademicYearId = id // Store the selected academic year ID
            academicYearsAdapter.updateMany(state, {
                id: id,
                changes: { isSelected: true }
            })
        },
           
            updateAcademicYear: (state, action) => {
                academicYearsAdapter.updateOne(state, action.payload)
            },

    }
})
export const { setAcademicYears, updateAcademicYear, activateAcademicYear,  academicYearSelected } = academicYearsSlice.actions


// Selectors

export const selectSelectedAcademicYear = state => state.academicYear.selectedAcademicYearId


//export const currentAcademicYearsList = (state) => state.academicYear
export default academicYearsSlice.reducer//to be sent to the store
export const { selectAll: selectAllAcademicYears } = academicYearsAdapter.getSelectors(state => state.academicYear)//added this one


