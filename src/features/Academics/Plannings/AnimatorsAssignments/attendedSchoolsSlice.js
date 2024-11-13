//not an API slice but a traditional slice to work with redux this where we devide our state for the academic years

import { createSlice, createEntityAdapter  } from '@reduxjs/toolkit'


//const initialState=[] 
const attendedSchoolsAdapter = createEntityAdapter()//this was added
const initialState= attendedSchoolsAdapter.getInitialState()
const attendedSchoolsSlice = createSlice({
    name: 'attendedSchool',
    initialState,

    reducers: {
        setAttendedSchools: (state, action) => {//get and sort the items
            attendedSchoolsAdapter.setAll(state, action.payload)
        
        },        
        selectAttendedSchool: (state, action) => {
            const { id } = action.payload //get the id from the payload that was passed in from the component selection
            // console.log('selectedTitle')
            // console.log(id)
            //Reset isSelected for all academic years
            const newAttendedSchools=Object.values(state.entities).map(item  => {//Converts the entities object from the state into an array of its values. Each value is an entity, Iterates over each entity in the array.
                if (item.id === id){//Checks if the entity is not null or undefined.
                    
                    return { ...item, isSelected: true }//Sets the isSelected property of the entity to true
                } else {
                    return { ...item, isSelected: false }
                }
            })
            const newEntities = {}
            newAttendedSchools.forEach(item => {newEntities[item.id] = item
            })
            state.entities = newEntities
            state.ids = Object.keys(newEntities)

            },
           
            attendedSchoolAdded: (state, action) => {
                attendedSchoolsAdapter.updateOne(state, action.payload)
            },
            updateAttendedSchool: (state, action) => {
                attendedSchoolsAdapter.updateOne(state, action.payload)
            },


//             const selectedYear = listOfAttendedSchools.find((year)=> year.title===e.target.value)
//   const newSelectedYear = {...selectedYear,isSelected:true}
//   const modifiedList=  [...listOfAttendedSchools,newSelectedYear]
//   console.log(modifiedList)
//   console.log(selectedYear)

        
    }
})
export const { setAttendedSchools, updateAttendedSchool, attendedSchoolAdded,  selectAttendedSchool } = attendedSchoolsSlice.actions

export const currentAttendedSchoolsList = (state) => state.attendedSchool
export default attendedSchoolsSlice.reducer//to be sent to the store
// export const { selectAll: selectAllAttendedSchools } = attendedSchoolsAdapter.getSelectors(state => state.attendedSchool)//added this one


