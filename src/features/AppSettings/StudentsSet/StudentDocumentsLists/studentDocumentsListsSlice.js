// //not an API slice but a traditional slice to work with redux this where we devide our state for the academic years

// import { createSlice, createEntityAdapter  } from '@reduxjs/toolkit'


// //const initialState=[] 
// const studentDocumentsListsAdapter = createEntityAdapter()//this was added
// const initialState= studentDocumentsListsAdapter.getInitialState()
// const studentDocumentsListsSlice = createSlice({
//     name: 'studentDocumentsList',
//     initialState,

//     reducers: {
//         setStudentDocumentsLists: (state, action) => {//get and sort the items
//             studentDocumentsListsAdapter.setAll(state, action.payload)
        
//         },        
//         selectStudentDocumentsList: (state, action) => {
//             const { id } = action.payload //get the id from the payload that was passed in from the component selection
//             // console.log('selectedTitle')
//             // console.log(id)
//             //Reset isSelected for all academic years
//             const newStudentDocumentsLists=Object.values(state.entities).map(item  => {//Converts the entities object from the state into an array of its values. Each value is an entity, Iterates over each entity in the array.
//                 if (item.id === id){//Checks if the entity is not null or undefined.
                    
//                     return { ...item, isSelected: true }//Sets the isSelected property of the entity to true
//                 } else {
//                     return { ...item, isSelected: false }
//                 }
//             })
//             const newEntities = {}
//             newStudentDocumentsLists.forEach(item => {newEntities[item.id] = item
//             })
//             state.entities = newEntities
//             state.ids = Object.keys(newEntities)

//             },
           
//             updateStudentDocumentsList: (state, action) => {
//                 studentDocumentsListsAdapter.updateOne(state, action.payload)
//             },


// //             const selectedYear = listOfStudentDocumentsLists.find((year)=> year.title===e.target.value)
// //   const newSelectedYear = {...selectedYear,isSelected:true}
// //   const modifiedList=  [...listOfStudentDocumentsLists,newSelectedYear]
// //   console.log(modifiedList)
// //   console.log(selectedYear)

        
//     }
// })
// export const { setStudentDocumentsLists, updateStudentDocumentsList, activateStudentDocumentsList,  selectStudentDocumentsList } = studentDocumentsListsSlice.actions

// export const currentStudentDocumentsListsList = (state) => state.studentDocumentsList
// export default studentDocumentsListsSlice.reducer//to be sent to the store
// // export const { selectAll: selectAllStudentDocumentsLists } = studentDocumentsListsAdapter.getSelectors(state => state.studentDocumentsList)//added this one


