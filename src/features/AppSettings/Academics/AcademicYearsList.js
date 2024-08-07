

import { useGetAcademicYearsQuery } from "./academicYearsApiSlice"
import SectionTabs from '../../../Components/Shared/Tabs/SectionTabs'
import DataTable from 'react-data-table-component'
import { useSelector } from 'react-redux';
import { selectAcademicYearById, selectAllAcademicYears } from './academicYearsApiSlice'//use the memoized selector 
import AcademicYears from "./AcademicYears";

const AcademicYearsList = () => {

//get several things from the query
const {
  data: academicYears,//the data is renamed academicYears
        isLoading,//monitor several situations is loading...
        isSuccess,
        isError,
        error
} = useGetAcademicYearsQuery('academicYearsList')
const allAcademicYears = useSelector(state => selectAllAcademicYears(state))//do we need to put state inside??

//define the content to be conditionally rendered


const column =[
  { 
name: "ID",
selector:row=>row._id,
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
{name: "Current Year",
  selector:row=>row.currentYear === true ? 'Yes' : 'No',
  sortable:true
}, 
{name: "Creator",
  selector:row=>row.academicYearCreator,
  sortable:true
}, 
{name: "Action",
  selector:null,
  
  removableRows:true
}
]
let content

if (isLoading) content = <p>Loading...</p>

if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>//errormessage class defined in the css, the error has data and inside we have message of error
}

if (isSuccess) {




return (
  <>
  <SectionTabs/>
  <AcademicYears />{/*just to test teh component */}
  <div className=' flex-1 bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200' >
     {/* <div>
    <input type="text" placeholder="search" onChange={handleFilter}/>
   </div> */}
   
   <DataTable
    columns={column}
    data={allAcademicYears}
    pagination
    selectableRows
    removableRows
    pageSizeControl>
   </DataTable>

  </div>
  </>
)

}

}
export default AcademicYearsList