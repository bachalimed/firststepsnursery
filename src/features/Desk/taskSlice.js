//responsible of tracking initial state of the store regarding and defining all reducers

import { createSlice, nanoid } from "@reduxjs/toolkit" //nanoid helps track id of created items instead of storing them into arrays and loop through arrays


const initialState={//can be an array or object
    //initial state of tasks is an empty array or we retrieve from the database and store result here
    tasks:[{
        id:"66565565656656565656565",
        taskCreationDate: "2000-12-31T23:00:00.000Z",
        taskPriority: "high",
        taskSubject: "student reminding ",
        taskDescription: "must contact parent and confirm",
        taskCreator: "665ac169b27a97b0efc6a694",
        taskReference: "8877556644778833887766",
        taskDueDate: "2000-12-31T23:00:00.000Z",
        taskResponsible: "kfgk",
        taskAction: {
          actionDate: "2000-12-31T23:00:00.000Z",
          actionDescription: "called parent ana dtalked to him",
          actionReference: "",
          actionResponsible: "jihen",
          actionResult: "positive"
        },
        taskState: "completed",
        taskCompletionDate: "2000-12-31T23:00:00.000Z",
        lastModified: {
          date: "2000-12-31T23:00:00.000Z",
          operator: "665aa583b27a97b0efc6a687"
        },
        taskYear: "2324"
      },
      {
        id:"6656556565665656565nnh",
        taskCreationDate: "2024-12-31T23:00:00.000Z",
        taskPriority: "medium",
        taskSubject: "student admission ",
        taskDescription: "fill the forms and confirm",
        taskCreator: "665ac169b27a97b0efc6a694",
        taskReference: "8877556644778833887766",
        taskDueDate: "2000-12-31T23:00:00.000Z",
        taskResponsible: "kfgk",
        taskAction: {
          actionDate: "2000-12-31T23:00:00.000Z",
          actionDescription: "called parent ana dtalked to him",
          actionReference: "",
          actionResponsible: "jihen",
          actionResult: "positive"
        },
        taskState: "completed",
        taskCompletionDate: "2000-12-31T23:00:00.000Z",
        lastModified: {
          date: "2000-12-31T23:00:00.000Z",
          operator: "665aa583b27a97b0efc6a687"
        },
        taskYear: "2425"
      }]
//  tasks:{
//     id:"01",
//     text:"hello world"   
//  }
}

export const taskSlice = createSlice({//the slice contents to be exported:
    name: 'task', //the name of the slice being exported
    initialState, //already defined above
    reducers:{//will talk with the store to update the states
        addTask:(state, action)=>{//state and action are mandatory arguments in a reducer
            const task = { //content is provided from the payload, if payload is an object, use  payload.text
                //id: nanoid(),
                id: action.payload.id, //the id from the database
                taskCreationDate: action.payload.taskCreationDate,
                taskPriority: action.payload.taskPriority,
                taskSubject: action.payload.taskSubject,
                taskDescription: action.payload.taskDescription,
                taskCreator: action.payload.taskCreator,
                taskReference: action.payload.taskReference,
                taskDueDate: action.payload.taskDueDate,
                taskResponsible: action.payload.taskResponsible,
                taskAction: action.payload.taskAction,
                taskState: action.payload.taskState,
                taskCompletionDate: action.payload.taskCompletionDate,
                lastModified: action.payload.lastModified,
                taskYear: action.payload.taskYear
            }
            state.tasks.push(task)//push the task into the initial state empty array tasks
        },
        removeTask:(state, action)=>{//we will filter all the tasks that have not the id provided to be removed we end up with all the others
            state.tasks=state.tasks.filter((task)=>task.id ==!action.payload)
        },
        // updateTask:(state,action)=>{
        //     id:nanoid(),
        //     text:action.payload,
        // }
    }
})

//all the methods in the reducer need to be exported as actions
export const {addTask, removeTask} =taskSlice.actions //individual methods in the reducer
export default taskSlice.reducer //this needs to be imported/wired up to the store it will be called taskReducer