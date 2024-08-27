//         import React from 'react'
//         import StudentsParents from '../../StudentsParents'

//         import { useGetAttendedSchoolsQuery } from '../../../AppSettings/AcademicsSet/attendedSchools/attendedSchoolsApiSlice'
//         import { useState, useEffect } from "react"
//         import { useAddStudentDocumentsMutation } from "./studentDocumentsApiSlice"
//         import { useNavigate } from "react-router-dom"
//         import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
//         import { faSave } from "@fortawesome/free-solid-svg-icons"
//         import { ROLES } from "../../../../config/UserRoles"
//         import { ACTIONS } from "../../../../config/UserActions"
//         import useAuth from '../../../../hooks/useAuth'
//         import { useSelectedAcademicYear } from "../../../../hooks/useSelectedAcademicYears"
//         import { useSelector } from 'react-redux'
    
//         import { selectAllAcademicYears } from '../../../AppSettings/AcademicsSet/AcademicYears/academicYearsApiSlice'
//         import { useGetAcademicYearsQuery } from '../../../AppSettings/AcademicsSet/AcademicYears/academicYearsApiSlice'
// import { useGetStudentDocumentsListsQuery } from '../../../AppSettings/StudentsSet/StudentDocumentLists/studentDocumentListsApiSlice'
//         //constrains on inputs when creating new user
    
//         const NAME_REGEX= /^[A-z 0-9.-_]{6,20}$/

//     const StudentDocumentsForm = ({student}) => {
      
//       const Navigate = useNavigate()
//       //get the student details from the passed data
//        const {id, studentName}= student
//        console.log(studentName)
//        const [studentFile, setStudentFile]=useState([])
//        //initialisation of states for each input
//         const [studentId, setStudentId] = useState(id)// we get from previous page 
        
//         const [documents, setDocuments] = useState([]);
        
        
//         const [studentDocumentLabel, setStudentDocumentLabel] = useState('')
//         const [validStudentDocumentLabel, setValidStudentDocumentLabel] = useState('')
//         const [studentDocumentReference, setStudentDocumentReference] = useState('')
      
//         const [addStudentDocuments, {//an object that calls the status when we execute the newUserForm function
//           isLoading,
//           isSuccess,
//           isError,
//           error
//       }] = useAddStudentDocumentsMutation()//it will not execute the mutation nownow but when called
  
//       //prepare the permission variables
//  const{userId,canEdit, canDelete, canAdd, canCreate, isParent, status2}=useAuth()


// const {
//     data: studentDocumentsListsList,//the data is renamed parents
//     isLoading: listsListIsLoading,//monitor several situations
//     isSuccess: listsListIsSuccess,
//     isError: listsListIsError,
//     error: listsListError
//   } = useGetStudentDocumentsListsQuery({endpointName: 'studentDocumentsLists'}||{},{
//     //pollingInterval: 60000,//will refetch data every 60seconds
//     refetchOnFocus: true,
//     refetchOnMountOrArgChange: true
//   })


//  //this to be used to only select current year from check box
//  const selectedAcademicYear = useSelectedAcademicYear()
//  const [studentDocumentYear, setStudentDocumentYear] = useState(selectedAcademicYear.title)
//   const[filteredList, setFilteredList]=useState([])
 
//   useEffect(() => {
//     if (listsListIsSuccess) {
//       const { entities } = studentDocumentsListsList;
//       const lists = Object.values(entities);
//       const result = lists.find(list => list.documentsAcademicYear === selectedAcademicYear?.title);

//       if (result) {
//         setFilteredList(result.documentsList);
//       } else {
//         setFilteredList([]); // Clear the filtered list if no matching year is found
//       }
//     }
//   }, [listsListIsSuccess, studentDocumentsListsList, selectedAcademicYear]);
//  console.log(filteredList,'filteredList')
  
//  const handleAddDocument = () => {
//     setDocuments([...documents, { studentId, studentDocumentYear, studentDocumentReference: '', studentDocumentLabel: '', file: null }]);
//   };

//   const handleFieldChange = (index, field, value) => {
//     const newDocuments = [...documents];
//     newDocuments[index][field] = value;
//     setDocuments(newDocuments);
//   };

//   const handleFileChange = (index, file) => {
//     const newDocuments = [...documents];
//     newDocuments[index].file = file;
//     setDocuments(newDocuments);
//   };

//   const handleRemoveDocument = (index) => {
//     const newDocuments = documents.filter((_, i) => i !== index);
//     setDocuments(newDocuments);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault()
    
