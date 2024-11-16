//not an API slice but a traditional slice to work with redux this where we devide our state for the academic years

import { createSlice, createEntityAdapter  } from '@reduxjs/toolkit'


//const initialState=[] 
const paymentsAdapter = createEntityAdapter()//this was added
const initialState= paymentsAdapter.getInitialState()
const paymentsSlice = createSlice({
    name: 'payment',
    initialState,

    reducers: {
        setPayments: (state, action) => {//get and sort the items
            paymentsAdapter.setAll(state, action.payload)
        
        },        
        selectPayment: (state, action) => {
            const { id } = action.payload //get the id from the payload that was passed in from the component selection
            // console.log('selectedTitle')
            // console.log(id)
            //Reset isSelected for all academic years
            const newPayments=Object.values(state.entities).map(item  => {//Converts the entities object from the state into an array of its values. Each value is an entity, Iterates over each entity in the array.
                if (item.id === id){//Checks if the entity is not null or undefined.
                    
                    return { ...item, isSelected: true }//Sets the isSelected property of the entity to true
                } else {
                    return { ...item, isSelected: false }
                }
            })
            const newEntities = {}
            newPayments.forEach(item => {newEntities[item.id] = item
            })
            state.entities = newEntities
            state.ids = Object.keys(newEntities)

            },
           
            paymentAdded: (state, action) => {
                paymentsAdapter.updateOne(state, action.payload)
            },
            updatePayment: (state, action) => {
                paymentsAdapter.updateOne(state, action.payload)
            },


//             const selectedYear = listOfPayments.find((year)=> year.title===e.target.value)
//   const newSelectedYear = {...selectedYear,isSelected:true}
//   const modifiedList=  [...listOfPayments,newSelectedYear]
//   console.log(modifiedList)
//   console.log(selectedYear)

        
    }
})
export const { setPayments, updatePayment, paymentAdded,  selectPayment } = paymentsSlice.actions

export const currentPaymentsList = (state) => state.payment
export default paymentsSlice.reducer//to be sent to the store
// export const { selectAll: selectAllPayments } = paymentsAdapter.getSelectors(state => state.payment)//added this one


