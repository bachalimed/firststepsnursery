import { useState, useEffect } from "react"
import { useAddNewUserMutation } from "./usersApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from "@fortawesome/free-solid-svg-icons"
import { ROLES } from "../../../config/UserRoles"
import SectionTabsDown from '../../../Components/Shared/Tabs/SectionTabsDown'

//constrains on inputs when creating new user
const USER_REGEX = /^[A-z]{6,20}$/
const PWD_REGEX = /^[A-z0-9!@#-_$%]{4,12}$/
const NAME_REGEX= /^[A-z 0-9]{3,20}$/
const PHONE_REGEX= /^[0-9]{6,15}$/
const DOB_REGEX = /^[0-9/-]{4,10}$/
const EMAIL_REGEX = /^[A-z0-9.@-_]{6,20}$/

const NewUserForm = () => {//an add user function that can be called inside the component

    const [addNewUser, {//an object that calls the status when we execute the newUserForm function
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewUserMutation()//it will not execute now but when called

    const navigate = useNavigate()

    const [username, setUsername] = useState('')
    const [validUsername, setValidUsername] = useState(false)//will be true when the username is validated
    const [password, setPassword] = useState('')
    const [validPassword, setValidPassword] = useState(false)//will be true when the passwrod is validated
    const [userRoles, setUserRoles] = useState(["Employee"])//the roles array is defaulted to employee
    const [userFullName, setUserFullName] = useState('')
    const [validUserFullName, setValidUserFullName] = useState(false)
    const [userFirstName, setUserFirstName] = useState('')
    const [validUserFirstName, setValidUserFirstName] = useState(false)
    const [userMiddleName, setUserMiddleName] = useState('')
    const [userLastName, setUserLastName] = useState('')
    const [validUserLastName, setValidUserLastName] = useState(false)
    const[ isParent,setIsParent ]= useState('')
    const[ isEmployee,setIsEmployee ]= useState('')
    const[ userDob,setUserDob ]= useState('')
    const[ validUserDob,setValidUserDob ]= useState(false)
    const[ userIsActive,setUserIsActive ]= useState(false)
    const[ userPhoto,setUserPhoto ]= useState('')
    const[ label,setLabel ]= useState('')
    const[ location,setLocation ]= useState('')
    const[ size,setSize ]= useState()
    const[ format,setFormat ]= useState('')
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
    const[validUserContact, setValidUserContact ]= useState(false)
    const[primaryPhone, setPrimaryPhone ]= useState()
    const[validPrimaryPhone, setValidPrimaryPhone ]= useState(false)
    const[secondaryPhone, setSecondaryPhone ]= useState()
    const[email, setEmail ]= useState('')
    const[validEmail, setValidEmail ]= useState(false)

 
 
//use effect is used to validate the inputs against the defined REGEX above
    useEffect(() => {
        setValidUsername(USER_REGEX.test(username))
    }, [username])

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password))
    }, [password])

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

    useEffect(() => {
        if (isSuccess) {//if it is success, empty all the individual states and navigaet back to the users list
            setUsername('')
            setPassword('')
            setUserRoles([])
            setUserFirstName('')
            setUserMiddleName('')
            setUserLastName('')
            setUserFullName({userFirstName:'', userMiddleName:'', userLastName:''})
            setIsParent('')
            setIsEmployee('')
            setUserDob('')
            setUserIsActive(false)
            setLabel('')
            setLocation('')
            setSize()
            setFormat('')
            setUserPhoto({label:'', location:'', size:'', format:''})
            setHouse('')
            setStreet('')
            setArea('')
            setPostCode('')
            setCity('')
            setUserAddress({house:'', street:'', area:'', postcode:'', city:''})
            setPrimaryPhone()
            setSecondaryPhone()
            setEmail('')
            setUserContact({primaryPhone:'', secondaryPhone:'', email:'' })
            navigate('/admin/usersManagement/users/')//will navigate here after saving
        }
    }, [isSuccess, navigate])//even if no success it will navigate and not show any warning if failed or success

    //handlers to get the individual states from the input
    const onUsernameChanged = e => setUsername(e.target.value)
    const onPasswordChanged = e => setPassword(e.target.value)
    const onUserFirstNameChanged = e => setUserFirstName(e.target.value)
    const onUserMiddleNameChanged = e => setUserMiddleName(e.target.value)
    const onUserLastNameChanged = e => setUserLastName(e.target.value)
    const onIsParentChanged = e => setIsParent(e.target.value)
    const onIsEmployeeChanged = e => setIsEmployee(e.target.value)
    const onUserDobChanged = e => setUserDob(e.target.value)
    const onUserIsActiveChanged = e => setUserIsActive(prev => !prev)//will invert the previous state
    const onLabelChanged = e => setLabel(e.target.value)
    const onLocationChanged = e => setLocation(e.target.value)
    const onSizeChanged = e => setSize(e.target.value)
    const onFormatChanged = e => setFormat(e.target.value)
    
    const onHouseChanged = e => setHouse(e.target.value)
    const onStreetChanged = e => setStreet(e.target.value)
    const onAreaChanged = e => setArea(e.target.value)
    const onPostCodeChanged = e => setPostCode(e.target.value)
    const onCityChanged = e => setCity(e.target.value)
 
    const onPrimaryPhoneChanged = e => setPrimaryPhone(e.target.value)
    const onSecondaryPhoneChanged = e => setSecondaryPhone(e.target.value)
    const onEmailChanged = e => setEmail(e.target.value)
    

    const onUserRolesChanged = (e) => {
        const { value, checked } = e.target;
        setUserRoles((prevRoles) =>
          checked ? [...prevRoles, value] : prevRoles.filter((role) => role !== value)
        )
      }


    // const onUserRolesChanged = e => {//because the roles is a select and allows multiple selections, we get an array from
    //     const values = Array.from(
    //         e.target.selectedOptions, //HTMLCollection that s why we have array from
    //         (option) => option.value// we get the values from options and we put them into Roles array
    //     )
    //     setUserRoles(values)
    // }
