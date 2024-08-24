
import React from 'react'
import StudentsParents from '../../StudentsParents'
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { IoCheckmarkSharp, IoCheckmarkDoneOutline  } from "react-icons/io5";
import { MdOutlineRadioButtonChecked, MdRadioButtonUnchecked  } from "react-icons/md";
import { GrView } from "react-icons/gr";
import { GrDocumentUpload } from "react-icons/gr";
import { useGetAttendedSchoolsQuery } from '../../../AppSettings/AcademicsSet/attendedSchools/attendedSchoolsApiSlice'
import { useState, useEffect } from "react"
import { useAddStudentDocumentsMutation } from "./studentDocumentsApiSlice"
import { useNavigate, Link } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from "@fortawesome/free-solid-svg-icons"
import { ROLES } from "../../../../config/UserRoles"
import { ACTIONS } from "../../../../config/UserActions"
import useAuth from '../../../../hooks/useAuth'
import UploadDocumentFormModal from './UploadDocumentFormModal'
import { useSelector } from 'react-redux'
import {  useGetStudentsQuery, useGetStudentsByYearQuery } from "./studentsApiSlice"
import { HiOutlineSearch } from 'react-icons/hi'
import DataTable from 'react-data-table-component'
import {  selectAllStudentsByYear, selectAllStudents } from './studentsApiSlice'//use the memoized selector 
import { ImProfile } from "react-icons/im"
import { FiEdit } from "react-icons/fi"
import { RiDeleteBin6Line } from "react-icons/ri"
import { setAcademicYears } from "../../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice"
import { useSelectedAcademicYear } from "../../../../hooks/useSelectedAcademicYears"
import getCurrentAcademicYear from '../../../../config/CurrentYear'
import { LiaMaleSolid, LiaFemaleSolid  } from "react-icons/lia";
import { useDispatch } from "react-redux"
import { setSomeStudents, setStudents, currentStudentsList } from "./studentsSlice"
import { IoDocumentAttachOutline } from "react-icons/io5";
import { useGetStudentDocumentsByYearByIdQuery } from './studentDocumentsApiSlice'

import { useGetAcademicYearsQuery, selectAllAcademicYears } from '../../../AppSettings/AcademicsSet/AcademicYears/academicYearsApiSlice'

//constrains on inputs when creating new user

const NAME_REGEX= /^[A-z 0-9.-_]{6,20}$/

