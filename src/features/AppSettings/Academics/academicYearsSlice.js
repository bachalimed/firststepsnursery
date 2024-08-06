//not an API slice but a traditional slice to work with redux

import { createSlice, createEntityAdapter  } from '@reduxjs/toolkit'


//const initialState=[] 
const academicYearsAdapter = createEntityAdapter()//this was added
const initialState= academicYearsAdapter.getInitialState()
const academicYearsSlice = createSlice({
    name: 'academicYears',
    initialState,
   
    reducers: {
        setAcademicYears: (state, action) => {
            console.log('State:', state)
            academicYearsAdapter.setAll(state, action.payload)
            console.log('State:', state)
        },
        updateAcademicYear: (state, action) => {
            academicYearsAdapter.updateOne(state, action.payload)
        },
        selectAcademicYear: (state, action) => {
            const { selectedTitle } = action.payload
            console.log('selectedTitle')
            console.log(selectedTitle)
            //Reset isSelected for all academic years
            //const oldSelected = state.filter(year=>year.isSelected)
            //console.log(oldSelected)
            Object.values(state.entities).forEach(entity => {//Converts the entities object from the state into an array of its values. Each value is an entity, Iterates over each entity in the array.
                if (entity) {//Checks if the entity is not null or undefined.
                    console.log(entity)
                    entity.isSelected = false}//Sets the isSelected property of the entity to false
            })
            const SelectedAcademicYear = state.entities[selectedTitle]
            if (SelectedAcademicYear) {
                SelectedAcademicYear.isSelected = true
            }
             console.log(SelectedAcademicYear)
            //const selectedYear = state.academicYears.find((year)=> year.title===selectedTitle)
            //return academicYears

            },



//             const selectedYear = listOfAcademicYears.find((year)=> year.title===e.target.value)
//   const newSelectedYear = {...selectedYear,isSelected:true}
//   const modifiedList=  [...listOfAcademicYears,newSelectedYear]
//   console.log(modifiedList)
//   console.log(selectedYear)

        
    }
})
export const { setAcademicYears, updateAcademicYear, activateAcademicYear, selectAcademicYear } = academicYearsSlice.actions

export const currentAcademicYearsList = (state) => state.academicYears
export default academicYearsSlice.reducer//to be sent to the store
export const { selectAll: selectAllAcademicYears } = academicYearsAdapter.getSelectors(state => state.academicYears)//added this one

