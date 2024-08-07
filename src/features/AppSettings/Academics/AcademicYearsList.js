

import { useGetAcademicYearsQuery} from "./academicYearsApiSlice"
import SectionTabs from '../../../Components/Shared/Tabs/SectionTabs'
import DataTable from 'react-data-table-component'

import {    setAcademicYears} from './academicYearsSlice'//use the memoized selector 

import { useSelector, useDispatch } from 'react-redux'
import { useState , useEffect} from 'react'

const AcademicYearsList = () => {
  const dispatch = useDispatch()
//get several things from the query
const {
  data: academicYearsData,//the data is renamed academicYearsData
        isLoading,//monitor several situations is loading...
        isSuccess,
        isError,
        error
} = useGetAcademicYearsQuery('newAcademicYears')//this should match the endpoint defined in your API slice.!! what does it mean?
//we do not want to import from state but from DB

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
  <SectionTabs/>
 
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

  </div>
  </>
)

}

}
export default AcademicYearsList