

import DataTable from 'react-data-table-component'
import { useEffect, useState } from "react"

import { useNavigate } from "react-router-dom"
import { FiEdit } from "react-icons/fi"
import { RiDeleteBin6Line } from "react-icons/ri"
import { setAcademicYears } from "./academicYearsSlice"
import { useSelectedAcademicYear } from "../../../../hooks/useSelectedAcademicYears"
import useAuth from '../../../../hooks/useAuth'
import { useGetAcademicYearsQuery} from "./academicYearsApiSlice"
import { useSelector, useDispatch } from 'react-redux'
import AcademicsSet from "../../AcademicsSet"

const AcademicYearsList = () => {
  const Navigate = useNavigate()
  const dispatch = useDispatch()
//get several things from the query
const {
  data: academicYearsData,//the data is renamed academicYearsData
        isLoading,//monitor several situations is loading...
        isSuccess,
        isError,
        error
} = useGetAcademicYearsQuery('academicYearsList')//this should match the endpoint defined in your API slice.!! what does it mean?
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

const handleNextSelected = () => {
  console.log('Selected Rows to duplicate forward:', selectedRows);
  // Add  delete logic here (e.g., dispatching a Redux action or calling an API)
//ensure only one can be selected: the last one
const toDuplicate = selectedRows[-1]

  setSelectedRows([]); // Clear selection after delete
}



const{canEdit, isAdmin, canDelete, canCreate, status2}=useAuth()
//console.log(academicYearsData)
const [academicYears, setAcademicYearsState] = useState([])
useEffect(()=>{
  // console.log('isLoading:', isLoading)
  // console.log('isSuccess:', isSuccess)
  // console.log('isError:', isError)
  if (isError) {
    console.log('error:', error)
  }
  if (isSuccess ) {
    //console.log('academicYearsData',academicYearsData)
    //transform into an array
    const {entities}=academicYearsData
    const academicYearsArray =Object.values(entities)
    setAcademicYearsState(academicYearsArray)
    //console.log('academic years from list call', academicYears)
    dispatch(setAcademicYears(entities)); // Dispatch to state  using setALL which will create the ids and entities automatically
    //console.log('academicYears',academicYears)
  } else {
    //console.log('academicYearsData is not an array')
  }
}, [isSuccess, academicYearsData, isError, error, dispatch])

//define the content to be conditionally rendered
const column =[
  { 
name: "ID",
selector:row=>row.id,
sortable:true
 }, 
  { 
name: "Title",
selector:row=>row.title,
sortable:true
 }, 
  { 
name: "Academic Year start",
selector:row=>new Date(row.yearStart).toLocaleString('en-US', { day: 'numeric', month: 'numeric', year: 'numeric' }),
sortable:true
 }, 
{name: "Academic Year End",
  selector:row=>new Date(row.yearEnd).toLocaleString('en-US', { day: 'numeric', month: 'numeric', year: 'numeric' }),
  
  sortable:true
}, 

{name: "Creator",
  selector:row=>row.academicYearCreator,
  sortable:true
}, 
{name: "Action",
  selector:null,
  
  removableRows:true
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
    data={academicYears}
    pagination
    selectableRows
    removableRows
    pageSizeControl>
   </DataTable>
   <div className="flex justify-end items-center space-x-4">
      
      
		
        <button 
			className="px-3 py-2 bg-yellow-400 text-white rounded"
			onClick={() => Navigate('/settings/academicsSet/newAcademicYear')}
			disabled={selectedRows.length !== 0} // Disable if no rows are selected
      hidden={!canCreate}
			>
			New academic Year
		</button>
     
	</div>

  </div>
  </>
)

}

}
export default AcademicYearsList