const StudentDocumentsList = ({student}) => {

const Navigate = useNavigate()
//get the student details from the passed data
const {id, studentName}= student
//console.log(id, studentName,'student name and id')
const [studentFile, setStudentFile]=useState([])
//initialisation of states for each input
const [studentId, setStudentId] = useState(id)// we get from previous page 

const [documents, setDocuments] = useState([]);

const [addStudentDocuments, {//an object that calls the status when we execute the newUserForm function
    isLoading:uploadIsLoading,
    isSuccess:uploadIsSuccess,
    isError:uploadIsError,
    error:uploadError
}] = useAddStudentDocumentsMutation()//it will not execute the mutation nownow but when called

const [studentDocumentLabel, setStudentDocumentLabel] = useState('')
const [validStudentDocumentLabel, setValidStudentDocumentLabel] = useState('')
const [studentDocumentReference, setStudentDocumentReference] = useState('')

const selectedAcademicYear = useSelectedAcademicYear()


//prepare the permission variables
const{userId,canEdit, canDelete, canAdd, canView, canCreate, isParent, isAdmin, status2}=useAuth()

useEffect(() => {
    if (selectedAcademicYear?.title) {
        setStudentDocumentYear(selectedAcademicYear.title)
      console.log('Selected year updated:', selectedAcademicYear.title)
    }
  }, [selectedAcademicYear])

 const [studentDocumentYear, setStudentDocumentYear] = useState(selectedAcademicYear.title)

const {
data: studentDocumentsListing,//the data is renamed parents
isLoading: listIsLoading,//monitor several situations
isSuccess: listIsSuccess,
isError: listIsError,
error: listError
} = useGetStudentDocumentsByYearByIdQuery({studentId:id , year : studentDocumentYear ,endpointName: 'studentsDocumentsList'}||{},{
//pollingInterval: 60000,//will refetch data every 60seconds
refetchOnFocus: true,
refetchOnMountOrArgChange: true
})


let studentDocuments
let updatedListing=[]

    if (listIsSuccess) {
    const { studentDocuments, studentDocumentsList }= studentDocumentsListing
    const listing =studentDocumentsList[0].documentsList
     updatedListing = listing.map(item => {
        // Check if the documentReference exists in the studentDocuments array
        const isUploaded = studentDocuments.some(doc => doc.studentDocumentReference === item.documentReference);
        
        // Return a new object with the documentUploaded key added if the reference exists
        return {
            ...item,
            documentUploaded: isUploaded
        };
    });
    console.log(studentDocuments,'returned data docs')
    
    console.log(   updatedListing,'returned data listing')
    
    }



//         //the error messages to be displayed in every case according to the class we put in like 'form input incomplete... which will underline and highlight the field in that cass
//const errClass = isError ? "errmsg" : "offscreen"
//       //const validStudentClass = !validStudentName ? 'form__input--incomplete' : ''
//       //const validPwdClass = !validPassword ? 'form__input--incomplete' : ''
//       //const validRolesClass = !Boolean(userRoles.length) ? 'form__input--incomplete' : ''
const handleDelete =()=>{
    console.log('deleting')
}

const [isModalOpen, setIsModalOpen] = useState(false)
const handleUploadClick = () => {
    setIsModalOpen(true);
}
// now that the modal has returned the required data:{ studentId, studentDocumentYear, studentDocumentLabel, studentDocumentType, file

const handleUpload = async ({studentId, studentDocumentYear, studentDocumentLabel, studentDocumentReference, file }) => {
   // e.preventDefault()
const formData = new FormData()

    // Append each document to the FormData
    
      formData.append('studentId', studentId);
      formData.append('studentDocumentYear', studentDocumentYear);
      formData.append('studentDocumentReference', studentDocumentReference)///!!!must upload the id and not the title
      formData.append('studentDocumentLabel', studentDocumentLabel);
      formData.append('file', file);
    
    try {
      const response = await addStudentDocuments(formData)//.unwrap()
    if (!response.ok) {
      throw new Error('Something went wrong!');
    }
    const result = await response.json();
    console.log('Upload successful:', result);
  } catch (error) {
    console.error('Error uploading documents:', error);
  }
};

useEffect(() => {
    if (uploadIsSuccess) {//if the add of new user using the mutation is success, empty all the individual states and navigate back to the users list
      setStudentId('')
      setStudentDocumentYear('')
      setStudentDocumentLabel('')
      setStudentDocumentReference('')
      setDocuments([])
      Navigate(`/students/studentsParents/studentDocumentsList/${studentId}`)//will navigate here after saving
    }
}, [uploadIsSuccess, Navigate])


const column =[
    { 
      name: "#", // New column for entry number
      cell: (row, index) => index + 1, // Display the index + 1 (for 1-based numbering)
      sortable: false,
      width: '50px',
      
    }, 
    //show this column only if user is a parent and not employee
  
    (status2)&&{ 
  name: "Reference",
  selector:row=>( row.documentReference  ),
  sortable:true,
  width:'200px'
   }, 
   { 
    name: "Title",
    selector:row=>row.documentTitle,
  
    sortable:true,
    removableRows:true,
    width:'170px'
    }, 
    { 
  name: "Required",
  selector:row=>( row.isRequired),
  cell: row => (
    <span>
      {row.isRequired===true ? (
        <IoCheckmarkSharp className='text-gray-500 text-2xl' />
      ) : ''}
    </span>
  ),
  sortable:true,
  width:'100px'
   }, 
    { 
  name: "Legalised",
  selector:row=>(row.isLegalised),
  sortable:true,
  cell: row => (
    <span>
      {row.isLegalised===true ? (
        <IoCheckmarkSharp className='text-gray-500 text-2xl' />
      ) : ''}
    </span>
  ),
  width:'100px',
   }, 
  {name: "Uploaded",
    selector:row=>(row.documentUploaded),
    cell: row => (
        <span>
          {row.documentUploaded===true ? (
            <IoCheckmarkDoneSharp className='text-green-500 text-2xl' />
          ) : ''}
        </span>
      ),
    sortable:true,
    width:'100px',
  }, 
  { 
    name: "Actions",
    cell: row => (
      <div className="space-x-1">
        {canView&&row.documentUploaded&&(<button className="text-blue-500" fontSize={20}  onClick={() => Navigate(`/students/studentsParents/studentDocument/${row.id}`)}  > 
          <GrView fontSize={20}/> 
          </button>)}
       
        {canEdit&&!row.documentUploaded&&(<button  className="text-yellow-400" onClick={handleUploadClick}  > 
        <GrDocumentUpload fontSize={20}/> 
        </button>)}
        {canDelete&&row.documentUploaded&&(<button className="text-red-500"  onClick={() => handleDelete(row.id)}>
          <RiDeleteBin6Line fontSize={20}/>
        </button>)}
      </div>
    ),
    ignoreRowClick: true,
    
    button: true,
  }
  ]
  let content
  if (listIsLoading) content = <p>Loading...</p>
  if (listIsError) {
    content = <p className="errmsg">{listError?.data?.message}</p>//errormessage class defined in the css, the error has data and inside we have message of error
  }
   //if (isSuccess){
  
   content = 
    <>
  
    <StudentsParents/>

    <div>
         
    <UploadDocumentFormModal 
                isOpen={isModalOpen} 
                onRequestClose={() => setIsModalOpen(false)} 
                studentId={studentId}
                updatedListing={updatedListing}
                year={studentDocumentYear}
                onUpload={handleUpload}
            />
    </div>
        
    <div className=' flex-1 bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200' >
      
     
     <DataTable
      columns={column}
      data={updatedListing}
      pagination
      selectableRows
      removableRows
      pageSizeControl
      
      
      >
      </DataTable>
      <div className="flex justify-end items-center space-x-4">
          
          <button 
              className=" px-4 py-2 bg-green-500 text-white rounded"
              
                >
              Student Details
            </button>
        
         
       {(isAdmin&&<button 
              className="px-3 py-2 bg-gray-400 text-white rounded"
             
             
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


export default StudentDocumentsList