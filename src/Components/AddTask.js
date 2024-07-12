import { useDispatch } from 'react-redux'
import react, { useState } from 'react'
import { addTask } from '../features/Desk/taskSlice'//this is why we exported the reducer methods  individually, to use them when needed

const AddTask = () => {


    const [input, setInput] = useState('')//statrs with empty string
    const dispatch = useDispatch()

    //create a method to collect information, wrap it and send it to the handler
    const addTaskHandler =(e)=>{
        e.preventDefault() //prevents refreshing all the page automatically

        dispatch(addTask(input))// or dispatch(addTask(({id, text}))
        //refresh the input
        setInput=("")

    }
  return (
    <form onSubmit={addTaskHandler} className="space-x-3 mt-12">
        <input
        type ="text"
        className="bg-gray-800 rounded border border-gray-700 focus:border-indigo-500 
        focus:ring-2 focus:ring-indigo-900 text-base online-none text-gray-100 
        py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
        placeholder="Enter task text..."
        value={input}
        onChange={(e)=>setInput(e.target.value)}
        />
        <button
        type='submit'
        className='text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg'
        > add Tasks
        </button>
    </form>
        
  )
}

export default AddTask