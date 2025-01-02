// //not an API slice but a traditional slice to work with redux this where we devide our state for the academic years

// import { createSlice, createEntityAdapter  } from '@reduxjs/toolkit'


// //const initialState=[] 
// const classroomsAdapter = createEntityAdapter()//this was added
// const initialState= classroomsAdapter.getInitialState()
// const classroomsSlice = createSlice({
//     name: 'classroom',
//     initialState,

//     reducers: {
//         setClassrooms: (state, action) => {//get and sort the items
//             classroomsAdapter.setAll(state, action.payload)
        
//         },        
//         selectClassroom: (state, action) => {
//             const { id } = action.payload //get the id from the payload that was passed in from the component selection
//             // console.log('selectedTitle')
//             // console.log(id)
//             //Reset isSelected for all academic years
//             const newClassrooms=Object.values(state.entities).map(item  => {//Converts the entities object from the state into an array of its values. Each value is an entity, Iterates over each entity in the array.
//                 if (item.id === id){//Checks if the entity is not null or undefined.
                    
//                     return { ...item, isSelected: true }//Sets the isSelected property of the entity to true
//                 } else {
//                     return { ...item, isSelected: false }
//                 }
//             })
//             const newEntities = {}
//             newClassrooms.forEach(item => {newEntities[item.id] = item
//             })
//             state.entities = newEntities
//             state.ids = Object.keys(newEntities)

//             },
           
//             classroomAdded: (state, action) => {
//                 classroomsAdapter.updateOne(state, action.payload)
//             },
//             updateClassroom: (state, action) => {
//                 classroomsAdapter.updateOne(state, action.payload)
//             },


// //             const selectedYear = listOfClassrooms.find((year)=> year.title===e.target.value)
// //   const newSelectedYear = {...selectedYear,isSelected:true}
// //   const modifiedList=  [...listOfClassrooms,newSelectedYear]
// //   console.log(modifiedList)
// //   console.log(selectedYear)

        
//     }
// })
// export const { setClassrooms, updateClassroom, classroomAdded,  selectClassroom } = classroomsSlice.actions

// export const currentClassroomsList = (state) => state.classroom
// export default classroomsSlice.reducer//to be sent to the store
// // export const { selectAll: selectAllClassrooms } = classroomsAdapter.getSelectors(state => state.classroom)//added this one


