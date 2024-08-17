//not an API slice but a traditional slice to work with redux this where we devide our state for t

import { createSlice, createEntityAdapter  } from '@reduxjs/toolkit'


//const initialState=[] 
const studentsAdapter = createEntityAdapter()//this was added
const initialState= studentsAdapter.getInitialState()
const studentsSlice = createSlice({
    name: 'student',
    initialState,

    reducers: {
        setStudents: (state, action) => {//get and sort the items
            studentsAdapter.setAll(state, action.payload)
        
        },        
        selectStudent: (state, action) => {
            const { id } = action.payload //get the id from the payload that was passed in from the component selection
            // console.log('selectedTitle')
            // console.log(id)
            //Reset isSelected for all academic years
            const newStudents=Object.values(state.entities).map(item  => {//Converts the entities object from the state into an array of its values. Each value is an entity, Iterates over each entity in the array.
                if (item.id === id){//Checks if the entity is not null or undefined.
                    
                    return { ...item, isSelected: true }//Sets the isSelected property of the entity to true
                } else {
                    return { ...item, isSelected: false }
                }
            })
            const newEntities = {}
            newStudents.forEach(item => {newEntities[item.id] = item
            })
            state.entities = newEntities
            state.ids = Object.keys(newEntities)

            },
           
        updateStudent: (state, action) => {
            studentsAdapter.updateOne(state, action.payload)
            },
        setResult: (state, action) => {//save to teh state??
            const {list}  = action.payload
            state.student = list
            
            },    


        
    }
})
//export actions
export const { setStudents, updateStudent,  selectStudent, setResult } = studentsSlice.actions

export const currentStudentsList = (state) => state.student
//export reducer
export default studentsSlice.reducer//to be sent to the store
//export selectors
 export const { selectAll: selectAllStudents } = studentsAdapter.getSelectors(state => state.student)//added this one


