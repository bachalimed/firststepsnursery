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
        setSomeStudents: (state, action) => {studentsAdapter.upsertMany(state, action.payload)
        },    //will ad d to the state
       
           
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
export const { setStudents, updateStudent,   setResult, setSomeStudents } = studentsSlice.actions

export const currentStudentsList = (state) => state.student
//export reducer
export default studentsSlice.reducer//to be sent to the store
//export selectors
 export const { selectAll: selectAllStudents,
    
   
  } = studentsAdapter.getSelectors(state => state.student)//added this one


