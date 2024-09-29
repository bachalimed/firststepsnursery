//not an API slice but a traditional slice to work with redux this where we devide our state for t

import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";

//const initialState=[]
const usersAdapter = createEntityAdapter(); //this was added
const initialState = usersAdapter.getInitialState();
const usersSlice = createSlice({
  name: "user",
  initialState,

  reducers: {
    setUsers: (state, action) => {
      //get and sort the items
      usersAdapter.setAll(state, action.payload);
    },
    setSomeUsers: (state, action) => {
      usersAdapter.upsertMany(state, action.payload);
    }, //will ad d to the state

    updateUser: (state, action) => {
      usersAdapter.updateOne(state, action.payload);
    },
    setResult: (state, action) => {
      //save to teh state??
      const { list } = action.payload;
      state.user = list;
    },
  },
  extraReducers: (builder) => {
    // Extra reducers will handle actions from the query
  },
});
//export actions
export const { setUsers, updateUser, setResult, setSomeUsers } =
  usersSlice.actions; //to be used with dispatch in the components

export const currentUsersList = (state) => state.user;
//export reducer
export default usersSlice.reducer; //to be sent to the store
//export selectors
export const { selectAll: selectAllUsers,
   //selectById: selectUserById 
  } =
  usersAdapter.getSelectors((state) => state.user); //added this one
