//not an API slice but a traditional slice to work with redux this where we devide our state for t

import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";

//const initialState=[]
const admissionsAdapter = createEntityAdapter(); //this was added
const initialState = admissionsAdapter.getInitialState();
const admissionsSlice = createSlice({
  name: "admission",
  initialState,

  reducers: {
    setAdmissions: (state, action) => {
      //get and sort the items
      admissionsAdapter.setAll(state, action.payload);
    },
    setSomeAdmissions: (state, action) => {
      admissionsAdapter.upsertMany(state, action.payload);
    }, //will ad d to the state

    updateAdmission: (state, action) => {
      admissionsAdapter.updateOne(state, action.payload);
    },
    setResult: (state, action) => {
      //save to teh state??
      const { list } = action.payload;
      state.admission = list;
    },
  },
  extraReducers: (builder) => {
    // Extra reducers will handle actions from the query
  },
});
//export actions
export const { setAdmissions, updateAdmission, setResult, setSomeAdmissions } =
  admissionsSlice.actions; //to be used with dispatch in the components

export const currentAdmissionsList = (state) => state.admission;
//export reducer
export default admissionsSlice.reducer; //to be sent to the store
//export selectors
export const { selectAll: selectAllAdmissions, selectById: selectAdmissionById } =
  admissionsAdapter.getSelectors((state) => state.admission); //added this one
