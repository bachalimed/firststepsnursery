import React from 'react';

import { useGetStudentsQuery } from "./studentsApiSlice"
import SectionTabs from '../../Components/Shared/Tabs/SectionTabs'
import DataTable from 'react-data-table-component'
import { useSelector } from 'react-redux';
import { selectStudentById, selectAllStudents } from './studentsApiSlice'//use the memoized selector 

const StudentsList = () => {

//get several things from the query
const {
  data: students,//the data is renamed students
        isLoading,//monitor several situations is loading...
        isSuccess,
        isError,
        error
} = useGetStudentsQuery()
const allStudents = useSelector(state => selectAllStudents(state))

//define the content to be conditionally rendered

const column =[
  { 
name: "ID",
selector:row=>row._Id,
sortable:true
 }, 
  { 
name: "First Name",
selector:row=>row.studentName.firstName+" " +row.studentName.middleName,
sortable:true
 }, 
  { 
name: "Last Name",
selector:row=>row.studentName.lastName,
sortable:true
 }, 
{name: "DOB",
  selector:row=>row.studentDob,
  
  sortable:true
}, 
{name: "Father",
  selector:row=>row.studentParent.studentFather,
  sortable:true
}, 
{name: "Mother",
  selector:row=>row.studentParent.studentMother,
  sortable:true
}, 
{name: "Sex",
  selector:row=>row.studentSex,
  sortable:true,
  removableRows:true
}
]
let content

if (isLoading) content = <p>Loading...</p>

if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>//errormessage class defined in the css, the error has data and inside we have message of error
}

if (isSuccess) {



}
return (
  <>
  <SectionTabs/>
  <div className=' flex-1 bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200' >
     {/* <div>
    <input type="text" placeholder="search" onChange={handleFilter}/>
   </div> */}
   {console.log("success3")} 
   <DataTable
    columns={column}
    data={allStudents}
    pagination
    selectableRows
    removableRows
    pageSizeControl>
   </DataTable>

  </div>
  </>
)



}
export default StudentsList