import React from 'react'
import StudentsParents from '../StudentsParents'


import { useState, useEffect } from "react"
import { useUpdateStudentMutation } from "./studentsApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from "@fortawesome/free-solid-svg-icons"
import { ROLES } from "../../../config/UserRoles"
import { ACTIONS } from "../../../config/UserActions"
import useAuth from '../../../hooks/useAuth'


 //constrains on inputs when creating new user
 const USER_REGEX = /^[A-z]{6,20}$/
 const PWD_REGEX = /^[A-z0-9!@#-_$%]{8,20}$/
 const NAME_REGEX= /^[A-z 0-9]{3,20}$/
 const PHONE_REGEX= /^[0-9]{6,15}$/
 const DOB_REGEX = /^[0-9/-]{4,10}$/
 const EMAIL_REGEX = /^[A-z0-9.@-_]{6,20}$/


const EditStudentForm = ({student}) => {
  console.log('hello', student)
  const [updateStudent, {//an object that calls the status when we execute the newUserForm function
    isLoading,
    isSuccess,
    isError,
    error
}] = useUpdateStudentMutation()//it will not execute the mutation nownow but when called

const Navigate = useNavigate()

//prepare the permission variables
const{userId,canEdit, canDelete, canAdd, canCreate, isParent, status2}=useAuth()


   
  //initialisation of states for each input
    const [studentName, setStudentName] = useState(student.studentName)
    const [firstName, setFirstName] = useState(student.studentName.firstName)
    const [validFirstName, setValidFirstName] = useState(false)
    const [middleName, setMiddleName] = useState(student.studentName.middleName)
    const [lastName, setLastName] = useState(student.studentName.lastName)
    const [validLastName, setValidLastName] = useState(false)
    const [ studentDob,setStudentDob ]= useState(student.studentDob.split('T')[0])
    const [ validStudentDob,setValidStudentDob ]= useState(false)
    const [ studentSex,setStudentSex ]= useState(student.studentSex)
    const [studentIsActive, setStudentIsActive] = useState(student.studentIsActive)
    const [studentYear, setStudentYear] = useState(student.studentYear)
    const [studentJointFamily, setStudentJointFamily] = useState(student.studentJointFamily)
    const [studentPhoto, setStudentPhoto] = useState(student.studentPhoto)
        
    const [studentMother, setStudentMother] = useState(student.studentMother)
    const [studentFather, setStudentFather] = useState(student.studentFather)
    const [studentGardien, setStudentGardien] = useState(student.studentGardien)//an array
    const [gardienFirstName, setGardienFirstName] = useState(student.gardienFirstName)
    const [gardienMiddleName, setgardienMiddleName] = useState(student.gardienMiddleName)
    const [gardienLastName, setGardienLastName] = useState(student.gardienLastName)
    const [gardienPhone, setGardienPhone] = useState(student.gardienPhone)
    const [gardienRelation, setGardienRelation] = useState(student.gardienRelation)
    
    const [studentEducation, setStudentEducation] = useState(student.studentEducation)//an array
    const [schoolyear, setSchoolyear] = useState(student.schoolyear)
    const [attendedSchool, setAttendedSchool] = useState(student.attendedSchool)
    const [note, setNote] = useState(student.note)
    const [lastModified, setLastModified]=useState(student.lastModified)
    const [date, setDate] = useState(student.date)//the exact date time of saving will be saved in the backend
    const [operator, setOperator]=useState(userId)//id of the user logged in already
    const [studentDocuments, setStudentDocuments]=useState(student.studentDocuments)//an array
    const [admissions, setAdmissions]=useState(student.admissions)
    const [id, setId]=useState(student.id)
    const [schoolYear, setSchoolYear]=useState(student.schoolYear)
    const [admission, setAdmission]=useState(student.admission)
        
        
        
        //use effect is used to validate the inputs against the defined REGEX above
        //the previous constrains have to be verified on the form for teh user to know 
        
        
        useEffect(() => {
          setValidFirstName(NAME_REGEX.test(firstName))
        }, [firstName])
        
        useEffect(() => {
          setValidLastName(NAME_REGEX.test(lastName))
        }, [lastName])
        
        useEffect(() => {
          setValidStudentDob(DOB_REGEX.test(studentDob))
        }, [studentDob])
        
        
        useEffect(() => {
          if (isSuccess) {//if the add of new user using the mutation is success, empty all the individual states and navigate back to the users list
            
            setFirstName('')
            setValidFirstName(false)
            setMiddleName('')
            setLastName('')
            setValidLastName(false)
            setStudentName({firstName:'', middleName:'', lastName:''})
            setStudentDob('')
            setValidStudentDob('')
            setStudentSex('')
            setStudentIsActive(false)
            setStudentYear('')//will be true when the username is validated
            setStudentMother('')
            setStudentFather('')
            setStudentJointFamily('')
            setGardienFirstName('')
            setgardienMiddleName('')
            setGardienLastName('')
            setGardienPhone('')
            setGardienRelation('')
            setStudentGardien([])
            setSchoolyear('')
            setAttendedSchool('')
            setNote('')
            setStudentEducation([])              
            //setDate = useState()
            setOperator('')
            setLastModified({date:'', operator:''})
            setStudentDocuments([])
            setId('')
            setSchoolYear('')
            setAdmission('')
            setAdmissions([])
            Navigate('/students/studentsParent/students/')//will navigate here after saving
          }
        }, [isSuccess, Navigate])//even if no success it will navigate and not show any warning if failed or success
        
        //handlers to get the individual states from the input
        
        
        
        
        
        
        
        const onFirstNameChanged = e => setFirstName(e.target.value)
        const onMiddleNameChanged = e => setMiddleName(e.target.value)
        const onLastNameChanged = e => setLastName(e.target.value)
        const onStudentDobChanged = e => setStudentDob(e.target.value)
        const onStudentSexChanged = e => setStudentSex(e.target.value)
        const onStudentIsActiveChanged = e => setStudentIsActive(e.target.value)
        const onStudentYearChanged = e => setStudentYear(e.target.value)
      const onStudentMotherChanged = e => setStudentMother(e.target.value)
      const onStudentFatherChanged = e => setStudentFather(e.target.value)
      const onStudentJointFamilyChanged = e => setStudentJointFamily(e.target.value)
      const onGardienFirstNameChanged = e => setGardienFirstName(e.target.value)
      const onGardienMiddleNameChanged = e => setgardienMiddleName(e.target.value)  
      const onGardienLastNameChanged = e => setGardienLastName(e.target.value)
      const onGardienPhoneChanged = e => setGardienPhone(e.target.value)
      const onGardienRelationChanged = e => setGardienRelation(e.target.value)
      const onSchoolyearChanged = e => setSchoolyear(e.target.value)
      const onAttendedSchoolChanged = e => setAttendedSchool(e.target.value)
      const onNoteChanged = e => setNote(e.target.value)
      
      //const onDateChanged = e => setDate(e.target.value)
      const onOperatorChanged = e => setOperator(e.target.value)
      const onLastModifiedChanged = e => setLastModified(e.target.value)
      const onStudentDocumentsChanged = e => setStudentDocuments(e.target.value)
      const onIdChanged = e => setId(e.target.value)
      const onSchoolYearChanged = e => setSchoolYear(e.target.value)
      const onAdmissionChanged = e => setAdmission(e.target.value)
      const onAdmissionsChanged = e => setAdmissions(e.target.value)
      
          
        useEffect(()=>{
            setStudentName({firstName:firstName, middleName:middleName, lastName:lastName})},
        [firstName, middleName, lastName])
        useEffect(()=> {
            setStudentGardien([{gardienFirstName:gardienFirstName, gardienMiddleName:gardienMiddleName, gardienLastName:gardienLastName, gardienPhone:gardienPhone, gardienRelation:gardienRelation}])
        }, [gardienFirstName, gardienMiddleName, gardienLastName, gardienPhone, gardienRelation])
        
        useEffect(()=>{
          setStudentEducation(prev=>[...prev,{schoolYear:schoolYear, attendedSchool:attendedSchool, note:note}])},
          [schoolYear, attendedSchool, note])
        useEffect(()=> {
            setLastModified([{date:'', operator:operator}])
          }, [date, operator])
          
        useEffect(()=>{
          setStudentDocuments(prev=>[...prev,{id:id}])},
          [id])
          useEffect(()=> {
            setAdmissions(prev=>[...prev,{schoolYear:schoolYear, admission:admission}])
        }, [schoolYear, admission])
        
        
        //to check if we can save before onsave, if every one is true, and also if we are not loading status
        const canSave = [validFirstName, validLastName, validStudentDob, studentSex ].every(Boolean) && !isLoading
        
       
        const onSaveStudentClicked = async (e) => {  
            //generate the objects before saving
            //console.log(` 'first name' ${userFirstName}', fullfirstname,' ${userFullName.userFirstName}', house: '${house}', usercontact house' ${userContact.house},    ${userRoles.length},${isParent}, ${isEmployee}` )
            await updateStudent({ studentName, studentDob, studentSex, studentIsActive, studentYear, studentPhoto, studentJointFamily  })//we call the add new user mutation and set the arguments to be saved
            //added this to confirm save
            if (isError) {console.log('error savingg', error)//handle the error msg to be shown  in the logs??
            }
          }
        
        const handleCancel= ()=>{
          Navigate ('/students/studentsParents/students/')
        }
        
        //the error messages to be displayed in every case according to the class we put in like 'form input incomplete... which will underline and highlight the field in that cass
        const errClass = isError ? "errmsg" : "offscreen"
        //const validStudentClass = !validStudentName ? 'form__input--incomplete' : ''
        //const validPwdClass = !validPassword ? 'form__input--incomplete' : ''
        //const validRolesClass = !Boolean(userRoles.length) ? 'form__input--incomplete' : ''
        
        let content
      
      content = (<>
        <StudentsParents/>
        
              <p className={errClass}>{error?.data?.message}</p>  {/*will display if there is an error message, some of the error messagees are defined in the back end responses*/}
  
              <form className="form" onSubmit={e=>e.preventDefault()}>
                  <div className="form__title-row">
                      <h2>Edit Student Form</h2>
                      
                  </div>
                  <div>
                  <label className="form__label" htmlFor="firstName">
                      First Name* : <span className="nowrap">[3-20 letters]</span></label>
                  <input
                      className=''
                      id="firstName"
                      name="firstName"
                      type="text"
                      autoComplete="off"
                      value={firstName}
                      onChange={onFirstNameChanged}
                  />
                  <label className="form__label" htmlFor="middleName">
                     Middle Name : <span className="nowrap"></span></label>
                  <input
                      className=''
                      id="middleName"
                      name="middleName"
                      type="text"
                      autoComplete="off"
                      value={middleName}
                      onChange={onMiddleNameChanged}
                  />
                  </div>
                  <div>
                  <label className="form__label" htmlFor="lastName">
                      Last Name* : <span className="nowrap">[3-20 letters]</span></label>
                  <input
                      className=''
                      id="lastName"
                      name="lastName"
                      type="text"
                      autoComplete="off"
                      value={lastName}
                      onChange={onLastNameChanged}
                  />
                   <label className="form__label" htmlFor="userDob">
                      Date Of Birth* : <span className="nowrap">[dd/mm/yyyy]</span></label>
                  <input
                      className=''
                      id="studentDob"
                      name="studentDob"
                      type="date"
                      autoComplete="off"
                      value={studentDob}
                      onChange={onStudentDobChanged}
                  />
                  </div>
                  <div>
                  <label> <div style={{ marginTop: '10px' }}>
                      User Sex: {studentSex}
                  </div><br/>
                      <input
                      type="radio"
                      value="Male"
                      checked={studentSex === 'Male'}
                      onChange={onStudentSexChanged}
                      />
                      Male
                  </label>
  
                  <label style={{ marginLeft: '10px' }}>
                      <input
                      type="radio"
                      value="Female"
                      checked={studentSex === 'Female'}
                      onChange={onStudentSexChanged}
                      />
                      Female
                  </label>
  
                  
                  </div>
                 
                  <label>
                    <input
                    type="checkbox"
                    value={studentIsActive}
                    checked={studentIsActive}
                    onChange={onStudentIsActiveChanged}
                    />
                    Student Is Active
                    </label>
                   <label className="form__label" htmlFor="StudentYear">
                      studentYear* :wiil get form acaamdeic years selection later <span className="nowrap">[8-20 chars incl. !@#$-_%]</span></label>
                  <input
                      className=''
                      id="studentYear"
                      name="studentYear"
                      type="studentYear"
                      value={studentYear}
                      onChange={onStudentYearChanged}
                  />
                  <label>
                    <input
                    type="checkbox"
                    value={studentJointFamily}
                    checked={studentJointFamily}
                    onChange={onStudentJointFamilyChanged}
                    />
                    Student Joint family
                    </label>
                 
                  
                  <label className="form__label" htmlFor="gardienFirstName">
                      Gardien First Name : <span className="nowrap">[3-20 letters]</span></label>
                  <input
                      className=''
                      id="gardienFirstName"
                      name="gardienFirstName"
                      type="text"
                      autoComplete="off"
                      value={gardienFirstName}
                      onChange={onGardienFirstNameChanged}
                  />
                  <label className="form__label" htmlFor="gardienMiddleName">
                      Gardien Middle Name : <span className="nowrap"></span></label>
                  <input
                      className=''
                      id="gardienMiddleName"
                      name="gardienMiddleName"
                      type="text"
                      autoComplete="off"
                      value={gardienMiddleName}
                      onChange={onGardienMiddleNameChanged}
                  />
                  <label className="form__label" htmlFor="gardienLastName">
                      Gardien Last Name : <span className="nowrap">[3-20 letters]</span></label>
                  <input
                      className=''
                      id="gardienLastName"
                      name="gardienLastName"
                      type="text"
                      autoComplete="off"
                      value={gardienLastName}
                      onChange={onGardienLastNameChanged}
                  />
                  <label className="form__label" htmlFor="gardienRelation">
                      Gardien Relation : <span className="nowrap">[3-20 letters]</span></label>
                  <input
                      className=''
                      id="gardienRelation"
                      name="gardienRelation"
                      type="text"
                      autoComplete="off"
                      value={gardienRelation}
                      onChange={onGardienRelationChanged}
                  />
                  <label className="form__label" htmlFor="gardienPhone">
                      Gardien Phone : <span className="nowrap"></span></label>
                  <input
                      className=''
                      id="gardienPhonee"
                      name="gardienPhone"
                      type="text"
                      autoComplete="off"
                      value={gardienPhone}
                      onChange={onGardienPhoneChanged}
                  />
                  <label className="form__label" htmlFor="schoolYear">
                      School Year : <span className="nowrap"></span></label>
                  <input
                      className=''
                      id="schoolYear"
                      name="schoolYear"
                      type="text"
                      autoComplete="off"
                      value={schoolYear}
                      onChange={onSchoolYearChanged}
                  />
                  <div>
                  <label className="form__label" htmlFor="attendedSchool">
                      Attended School: <span className="nowrap"></span></label>
                  <input
                      className=''
                      id="attendedSchool"
                      name="attendedSchool"
                      type="text"
                      autoComplete="off"
                      value={attendedSchool}
                      onChange={onAttendedSchoolChanged}
                  />
                  <label className="form__label" htmlFor="note">
                      Note : <span className="nowrap"></span></label>
                  <input
                      className=''
                      id="note"
                      name="note"
                      type="text"
                      autoComplete="off"
                      value={note}
                      onChange={onNoteChanged}
                  />
                  </div>
                 
                <div className="flex justify-end items-center space-x-4">
                      <button 
                          className=" px-4 py-2 bg-green-500 text-white rounded"
                          type='submit'
                          title="Save"
                          onClick={onSaveStudentClicked}
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

export default EditStudentForm