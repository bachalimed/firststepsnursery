// //not an API slice but a traditional slice to work with redux this where we devide our state for the academic years

// import { createSlice, createEntityAdapter  } from '@reduxjs/toolkit'


// //const initialState=[] 
// const tasksAdapter = createEntityAdapter()//this was added
// const initialState= tasksAdapter.getInitialState()
// const tasksSlice = createSlice({
//     name: 'task',
//     initialState,

//     reducers: {
//         setTasks: (state, action) => {//get and sort the items
//             tasksAdapter.setAll(state, action.payload)
        
//         },        
       
//         filterTasks: (state, action) => {
//             const { userId } = action.payload
            
//             //console.log('userId', userId)
//             //console.log('state.entities', state.entities)
//             // Filter the entities based on taskCreator or taskResponsible
//             const newTasks = Object.values(state.entities).filter(item => 
//                 item.taskCreator === userId || item.taskResponsible === userId
//             );
//            // console.log('newTasks', newTasks)
        
//             // Rebuild the entities object
//             const newEntities = {}
//             newTasks.forEach(item => {
//                 newEntities[item.id] = item
//             })
//             //console.log('state.entities:', state.entities);
//             //console.log('userId:', userId);
//             // Update the state with the new entities and ids
//             state.entities = newEntities;
//             state.ids = Object.keys(newEntities)
//         },        
//         updateTask: (state, action) => {
//             tasksAdapter.updateOne(state, action.payload)
//         },



        
//     }
// })
// export const { setTasks, updateTask,    filterTasks } = tasksSlice.actions

// export const currentTasksList = (state) => state.tasks
// export default tasksSlice.reducer//to be sent to the store
// // export const { selectAll: selectAllTasks } = tasksAdapter.getSelectors(state => state.tasks)//added this one


