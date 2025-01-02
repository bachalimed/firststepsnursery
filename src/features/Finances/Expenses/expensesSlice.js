// //not an API slice but a traditional slice to work with redux this where we devide our state for the academic years

// import { createSlice, createEntityAdapter  } from '@reduxjs/toolkit'


// //const initialState=[] 
// const expensesAdapter = createEntityAdapter()//this was added
// const initialState= expensesAdapter.getInitialState()
// const expensesSlice = createSlice({
//     name: 'expense',
//     initialState,

//     reducers: {
//         setExpenses: (state, action) => {//get and sort the items
//             expensesAdapter.setAll(state, action.payload)
        
//         },        
//         selectExpense: (state, action) => {
//             const { id } = action.payload //get the id from the payload that was passed in from the component selection
//             // console.log('selectedTitle')
//             // console.log(id)
//             //Reset isSelected for all academic years
//             const newExpenses=Object.values(state.entities).map(item  => {//Converts the entities object from the state into an array of its values. Each value is an entity, Iterates over each entity in the array.
//                 if (item.id === id){//Checks if the entity is not null or undefined.
                    
//                     return { ...item, isSelected: true }//Sets the isSelected property of the entity to true
//                 } else {
//                     return { ...item, isSelected: false }
//                 }
//             })
//             const newEntities = {}
//             newExpenses.forEach(item => {newEntities[item.id] = item
//             })
//             state.entities = newEntities
//             state.ids = Object.keys(newEntities)

//             },
           
//             expenseAdded: (state, action) => {
//                 expensesAdapter.updateOne(state, action.payload)
//             },
//             updateExpense: (state, action) => {
//                 expensesAdapter.updateOne(state, action.payload)
//             },


// //             const selectedYear = listOfExpenses.find((year)=> year.title===e.target.value)
// //   const newSelectedYear = {...selectedYear,isSelected:true}
// //   const modifiedList=  [...listOfExpenses,newSelectedYear]
// //   console.log(modifiedList)
// //   console.log(selectedYear)

        
//     }
// })
// export const { setExpenses, updateExpense, expenseAdded,  selectExpense } = expensesSlice.actions

// export const currentExpensesList = (state) => state.expense
// export default expensesSlice.reducer//to be sent to the store
// // export const { selectAll: selectAllExpenses } = expensesAdapter.getSelectors(state => state.expense)//added this one


