// //not an API slice but a traditional slice to work with redux this where we devide our state for the academic years

// import { createSlice, createEntityAdapter  } from '@reduxjs/toolkit'


// //const initialState=[] 
// const invoicesAdapter = createEntityAdapter()//this was added
// const initialState= invoicesAdapter.getInitialState()
// const invoicesSlice = createSlice({
//     name: 'invoice',
//     initialState,

//     reducers: {
//         setInvoices: (state, action) => {//get and sort the items
//             invoicesAdapter.setAll(state, action.payload)
        
//         },        
//         selectInvoice: (state, action) => {
//             const { id } = action.payload //get the id from the payload that was passed in from the component selection
//             // console.log('selectedTitle')
//             // console.log(id)
//             //Reset isSelected for all academic years
//             const newInvoices=Object.values(state.entities).map(item  => {//Converts the entities object from the state into an array of its values. Each value is an entity, Iterates over each entity in the array.
//                 if (item.id === id){//Checks if the entity is not null or undefined.
                    
//                     return { ...item, isSelected: true }//Sets the isSelected property of the entity to true
//                 } else {
//                     return { ...item, isSelected: false }
//                 }
//             })
//             const newEntities = {}
//             newInvoices.forEach(item => {newEntities[item.id] = item
//             })
//             state.entities = newEntities
//             state.ids = Object.keys(newEntities)

//             },
           
//             invoiceAdded: (state, action) => {
//                 invoicesAdapter.updateOne(state, action.payload)
//             },
//             updateInvoice: (state, action) => {
//                 invoicesAdapter.updateOne(state, action.payload)
//             },


// //             const selectedYear = listOfInvoices.find((year)=> year.title===e.target.value)
// //   const newSelectedYear = {...selectedYear,isSelected:true}
// //   const modifiedList=  [...listOfInvoices,newSelectedYear]
// //   console.log(modifiedList)
// //   console.log(selectedYear)

        
//     }
// })
// export const { setInvoices, updateInvoice, invoiceAdded,  selectInvoice } = invoicesSlice.actions

// export const currentInvoicesList = (state) => state.invoice
// export default invoicesSlice.reducer//to be sent to the store
// // export const { selectAll: selectAllInvoices } = invoicesAdapter.getSelectors(state => state.invoice)//added this one


