//not an API slice but a traditional slice to work with redux this where we devide our state for the academic years

import { createSlice, createEntityAdapter  } from '@reduxjs/toolkit'


//const initialState=[] 
const academicYearsAdapter = createEntityAdapter()//this was added
const initialState= academicYearsAdapter.getInitialState()
const academicYearsSlice = createSlice({
    name: 'academicYears',
    initialState,

    reducers: {
        setAcademicYears: (state, action) => {//get and sort the items
            academicYearsAdapter.setAll(state, action.payload)
        
        },        
        selectAcademicYear: (state, action) => {
            const { id } = action.payload //get the id from the payload that was passed in from the component selection
            // console.log('selectedTitle')
            // console.log(id)
            //Reset isSelected for all academic years
            const newAcademicYears=Object.values(state.entities).map(item  => {//Converts the entities object from the state into an array of its values. Each value is an entity, Iterates over each entity in the array.
                if (item.id === id){//Checks if the entity is not null or undefined.
                    
                    return { ...item, isSelected: true }//Sets the isSelected property of the entity to true
                } else {
                    return { ...item, isSelected: false }
                }
            })
            const newEntities = {}
            newAcademicYears.forEach(item => {newEntities[item.id] = item
            })
            state.entities = newEntities
            state.ids = Object.keys(newEntities)

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
export const { setAcademicYears, updateAcademicYear, activateAcademicYear,  selectAcademicYear } = academicYearsSlice.actions

export const currentAcademicYearsList = (state) => state.academicYears
export default academicYearsSlice.reducer//to be sent to the store
// export const { selectAll: selectAllAcademicYears } = academicYearsAdapter.getSelectors(state => state.academicYears)//added this one


