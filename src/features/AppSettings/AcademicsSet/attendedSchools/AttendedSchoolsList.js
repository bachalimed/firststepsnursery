

import { HiOutlineSearch } from 'react-icons/hi'

import DataTable from 'react-data-table-component'
import { useEffect, useState } from "react"
import { Link } from 'react-router-dom'
import { useNavigate } from "react-router-dom"
import { ImProfile } from "react-icons/im"
import { FiEdit } from "react-icons/fi"
import { RiDeleteBin6Line } from "react-icons/ri"
import { setAttendedSchools } from "./attendedSchoolsSlice"

import useAuth from '../../../../hooks/useAuth'


import { useGetAttendedSchoolsQuery} from "./attendedSchoolsApiSlice"


import { useSelector, useDispatch } from 'react-redux'

import AcademicsSet from "../../AcademicsSet"

const AttendedSchoolsList = () => {
  const Navigate = useNavigate()
  const dispatch = useDispatch()
//get several things from the query
const {
  data: attendedSchoolsData,//the data is renamed attendedSchoolsData
        isLoading,//monitor several situations is loading...
        isSuccess,
        isError,
        error
} = useGetAttendedSchoolsQuery('attendedSchoolsList')||{}//this should match the endpoint defined in your API slice.!! what does it mean?
//we do not want to import from state but from DB
const [selectedRows, setSelectedRows] = useState([])

// Handler for selecting rows
const handleRowSelected = (state) => {
  setSelectedRows(state.selectedRows)
  //console.log('selectedRows', selectedRows)
}

//handle delete

const handleDelete=()=>{
console.log('deleting')
}




const{canEdit, isAdmin, canDelete, canCreate, status2}=useAuth()
//console.log(attendedSchoolsData)
const [attendedSchools, setAttendedSchoolsState] = useState([])
useEffect(()=>{
  // console.log('isLoading:', isLoading)
  // console.log('isSuccess:', isSuccess)
  // console.log('isError:', isError)
  if (isError) {
    console.log('error:', error)
  }
  if (isSuccess ) {
    //console.log('attendedSchoolsData',attendedSchoolsData)
    //transform into an array
    const {entities}=attendedSchoolsData
    const attendedSchoolsArray =Object.values(entities)
    setAttendedSchoolsState(attendedSchoolsArray)
    //console.log('academic years from list call', attendedSchools)
    dispatch(setAttendedSchools(entities)); // Dispatch to state  using setALL which will create the ids and entities automatically
    //console.log('attendedSchools',attendedSchools)
  } else {
    //console.log('attendedSchoolsData is not an array')
  }
}, [isSuccess, attendedSchoolsData, isError, error, dispatch])

//define the content to be conditionally rendered
const column =[
  { 
name: "ID",
selector:row=>row.id,
sortable:true
 }, 
  { 
name: "School Name",
selector:row=>row.schoolName,
sortable:true
 }, 
  { 
name: "School Type",
selector:row=>row.schoolType,
sortable:true
 }, 
{name: "School City",
  selector:row=>row.schoolCity,
  
  sortable:true
}, 

{ 
  name: "Actions",
  cell: row => (
    <div className="space-x-1">
      
      {canEdit?(<button  className="text-yellow-400" onClick={() => Navigate(`/students/studentsParents/edit/${row.id}`)}  > 
      <FiEdit fontSize={20}/> 
      </button>):null}
      {canDelete?(<button className="text-red-500"  onClick={() => handleDelete(row.id)}>
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

if (isSuccess ) {


  

return (
  <>
  <AcademicsSet/>
 
  <div className=' flex-1 bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200' >
     {/* <div>
    <input type="text" placeholder="search" onChange={handleFilter}/>
   </div> */}
   
   <DataTable
    columns={column}
    data={attendedSchools}
    pagination
    selectableRows
    removableRows
    pageSizeControl>
   </DataTable>
   <div className="flex justify-end items-center space-x-4">
      
      
		
        <button 
			className="px-3 py-2 bg-yellow-400 text-white rounded"
			onClick={() => Navigate('/settings/academicsSet/newSchool')}
			disabled={selectedRows.length !== 0} // Disable if no rows are selected
      hidden={!canCreate}
			>
			New School
		</button>
     
	</div>

  </div>
  </>
)

}

}
export default AttendedSchoolsList