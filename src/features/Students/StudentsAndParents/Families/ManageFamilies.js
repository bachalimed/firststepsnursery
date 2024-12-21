// import React from 'react';
// import { HiOutlineSearch } from 'react-icons/hi'
// import { useGetParentsQuery, useGetParentsByYearQuery } from "./familiesApiSlice"
// import { setSomeParents } from "./familiesSlice"
// import { useGetUsersQuery} from "../../../Admin/UsersManagement/usersApiSlice"
// import StudentsParents from '../../StudentsParents'
// import DataTable from 'react-data-table-component'
// import DeletionConfirmModal from '../../../../Components/Shared/Modals/DeletionConfirmModal'
// import { useSelector } from 'react-redux'
// import { selectParentById, selectAllParents } from './familiesApiSlice'//use the memoized selector
// import { selectAllUsers, selectUserById } from '../../../Admin/UsersManagement/usersApiSlice'//use the memoized selector
// import { useState, useEffect } from "react"
// import { Link , useNavigate} from 'react-router-dom'
// import { useDeleteParentMutation } from './familiesApiSlice'
// import { FiEdit, FiDelete  } from 'react-icons/fi'
// import { RiDeleteBin6Line } from 'react-icons/ri'
// import useAuth from "../../../../hooks/useAuth"
// import { ImProfile } from 'react-icons/im'
// import { useDispatch } from "react-redux"
// import { IoShieldCheckmarkOutline, IoShieldOutline  } from "react-icons/io5"

// import AssignChildModal from './AssignChildModal';
// import { useGetStudentsQuery, useGetStudentsByYearQuery } from '../Students/studentsApiSlice';
// const ManageFamilies = () => {
//   //this is for the academic year selection

//   const [selectedRows, setSelectedRows] = useState([])

// const Navigate = useNavigate()
// const Dispatch = useDispatch()
// const [isAssignChildModalOpen, setIsAssignChildModalOpen] = useState(false);
// const [selectedFatherId, setSelectedFatherId] = useState(null);

// //get several things from the query
// const {
//   data: parents,
//   isLoading: isParentLoading,//monitor several situations
//   isSuccess: isParentSuccess,
//   isError: isParentError,
//   error: parentError
// } = useGetParentsByYearQuery({selectedYear:'1000' ,endpointName: 'parentsList'}||{},{
//   //pollingInterval: 60000,
//   refetchOnFocus: true,
//   refetchOnMountOrArgChange: true
// })

// //this ensures teh selected year is chosen before running hte useeffect it is working perfectly to dispaptch the selected year

// const {
//   data: students,//the data is renamed students
//         isLoading:isStudentLoading,
//         isSuccess:isStudentSuccess,
//         isError:isStudentError,
//         error:studentError
// } = useGetStudentsByYearQuery({selectedYear:'1000' ,endpointName: 'studentsList'}||{},{//this param will be passed in req.params to select only students for taht year
//  
//   //pollingInterval: 60000,
//   refetchOnFocus: true,
//   refetchOnMountOrArgChange: true
// })

// // State to hold selected rows
// //state to hold the search query
// const [searchQuery, setSearchQuery] = useState('')

// let parentsList =[]
// let filteredParents=[]
// if (isParentSuccess){
//   //set to the state to be used for other component s and edit student component

//   const {entities}=parents
//   //we need to change into array to be read??
//   parentsList = Object.values(entities)//we are using entity adapter in this query
//   Dispatch(setSomeParents(parentsList))//timing issue to update the state and use it the same time
//  console.log(parentsList)
//   //the serach result data
//  filteredParents = parentsList?.filter(item => {
// //the nested objects need extra logic to separate them
// const firstNameMatch = item?.userProfile?.userFullName?.userFirstName?.toLowerCase().includes(searchQuery.toLowerCase())
// const middleNameMatch = item?.userProfile?.userFullName?.userMiddleName?.toLowerCase().includes(searchQuery.toLowerCase())
// const lastNameMatch = item?.userProfile?.userFullName?.userLastName?.toLowerCase().includes(searchQuery.toLowerCase())
// const dobMatch = item?.userProfile?.userDob?.toLowerCase().includes(searchQuery.toLowerCase());
// const motherFirstNameMatch = item?.partner?.userProfile?.userFullName?.userFirstName?.toLowerCase().includes(searchQuery.toLowerCase())
// const motherMiddleNameMatch = item?.partner?.userProfile?.userFullName?.userMiddleName?.toLowerCase().includes(searchQuery.toLowerCase())
// const motherLastNameMatch = item?.partner?.userProfile?.userFullName?.userLastName?.toLowerCase().includes(searchQuery.toLowerCase())

// //console.log('filteredStudents in the success', item)
// return (Object.values(item).some(val =>
//   String(val).toLowerCase().includes(searchQuery.toLowerCase())
// )||firstNameMatch||middleNameMatch||lastNameMatch||dobMatch||motherFirstNameMatch||motherMiddleNameMatch||motherLastNameMatch)
// })
// }

// //console.log('allParents', allParents)

// const{canEdit, canDelete, canCreate, status2}=useAuth()

// const handleSearch = (e) => {
//   setSearchQuery(e.target.value)
// }

// //console.log('filtered', filteredParents)

// // Handler for selecting rows
// const handleRowSelected = (state) => {
// setSelectedRows(state.selectedRows)
// console.log('selectedRows', selectedRows)
// }
// let studentsList
// if (isStudentSuccess){
//   const {entities}=students
//   //we need to change into array to be read??
//   studentsList = Object.values(entities)
//   //console.log('studetnsList', studentsList)

