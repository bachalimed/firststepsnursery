//not an API slice but a traditional slice to work with redux this where we devide our state for t

import { createSlice, createEntityAdapter  } from '@reduxjs/toolkit'


//const initialState=[] 
const parentsAdapter = createEntityAdapter()//this was added
const initialState= parentsAdapter.getInitialState()
const parentsSlice = createSlice({
    name: 'parent',
    initialState,

    reducers: {
        setParents: (state, action) => {//get and sort the items
            parentsAdapter.setAll(state, action.payload)
        
        },   
        setSomeParents: (state, action) => {parentsAdapter.upsertMany(state, action.payload)
        },    //will ad d to the state
       
           
        updateParent: (state, action) => {
            parentsAdapter.updateOne(state, action.payload)
            },
        setResult: (state, action) => {//save to teh state??
            const {list}  = action.payload
            state.parent = list
            
            },    


        
    }
})
//export actions
export const { setParents, updateParent,   setResult, setSomeParents } = parentsSlice.actions//to be used with dispatch in the components

export const currentParentsList = (state) => state.parent
//export reducer
export default parentsSlice.reducer//to be sent to the store
//export selectors
 export const { selectAll: selectAllParents,
    
   
  } = parentsAdapter.getSelectors(state => state.parent)//added this one

