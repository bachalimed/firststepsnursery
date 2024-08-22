        import React from 'react'
        import StudentsParents from '../StudentsParents'

        import { useGetAttendedSchoolsQuery } from '../../AppSettings/AcademicsSet/attendedSchools/attendedSchoolsApiSlice'
        import { useState, useEffect } from "react"
        import { useAddNewStudentMutation } from "./studentsApiSlice"
        import { useNavigate } from "react-router-dom"
        import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
        import { faSave } from "@fortawesome/free-solid-svg-icons"
        import { ROLES } from "../../../config/UserRoles"
        import { ACTIONS } from "../../../config/UserActions"
        import useAuth from '../../../hooks/useAuth'
        import { useSelectedAcademicYear } from "../../../hooks/useSelectedAcademicYears"
        import { useSelector } from 'react-redux'
        import { selectAllAcademicYears } from '../../AppSettings/AcademicsSet/AcademicYears/academicYearsApiSlice'
        import { useGetAcademicYearsQuery } from '../../AppSettings/AcademicsSet/AcademicYears/academicYearsApiSlice'
        //constrains on inputs when creating new user
        const USER_REGEX = /^[A-z]{6,20}$/
        const PWD_REGEX = /^[A-z0-9!@#-_$%]{8,20}$/
        const NAME_REGEX= /^[A-z 0-9]{3,20}$/
        const PHONE_REGEX= /^[0-9]{6,15}$/
        const DOB_REGEX = /^[0-9/-]{4,10}$/
        const EMAIL_REGEX = /^[A-z0-9.@-_]{6,20}$/

    const NewStudentForm = () => {
       
       const [selectedYear, setSelectedYear] = useState('')
        const Navigate = useNavigate()
        const academicYears = useSelector(selectAllAcademicYears)// to be used to show all academic years

      const [addNewStudent, {//an object that calls the status when we execute the newUserForm function
          isLoading,
          isSuccess,
          isError,
          error
      }] = useAddNewStudentMutation()//it will not execute the mutation nownow but when called
  
      //prepare the permission variables
 const{userId,canEdit, canDelete, canAdd, canCreate, isParent, status2}=useAuth()

 const {
    data: attendedSchoolsList,//the data is renamed parents
    isLoading: schoolIsLoading,//monitor several situations
    isSuccess: schoolIsSuccess,
    isError: schoolIsError,
    error: schoolError
  } = useGetAttendedSchoolsQuery({endpointName: 'attendedSchoolsList'}||{},{//this inside the brackets is using the listeners in store.js to update the data we use on multiple access devices
    //pollingInterval: 60000,//will refetch data every 60seconds
    refetchOnFocus: true,//when we focus on another window then come back to the window ti will refetch data
    refetchOnMountOrArgChange: true//refetch when we remount the component
  })

let attendedSchools
if (schoolIsSuccess){
    const {entities} = attendedSchoolsList
    attendedSchools = Object.values(entities)
    console.log(attendedSchools)
}

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

let yearsList
if (yearIsSuccess){
    const {entities} = academicYearsList
    yearsList = Object.values(entities)
    console.log(yearsList)
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
        const [studentName, setStudentName] = useState({})
        const [firstName, setFirstName] = useState('')
        const [validFirstName, setValidFirstName] = useState(false)
        const [middleName, setMiddleName] = useState('')
        const [lastName, setLastName] = useState('')
        const [validLastName, setValidLastName] = useState(false)
        const [ studentDob,setStudentDob ]= useState('')
        const [ validStudentDob,setValidStudentDob ]= useState('')
        const [ studentSex,setStudentSex ]= useState('')
        const [studentIsActive, setStudentIsActive] = useState(prev => !prev)

        const [academicYear, setAcademicYear] = useState('')
        const [studentYears, setStudentYears] = useState([])
        const [studentJointFamily, setStudentJointFamily] = useState('')
        const [studentPhoto, setStudentPhoto] = useState({})
        
        const [studentMother, setStudentMother] = useState('')
        const [studentFather, setStudentFather] = useState('')
        const [studentGardien, setStudentGardien] = useState('')
        const [gardienFirstName, setGardienFirstName] = useState('')
        const [gardienMiddleName, setgardienMiddleName] = useState('')
        const [gardienLastName, setGardienLastName] = useState('')
        const [gardienPhone, setGardienPhone] = useState('')
        const [gardienRelation, setGardienRelation] = useState('')
        
        const [educationYear, setEducationYear] = useState('')
        const [note, setNote] = useState('')
        const [attendedSchool, setAttendedSchool] = useState('')
        const [studentEducation, setStudentEducation] = useState([])
        const [lastModified, setLastModified]=useState({})
        const [date, setDate] = useState('')//the exact date time of saving will be saved in the backend
        const [operator, setOperator]=useState(userId)//id of the user logged in already
        const [studentDocuments, setStudentDocuments]=useState([])
        const [admissions, setAdmissions]=useState([])
        const [id, setId]=useState('')
        const [schoolYear, setSchoolYear]=useState('')
        const [admission, setAdmission]=useState('')
      
      
            
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
            setStudentPhoto({})
            setStudentSex('')
            setStudentIsActive(false)
            setStudentYears('')//will be true when the username is validated
            setStudentMother('')
            setStudentFather('')
            setStudentJointFamily('')
            setGardienFirstName('')
            setgardienMiddleName('')
            setGardienLastName('')
            setGardienPhone('')
            setGardienRelation('')
            setStudentGardien({gardienFirstName:'', gardienMiddleName:'', gardienlastName:'', gardienPhone:''})
            setEducationYear('')
            setAttendedSchool('')
            setNote('')
            setStudentEducation([{ educationYear: '', attendedSchool: '', note: '' }])           
            //setDate = useState()
            setOperator('')
            setLastModified({date:'', operator:''})
            setStudentDocuments([])
            setId('')
            setSchoolYear('')
            setAdmission('')
            setAdmissions([])
            Navigate('/students/studentsParents/students')//will navigate here after saving
          }
      }, [isSuccess, Navigate])//even if no success it will navigate and not show any warning if failed or success
  
      //handlers to get the individual states from the input







      const onFirstNameChanged = e => setFirstName(e.target.value)
      const onMiddleNameChanged = e => setMiddleName(e.target.value)
      const onLastNameChanged = e => setLastName(e.target.value)
      const onStudentDobChanged = e => setStudentDob(e.target.value)
      const onStudentSexChanged = e => setStudentSex(e.target.value)
      const onStudentIsActiveChanged = e => setStudentIsActive((prev)=>!prev)
      //const onAcademicYearChanged = e => setAcademicYear(e.target.value)
      
      const onStudentMotherChanged = e => setStudentMother(e.target.value)
      const onStudentFatherChanged = e => setStudentFather(e.target.value)
      const onStudentJointFamilyChanged = e => setStudentJointFamily((prev)=>!prev)
      const onGardienFirstNameChanged = e => setGardienFirstName(e.target.value)
      const onGardienMiddleNameChanged = e => setgardienMiddleName(e.target.value)  
      const onGardienLastNameChanged = e => setGardienLastName(e.target.value)
      const onGardienPhoneChanged = e => setGardienPhone(e.target.value)
      const onGardienRelationChanged = e => setGardienRelation(e.target.value)
      const onEducationYearChanged = e => setEducationYear(e.target.value)
      const onAttendedSchoolChanged = e => setAttendedSchool(e.target.value)
      const onNoteChanged = e => setNote(e.target.value)
      //const onStudentEducationChanged = e => setStudentEducation(e.target.value)
      //const onDateChanged = e => setDate(e.target.value)
    //   const onOperatorChanged = e => setOperator(e.target.value)//it is imopprted from usAuth already
      //const onLastModifiedChanged = e => setLastModified(e.target.value)// this will be done in the backend when saving
      const onStudentDocumentsChanged = e => setStudentDocuments(e.target.value)
      const onIdChanged = e => setId(e.target.value)
      const onSchoolYearChanged = e => setSchoolYear(e.target.value)
      const onAdmissionChanged = e => setAdmission(e.target.value)
      const onAdmissionsChanged = e => setAdmissions(e.target.value)
      
      
  
      //adds to the previous entries in arrays for gardien, schools...
      const onAcademicYearChanged = (e) => {
        const { value, checked } = e.target
        setStudentYears((prevYears) => 
          checked 
            ? [...prevYears, { academicYear: value }] 
            : prevYears.filter((year) => year.academicYear !== value)
        )
      }
 
 // to deal with student education entries:
 // Handler to update an entry field
 const handleFieldChange = (index, field, value) => {
    const updatedEntries = [...studentEducation];
    updatedEntries[index][field] = value;
    setStudentEducation(updatedEntries);
  };

  // Handler to add a new education entry
  const handleAddEntry = () => {
    setStudentEducation([
      ...studentEducation,
      { academicYear: '', attendedSchool: '', note: '' }
    ]);
  };

  // Handler to remove an education entry
  const handleRemoveEntry = (index) => {
    const updatedEntries = studentEducation.filter((_, i) => i !== index);
    setStudentEducation(updatedEntries);
  };
  
       
        // //check if the parent and employee id is available or delete the variable
        // if (isParent===''){ setIsParent(undefined)}
        // if (isEmployee===''){ setIsEmployee(undefined)}
        
        useEffect(()=>{
            setStudentName({firstName:firstName, middleName:middleName, lastName:lastName})},
        [firstName, middleName, lastName])
        useEffect(()=> {
            setStudentGardien([{gardienFirstName:gardienFirstName, gardienMiddleName:gardienMiddleName, gardienLastName:gardienLastName, gardienPhone:gardienPhone, gardienRelation:gardienRelation}])
        }, [gardienFirstName, gardienMiddleName, gardienLastName, gardienPhone, gardienRelation])
  
        // useEffect(()=>{
        //     setStudentEducation({schoolYear:schoolYear, attendedSchool:attendedSchool, note:note})},
        // [schoolYear, attendedSchool, note])
        useEffect(()=> {
            setLastModified([{date:'', operator:operator}])
        }, [date, operator])
  
        useEffect(()=>{
            setStudentDocuments({id:id})},
        [id])
        // useEffect(()=> {
        //     setAdmissions([{schoolYear:schoolYear, admission:admission}])
        // }, [schoolYear, admission])
  
  
        //to check if we can save before onsave, if every one is true, and also if we are not loading status
      const canSave = [validFirstName, validLastName, studentYears, validStudentDob, studentSex ].every(Boolean) && !isLoading
        
      const onSaveStudentClicked = async (e) => {
          e.preventDefault()
          
          if (canSave) {//if cansave is true
              //generate the objects before saving
              console.log(studentName, studentDob, studentSex, studentIsActive, studentYears, studentPhoto, studentJointFamily, studentEducation)
              await addNewStudent({ studentName, studentDob, studentSex, studentIsActive, studentYears, studentPhoto, studentJointFamily, studentEducation  })//we call the add new user mutation and set the arguments to be saved
              //added this to confirm save
              if (isError) {console.log('error savingg', error)//handle the error msg to be shown  in the logs??
              }
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
  
      
      const content = (<>
        <StudentsParents/>
        
              <p className={errClass}>{error?.data?.message}</p>  {/*will display if there is an error message, some of the error messagees are defined in the back end responses*/}
  
              <form className="form" onSubmit={onSaveStudentClicked}>
                  <div className="form__title-row">
                      <h2>New Student Form</h2>
                      
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
                      Student Sex* : {studentSex || 'None'}
                  </div>
                      <input
                      type="checkbox"
                      value="Male"
                      checked={studentSex === 'Male'}
                      onChange={onStudentSexChanged}
                      />
                      Male
                  </label>
  

                  <label style={{ marginLeft: '10px' }}>
                      <input
                      type="checkbox"
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


                    <h1>Student Year* : </h1>
                    <div className="flex flex-wrap space-x-4">
                       
                            <label >
                            <input
                            type="checkbox"
                            value={selectedYear}
                            checked={studentYears.some(year => year.academicYear === selectedYear)}
                            onChange={onAcademicYearChanged}
                            />
                            {selectedYear}
                            </label>
                     
                        </div>

                  <label>
                    <input
                    type="checkbox"
                    value={studentJointFamily}
                    checked={studentJointFamily}
                    onChange={onStudentJointFamilyChanged}
                    />
                    Student Joint family
                    </label>
                   
                   
                  
                 





                  <div>
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
                  </div>
                  

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
                  <div>
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
                  </div>
                <h1>Student Education</h1>
                        {Array.isArray(studentEducation)&&(studentEducation.length!=0)&&(studentEducation.map((entry, index) => (
                            <div key={index} className="education-entry">
                            <div>
                                <label htmlFor={`educationYear-${index}`}>educationYear:</label>
                                <select
                                id={`educationYear-${index}`}
                                value={entry.educationYear}
                                onChange={(e) => handleFieldChange(index, 'educationYear', e.target.value)}
                                >
                                <option value="">Select Year</option>
                                {yearsList.map((year) => (
                                    <option key={year.id} value={year.id}>
                                    {year.title}
                                    </option>
                                ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor={`attendedSchool-${index}`}>Attended School:</label>
                                <select
                                id={`attendedSchool-${index}`}
                                value={entry.attendedSchool}
                                onChange={(e) => handleFieldChange(index, 'attendedSchool', e.target.value)}
                                >
                                <option value="">Select School</option>
                                { schoolIsSuccess&&(attendedSchools.map((school) => (
                                    <option key={school.id} value={school.id}>
                                    {school.schoolName}
                                    </option>
                                )))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor={`note-${index}`}>Note:</label>
                                <input
                                id={`note-${index}`}
                                type="text"
                                value={entry.note}
                                onChange={(e) => handleFieldChange(index, 'note', e.target.value)}
                                />
                            </div>

                            <button type="button" onClick={() => handleRemoveEntry(index)}>Remove Entry</button>
                            </div>
                        )))}

                        <button type="button" className=" px-4 py-2 bg-blue-200 text-white rounded" onClick={handleAddEntry}>Add Student Education</button>

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
export default NewStudentForm