//we do not  need to retriev the employee and parent ids from the DB ans set their state because they are saved before the user
//check if the parent and employee id is available or delete the variable
if (isParent===''){ setIsParent(undefined)}
if (isEmployee===''){ setIsEmployee(undefined)}


//to check if we can save before onsave, if every one is true, and also if we are not loading status
    const canSave = [validUserFirstName, validUserLastName, validUsername, validPassword, validUserDob,     validStreet,  validPrimaryPhone, validEmail, userRoles.length ].every(Boolean) && !isLoading
console.log(` ${userFirstName}, ${validUserLastName}, ${validUsername}, ${validPassword}, ${validUserDob},    ${ validStreet},  ${validPrimaryPhone}, ${validEmail}, ${userRoles.length}, ${isParent}, ${isEmployee}, ${userIsActive}` )
    const onSaveUserClicked = async (e) => {
        e.preventDefault()
        
        if (canSave) {//if cansave is true
            //generate the objects before saving
            setUserFullName({userFirstName:userFirstName, userMiddleName:userMiddleName, userLastName:userLastName})
            setUserPhoto({label:label, location:location, size:size, format:format})
            setUserAddress({house:house, street:street, area:area, postCode:postCode, city:city})
            setUserContact({primaryPhone:primaryPhone, secondaryPhone:secondaryPhone, email:email})
            console.log(` 'first name' ${userFirstName}', fullfirstname,' ${userFullName.userFirstName}', house: '${house}', usercontact house' ${userContact.house},    ${userRoles.length},${isParent}, ${isEmployee}` )
            await addNewUser({ username, password,  userFullName, isParent, isEmployee, userDob, userIsActive, userRoles, userPhoto, userAddress, userContact })//we call the add new user mutation and set the arguments to be saved
        }
    }

    // const options = Object.values(ROLES).map(role => {//the options for the roles in the select menu
    //     return (
    //         <option
    //             key={role}
    //             value={role}

    //         > {role}</option >
    //     )
    // })
