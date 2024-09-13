import { useState, useEffect } from "react"
import { useAddNewFamilyMutation } from "./familiesApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from "@fortawesome/free-solid-svg-icons"
import { ROLES } from "../../../../config/UserRoles"
import { ACTIONS } from "../../../../config/UserActions"
import StudentsParents from '../../StudentsParents'
import { useGetFamiliesByYearQuery } from "./familiesApiSlice"
import { useGetStudentsByYearQuery } from "../Students/studentsApiSlice"
import { useContext } from "react"
import { StepperContext } from "../../../../contexts/StepperContext"
//constrains on inputs when creating new parent
const USER_REGEX = /^[A-z0-9]{6,20}$/
const PWD_REGEX = /^[A-z0-9!@#-_$%]{8,20}$/
const NAME_REGEX= /^[A-z 0-9]{3,20}$/
const PHONE_REGEX= /^[0-9]{6,15}$/
const DOB_REGEX = /^[0-9/-]{4,10}$/
const EMAIL_REGEX = /^[A-z0-9.@-_]{6,20}$/

export default function NewMotherForm () {//an add parent function that can be called inside the component
 //const {userData, setUserData} = useContext(StepperContext)
 const {mother, setMother} = useContext(StepperContext)
 const{familySituation, setFamilySituation }= useContext(StepperContext)


//  const handleChange=(e)=>{
//     const {name, value} = e.target
//     setUserData({...userData, [name]:value})
//  }

      const generateRandomUsername = () => {
        const randomChars = Math.random().toString(36).substring(2, 10); // generate random characters
        return `user${randomChars}`; // prefix with 'user'
    };
    const Navigate = useNavigate()


    //initialisation of states for each input
    const [username, setUsername] = useState(generateRandomUsername())
    // const [validUsername, setValidUsername] = useState(false)//will be true when the parentname is validated
    const [password, setPassword] = useState('12345678')
    // const [validPassword, setValidPassword] = useState(false)//will be true when the passwrod is validated
    const [userRoles, setUserRoles] = useState(["Parent"])//the roles array is defaulted to employee
    const [userAllowedActions, setUserAllowedActions] = useState([])
    const [userFullName, setUserFullName] = useState('')
    const [validUserFullName, setValidUserFullName] = useState(false)
    const [userFirstName, setUserFirstName] = useState('')
    const [validUserFirstName, setValidUserFirstName] = useState(false)
    const [userMiddleName, setUserMiddleName] = useState('')
    const [userLastName, setUserLastName] = useState('')
    const [validUserLastName, setValidUserLastName] = useState(false)
    const[ isParent,setIsParent ]= useState('')
    const[ userDob,setUserDob ]= useState('')
    const[ userSex,setUserSex ]= useState('Female')
    const[ validUserDob,setValidUserDob ]= useState(false)
    const[ userIsActive,setUserIsActive ]= useState(false)
    const[ userAddress,setUserAddress ]= useState('')
    const[ validUserAddress,setValidUserAddress ]= useState(false)
    const[ house,setHouse ]= useState('')
    const[ validHouse,setValidHouse ]= useState(false)
    const[ street,setStreet ]= useState('')
    const[ validStreet,setValidStreet ]= useState(false)
    const[ area,setArea ]= useState('')
    const[ validArea,setValidArea ]= useState(false)
    const[ postCode,setPostCode ]= useState('')
    const[ validPostCode,setValidPostCode ]= useState(false)
    const[ city,setCity ]= useState('')
    const[ validCity,setValidCity ]= useState(false)
    const[userContact, setUserContact ]= useState('')
    const[validParentContact, setValidParentContact ]= useState(false)
    const[primaryPhone, setPrimaryPhone ]= useState()
    const[validPrimaryPhone, setValidPrimaryPhone ]= useState(false)
    const[secondaryPhone, setSecondaryPhone ]= useState()
    const[email, setEmail ]= useState('')
    const[validEmail, setValidEmail ]= useState(false)
    
    

//use effect is used to validate the inputs against the defined REGEX above
//the previous constrains have to be verified on the form for teh parent to know 
    // useEffect(() => {
    //     setValidUsername(USER_REGEX.test(username))
    // }, [username])

    // useEffect(() => {
    //     setValidPassword(PWD_REGEX.test(password))
    // }, [password])

    useEffect(() => {
        setValidUserFirstName(NAME_REGEX.test(userFirstName))
    }, [userFirstName])

    useEffect(() => {
        setValidUserLastName(NAME_REGEX.test(userLastName))
    }, [userLastName])

    useEffect(() => {
        setValidUserDob(DOB_REGEX.test(userDob))
    }, [userDob])

    useEffect(() => {
        setValidStreet(NAME_REGEX.test(street))
    }, [street])

    useEffect(() => {
        setValidPrimaryPhone(PHONE_REGEX.test(primaryPhone))
    }, [primaryPhone])

   
    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email))
    }, [email])

    //handlers to get the individual states from the input
    //const onUsernameChanged = e => setUsername(e.target.value)
    //const onPasswordChanged = e => setPassword(e.target.value)
    const onUserFirstNameChanged = e => setUserFirstName(e.target.value)
    const onUserMiddleNameChanged = e => setUserMiddleName(e.target.value)
    const onUserLastNameChanged = e => setUserLastName(e.target.value)
    const onUserDobChanged = e => setUserDob(e.target.value)
    const onUserSexChanged = e => setUserSex(e.target.value)
    const onFamilySituationChanged = e => setFamilySituation(e.target.value)
    const onHouseChanged = e => setHouse(e.target.value)
    const onStreetChanged = e => setStreet(e.target.value)
    const onAreaChanged = e => setArea(e.target.value)
    const onPostCodeChanged = e => setPostCode(e.target.value)
    const onCityChanged = e => setCity(e.target.value)
    const onPrimaryPhoneChanged = e => setPrimaryPhone(e.target.value)
    const onSecondaryPhoneChanged = e => setSecondaryPhone(e.target.value)
    const onEmailChanged = e => setEmail(e.target.value)
 

