//not an API slice but a traditional slice to work with redux this where we devide our state for t

import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";

//const initialState=[]
const sectionsAdapter = createEntityAdapter(); //this was added
const initialState = sectionsAdapter.getInitialState();
const sectionsSlice = createSlice({
  name: "section",
  initialState,

  reducers: {
    setSections: (state, action) => {
      //get and sort the items
      sectionsAdapter.setAll(state, action.payload);
    },
    setSomeSections: (state, action) => {
      sectionsAdapter.upsertMany(state, action.payload);
    }, //will ad d to the state

    updateSection: (state, action) => {
      sectionsAdapter.updateOne(state, action.payload);
    },
    setResult: (state, action) => {
      //save to teh state??
      const { list } = action.payload;
      state.section = list;
    },
  },
  extraReducers: (builder) => {
    // Extra reducers will handle actions from the query
  },
});
//export actions
export const { setSections, updateSection, setResult, setSomeSections } =
  sectionsSlice.actions; //to be used with dispatch in the components

export const currentSectionsList = (state) => state.section;
//export reducer
export default sectionsSlice.reducer; //to be sent to the store
//export selectors
export const { selectAll: selectAllSections, selectById: selectSectionById } =
  sectionsAdapter.getSelectors((state) => state.section); //added this one
