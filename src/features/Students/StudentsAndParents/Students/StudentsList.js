

import {  useGetStudentsQuery, useGetStudentsByYearQuery } from "./studentsApiSlice"
import { HiOutlineSearch } from 'react-icons/hi'
import StudentsParents from "../../StudentsParents"
import DataTable from 'react-data-table-component'
import { useSelector } from 'react-redux'
import {  selectAllStudentsByYear, selectAllStudents } from './studentsApiSlice'//use the memoized selector 
import { useEffect, useState } from "react"
import { Link } from 'react-router-dom'
import { useNavigate } from "react-router-dom"
import { ImProfile } from "react-icons/im"
import { FiEdit } from "react-icons/fi"
import { RiDeleteBin6Line } from "react-icons/ri"
import { setAcademicYears } from "../../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice"
import { useSelectedAcademicYear } from "../../../../hooks/useSelectedAcademicYears"
import useAuth from '../../../../hooks/useAuth'
import getCurrentAcademicYear from '../../../../config/CurrentYear'
import { LiaMaleSolid, LiaFemaleSolid  } from "react-icons/lia";
import { useDispatch } from "react-redux"
import { setSomeStudents, setStudents, currentStudentsList } from "./studentsSlice"
import { IoDocumentAttachOutline } from "react-icons/io5";


