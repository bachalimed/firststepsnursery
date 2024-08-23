import React from 'react'

import StudentsSet from '../../StudentsSet'
import { useState, useEffect } from "react"
import { useAddNewStudentDocumentsListMutation } from "./studentDocumentListsApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from "@fortawesome/free-solid-svg-icons"
import { ROLES } from "../../../../config/UserRoles"
import { ACTIONS } from "../../../../config/UserActions"
import useAuth from '../../../../hooks/useAuth'
import { useSelectedAcademicYear } from "../../../../hooks/useSelectedAcademicYears"
import { useSelector } from 'react-redux'
import { selectAllAcademicYears } from '../../AcademicsSet/AcademicYears/academicYearsApiSlice'
import { useGetAcademicYearsQuery } from '../../AcademicsSet/AcademicYears/academicYearsApiSlice'
//constrains on inputs when creating new user

const TITLE_REGEX= /^[A-z/ 0-9]{8,20}$/


const NewStudentDocumentsListForm = () => {

const [selectedYear, setSelectedYear] = useState('')
const Navigate = useNavigate()
const academicYears = useSelector(selectAllAcademicYears)// to be used to show all academic years

const [addNewStudentDocumentsList, {//an object that calls the status when we execute the newUserForm function
  isLoading,
  isSuccess,
  isError,
  error
}] = useAddNewStudentDocumentsListMutation()//it will not execute the mutation nownow but when called

//prepare the permission variables
const{userId,canEdit, canDelete, canAdd, canCreate, isParent, status2}=useAuth()


const {
data: academicYearsList,//the data is renamed parents
isLoading: yearIsLoading,//monitor several situations
isSuccess: yearIsSuccess,
isError: yearIsError,
error: yearError
} = useGetAcademicYearsQuery({endpointName: 'academicYearsList'}||{},{//this inside the brackets is using the listeners in store.js to update the data we use on multiple access devices
//pollingInterval: 60000,//will refetch data every 60seconds
refetchOnFocus: true,//when we focus on another window then come back to the window ti will refetch data
refetchOnMountOrArgChange: true//refetch when we remount the component
})

let yearsList=[]
if (yearIsSuccess&& academicYearsList?.entities){
const {entities} = academicYearsList
yearsList = Object.values(entities)
//console.log(yearsList)
}



//this to be used to only select current year from check box
const selectedAcademicYear = useSelectedAcademicYear()
useEffect(() => {
if (selectedAcademicYear?.title) {
setSelectedYear(selectedAcademicYear.title)
//console.log('Selected year updated:', selectedAcademicYear.title)
}
}, [selectedAcademicYear])


//initialisation of states for each input
const[studentDocumentsList, setStudentDocumentsList]=useState([])
//const [documentReference, setDocumentReference] = useState('')
const [documentTitle, setDocumentTitle] = useState('')
const [validDocumentTitle, setValidDocumentTitle] = useState(false)
const [isRequired, setIsRequired] = useState(false)
const [isLegalised, setIsLegalised] = useState(false)
const [documentsList, setDocumentsList] = useState([])
const [documentsAcademicYear, setDocumentsAcademicYear] = useState('')
const [validDocumentsAcademicYear, setValidDocumentsAcademicYear] = useState('')
    
//use effect is used to validate the inputs against the defined REGEX above
//the previous constrains have to be verified on the form for teh user to know 


useEffect(() => {
  setValidDocumentTitle(TITLE_REGEX.test(documentTitle))
}, [documentTitle])
useEffect(() => {
  setValidDocumentsAcademicYear(TITLE_REGEX.test(documentsAcademicYear))
}, [documentsAcademicYear])

useEffect(() => {
  if (isSuccess) {//if the add of new user using the mutation is success, empty all the individual states and navigate back to the users list
    //setDocumentReference('')
    //setDocumentTitle('')
    setStudentDocumentsList([])
    //setValidDocumentTitle(false)
    //setIsRequired('')
   // setIsLegalised('')
    //setDocumentsList([{documentTitle:(''), DocumentReference:(''), IsRequired:(''), IsLegalised:('')}])
    setDocumentsAcademicYear('') 
    setValidDocumentsAcademicYear(false)
    Navigate('/settings/studentsSet/studentDocumentsLists')//will navigate here after saving
  }
}, [isSuccess, Navigate])//even if no success it will navigate and not show any warning if failed or success

//handlers to get the individual states from the input



//const onDocumentReferenceChanged = e => setDocumentReference(e.target.value)
const onDocumentTitleChanged = e => setDocumentTitle(e.target.value)
const onIsRequiredChanged = e => setIsRequired(e.target.value)
const onIsLegalisedChanged = e => setIsLegalised(e.target.value)
const onDocumentsAcademicYearChanged = e => setDocumentsAcademicYear(e.target.value)


// useEffect(()=>{
//   setDocumentsList({documentTitle:documentTitle,  documentReference:documentReference,  isRequired:isRequired, isLegalised:isLegalised})},
// [documentTitle, documentReference, isRequired, isLegalised])

//adds to the previous entries in arrays for gardien, schools...
// const onDocumentsListChanged = (e) => {
// const { value, checked } = e.target
// setDocumentsList((prevList) => 
//   checked 
//     ? [...prevList, { documentsAcademicYear: value }] 
//     : prevList.filter((year) => year.documentsAcademicYear !== value)
// )
// }

// to deal with studentDocumentsList education entries:
// Handler to update an entry field
const handleFieldChange = (index, field, value) => {
const updatedEntries = [...studentDocumentsList];
updatedEntries[index][field] = value;
setStudentDocumentsList(updatedEntries);
};

// Handler to add a new education entry
const handleAddEntry = () => {
setStudentDocumentsList([
...studentDocumentsList,
{documentTitle:'', isRequired:false, isLegalised:false }
]);
};

// Handler to remove an education entry
const handleRemoveEntry = (index) => {
const updatedEntries = studentDocumentsList.filter((_, i) => i !== index);
setStudentDocumentsList(updatedEntries);
};


// //check if the parent and employee id is available or delete the variable
// if (isParent===''){ setIsParent(undefined)}
// if (isEmployee===''){ setIsEmployee(undefined)}


// useEffect(()=>{
//     setStudentDocumentsListEducation({schoolYear:schoolYear, attendedSchool:attendedSchool, note:note})},
// [schoolYear, attendedSchool, note])
// useEffect(()=> {
//     setLastModified([{date:'', operator:operator}])
// }, [date, operator])

// useEffect(()=>{
//     setStudentDocumentsListDocuments({id:id})},
// [id])
// useEffect(()=> {
//     setAdmissions([{schoolYear:schoolYear, admission:admission}])
// }, [schoolYear, admission])


//to check if we can save before onsave, if every one is true, and also if we are not loading status
const canSave = [ validDocumentsAcademicYear, ...studentDocumentsList.map(entry => entry.documentTitle)].every(Boolean) && !isLoading



const onSaveStudentDocumentsListClicked = async (e) => {
  e.preventDefault()
  
  if (canSave) {//if cansave is true
      //generate the objects before saving
      //console.log(documentsList, documentsAcademicYear )
      await addNewStudentDocumentsList({ documentsList:studentDocumentsList, documentsAcademicYear   })//we call the add new user mutation and set the arguments to be saved
      //added this to confirm save
      if (isError) {console.log('error savingg', error)//handle the error msg to be shown  in the logs??
      }
  }
}
const handleCancel= ()=>{
  Navigate ('/settings/studentsSet/studentDocumentsLists/')
}

//the error messages to be displayed in every case according to the class we put in like 'form input incomplete... which will underline and highlight the field in that cass
const errClass = isError ? "errmsg" : "offscreen"
//const validStudentDocumentsListClass = !validStudentDocumentsListName ? 'form__input--incomplete' : ''
//const validPwdClass = !validPassword ? 'form__input--incomplete' : ''
//const validRolesClass = !Boolean(userRoles.length) ? 'form__input--incomplete' : ''


const content = (<>
<StudentsSet/>

      <p className={errClass}>{error?.data?.message}</p>  {/*will display if there is an error message, some of the error messagees are defined in the back end responses*/}

      <form className="form" onSubmit={onSaveStudentDocumentsListClicked}>
          <div className="form__title-row">
              <h2>New StudentDocumentsList Form</h2>
              
          </div>
          <select
              value={documentsAcademicYear}
              onChange={(e) => setDocumentsAcademicYear(e.target.value)}
          >
          <option value="">Select Year</option>
            {yearsList.map((year) => (
                <option key={year.id} value={year.title}>
                {year.title}
                </option>
            ))}
            </select>
    


          <h1>Student Documents</h1>
            {studentDocumentsList.map((entry, index) => (
                <div key={index} className=''>
                    

                    <input
                        type="text"
                        placeholder="Document Title"
                        value={entry.documentTitle}
                        onChange={(e) => handleFieldChange(index, 'documentTitle', e.target.value)}
                    />

<label>
              <input
                type="checkbox"
                checked={entry.isRequired}
                onChange={(e) => handleFieldChange(index, 'isRequired', e.target.checked)}
              />
              Is Required?  
            </label>

            <label>
              <input
                type="checkbox"
                checked={entry.isLegalised}
                onChange={(e) => handleFieldChange(index, 'isLegalised', e.target.checked)}
              />
              Is Legalised?
            </label>


                    <button type="button" onClick={() => handleRemoveEntry(index)}>Remove</button>
                </div>
            ))}
            <button type="button" onClick={handleAddEntry}>Add Document</button>
                
               

        <div className="flex justify-end items-center space-x-4">
              <button 
                  className=" px-4 py-2 bg-green-500 text-white rounded"
                  type='submit'
                  title="Save"
                  onClick={onSaveStudentDocumentsListClicked}
                  disabled={!canSave}
                  >
                  Save Changes
              </button>
              <button 
              className=" px-4 py-2 bg-red-500 text-white rounded"
              onClick={handleCancel }
              >
              Cancel
              </button>
          </div>


      </form>
  </>
)





return content
}
export default NewStudentDocumentsListForm