//     const formData = new FormData()
// const doc = documents[0]
//     // Append each document to the FormData
    
//       formData.append('studentId', doc.studentId);
//       formData.append('studentDocumentYear', doc.studentDocumentYear);
//       formData.append('studentDocumentReference', doc.studentDocumentReference)///!!!must upload the id and not the title
//       formData.append('studentDocumentLabel', doc.studentDocumentLabel);
//       formData.append('file', doc.file);
    
  
//     try {
//       const response = await addStudentDocuments(formData)//.unwrap()


//     if (!response.ok) {
//       throw new Error('Something went wrong!');
//     }

//     const result = await response.json();
//     console.log('Upload successful:', result);
//   } catch (error) {
//     console.error('Error uploading documents:', error);
//   }
// };
//  console.log(documents,'documents')

// //add conditions of !loading for saving the documents tomake sure no bugs!!!!
  
//       useEffect(() => {
//           if (isSuccess) {//if the add of new user using the mutation is success, empty all the individual states and navigate back to the users list
//             setStudentId('')
//             setStudentDocumentYear('')
//             setStudentDocumentLabel('')
//             setStudentDocumentReference('')
//             setDocuments([])
            
//             Navigate('/students/studentsParents/students')//will navigate here after saving
//           }
//       }, [isSuccess, Navigate])//even if no success it will navigate and not show any warning if failed or success
  
 
//         //to check if we can save before onsave, if every one is true, and also if we are not loading status
//       const canSave = [validStudentDocumentLabel ].every(Boolean) && !isLoading
        
// //     
// //           if (canSave) {//if cansave is true
// //               //generate the objects before saving
// //               //console.log(studentName, studentDob, studentSex, studentIsActive, studentYears, studentPhoto, studentJointFamily, studentEducation)
// //               await addNewStudent({ validStudentDocumentLabel,   })//we call the add new user mutation and set the arguments to be saved
// //               //added this to confirm save
// //               if (isError) {console.log('error savingg', error)//handle the error msg to be shown  in the logs??
// //               }
// //           }
// //       }
//       const handleCancel= ()=>{
//           Navigate ('/students/studentsParents/students/')
//       }
     
// //         //the error messages to be displayed in every case according to the class we put in like 'form input incomplete... which will underline and highlight the field in that cass
//        //const errClass = isError ? "errmsg" : "offscreen"
// //       //const validStudentClass = !validStudentName ? 'form__input--incomplete' : ''
// //       //const validPwdClass = !validPassword ? 'form__input--incomplete' : ''
// //       //const validRolesClass = !Boolean(userRoles.length) ? 'form__input--incomplete' : ''
  
// return (
//   <>
//     <StudentsParents />
//     <form onSubmit={handleSubmit}>


//       <div>

//         show already uploaded documents for the student, adn the missing ones
//       </div>
//       <h2>Upload Documents for {studentName.firstName} {studentName.middleName} {studentName.lastName} </h2>
//       {listsListIsLoading && <p>Loading...</p>}
//       {listsListIsSuccess && (
//         <>
//           {documents.map((entry, index) => (
//             <div key={index}>
//               <div>
//                 <label htmlFor={`documentReference-${index}`}>Document Reference:</label>
//                 <select
//                   id={`documentReference-${index}`}
//                   value={entry.documentReference}
//                   onChange={(e) => handleFieldChange(index, 'studentDocumentReference', e.target.value)}
//                 >
//                   <option value="">Select Document</option>
//                   {filteredList.map((doc) => (
//                     <option key={doc.documentReference} value={doc.documentReference}>
//                       {doc.documentTitle}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label htmlFor={`documentLabel-${index}`}>Document Label:</label>
//                 <input
//                   id={`documentLabel-${index}`}
//                   type="text"
//                   value={entry.studentDocumentLabel}
//                   onChange={(e) => handleFieldChange(index, 'studentDocumentLabel', e.target.value)}
//                 />
//               </div>
//               <div>
//                 <label htmlFor={`file-${index}`}>Choose File:</label>
//                 <input
//                   id={`file-${index}`}
//                   type="file"
//                   onChange={(e) => handleFileChange(index, e.target.files[0])}
//                 />
//               </div>
//               <button type="button" onClick={() => handleRemoveDocument(index)}>Remove Entry</button>
//             </div>
//           ))}
//           <button type="button" onClick={handleAddDocument}>Add File</button>
//           <button type="submit">Upload Document</button>
//         </>
//       )}
//     </form>
//   </>
// );
// };

// export default StudentDocumentsForm;