//we do not  need to retriev the employee and parent ids from the DB ans set their state because they are saved before the parent
//check if the parent and employee id is available or delete the variable


useEffect(()=>{
setUserFullName({userFirstName:userFirstName, userMiddleName:userMiddleName, userLastName:userLastName})},
[userFirstName, userMiddleName, userLastName])

useEffect(()=>{
setUserAddress({house:house, street:street, area:area, postCode:postCode, city:city})},
[house, street, street, area, postCode, city])

useEffect(()=>{
setUserContact({primaryPhone:primaryPhone, secondaryPhone:secondaryPhone, email:email})},
[primaryPhone, secondaryPhone, email])
useEffect(()=>{
    setMother({ username, password,  userFullName, isParent,  userDob, userSex,  userIsActive, userRoles,  userAllowedActions, userAddress, userContact })},
[username, password,  userFullName, isParent,  userDob, userSex,  userIsActive, userRoles,  userAllowedActions, userAddress, userContact])

//to check if we can save before onsave, if every one is true, and also if we are not loading status
   // const canSave = [validUserFirstName, validUserLastName, validUserDob, userSex, validStreet,  validPrimaryPhone, userRoles.length ].every(Boolean) && !isAddFamilyLoading
//console.log(` ${validUserFirstName}, ${validUserLastName}, ${validUsername}, ${validPassword}, ${validUserDob},${userSex}    ${ validStreet},  ${validPrimaryPhone},  ${userRoles.length}` )
    // const onSaveFatherClicked = async (e) => {
    //     e.preventDefault()
        
    //     if (canSave) {//if cansave is true
    //         //generate the objects before saving
            
    //         await addNewFamily({father:father, familySituation:familySituation})//we call the add new parent mutation and set the arguments to be saved
    //         //added this to confirm save
            
            
    //         if (isAddFamilyError) {console.log('error savingg', addFamilyError)//handle the error msg to be shown  in the logs??
    //         }
    //     }
    // }
    // const handleCancel= ()=>{
    //     Navigate ('/students/studentsParents/families/')
    // }
   
