import { useGetUsersQuery } from './usersApiSlice'
import DataTable from 'react-data-table-component'
import { useSelector } from 'react-redux'
import { selectAllUsers } from "./usersApiSlice"//use the memoized selector 
import { useState } from 'react'
import { useDeleteUserMutation } from './usersApiSlice'
import { Link , useNavigate} from 'react-router-dom'
import { HiOutlineSearch } from 'react-icons/hi'
import { FiEdit, FiDelete  } from 'react-icons/fi'
import { RiDeleteBin6Line } from 'react-icons/ri'
import useAuth from "../../../hooks/useAuth"
import UsersManagement from '../UsersManagement'
import { ImProfile } from 'react-icons/im'
import { LiaMaleSolid, LiaFemaleSolid  } from "react-icons/lia";


import { selectParentById } from '../../Students/StudentsAndParents/parentsApiSlice'
import { IoShieldCheckmarkOutline, IoShieldOutline  } from "react-icons/io5";



const UsersList = () => {
//get several things from the query
    const {
        data: users,//the data is deconstructing the  into users
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetUsersQuery('usersList', {//this inside the brackets is using the listeners in store.js to update the data we use on multiple access devices
        pollingInterval: 60000,//will refetch data every 60seconds
        refetchOnFocus: true,//when we focus on another window then come back to the window ti will refetch data
        refetchOnMountOrArgChange: true//refetch when we remount the component
    })

    const [deleteUser, {
      isSuccess: isDelSuccess,
      isError: isDelError,
      error: delerror
  }] = useDeleteUserMutation()
 
const Navigate = useNavigate()
    //get the users fromthe state
    const allUsers = useSelector(state => selectAllUsers(state))
    //prepare the permission variables
    const{canEdit, canDelete, canAdd, canCreate, isParent, status2}=useAuth()

  // State to hold selected rows
  const [selectedRows, setSelectedRows] = useState([])

  //state to hold the search query
    const [searchQuery, setSearchQuery] = useState('')
   

    //the serach result data
    const filteredUsers = allUsers?.filter(item => {
      const firstNameMatch = item.userFullName.userFirstName.toLowerCase().includes(searchQuery)
      const middleNameMatch = item.userFullName.userMiddleName.toLowerCase().includes(searchQuery)
      const lastNameMatch = item.userFullName.userLastName.toLowerCase().includes(searchQuery)
      return (Object.values(item).some(val =>
          String(val).toLowerCase().includes(searchQuery.toLowerCase())
      )||firstNameMatch||middleNameMatch||lastNameMatch)
    })

    const handleSearch = (e) => {
        setSearchQuery(e.target.value)
    }


  // Handler for selecting rows
  const handleRowSelected = (state) => {
    setSelectedRows(state.selectedRows)
    //console.log('selectedRows', selectedRows)
  }
  
//handle edit
const handleEdit=(id)=>{
    Navigate(`/admin/usersManagement/${id}/`)//the path to be set in app.js and to be checked with server.js in backend, this is editing page of user
}

  const onDeleteUserClicked = async (id) => {    
    await deleteUser({ id })
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

  const errContent = (error?.data?.message || delerror?.data?.message) ?? ''
  const column =[
    { 
      name: "#", // New column for entry number
      cell: (row, index) => index + 1, // Display the index + 1 (for 1-based numbering)
      sortable: false,
      width: '50px',
      
    }, 
    //show this column only if user is a parent and not employee
  
    { 
  name: "Active",
  selector:row=>row.userIsActive ,
  cell: row => (
    <span>
      {row.userIsActive ? (
        <IoShieldCheckmarkOutline className='text-green-500 text-2xl' />
      ) : (
        <IoShieldOutline  className='text-yellow-400 text-2xl' />
      )}
    </span>
  ),
  sortable:true,
  width:'80px'
   }, 
   { 
 name: "Sex",
 selector:row=>row.userSex,
 cell: row => (
  <span>
    {row.userSex==='Male' ? (
      <LiaMaleSolid className='text-blue-500 text-2xl' />
    ) : (
      <LiaFemaleSolid  className='text-red-500 text-2xl' />
    )}
  </span>
),
 sortable:true,
 width:'70px'
  }, 
    { 
  name: "ID",
  selector:row=>( <Link to={`/admin/usersManagement/userDetails/${row._id}`} >{row._id} </Link> ),
  sortable:true,
  width:'200px'
   }, 
    { 
  name: "Username",
  selector:row=>( <Link to={`/admin/usersManagement/userDetails/${row._id}`}> {row.username}</Link>),
  sortable:true,
  width:'120px'
   }, 
    { 
  name: "first Name",
  selector:row=>( <Link to={`/admin/usersManagement/userDetails/${row._id}`}> {row.userFullName.userFirstName+" "+row.userFullName.userMiddleName}</Link>),
  sortable:true,
  width:'150px'
   }, 
    { 
  name: "Last Name",
  selector:row=>( <Link to={`/admin/usersManagement/userDetails/${row._id}`}> {row.userFullName.userLastName}</Link>),
  sortable:true,
  width:'150px'
   }, 
   
  {name: "DOB",
    selector:row=>new Date(row.userDob).toLocaleString('en-US', { day: 'numeric', month: 'numeric', year: 'numeric' }),
    width:'100px',
    sortable:true
  }, 
  {name: "Employee ?",
    selector:row=>row.isEmployee,
    sortable:true,
    width:'200px'
  }, 
  {name: "Parent?",
    selector:row=>row.isParent,
    sortable:true,
    width:'200px'
  }, 
  {name: "user Roles",
    selector:row=>row.userRoles,
    sortable:true,
    width:'150px'
  },
  {name: "Actions Allowed",
    selector:row=>row.userAllowedActions,
    sortable:true,
    width:'150px'
  },
  { 
    name: "Manage",
    cell: row => (
      <div className="space-x-1">
       <button className="text-blue-500" fontSize={20}  onClick={() => Navigate(`userDetails/${row._id}`)}  > 
        <ImProfile fontSize={20}/> 
        </button>
        {/* /////////////////////condition is canEdit and not ! of it */}
        {canEdit?(<button className="text-yellow-400"  onClick={() => Navigate(`/admin/usersManagement/${row._id}/`)}  > 
        <FiEdit fontSize={20}/> 
        </button>):null}
        {canDelete?(<button className="text-red-500" onClick={() => onDeleteUserClicked(row._id)} >
          <RiDeleteBin6Line fontSize={20}/>
        </button>):null}
      </div>
    ),
    ignoreRowClick: true,
    
    button: true,
  }
  ]
  let content
  
  if (isLoading) content = <p>Loading...</p>
  
  if (isError) {
      content = <p className="errmsg">{error?.data?.message}</p>//errormessage class defined in the css, the error has data and inside we have message of error
  }
  
  if (isSuccess||isDelSuccess) {
  
  content= (
    <>
    <UsersManagement/>
      <div className='relative h-10 mr-2 '>
				<HiOutlineSearch fontSize={20} className='text-gray-400 absolute top-1/2 -translate-y-1/2 left-3'/>
				<input type='text'  value={searchQuery} onChange= {handleSearch} className='text-sm focus:outline-none active:outline-none mt-1 h-8 w-[24rem] border border-gray-300 rounded-md px-4 pl-11 pr-4'/>
			</div>
    <div className=' flex-1 bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200' >
     
     <DataTable
      columns={column}
      data={filteredUsers}
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
        hidden={!canCreate}
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

export default UsersList