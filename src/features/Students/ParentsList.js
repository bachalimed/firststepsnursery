import React from 'react';

import { useGetParentsQuery } from "./parentsApiSlice"
import { useGetUsersQuery} from "../Admin/usersApiSlice"
import SectionTabs from '../../Components/Shared/Tabs/SectionTabs'
import DataTable from 'react-data-table-component'
import { useSelector } from 'react-redux'
import { selectParentById, selectAllParents } from './parentsApiSlice'//use the memoized selector 
import { selectAllUsers, selectUserById } from '../Admin/usersApiSlice'//use the memoized selector 


const ParentsList = () => {

//get several things from the query
const {
  data: parents,//the data is renamed parents
        isLoading,//monitor several situations is loading...
        isSuccess,
        isError,
        error
} = useGetParentsQuery(undefined, {//this inside the brackets is using the listeners in store.js to update the data we use on multiple access devices
  pollingInterval: 60000,//will refetch data every 60seconds
  refetchOnFocus: true,//when we focus on another window then come back to the window ti will refetch data
  refetchOnMountOrArgChange: true//refetch when we remount the component
})
const allParents = useSelector(state => selectAllParents(state))

// const {
//   data: users,//the data is renamed parents
      
// } = useGetUsersQuery()
// const allUsers = useSelector(state => selectAllUsers(state))





//define the content to be conditionally rendered

const column =[
  { 
name: "ID",
selector:row=>row._id,
sortable:true
 }, 
 
{name: "Partner",
  selector:row=>row.partner,
  sortable:true
},
{name: "Children",
  selector:row=>row.child.map(c => c.id).join(', '),
  sortable:true
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
 
  <div className=' flex-1 bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200' >
     {/* <div>
    <input type="text" placeholder="search" onChange={handleFilter}/>
   </div> */}
   
   <DataTable
    columns={column}
    data={allParents}
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
export default ParentsList