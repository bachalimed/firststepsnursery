// //not an API slice but a traditional slice to work with redux this where we devide our state for the academic years

// import { createSlice, createEntityAdapter  } from '@reduxjs/toolkit'

// //const initialState=[]
// const employeeDocumentsListsAdapter = createEntityAdapter()//this was added
// const initialState= employeeDocumentsListsAdapter.getInitialState()
// const employeeDocumentsListsSlice = createSlice({
//     name: 'employeeDocumentsList',
//     initialState,

//     reducers: {
//         setEmployeeDocumentsLists: (state, action) => {//get and sort the items
//             employeeDocumentsListsAdapter.setAll(state, action.payload)

//         },
//         selectEmployeeDocumentsList: (state, action) => {
//             const { id } = action.payload //get the id from the payload that was passed in from the component selection
//             // console.log('selectedTitle')
//             // console.log(id)
//             //Reset isSelected for all academic years
//             const newEmployeeDocumentsLists=Object.values(state.entities).map(item  => {//Converts the entities object from the state into an array of its values. Each value is an entity, Iterates over each entity in the array.
//                 if (item.id === id){//Checks if the entity is not null or undefined.

//                     return { ...item, isSelected: true }//Sets the isSelected property of the entity to true
//                 } else {
//                     return { ...item, isSelected: false }
//                 }
//             })
//             const newEntities = {}
//             newEmployeeDocumentsLists.forEach(item => {newEntities[item.id] = item
//             })
//             state.entities = newEntities
//             state.ids = Object.keys(newEntities)

//             },

//             updateEmployeeDocumentsList: (state, action) => {
//                 employeeDocumentsListsAdapter.updateOne(state, action.payload)
//             },

// //             const selectedYear = listOfEmployeeDocumentsLists.find((year)=> year.title===e.target.value)
// //   const newSelectedYear = {...selectedYear,isSelected:true}
// //   const modifiedList=  [...listOfEmployeeDocumentsLists,newSelectedYear]
// //   console.log(modifiedList)
// //   console.log(selectedYear)

//     }
// })
// export const { setEmployeeDocumentsLists, updateEmployeeDocumentsList, activateEmployeeDocumentsList,  selectEmployeeDocumentsList } = employeeDocumentsListsSlice.actions

// export const currentEmployeeDocumentsListsList = (state) => state.employeeDocumentsList
// export default employeeDocumentsListsSlice.reducer//to be sent to the store
// // export const { selectAll: selectAllEmployeeDocumentsLists } = employeeDocumentsListsAdapter.getSelectors(state => state.employeeDocumentsList)//added this one
