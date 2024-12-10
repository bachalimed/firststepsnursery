

import { useGetTasksQuery, useGetTasksByUserIdQuery } from "./tasksApiSlice"
import Tasks from "../Tasks"
import DataTable from 'react-data-table-component'
import { useSelector, useDispatch } from 'react-redux'
import {  selectAllTasks } from './tasksApiSlice'//use the memoized selector 
import {  filterTasks, setTasks } from './tasksSlice'//use the memoized selector 
import { useState, useEffect } from "react"
import { Link } from 'react-router-dom'
import { useNavigate } from "react-router-dom"
import { FiEdit, FiCheckSquare  } from "react-icons/fi"
import { RiDeleteBin6Line } from "react-icons/ri"
import useAuth from '../../../hooks/useAuth'
import {PRIORITY, ICONS} from '../../../config/PRIORITY'


const MyTasksList = () => {
  const dispatch = useDispatch()
  const{userId, username, userRoles, canEdit, canDelete, canAdd, canCreate, status1, status2, isEmployee, isManager, isParent, isContentManager, isAnimator, isAcademic, isFinance, isHR, isDesk, isDirector,  isAdmin}=useAuth()

 
  const Navigate = useNavigate()
  //const allTasks = useSelector(state => selectAllTasks(state))
  const allTasks = useSelector(selectAllTasks)//this works
  //const updateState = setTasks(allTasks)
  console.log("allTasks",allTasks)
  console.log('userId', userId)
//filter the tasks of the user only
useEffect(() => {
  
  dispatch(filterTasks({userId}))//the userId is properly passed in
  
}, [userId, allTasks])

//control what user can see, update(modify), delete(remove), close a task 



  // State to hold selected rows
  const [selectedRows, setSelectedRows] = useState([])

  // Handler for selecting rows
  const handleRowSelected = (state) => {
    setSelectedRows(state.selectedRows)
    //console.log('selectedRows', selectedRows)
  }
  //check permissions
  // const canModify = canEdit&&(username===)




//handle edit

const handleEdit=(e)=>{
  Navigate(`/desk/tasks/${e}`)//the path to be set in app.js and to be checked with server.js in backend, this is editing page of 
}
//handle delete
const handleClose=(e)=>{
  Navigate(`/desk/tasks/${e}`)//the path to be set in app.js and to be checked with server.js in backend, this is editing page of 
}
//handle delete

const handleDelete=()=>{
console.log('deleting')
}
  // Handler for deleting selected rows
  const handleDeleteSelected = () => {
    console.log('Selected Rows to delete:', selectedRows)
    // Add  delete logic here (e.g., dispatching a Redux action or calling an API)


    setSelectedRows([]) // Clear selection after delete
  }

  // Handler for duplicating selected rows, 
  const handleDuplicateSelected = () => {
    console.log('Selected Rows to duplicate:', selectedRows);
    // Add  delete logic here (e.g., dispatching a Redux action or calling an API)
//ensure only one can be selected: the last one
const toDuplicate = selectedRows[-1]

    setSelectedRows([]); // Clear selection after delete
  }
  
  // Handler for duplicating selected rows, 
  const handleDetailsSelected = () => {
    console.log('Selected Rows to detail:', selectedRows)
    // Add  delete logic here (e.g., dispatching a Redux action or calling an API)
//ensure only one can be selected: the last one
const toDuplicate = selectedRows[-1]

    setSelectedRows([]); // Clear selection after delete
  }


const column =[
  { 
    name: "#", // New column for entry number
    cell: (row, index) => index + 1, // Display the index + 1 (for 1-based numbering)
    sortable: false,
    width: '50px',
    
  }, 
  //show this column only if user is a parent and not employee

  (status2)&&{ 
name: "ID",
selector:row=>( <Link to={`/desk/tasks/taskDetails/:${row._id}`} >{row._id} </Link> ),
sortable:true
 }, 
  { 
name: "Subject",
selector:row=>( <Link to={`/desk/tasks/taskDetails/:${row._id}`}> {row.taskSubject}</Link>),
sortable:true
 }, 
  { 
name: "Description",
selector:row=>(
  <Link to={`/desk/tasks/taskDetails/:${row._id}`}>
  {row.taskDescription}
  </Link>
  ),
sortable:true
 }, 
{name: "Priority",
  
  selector:row=>row.taskPriority,
  cell: row => ICONS[row.taskPriority],
  sortable:true
}, 
{name: "Creator",
  selector:row=>row.taskCreator,
  sortable:true
}, 
{name: "Due Date",
  selector:row=>new Date(row.taskDueDate).toLocaleString('en-US', { day: 'numeric', month: 'numeric', year: 'numeric' }),
  sortable:true
}, 
{name: "Responsible",
  selector:row=>row.taskResponsible,
  sortable:true,
  removableRows:true
},
{name: "Reference",
  selector:row=>row.taskReference,
  sortable:true,
  removableRows:true
},
{name: "Completion Date",
  selector:row=>new Date(row.taskCompletionDate).toLocaleString('en-US', { day: 'numeric', month: 'numeric', year: 'numeric' }),
  sortable:true,
  removableRows:true
},
{name: "Actions performed",
  selector:row=>row.taskAction.length,
  sortable:true,
  removableRows:true
},

{ 
  name: "Actions",
  cell: row => (
    <div className="space-x-1">
      {canEdit?(<button   onClick={() => handleClose(row._id)} className="" > 
      <FiCheckSquare className="text-green-500" fontSize={20}/> 
      </button>):null}
      {canEdit?(<button className="text-amber-300"  onClick={() => handleEdit(row._id)}  > 
      <FiEdit fontSize={20}/> 
      </button>):null}
      {canEdit?(<button className="text-red-600" onClick={() => handleDelete(row._id)} >
        <RiDeleteBin6Line fontSize={20}/>
      </button>):null}
    </div>
  ),
  ignoreRowClick: true,
  
  button: true,
}
]
let content


 content =  
  <>
  <Tasks/>
  <div className=' flex-1 bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200' >
     {/* <div>
    <input type="text" placeholder="search" onChange={handleFilter}/>
   </div> */}
   
   <DataTable
    columns={column}
    data={allTasks}
    pagination
    selectableRows
    removableRows
    pageSizeControl
    onSelectedRowsChange={handleRowSelected}
    selectableRowsHighlight
    >
	</DataTable>
	<div className="flex justify-end items-center space-x-4">
        <button 
            className=" px-4 py-2 bg-green-600 text-white rounded"
            onClick={handleDetailsSelected}
            disabled={selectedRows.length !== 1} // Disable if no rows are selected
          	>
            Task Details
          </button>
       
        <button 
			className="px-3 py-2 bg-amber-300 text-white rounded"
			onClick={handleDuplicateSelected}
			disabled={selectedRows.length !== 1} // Disable if no rows are selected
      hidden={!canCreate}
			>
			Duplicate Selected
		</button>
	</div>

  </div>
  </>



return content

}
export default MyTasksList