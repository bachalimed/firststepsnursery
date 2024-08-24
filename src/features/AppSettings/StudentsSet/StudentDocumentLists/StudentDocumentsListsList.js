

import { HiOutlineSearch } from 'react-icons/hi'

import DataTable from 'react-data-table-component'
import { useEffect, useState } from "react"
import { Link } from 'react-router-dom'
import { useNavigate } from "react-router-dom"
import { ImProfile } from "react-icons/im"
import { FiEdit } from "react-icons/fi"
import { RiDeleteBin6Line } from "react-icons/ri"
import { setStudentDocumentsLists } from "./studentDocumentsListsSlice"

import useAuth from '../../../../hooks/useAuth'


import { useGetStudentDocumentsListsQuery} from "./studentDocumentListsApiSlice"


import { useSelector, useDispatch } from 'react-redux'

import AcademicsSet from "../../AcademicsSet"

const StudentDocumentsListsList = () => {
  const Navigate = useNavigate()
  const dispatch = useDispatch()
//get several things from the query
const {
  data: studentDocumentsListsData,//the data is renamed studentDocumentsListsData
        isLoading,//monitor several situations is loading...
        isSuccess,
        isError,
        error
} = useGetStudentDocumentsListsQuery('studentDocumentsListsList')||{}//this should match the endpoint defined in your API slice.!! what does it mean?
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
//console.log(studentDocumentsListsData)
const [studentDocumentsLists, setStudentDocumentsListsState] = useState([])
useEffect(()=>{
  // console.log('isLoading:', isLoading)
  // console.log('isSuccess:', isSuccess)
  // console.log('isError:', isError)
  if (isError) {
    console.log('error:', error)
  }
  if (isSuccess ) {
    //console.log('studentDocumentsListsData',studentDocumentsListsData)
    //transform into an array
    const {entities}=studentDocumentsListsData
    const studentDocumentsListsArray =Object.values(entities)
    setStudentDocumentsListsState(studentDocumentsListsArray)
   // console.log('academic years from list call', studentDocumentsListsArray)
    dispatch(setStudentDocumentsLists(entities)); // Dispatch to state  using setALL which will create the ids and entities automatically
    //console.log('studentDocumentsLists',studentDocumentsLists)
  } else {
    //console.log('studentDocumentsListsData is not an array')
  }
}, [isSuccess, studentDocumentsListsData, isError, error, dispatch])

//define the content to be conditionally rendered
const column =[
  { 
name: "ID",
selector:row=>row.id,
sortable:true
 }, 
  { 
name: "Academic Year",
selector:row=>row.documentsAcademicYear,
sortable:true
 }, 

 {name: "Documents Title",
  
  selector:row=>( 
  <div>{row.documentsList.map(doc=> (
    <div key ={doc.documentReference}>{doc.documentTitle}</div>))}
  </div>),
  sortable:true,
  removableRows:true
},
 {name: "Required",
  
  selector:row=>( 
  <div>{row.documentsList.map(doc=> (
    <div key ={doc.documentReference}>{doc.isRequired ? "Yes" : "No"}</div>))}
  </div>),
  sortable:true,
  removableRows:true
},
 {name: "Legalised",
  
  selector:row=>( 
  <div>{row.documentsList.map(doc=> (
    <div key ={doc.documentReference}>{doc.isLegalised? "Yes" : "No"}</div>))}
  </div>),
  sortable:true,
  removableRows:true
},




{ 
  name: "Actions",
  cell: row => (
    <div className="space-x-1">
      
      {canEdit?(<button  className="text-yellow-400" onClick={() => Navigate(`/settings/studentsSet/studentDocumentsList/edit/${row.id}`)}  > 
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
    data={studentDocumentsLists}
    pagination
    selectableRows
    removableRows
    pageSizeControl>
   </DataTable>
   <div className="flex justify-end items-center space-x-4">
      
      
		
        <button 
			className="px-3 py-2 bg-yellow-400 text-white rounded"
			onClick={() => Navigate('/settings/studentsSet/newStudentDocumentsList')}
			disabled={selectedRows.length !== 0} // Disable if no rows are selected
      hidden={!canCreate}
			>
			New List
		</button>
     
	</div>

  </div>
  </>
)

}

}
export default StudentDocumentsListsList