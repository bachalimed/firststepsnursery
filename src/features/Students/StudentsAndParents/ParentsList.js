import React from 'react';
import { HiOutlineSearch } from 'react-icons/hi'
import { useGetParentsQuery } from "./parentsApiSlice"
import { useGetUsersQuery} from "../../Admin/UsersManagement/usersApiSlice"
import StudentsParents from '../StudentsParents'
import DataTable from 'react-data-table-component'
import { useSelector } from 'react-redux'
import { selectParentById, selectAllParents } from './parentsApiSlice'//use the memoized selector 
import { selectAllUsers, selectUserById } from '../../Admin/UsersManagement/usersApiSlice'//use the memoized selector 
import { useState, useEffect } from "react"
import { Link , useNavigate} from 'react-router-dom'
import { useDeleteParentMutation } from './parentsApiSlice'
import { FiEdit, FiDelete  } from 'react-icons/fi'
import { RiDeleteBin6Line } from 'react-icons/ri'
import useAuth from "../../../hooks/useAuth"
import { ImProfile } from 'react-icons/im'
import { IoShieldCheckmarkOutline, IoShieldOutline  } from "react-icons/io5"

const ParentsList = () => {

//get several things from the query
const {
  data: parents,//the data is renamed parents
  isLoading: isParentLoading,//monitor several situations
  isSuccess: isParentSuccess,
  isError: isParentError,
  error: parentError
} = useGetParentsQuery('parentsList', {//this inside the brackets is using the listeners in store.js to update the data we use on multiple access devices
  pollingInterval: 60000,//will refetch data every 60seconds
  refetchOnFocus: true,//when we focus on another window then come back to the window ti will refetch data
  refetchOnMountOrArgChange: true//refetch when we remount the component
})
const allParents = useSelector(state => selectAllParents(state))
//console.log('allParents', allParents)







// const {
//   data: users,//the data is renamed parents
//   isLoading: isUserLoading,//monitor several situations
//   isSuccess: isUserSuccess,
//   isError: isUserError,
//   error: userError    
// } = useGetUsersQuery()
// const allUsers = useSelector(state => selectAllUsers(state))
// console.log('allUsers', allUsers)
const Navigate = useNavigate()
    const [parentYear, setParentYear] = useState('')
    const [childrenList, setChildrenList] = useState('')
    const [partner, setPartner] = useState('')
    const[individual, setIndividual]=useState({})
 const {canEdit, canDelete, }=useAuth()

    const [deleteParent, {
      isSuccess: isDelSuccess,
      isError: isDelError,
      error: delerror
  }] = useDeleteParentMutation()




  // State to hold selected rows
  const [selectedRows, setSelectedRows] = useState([])
//state to hold the search query
const [searchQuery, setSearchQuery] = useState('')
//the serach result data
const filteredParents = allParents.filter(item => {
  //the nested objects need extra logic to separate them
   //const firstNameMatch = item.studentName.firstName.toLowerCase().includes(searchQuery)
   //const middleNameMatch = item.studentName.middleName.toLowerCase().includes(searchQuery)
   //const lastNameMatch = item.studentName.lastName.toLowerCase().includes(searchQuery)
  return Object.values(item).some(val =>
      String(val).toLowerCase().includes(searchQuery.toLowerCase())
  )
  // ||firstNameMatch||middleNameMatch||lastNameMatch)
      //||firstNameMatch||middleNameMatch||lastNameMatch)
})
const handleSearch = (e) => {
  setSearchQuery(e.target.value)
}

//console.log('filtered', filteredParents)


// Handler for selecting rows
const handleRowSelected = (state) => {
setSelectedRows(state.selectedRows)
//console.log('selectedRows', selectedRows)
}

//handle edit
const handleEdit=(id)=>{
Navigate(`/students/studentsParents/students/${id}/`)//the path to be set in app.js and to be checked with server.js in backend, this is editing page of user
}

const onDeleteParentClicked = async (id) => {    
await deleteParent({ id })
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
//console.log('Selected Rows to detail:', selectedRows)
// Add  delete logic here (e.g., dispatching a Redux action or calling an API)
//ensure only one can be selected: the last one
const toDuplicate = selectedRows[-1]

setSelectedRows([]); // Clear selection after delete
}

const errContent = (isParentError?.data?.message || isDelError?.data?.message) ?? ''
//define the content to be conditionally rendered

const column =[
  { 
    name: "#", // New column for entry number
    cell: (row, index) => index + 1, // Display the index + 1 (for 1-based numbering)
    sortable: false,
    width: '50px',
    
  },
  
  
  { name: "first Name",
  selector:row=>( <Link to={`/changepath/${row._id}`}> {row.userProfile.userFullName.userFirstName+" "+row.userProfile.userFullName.userMiddleName}</Link>),
  sortable:true,
  width:'150px'
  }, 
  { 
  name: "Last Name",
  selector:row=>( <Link to={`/change path/${row._id}`}> {row.userProfile.userFullName.userLastName}</Link>),
  sortable:true,
  width:'150px'
  },
 

   {name: "DOB",
    selector:row=>new Date(row.userProfile.userDob).toLocaleString('en-US', { day: 'numeric', month: 'numeric', year: 'numeric' }),
    width:'100px',
    sortable:true
  },  

 
{name: "Contact",
  selector:row=>row.userProfile.userContact.primaryPhone,
  sortable:true
},
{name: "Situation",
  selector:row=>row.children[0].studentJointFamily?'Jointe':'Separation',
  sortable:true
},
{name: "Children",
  selector:row=>row.children[0].studentName.firstName+row.children[0].studentName.middleName,
  sortable:true
},
{ 
  name: "Manage",
  cell: row => (
    <div className="space-x-1">
     <button className="text-blue-500" fontSize={20}  onClick={() => Navigate(`userDetails/${row._id}`)}  > 
      <ImProfile fontSize={20}/> 
      </button>
      {/* /////////////////////condition is canEdit and not ! of it */}
      {canEdit?(<button className="text-yellow-400"  onClick={() => handleEdit(row._id)}  > 
      <FiEdit fontSize={20}/> 
      </button>):null}
      {canDelete?(<button className="text-red-500" onClick={() => onDeleteParentClicked(row._id)} >
        <RiDeleteBin6Line fontSize={20}/>
      </button>):null}
    </div>
  ),
  ignoreRowClick: true,
  
  button: true,
}


]
let content

if (isParentLoading) content = <p>Loading...</p>

if (isParentError|isDelError) {
    content = <p className="errmsg">error msg{parentError?.data?.message}</p>//errormessage class defined in the css, the error has data and inside we have message of error
}

if (isParentSuccess||isDelSuccess) {

  //console.log('filtered and success', filteredParents)

content= (
  <>
  <StudentsParents/>
  <div className='relative h-10 mr-2 '>
				<HiOutlineSearch fontSize={20} className='text-gray-400 absolute top-1/2 -translate-y-1/2 left-3'/>
				<input type='text'  value={searchQuery} onChange= {handleSearch} className='text-sm focus:outline-none active:outline-none mt-1 h-8 w-[24rem] border border-gray-300 rounded-md px-4 pl-11 pr-4'/>
			</div>
  <div className=' flex-1 bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200' >
     {/* <div>
    <input type="text" placeholder="search" onChange={handleFilter}/>
   </div> */}
   
   <DataTable
    columns={column}
    data={filteredParents}
    pagination
    selectableRows
    removableRows
    pageSizeControl>
   </DataTable>
   <div className="flex justify-end items-center space-x-4">
          <button 
              className=" px-4 py-2 bg-green-500 text-white rounded"
              onClick={handleDetailsSelected}
              disabled={selectedRows.length !== 1} // Disable if no rows are selected
                >
              User Details
            </button>
          
          <button 
              className="px-3 py-2 bg-yellow-400 text-white rounded"
              onClick={handleDuplicateSelected}
              disabled={selectedRows.length !== 1} // Disable if no rows are selected
        // hidden={!canCreate}
              >
              Duplicate Selected
          </button>
      </div>
  </div>
  </>
)


}
return content
}
export default ParentsList