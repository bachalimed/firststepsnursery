//not an API slice but a traditional slice to work with redux this where we devide our state for t

import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";

//const initialState=[]
const familiesAdapter = createEntityAdapter(); //this was added
const initialState = familiesAdapter.getInitialState();
const familiesSlice = createSlice({
  name: "family",
  initialState,

  reducers: {
    setFamilies: (state, action) => {
      //get and sort the items
      familiesAdapter.setAll(state, action.payload);
    },
    setSomeFamilies: (state, action) => {
      familiesAdapter.upsertMany(state, action.payload);
    }, //will ad d to the state

    updateFamily: (state, action) => {
      familiesAdapter.updateOne(state, action.payload);
    },
    setResult: (state, action) => {
      //save to teh state??
      const { list } = action.payload;
      state.family = list;
    },
  },
});
//export actions
export const { setFamilies, updateFamily, setResult, setSomeFamilies } =
  familiesSlice.actions; //to be used with dispatch in the components

export const currentFamiliesList = (state) => state.parent;
//export reducer
export default familiesSlice.reducer; //to be sent to the store
//export selectors
export const { selectAll: selectAllFamilies } = familiesAdapter.getSelectors(
  (state) => state.family
); //added this one