//the error messages to be displayed in every case according to the class we put in like 'form input incomplete... which will underline and highlight the field in that cass
    const errClass = isError ? "errmsg" : "offscreen"
    const validUserClass = !validUsername ? 'form__input--incomplete' : ''
    const validPwdClass = !validPassword ? 'form__input--incomplete' : ''
    const validRolesClass = !Boolean(userRoles.length) ? 'form__input--incomplete' : ''


    const content = (
        <>
        <SectionTabsDown/>
            <p className={errClass}>{error?.data?.message}</p>  {/*will display if there is an error message, some of the error messagees are defined in the back end responses*/}

            <form className="form" onSubmit={onSaveUserClicked}>
                <div className="form__title-row">
                    <h2>New User Form</h2>
                    <div className="form__action-buttons">
                        <button
                            className="icon-button"
                            title="Save"
                            disabled={!canSave}//if can save is false, the save button is disabled
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                    </div>
                </div>
                
                <label className="form__label" htmlFor="userFirstName">
                    User First Name: <span className="nowrap">[3-20 letters]</span></label>
                <input
                    className={`form__input ${validUserClass}`}
                    id="userFirstName"
                    name="userFirstName"
                    type="text"
                    autoComplete="off"
                    value={userFirstName}
                    onChange={onUserFirstNameChanged}
                />
                <label className="form__label" htmlFor="userMiddleName">
                    User Middle Name : <span className="nowrap">[3-20 letters]</span></label>
                <input
                    className={`form__input ${validUserClass}`}
                    id="userMiddleName"
                    name="userMiddleName"
                    type="text"
                    autoComplete="off"
                    value={userMiddleName}
                    onChange={onUserMiddleNameChanged}
                />
                
                <label className="form__label" htmlFor="userLastName">
                    User Last Name: <span className="nowrap">[3-20 letters]</span></label>
                <input
                    className={`form__input ${validUserClass}`}
                    id="userLastName"
                    name="userLastName"
                    type="text"
                    autoComplete="off"
                    value={userLastName}
                    onChange={onUserLastNameChanged}
                />
                
                <label className="form__label" htmlFor="username">
                    Username: <span className="nowrap">[3-20 letters]</span></label>
                <input
                    className={`form__input ${validUserClass}`}
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="off"
                    value={username}
                    onChange={onUsernameChanged}
                />
                 <label className="form__label" htmlFor="password">
                    Password: <span className="nowrap">[4-12 chars incl. !@#$-_%]</span></label>
                <input
                    className={`form__input ${validPwdClass}`}
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={onPasswordChanged}
                />
                <label className="form__label" htmlFor="userDob">
                    Date Of Birth: <span className="nowrap">[dd/mm/yyyy]</span></label>
                <input
                    className={`form__input ${validUserClass}`}
                    id="userDob"
                    name="userDob"
                    type="date"
                    autoComplete="off"
                    value={userDob}
                    onChange={onUserDobChanged}
                />
                <label className="form__label" htmlFor="house">
                    House: <span className="nowrap">[3-20 letters]</span></label>
                <input
                    className={`form__input ${validUserClass}`}
                    id="house"
                    name="house"
                    type="text"
                    autoComplete="off"
                    value={house}
                    onChange={onHouseChanged}
                />
                <label className="form__label" htmlFor="street">
                    Street: <span className="nowrap">[3-20 letters]</span></label>
                <input
                    className={`form__input ${validUserClass}`}
                    id="street"
                    name="street"
                    type="text"
                    autoComplete="off"
                    value={street}
                    onChange={onStreetChanged}
                />
                <label className="form__label" htmlFor="area">
                    Area: <span className="nowrap">[3-15 letters]</span></label>
                <input
                    className={`form__input ${validUserClass}`}
                    id="area"
                    name="area"
                    type="text"
                    autoComplete="off"
                    value={area}
                    onChange={onAreaChanged}
                />
                <label className="form__label" htmlFor="city">
                    City: <span className="nowrap">[3-20 letters]</span></label>
                <input
                    className={`form__input ${validUserClass}`}
                    id="city"
                    name="city"
                    type="text"
                    autoComplete="off"
                    value={city}
                    onChange={onCityChanged}
                />
                <label className="form__label" htmlFor="postCode">
                    Post Code: <span className="nowrap">[3-12 letters]</span></label>
                <input
                    className={`form__input ${validUserClass}`}
                    id="postCode"
                    name="postCode"
                    type="text"
                    autoComplete="off"
                    value={postCode}
                    onChange={onPostCodeChanged}
                />
                <label className="form__label" htmlFor="primaryPhone">
                    Primary Phone: <span className="nowrap">[6 to 15 Digits]</span></label>
                <input
                    className={`form__input ${validUserClass}`}
                    id="primaryPhone"
                    name="primaryPhone"
                    type="tel"
                    autoComplete="off"
                    value={primaryPhone}
                    onChange={onPrimaryPhoneChanged}
                />

                



                <label className="form__label" htmlFor="secondaryPhone">
                    Secondary Phone: <span className="nowrap">[6 to 15 Digits]</span></label>
                <input
                    className={`form__input ${validUserClass}`}
                    id="secondaryPhone"
                    name="secondaryPhone"
                    type="tel"
                    autoComplete="off"
                    value={secondaryPhone}
                    onChange={onSecondaryPhoneChanged}
                />
                <label className="form__label" htmlFor="email">
                    Email: <span className="nowrap"></span></label>
                <input
                    className={`form__input ${validUserClass}`}
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="off"
                    value={email}
                    onChange={onEmailChanged}
                />
                <label className="form__label" htmlFor="postCode">
                    Post Code: <span className="nowrap">[3-12 letters]</span></label>
                <input
                    className={`form__input ${validUserClass}`}
                    id="postCode"
                    name="postCode"
                    type="text"
                    autoComplete="off"
                    value={postCode}
                    onChange={onPostCodeChanged}
                />
                <label className="form__label" htmlFor="label">
                    Photo label: <span className="nowrap">[3-12 letters]</span></label>
                <input
                    className={`form__input ${validUserClass}`}
                    id="label"
                    name="label"
                    type="text"
                    autoComplete="off"
                    value={label}
                    onChange={onLabelChanged}
                />
                <label className="form__label" htmlFor="location">
                    Photo location : <span className="nowrap">[3-12 letters]</span></label>
                <input
                    className={`form__input ${validUserClass}`}
                    id="location"
                    name="location"
                    type="text"
                    autoComplete="off"
                    value={location}
                    onChange={onLocationChanged}
                />
                <label className="form__label" htmlFor="size">
                    Photo size: <span className="nowrap">[3-12 letters]</span></label>
                <input
                    className={`form__input ${validUserClass}`}
                    id="size"
                    name="size"
                    type="number"
                    autoComplete="off"
                    value={size}
                    onChange={onSizeChanged}
                />
                <label className="form__label" htmlFor="format">
                    Photo format: <span className="nowrap">[3-12 letters]</span></label>
                <input
                    className={`form__input ${validUserClass}`}
                    id="format"
                    name="format"
                    type="text"
                    autoComplete="off"
                    value={format}
                    onChange={onFormatChanged}
                />
                 <label className="form__label" htmlFor="isParent">
                    User Is Parent: <span className="nowrap">[24 digits]</span></label>
                <input
                    className={`form__input ${validUserClass}`}
                    id="isParent"
                    name="isParent"
                    type="text"
                    autoComplete="off"
                    value={isParent}
                    onChange={onIsParentChanged}
                />
                 <label className="form__label" htmlFor="isEmployee">
                 User Is Employee: <span className="nowrap">[24 digits]</span></label>
                <input
                    className={`form__input ${validUserClass}`}
                    id="isEmployee"
                    name="isEmployee"
                    type="text"
                    autoComplete="off"
                    value={isEmployee}
                    onChange={onIsEmployeeChanged}
                />



                    <label>
                    <input
                    type="checkbox"
                    value={userIsActive}
                    checked={userIsActive}
                    onChange={onUserIsActiveChanged}
                    />
                    User Is Active
                    </label>
                    


                    {Object.keys(ROLES).map((key) => (
                    <div key={key}>
                    <label>
                        <input
                        type="checkbox"
                        value={ROLES[key]}
                        checked={userRoles.includes(ROLES[key])}
                        onChange={onUserRolesChanged}
                        />
                        {ROLES[key]}
                    </label>
                    </div>
                ))}
              

                {/* <label className="form__label" htmlFor="roles">
                    ASSIGNED ROLES:</label>
                <select
                    id="roles"
                    name="roles"
                    className={`form__select ${validRolesClass}`}
                    multiple={true}
                    size="7"
                    value={userRoles}
                    onChange={onUserRolesChanged}
                >
                    {options}
                </select> */}

            </form>
        </>
    )

    return content
}
export default NewUserForm