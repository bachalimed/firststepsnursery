        import React from 'react'
        import StudentsParents from '../../StudentsParents'

        import { useGetAttendedSchoolsQuery } from '../../../AppSettings/AcademicsSet/attendedSchools/attendedSchoolsApiSlice'
        import { useState, useEffect } from "react"
        import { useAddNewStudentMutation } from "./studentsApiSlice"
        import { useNavigate } from "react-router-dom"
        import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
        import { faSave } from "@fortawesome/free-solid-svg-icons"
        import { ROLES } from "../../../../config/UserRoles"
        import { ACTIONS } from "../../../../config/UserActions"
        import useAuth from '../../../../hooks/useAuth'
        import { useSelectedAcademicYear } from "../../../../hooks/useSelectedAcademicYear"
        import { useSelector } from 'react-redux'
       
        import { useGetAcademicYearsQuery, selectAllAcademicYears } from '../../../AppSettings/AcademicsSet/AcademicYears/academicYearsApiSlice'
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
    //console.log(attendedSchools)
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

        const [academicYear, setAcademicYear] = useState(null)
        const [studentYears, setStudentYears] = useState([])
        //const [studentJointFamily, setStudentJointFamily] = useState(true)
        const [studentGardien, setStudentGardien] = useState([])
        const [gardienYear, setGardienYear] = useState('')
        const [gardienFirstName, setGardienFirstName] = useState('')
        const [gardienMiddleName, setgardienMiddleName] = useState('')
        const [gardienLastName, setGardienLastName] = useState('')
        const [gardienPhone, setGardienPhone] = useState('')
        const [gardienRelation, setGardienRelation] = useState('')
        
        const [schoolYear, setSchoolYear] = useState('')
        const [note, setNote] = useState('')
        const [attendedSchool, setAttendedSchool] = useState('')
        const [studentEducation, setStudentEducation] = useState([])

        const [operator, setOperator]=useState(userId)//id of the user logged in already

      
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
      //ensure studentEducation has no empty array
      
  
  
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
            setStudentYears('')//will be true when the username is validated
           
            //setStudentJointFamily(true)
            setGardienFirstName('')
            setgardienMiddleName('')
            setGardienLastName('')
            setGardienPhone('')
            setGardienRelation('')
            setStudentGardien({})
            setSchoolYear('')
            setAttendedSchool('')
            setNote('')
            setStudentEducation([])           
            //setDate = useState()
            setOperator('')
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
 
      //const onStudentJointFamilyChanged = e => setStudentJointFamily((prev)=>!prev)

      const onGardienFirstNameChanged = e => setGardienFirstName(e.target.value)
      const onGardienMiddleNameChanged = e => setgardienMiddleName(e.target.value)  
      const onGardienLastNameChanged = e => setGardienLastName(e.target.value)
      const onGardienPhoneChanged = e => setGardienPhone(e.target.value)
      const onGardienRelationChanged = e => setGardienRelation(e.target.value)
      const onSchoolYearChanged = e => setSchoolYear(e.target.value)
      const onAttendedSchoolChanged = e => setAttendedSchool(e.target.value)
      const onNoteChanged = e => setNote(e.target.value)
      const onStudentEducationChanged = e => setStudentEducation(e.target.value)
      //const onDateChanged = e => setDate(e.target.value)
    //   const onOperatorChanged = e => setOperator(e.target.value)//it is imopprted from usAuth already
        
      //adds to the previous entries in arrays for gardien, schools...
      const onAcademicYearChanged = (e) => {
        const { value, checked } = e.target
        setStudentYears((prevYears) => 
          checked 
            ? [...prevYears, { academicYear: value }] 
            : prevYears.filter((year) => year.academicYear !== value)
        )
      }
      
 // to deal with student gardien entries:
 // Handler to update an entry field
 const handleGardienFieldChange = (index, field, value) => {
    const updatedEntries = [...studentGardien];
    updatedEntries[index][field] = value;
    setStudentGardien(updatedEntries);
  };

  // Handler to add a new gardien entry
  const handleAddGardienEntry = () => {
    setStudentGardien([
      ...studentGardien,
      { gardienFirstName: '', gardienMiddleName: '', gardienLastName: '', gardienPhone: '',gardienRelation: '', gardienYear:''}
    ])
  }

  // Handler to remove an gardien entry
  const handleRemoveGardienEntry = (index) => {
    const updatedEntries = studentGardien.filter((_, i) => i !== index);
    setStudentGardien(updatedEntries);
  };
  

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
      { schoolYear: '', attendedSchool: '', note: '' }
    ])
  }

  // Handler to remove an education entry
  const handleRemoveEntry = (index) => {
    const updatedEntries = studentEducation.filter((_, i) => i !== index);
    setStudentEducation(updatedEntries);
  };
  
        useEffect(()=>{
            setStudentName({firstName:firstName, middleName:middleName, lastName:lastName})},
        [firstName, middleName, lastName])
     
        //to check if we can save before onsave, if every one is true, and also if we are not loading status
      const canSave = [validFirstName, validLastName, studentYears, validStudentDob, studentSex ].every(Boolean) && !isLoading
        
      const onSaveStudentClicked = async (e) => {
          e.preventDefault()
          
          if (canSave) {//if cansave is true
              //generate the objects before saving
              console.log(studentName, studentDob, studentSex, studentIsActive, studentYears,   studentEducation)
              await addNewStudent({ studentName, studentDob, studentSex, studentIsActive, studentYears,   studentEducation , studentGardien, operator  })//we call the add new user mutation and set the arguments to be saved
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
  
      const content = (
        <>
          <StudentsParents />
      
          <p className={`text-red-500 ${errClass}`}>{error?.data?.message}</p> {/* Display error messages */}
      
          <form className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md" onSubmit={onSaveStudentClicked}>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold">New student for the academic year {selectedYear}</h2>
            </div>
      
            <div className="grid gap-6 mb-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="firstName">
                  First Name* <span className="text-gray-500 text-xs">[3-20 letters]</span>
                </label>
                <input
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="off"
                  value={firstName}
                  onChange={onFirstNameChanged}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="middleName">
                  Middle Name
                </label>
                <input
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                  id="middleName"
                  name="middleName"
                  type="text"
                  autoComplete="off"
                  value={middleName}
                  onChange={onMiddleNameChanged}
                />
              </div>
      
              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="lastName">
                  Last Name* <span className="text-gray-500 text-xs">[3-20 letters]</span>
                </label>
                <input
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="off"
                  value={lastName}
                  onChange={onLastNameChanged}
                  required
                />
              </div>
      
              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="studentDob">
                  Date Of Birth* <span className="text-gray-500 text-xs">[dd/mm/yyyy]</span>
                </label>
                <input
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                  id="studentDob"
                  name="studentDob"
                  type="date"
                  autoComplete="off"
                  value={studentDob}
                  onChange={onStudentDobChanged}
                  required
                />
              </div>
            </div>
      
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="male"
                  value="Male"
                  checked={studentSex === 'Male'}
                  onChange={onStudentSexChanged}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  
                />
                <label htmlFor="male" className="ml-2 text-sm font-medium text-gray-700">Male</label>
      
                <input
                  type="checkbox"
                  id="female"
                  value="Female"
                  checked={studentSex === 'Female'}
                  onChange={onStudentSexChanged}
                  className="ml-6 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="female" className="ml-2 text-sm font-medium text-gray-700">Female</label>
              </div>
      
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="active"
                  value={studentIsActive}
                  checked={studentIsActive}
                  onChange={onStudentIsActiveChanged}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="active" className="ml-2 text-sm font-medium text-gray-700">Student Is Active</label>
              </div>
      
              <div className="flex items-center mb-2">
                       
                           
                <input
                type="checkbox"
                id="studentYears"
                value={selectedYear}
                checked={studentYears.some(year => year.academicYear === selectedYear)}
                onChange={onAcademicYearChanged}
                
                 className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                 required
                />
                
            <label htmlFor="studentYears" className="ml-2 text-sm font-medium text-gray-700">Student Year*: {selectedYear}</label>            
                     
             </div>
            </div>
      
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Student Gardien</h3>
              {Array.isArray(studentGardien) && studentGardien.length > 0 && studentGardien.map((entry, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm mb-4">
                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-700" htmlFor={`gardienFirstName-${index}`}>First Name:</label>
                    <input
                      id={`gardienFirstName-${index}`}
                      type="text"
                      value={entry.gardienFirstName}
                      onChange={(e) => handleGardienFieldChange(index, 'gardienFirstName', e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-700" htmlFor={`gardienMiddleName-${index}`}>Middle Name:</label>
                    <input
                      id={`gardienMiddleName-${index}`}
                      type="text"
                      value={entry.gardienMiddleName}
                      onChange={(e) => handleGardienFieldChange(index, 'gardienMiddleName', e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-700" htmlFor={`gardienLastName-${index}`}>Last Name:</label>
                    <input
                      id={`gardienLastName-${index}`}
                      type="text"
                      value={entry.gardienLastName}
                      onChange={(e) => handleGardienFieldChange(index, 'gardienLastName', e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-700" htmlFor={`gardienYear-${index}`}>gardienYear:</label>
                   
                    <select
                        id={`gardienYear-${index}`}
                        value={entry.gardienYear}
                        onChange={(e) => handleGardienFieldChange(index, 'gardienYear', e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                      >
                        <option value="">Select Year</option>
                        {yearsList.map((year) => (
                          <option key={year.id} value={year.title}>
                            {year.title}
                          </option>
                        ))}
                      </select>
                  </div>







                 
                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-700" htmlFor={`gardienRelation-${index}`}>Relation To Student :</label>
                    <input
                      id={`gardienRelation-${index}`}
                      type="text"
                      value={entry.gardienRelation}
                      onChange={(e) => handleGardienFieldChange(index, 'gardienRelation', e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-700" htmlFor={`gardienPhone-${index}`}>Phone Number:</label>
                    <input
                      id={`gardienPhone-${index}`}
                      type="text"
                      value={entry.gardienPhone}
                      onChange={(e) => handleGardienFieldChange(index, 'gardienPhone', e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
      
                  <button
                    type="button"
                    onClick={() => handleRemoveGardienEntry(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove Entry
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={handleAddGardienEntry}
              >
                Add Student Gardien
              </button>
            </div>
      
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Student Education</h3>
              {Array.isArray(studentEducation) && studentEducation.length > 0 && studentEducation.map((entry, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm mb-4">
                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-700" htmlFor={`schoolYear-${index}`}>School Year:</label>
                    <select
                      id={`schoolYear-${index}`}
                      value={entry.schoolYear}
                      onChange={(e) => handleFieldChange(index, 'schoolYear', e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="">Select Year</option>
                      {yearsList.map((year) => (
                        <option key={year.id} value={year.title}>
                          {year.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-700" htmlFor={`attendedSchool-${index}`}>Attended School:</label>
                    <select
                      id={`attendedSchool-${index}`}
                      value={entry.attendedSchool}
                      onChange={(e) => handleFieldChange(index, 'attendedSchool', e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="">Select School</option>
                      {schoolIsSuccess && attendedSchools.map((school) => (
                        <option key={school.id} value={school.id}>
                          {school.schoolName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-700" htmlFor={`note-${index}`}>Note:</label>
                    <input
                      id={`note-${index}`}
                      type="text"
                      value={entry.note}
                      onChange={(e) => handleFieldChange(index, 'note', e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
      
                  <button
                    type="button"
                    onClick={() => handleRemoveEntry(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove Entry
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={handleAddEntry}
              >
                Add Student Education
              </button>
            </div>
      
            <div className="flex justify-end space-x-4">
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                title="Save"
                onClick={onSaveStudentClicked}
                disabled={!canSave}
              >
                Save Changes
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        </>
      );
      
      return content;
    }
export default NewStudentForm