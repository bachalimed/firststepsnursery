

import { HiOutlineSearch } from 'react-icons/hi'

import DataTable from 'react-data-table-component'
import { useEffect, useState } from "react"
import { Link } from 'react-router-dom'
import { useNavigate } from "react-router-dom"
import { ImProfile } from "react-icons/im"
import { FiEdit } from "react-icons/fi"
import { RiDeleteBin6Line } from "react-icons/ri"
import { setClassrooms } from "./classroomsSlice"
import DeletionConfirmModal from "../../../../Components/Shared/Modals/DeletionConfirmModal";
import useAuth from '../../../../hooks/useAuth'


import { useGetClassroomsQuery,  useDeleteClassroomMutation,} from "./classroomsApiSlice"


import { useSelector, useDispatch } from 'react-redux'

import AcademicsSet from "../../AcademicsSet"

const ClassroomsList = () => {
  const Navigate = useNavigate()
  const dispatch = useDispatch()
//get several things from the query
const {
  data: classroomsData,//the data is renamed classroomsData
        isLoading,//monitor several situations is loading...
        isSuccess,
        isError,
        error
} = useGetClassroomsQuery('classroomsList')||{}//this should match the endpoint defined in your API slice.!! what does it mean?
//we do not want to import from state but from DB
const [selectedRows, setSelectedRows] = useState([])

const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for modal
  const [idClassroomToDelete, setIdClassroomToDelete] = useState(null); // State to track which document to delete

  //initialising the delete Mutation
  const [
    deleteClassroom,
    {
      isLoading: isDelLoading,
      isSuccess: isDelSuccess,
      isError: isDelError,
      error: delerror,
    },
  ] = useDeleteClassroomMutation();

  // Function to handle the delete button click
  const onDeleteClassroomClicked = (id) => {
    setIdClassroomToDelete(id); // Set the document to delete
    setIsDeleteModalOpen(true); // Open the modal
  };

  // Function to confirm deletion in the modal
  const handleConfirmDelete = async () => {
    await deleteClassroom({ id: idClassroomToDelete });
    setIsDeleteModalOpen(false); // Close the modal
  };

  // Function to close the modal without deleting
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setIdClassroomToDelete(null);
  };


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
//console.log(classroomsData)
//const [classrooms, setClassroomsState] = useState([])

  let classrooms =[]
  if (isSuccess ) {
    //console.log('classroomsData',classroomsData)
    //transform into an array
    const {entities}=classroomsData
     classrooms =Object.values(entities)
    //setClassroomsState(classroomsArray)
    
    //dispatch(setClassrooms(entities)); // Dispatch to state  using setALL which will create the ids and entities automatically
    console.log('classrooms',classrooms)
  } 


//define the content to be conditionally rendered
const column =[
  { 
name: "ID",
selector:row=>row.id,
sortable:true,
width:"210px"
 }, 
  { 
name: "Number",
selector:row=>row.classroomNumber,
sortable:true,
width:"100px"
 }, 
  { 
name: "Label",
selector:row=>row.classroomLabel,
sortable:true,
width:"140px"
 }, 
  { 
name: "Capacity",
selector:row=>row.classroomCapacity,
sortable:true,
width:"100px"
 }, 
{name: "Max Capacity",
  selector:row=>row.classroomMaxCapacity,
  sortable:true,
  width:"120px"
}, 

{ 
  name: "Actions",
  cell: row => (
    <div className="space-x-1">
      
      {canEdit?(<button  className="text-yellow-400" onClick={() => Navigate(`/settings/academicsSet/editClassroom/${row.id}`)}  > 
      <FiEdit fontSize={20}/> 
      </button>):null}
      {canDelete?(<button className="text-red-500"  onClick={() => onDeleteClassroomClicked(row.id)}>
        <RiDeleteBin6Line fontSize={20}/>
      </button>):null}
    </div>
  ),
  ignoreRowClick: true,
  
  button: true,
}
]

 // Custom header to include the row count
 const tableHeader = (
  <div>
    <h2>Classrooms List: 
    <span> {classrooms.length} users</span></h2>
  </div>
);
let content

if (isLoading) content = <p>Loading...</p>

if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>//errormessage class defined in the css, the error has data and inside we have message of error
}

// if (isSuccess ) {

return (
  <>
  <AcademicsSet/>
 
  <div className=' flex-1 bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200' >
     {/* <div>
    <input type="text" placeholder="search" onChange={handleFilter}/>
   </div> */}
   
   <DataTable
    title={tableHeader}
    columns={column}
    data={classrooms}
    pagination
    selectableRows
    removableRows
    pageSizeControl
    customStyles={{
      headCells: {
        style: {
          // Apply Tailwind style via a class-like syntax
          justifyContent: 'center', // Align headers to the center
          textAlign: 'center', // Center header text
        },
      },
      // cells: {
      //   style: {
      //     justifyContent: 'center', // Center cell content
      //     textAlign: 'center',
      //   },
      // },
    }}
    >
   </DataTable>
   <div className="flex justify-end items-center space-x-4">
      
      
		
        <button 
			className="px-3 py-2 bg-green-400 text-white rounded"
			onClick={() => Navigate('/settings/academicsSet/newSchool')}
			disabled={selectedRows.length !== 0} // Disable if no rows are selected
      hidden={!canCreate}
			>
			New Classroom
		</button>
     
	</div>

  </div>
  <DeletionConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />
  </>
)

}

//}
export default ClassroomsList