// }
// const handleAssignChild = () => {
//   if (selectedRows.length === 1) {
//     setSelectedFatherId(selectedRows[0].id); // Assuming _id is the parent ID
//     console.log('selectedPAretn id', selectedFatherId)
//     setIsAssignChildModalOpen(true);
//   }
// };

// const handleConfirmAssignChild = (studentId) => {
//   // Logic to add the child to the parent
//   console.log('Adding child:', studentId, 'to parent:', selectedFatherId);
//   setIsAssignChildModalOpen(false);
// };

// const handleAssignPartner=()=>{
//   console.log('hi')
// }

// //handle edit
// const handleEdit=(id)=>{
// Navigate(`/students/studentsParents/students/${id}/`)//the path to be set in app.js and to be checked with server.js in backend, this is editing page of user
// }

// const errContent = (isParentError?.data?.message || isStudentError?.data?.message) ?? ''
// //define the content to be conditionally rendered

// const column =[
//   {
//     name: "#", // New column for entry number
//     cell: (row, index) => index + 1, // Display the index + 1 (for 1-based numbering)
//     sortable: false,
//     width: '50px',

//   },

//   { name: "Father Name",
//   selector:row=>( <Link to={`/changepath/${row._id}`}> {row.userProfile.userFullName.userFirstName+" "+row.userProfile.userFullName.userMiddleName+" "+row.userProfile.userFullName.userLastName}</Link>),
//   sortable:true,
//   width:'150px'
//   },
//   { name: "Mother Name",
//   selector:row=>( <Link to={`/changepath/${row._id}`}> {row.partner.userProfile.userFullName.userFirstName+" "+row.partner.userProfile.userFullName.userMiddleName+" "+row.partner.userProfile.userFullName.userLastName}</Link>),
//   sortable:true,
//   width:'150px'
//   },
//   {name: "Situation",
//     selector:row=>row.children[0].studentJointFamily?'Joint':'Separated',
//     sortable:true
//   },

//   //  {name: "DOB",
//   //   selector:row=>new Date(row.userProfile.userDob).toLocaleString('en-US', { day: 'numeric', month: 'numeric', year: 'numeric' }),
//   //   width:'100px',
//   //   sortable:true
//   // },

// {name: "Father Phone",
//   selector:row=>row.userProfile.userContact.primaryPhone,
//   sortable:true,
//   width:'130px'
// },
// {name: "Mother Phone",
//   selector:row=>row.partner.userProfile.userContact.primaryPhone,
//   sortable:true,
//   width:'130px'
// },

// {name: "Children",
//   selector:row=>(
//     <div>{row.children.map(child=> (
//       <div key ={child._id}>{child.studentName.firstName} {child.studentName.middleName} {child.studentName.lastName}</div>))}
//     </div>),

//   sortable:true,
//   width: '180px',
// },
// {
//   name: "Manage",
//   cell: row => (
//     <div className="space-x-1">
//      <button className="text-sky-700" fontSize={20}  onClick={() => Navigate(`/students/studentsParents/parentDetails/${row.id}`)}  >
//       <ImProfile fontSize={20}/>
//       </button>
//       {/* /////////////////////condition is canEdit and not ! of it */}
//       {canEdit?(<button className="text-amber-300"  onClick={() => Navigate(`/students/studentsParents/editParent/${row.id}`)} >
//       <FiEdit fontSize={20}/>
//       </button>):null}

//     </div>
//   ),
//   ignoreRowClick: true,

//   button: true,
// }

// ]
// let content

// if (isParentLoading) content = <p>Loading...</p>

// if (isParentError|isStudentError) {
//     content = <p className="errmsg">error msg  {Error?.data?.message}</p>//errormessage class defined in the css, the error has data and inside we have message of error
// }

// //if (isParentSuccess||isDelSuccess) {

//   //console.log('filtered and success', filteredParents)

// content= (
//   <>
//   <StudentsParents/>
//   <div className='relative h-10 mr-2 '>
// 				<HiOutlineSearch fontSize={20} className='text-gray-400 absolute top-1/2 -translate-y-1/2 left-3'/>
// 				<input type='text'  value={searchQuery} onChange= {handleSearch} className='text-sm focus:outline-none active:outline-none mt-1 h-8 w-[12rem] border border-gray-300 rounded-md px-4 pl-11 pr-4'/>
// 			</div>
//   <div className=' flex-1 bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200' >
//      {/* <div>
//     <input type="text" placeholder="search" onChange={handleFilter}/>
//    </div> */}

//    <DataTable
//     columns={column}
//     data={filteredParents}
//     pagination
//     selectableRows
//     removableRows
//     onSelectedRowsChange={handleRowSelected}
//     pageSizeControl>
//    </DataTable>
//    <div className="cancelSavebuttonsDiv">
//           <button
//                className="px-3 py-2 bg-amber-300 text-white rounded"
//                onClick={handleAssignChild}
//               disabled={selectedRows.length !== 1} // Disable if no rows are selected
//                 >
//               Assign Child
//             </button>

//           <button
//               className="px-3 py-2 bg-blue-400 text-white rounded"
//               onClick={handleAssignPartner}
//               disabled={selectedRows.length !== 1} // Disable if no rows are selected
//         // hidden={!canCreate}
//               >
//               Assign Partner
//           </button>

//       </div>
//   </div>

// {isStudentSuccess&&(<AssignChildModal
//         isOpen={isAssignChildModalOpen}
//         onClose={() => setIsAssignChildModalOpen(false)}
//         onConfirm={handleConfirmAssignChild}
//         students={studentsList || []} // Pass the students to the modal
//          className="modal"
//       overlayClassName="overlay"
//       />)}
//   </>
// )

// //}
// return content
// }
// export default ManageFamilies