const StudentsList = () => {
//this is for the academic year selection
  const selectedAcademicYear = useSelectedAcademicYear()
  const [selectedYear, setSelectedYear]=useState('')
  
  const Navigate = useNavigate()
  const Dispatch = useDispatch()



  const {
    data: students,//the data is renamed students
          isLoading,//monitor several situations is loading...
          isSuccess,
          isError,
          error
  } = useGetStudentsByYearQuery({selectedYear:selectedYear ,endpointName: 'studentsList'}||{},{//this param will be passed in req.params to select only students for taht year
    //this inside the brackets is using the listeners in store.js to update the data we use on multiple access devices
    //pollingInterval: 60000,//will refetch data every 60seconds
    refetchOnFocus: true,//when we focus on another window then come back to the window ti will refetch data
    refetchOnMountOrArgChange: true//refetch when we remount the component
  })

//this ensures teh selected year is chosen before running hte useeffect it is working perfectly to dispaptch the selected year
  useEffect(() => {
    if (selectedAcademicYear?.title) {
      setSelectedYear(selectedAcademicYear.title)
      //console.log('Selected year updated:', selectedAcademicYear.title)
    }
  }, [selectedAcademicYear])
console.log('selectedAcademicYear',selectedAcademicYear)

  // const myStu = useSelector(state=> state.student)
  // console.log(myStu, 'mystu')

  //const allStudents = useSelector(selectAllStudents)// not the same cache list we re looking for this is from getstudents query and not getstudentbyyear wuery

//console.log('allStudents from the state by year',allStudents)
  // State to hold selected rows
  const [selectedRows, setSelectedRows] = useState([])
//state to hold the search query
const [searchQuery, setSearchQuery] = useState('')
//const [filteredStudents, setFilteredStudents] = useState([])
 //we need to declare the variable outside of if statement to be able to use it outside later
  let studentsList =[]
let filteredStudents = []
  if (isSuccess){
    
    //set to the state to be used for other component s and edit student component
    
    const {entities}=students
    
    //we need to change into array to be read??
    studentsList = Object.values(entities)//we are using entity adapter in this query
    Dispatch(setSomeStudents(studentsList))//timing issue to update the state and use it the same time
    
   
    //the serach result data
   filteredStudents = studentsList?.filter(item => {
  //the nested objects need extra logic to separate them
  const firstNameMatch = item?.studentName?.firstName.toLowerCase().includes(searchQuery.toLowerCase())
  const middleNameMatch = item?.studentName?.middleName.toLowerCase().includes(searchQuery.toLowerCase())
  const lastNameMatch = item?.studentName?.lastName.toLowerCase().includes(searchQuery.toLowerCase())
  //console.log('filteredStudents in the success', item)
  return (Object.values(item).some(val =>
    String(val).toLowerCase().includes(searchQuery.toLowerCase())
  )||firstNameMatch||middleNameMatch||lastNameMatch)
})
}

//console.log('the studentsList after if ', studentsList)
//console.log('the filteredStudents afyter if ', filteredStudents)


//import students

const{canEdit, isAdmin, canDelete, canCreate, status2}=useAuth()
// console.log('in student list canEdit', canEdit)
// console.log('canDelete', canDelete)
// console.log('canAdd', canAdd)
// console.log('canCreate', canCreate)
// console.log('isParent', isParent)
// console.log('status2', status2)

const handleAllStudents = (e)=>{

}
   



const handleSearch = (e) => {
    setSearchQuery(e.target.value)
}
  // Handler for selecting rows
  const handleRowSelected = (state) => {
    setSelectedRows(state.selectedRows)
    //console.log('selectedRows', selectedRows)
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
selector:row=>( <Link to={`/students/studentsParents/student/studentDetails/${row.id}`} >{row.id} </Link> ),
sortable:true,
width:'200px'
 }, 
 { 
  name: "Sex",
  selector:row=>row.studentSex,//changed from userSex
  cell: row => (
   <span>
     {row.studentSex==='Male' ? (
       <LiaMaleSolid className='text-blue-500 text-2xl' />
     ) : (
       <LiaFemaleSolid  className='text-red-500 text-2xl' />
     )}
   </span>
 ),
  sortable:true,
  removableRows:true,
  width:'70px'
  }, 
  { 
name: "First Name",
selector:row=>( <Link to={`/students/studentsParents/student/studentDetails/${row.id}`}> {row.studentName.firstName+" "+row.studentName.middleName}</Link>
  
),
sortable:true,
width:'180px'
 }, 
  { 
name: "Last Name",
selector:row=>(
  <Link to={`/students/studentsParents/student/studentDetails/${row.id}`}>
  {row.studentName.lastName}
  </Link>
  ),
sortable:true
 }, 
{name: "DOB",
  selector:row=>new Date(row.studentDob).toLocaleString('en-US', { day: 'numeric', month: 'numeric', year: 'numeric' }),
  
  sortable:true
}, 
// {name: "Father",
//   selector:row=>row.studentFather._id,
//   sortable:true
// }, 
// {name: "Mother",
//   selector:row=>row.studentMother._id,
//   sortable:true
// }, 


{name: "Student Years",
  
  selector:row=>( 
  <div>{row.studentYears.map(year=> (
    <div key ={year.academicYear}>{year.academicYear}</div>))}
  </div>),
  sortable:true,
  removableRows:true
},
{name: "Documents",
  selector:row=>( <Link to={`/students/studentsParents/studentDocumentsList/${row.id}`} > <IoDocumentAttachOutline className='text-gray-500 text-2xl'/></Link> ),
  sortable:true,
  removableRows:true,
  width:'120px',
},


{ 
  name: "Actions",
  cell: row => (
    <div className="space-x-1">
      <button className="text-blue-500" fontSize={20}  onClick={() => Navigate(`/students/studentsParents/student/studentDetails/${row.id}`)}  > 
        <ImProfile fontSize={20}/> 
        </button>
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
 //if (isSuccess){

 content = 
  <>

  <StudentsParents/>
      <div className='relative h-10 mr-2 '>
				<HiOutlineSearch fontSize={20} className='text-gray-400 absolute top-1/2 -translate-y-1/2 left-3'/>
				<input type='text'  value={searchQuery} onChange= {handleSearch} className='text-sm focus:outline-none active:outline-none mt-1 h-8 w-[24rem] border border-gray-300 rounded-md px-4 pl-11 pr-4'/>
			</div>
  <div className=' flex-1 bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200' >
    
   
   <DataTable
    columns={column}
    data={filteredStudents}
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
            Student Details
          </button>
      
		
        <button 
			className="px-3 py-2 bg-yellow-400 text-white rounded"
			onClick={handleDuplicateSelected}
			disabled={selectedRows.length !== 1} // Disable if no rows are selected
      hidden={!canCreate}
			>
			Duplicate Selected
		</button>
     {(isAdmin&&<button 
			className="px-3 py-2 bg-gray-400 text-white rounded"
			onClick={handleDuplicateSelected}
			disabled={selectedRows.length !== 1} // Disable if no rows are selected
      hidden={!canCreate}
			>
			All
		</button>)}
	</div>

  </div>
  </>
//}
return content
    
 }
  export default StudentsList