//the error messages to be displayed in every case according to the class we put in like 'form input incomplete... which will underline and highlight the field in that cass
    // const errClass = isAddFamilyError ? "errmsg" : "offscreen"
    
   // const validRolesClass = !Boolean(userRoles.length) ? 'form__input--incomplete' : ''


    const content = (
        <div className="flex flex-col p-4 space-y-6">
       
            {/* <p className={errClass}>{addFamilyError?.data?.message}</p>  */}
             {/*will display if there is an error message, some of the error messagees are defined in the back end responses*/}

            <form className="w-full flex flex-col space-y-4" >
                {/* onSubmit={onSaveFatherClicked}> */}
                <div className="form__title-row mb-4">
                    <h2 className="text-xl font-semibold">Mother Details</h2>
                    
                </div>
                
                <label className="form__label" htmlFor="userFirstName">
                    Mother First Name* : <span className="nowrap">[3-20 letters]</span></label>
                <input
                    className={`form__input w-full`}
                    id="userFirstName"
                    name="userFirstName"
                    type="text"
                    autoComplete="off"
                    value={userFirstName}
                    onChange={onUserFirstNameChanged}
                />
                <label className="form__label" htmlFor="userMiddleName">
                    Mother Middle Name : <span className="nowrap"></span></label>
                <input
                    className={`form__input w-full`}
                    id="userMiddleName"
                    name="userMiddleName"
                    type="text"
                    autoComplete="off"
                    value={userMiddleName}
                    onChange={onUserMiddleNameChanged}
                />
                
                <div>
                <label className="form__label" htmlFor="userLastName">
                    Mother Last Name* : <span className="nowrap">[3-20 letters]</span></label>
                <input
                    className={`form__input w-full nowrap`}
                    id="userLastName"
                    name="userLastName"
                    type="text"
                    autoComplete="off"
                    value={userLastName}
                    onChange={onUserLastNameChanged}
                />
                 <label className="form__label" htmlFor="userDob">
                    Date Of Birth* : <span className="nowrap">[dd/mm/yyyy]</span></label>
                <input
                    className={`form__input `}
                    id="userDob"
                    name="userDob"
                    type="date"
                    autoComplete="off"
                    value={userDob}
                    onChange={onUserDobChanged}
                />
                </div>
            
               
                
                <label className="form__label" htmlFor="house">
                    House* : <span className="nowrap">[3-20 letters]</span></label>
                <input
                    className={`form__input `}
                    id="house"
                    name="house"
                    type="text"
                    autoComplete="off"
                    value={house}
                    onChange={onHouseChanged}
                />
                <label className="form__label" htmlFor="street">
                    Street* : <span className="nowrap">[3-20 letters]</span></label>
                <input
                    className={`form__input `}
                    id="street"
                    name="street"
                    type="text"
                    autoComplete="off"
                    value={street}
                    onChange={onStreetChanged}
                />
                <div>
                <label className="form__label" htmlFor="area">
                    Area: <span className="nowrap"></span></label>
                <input
                    className={`form__input `}
                    id="area"
                    name="area"
                    type="text"
                    autoComplete="off"
                    value={area}
                    onChange={onAreaChanged}
                />
                <label className="form__label" htmlFor="city">
                    City* : <span className="nowrap">[3-20 letters]</span></label>
                <input
                    className={`form__input `}
                    id="city"
                    name="city"
                    type="text"
                    autoComplete="off"
                    value={city}
                    onChange={onCityChanged}
                />
                </div>
                <label className="form__label" htmlFor="postCode">
                    Post Code: <span className="nowrap"></span></label>
                <input
                    className={`form__input `}
                    id="postCode"
                    name="postCode"
                    type="text"
                    autoComplete="off"
                    value={postCode}
                    onChange={onPostCodeChanged}
                />
                <div>
                <label className="form__label" htmlFor="primaryPhone">
                    Primary Phone* : <span className="nowrap">[6 to 15 Digits]</span></label>
                <input
                    className={`form__input `}
                    id="primaryPhone"
                    name="primaryPhone"
                    type="tel"
                    autoComplete="off"
                    value={primaryPhone}
                    onChange={onPrimaryPhoneChanged}
                />

                <label className="form__label" htmlFor="secondaryPhone">
                    Secondary Phone: <span className="nowrap"></span></label>
                <input
                    className={`form__input `}
                    id="secondaryPhone"
                    name="secondaryPhone"
                    type="tel"
                    autoComplete="off"
                    value={secondaryPhone}
                    onChange={onSecondaryPhoneChanged}
                />
                </div>
                <label className="form__label" htmlFor="email">
                    Email: <span className="nowrap"></span></label>
                <input
                    className={`form__input `}
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="off"
                    value={email}
                    onChange={onEmailChanged}
                />
                
               

                    
              
{/* 
              <div className="flex justify-end items-center space-x-4">
                    <button 
                        className=" px-4 py-2 bg-green-500 text-white rounded"
                        type='submit'
                        title="Save"
                        onClick={onSaveFatherClicked}
                        disabled={!canSave}//||!stepSuccess}
                        >
                        Save Father
                    </button>
                    <button 
                    className=" px-4 py-2 bg-red-500 text-white rounded"
                    onClick={handleCancel }
                    >
                    Cancel
                    </button>
                </div> */}


            </form>
        </div>
    )

    return content
}
