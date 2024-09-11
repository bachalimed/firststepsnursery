//not an API slice but a traditional slice to work with redux this where we devide our state for the academic years

import { createSlice, createEntityAdapter  } from '@reduxjs/toolkit'


//const initialState=[] 
const academicYearsAdapter = createEntityAdapter()//this was added
const initialState= academicYearsAdapter.getInitialState()
const academicYearsSlice = createSlice({
    name: 'academicYear',
    initialState,

    reducers: {
        setAcademicYears: (state, action) => {//get and sort the items
            academicYearsAdapter.setAll(state, action.payload)
        
        },        
        academicYearSelected: (state, action) => {
            const { id } = action.payload //get the id from the payload that was passed in from the component selection
           
            const newAcademicYears=Object.values(state.entities).map(item  => ({//Converts the entities object from the state into an array of its values. Each value is an entity, Iterates over each entity in the array.
                 ...item,
                  isSelected: item.id===id}))
                
                academicYearsAdapter.setAll(state, newAcademicYears)
            },
            
           
            updateAcademicYear: (state, action) => {
                academicYearsAdapter.updateOne(state, action.payload)
            },


//             const selectedYear = listOfAcademicYears.find((year)=> year.title===e.target.value)
//   const newSelectedYear = {...selectedYear,isSelected:true}
//   const modifiedList=  [...listOfAcademicYears,newSelectedYear]
//   console.log(modifiedList)
//   console.log(selectedYear)
        
    }
})
export const { setAcademicYears, updateAcademicYear, activateAcademicYear,  academicYearSelected } = academicYearsSlice.actions

export const currentAcademicYearsList = (state) => state.academicYear
export default academicYearsSlice.reducer//to be sent to the store
// export const { selectAll: selectAllAcademicYears } = academicYearsAdapter.getSelectors(state => state.academicYear)//added this one


