import { useState, useEffect } from "react"
import { useUpdateUserMutation, useDeleteUserMutation } from "./usersApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons"
import { ROLES } from "../../config/UserRoles"
import SectionTabsDown from "../../Components/Shared/Tabs/SectionTabsDown"

const USER_REGEX = /^[A-z]{4,20}$/
const PWD_REGEX = /^[A-z0-9!@#-_$%]{8,20}$/
const NAME_REGEX= /^[A-z 0-9]{3,20}$/
const PHONE_REGEX= /^[0-9]{6,15}$/
const DOB_REGEX = /^[0-9/-]{4,10}$/
const EMAIL_REGEX = /^[A-z0-9.@-_]{8,20}$/

const EditUserForm = ({ user }) => {//user was passed as prop in editUser

    const [updateUser, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateUserMutation()

    const [deleteUser, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    }] = useDeleteUserMutation()

    const navigate = useNavigate()


    //const [id, setId] = useState(user.id)
    const [username, setUsername] = useState(user.username)
    const [validUsername, setValidUsername] = useState(false)
    const [password, setPassword] = useState('')
    const [validPassword, setValidPassword] = useState(false)
    const [userRoles, setUserRoles] = useState(user.userRoles)
    const [userFirstName, setUserFirstName] = useState(user.userFullName.userFirstName)
    const [validUserFirstName, setValidUserFirstName] = useState(false)
    const [userMiddleName, setUserMiddleName] = useState(user.userFullName.userMiddleName)
 
    const [userLastName, setUserLastName] = useState(user.userFullName.userLastName)
    const [validUserLastName, setValidUserLastName] = useState(false)
    const [userFullName, setUserFullName] = useState({userFirstName:user.userFullName.userFirstName, userMiddleName:user.userFullName.userMiddleName, userLastName:user.userFullName.userLastName})
    const [validUserFullName, setValidUserFullName] = useState(false)
    const[ isParent,setIsParent ]= useState(user.isParent)
    const[ isEmployee,setIsEmployee ]= useState(user.isEmployee)
//change date format from mongo db
    const[ userDob,setUserDob ]= useState(user.userDob.split('T')[0])
    const[ validUserDob,setValidUserDob ]= useState(false)
    const[ userIsActive,setUserIsActive ]= useState(user.userIsActive)
    const[ userPhoto,setUserPhoto ]= useState(user.userPhoto)
    const[ label,setLabel ]= useState(user.userPhoto.label)
    const[ location,setLocation ]= useState(user.userPhoto.location)
    const[ size,setSize ]= useState(user.userPhoto.size)
    const[ format,setFormat ]= useState(user.userPhoto.format)
    const[ userAddress,setUserAddress ]= useState(user.userAddress)
    const[ validUserAddress,setValidUserAddress ]= useState(false)
    const[ house,setHouse ]= useState(user.userAddress.house)
    const[ validHouse,setValidHouse ]= useState(false)
    const[ street,setStreet ]= useState(user.userAddress.street)
    const[ validStreet,setValidStreet ]= useState(false)
    const[ area,setArea ]= useState(user.userAddress.area)
    const[ validArea,setValidArea ]= useState(false)
    const[ postCode,setPostCode ]= useState(user.userAddress.postCode)
    const[ validPostCode,setValidPostCode ]= useState(false)
    const[ city,setCity ]= useState(user.userAddress.city)
    const[ validCity,setValidCity ]= useState(false)
    const[userContact, setUserContact ]= useState(user.userContact)
    const[validUserContact, setValidUserContact ]= useState(false)
    const[primaryPhone, setPrimaryPhone ]= useState(user.userContact.primaryPhone)
    const[validPrimaryPhone, setValidPrimaryPhone ]= useState(false)
    const[secondaryPhone, setSecondaryPhone ]= useState(user.userContact.secondaryPhone)
    
    const[email, setEmail ]= useState(user.userContact.email)
    const[validEmail, setValidEmail ]= useState(false)
    
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
        console.log(isSuccess)
        if (isSuccess || isDelSuccess) {
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
            setPrimaryPhone('')
            setSecondaryPhone('')
            setEmail('')
            setUserContact({primaryPhone:'', secondaryPhone:'', email:'' })
            navigate('/admin/usersManagement/users/')//will navigate here after saving
        }

    }, [isSuccess, isDelSuccess, navigate])

     //handlers to get the individual states from the input
     const onUsernameChanged = e => setUsername(e.target.value)
     const onPasswordChanged = e => setPassword(e.target.value)
     //const onUserFirstNameChanged = e => setUserFullName({userFirstName:e.target.value,userMiddleName:userMiddleName, userLastName:userLastName }) 
     //const onUserMiddleNameChanged = e => setUserFullName({userMiddleName:e.target.value})
     //const onUserLastNameChanged = e => setUserFullName({userLastName:e.target.value})
     const onUserFirstNameChanged = e => setUserFirstName(e.target.value) 
     const onUserMiddleNameChanged = e => setUserMiddleName(e.target.value)
     const onUserLastNameChanged = e => setUserLastName(e.target.value)

     const onIsParentChanged = e => setIsParent(e.target.value)
     const onIsEmployeeChanged = e => setIsEmployee(e.target.value)
     const onUserDobChanged = e => setUserDob(e.target.value)
     const onUserIsActiveChanged = e => setUserIsActive(prev => !prev)
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
    
 
    //  const onUserRolesChanged = e => {//because the roles is a select and allows multiple selections, we get an array from
    //      const values = Array.from(
    //          e.target.selectedOptions, //HTMLCollection that s why we have array from
    //          (option) => option.value// we get the values from options and we put them into Roles array
    //      )
    //      setUserRoles(values)
    //  }


    

    const onUserRolesChanged =  (e) => {
        const { value, checked } = e.target    
        setUserRoles((prevRoles) =>
          checked ? [...prevRoles, value] : prevRoles.filter((role) => role !== value)
        )
    }
    //check if the parent and employee id is available or delete the variable
    if (isParent===''){ setIsParent(undefined)}
    if (isEmployee===''){ setIsEmployee(undefined)}
   

//this will ensure the update of the states
    useEffect(() => {
        setUserFullName({userFirstName:userFirstName, userMiddleName:userMiddleName, userLastName:userLastName})
        setUserPhoto({label:label, location:location, size:size, format:format})
        setUserAddress({house:house, street:street, area:area, postCode:postCode, city:city})
        setUserContact({primaryPhone:primaryPhone, secondaryPhone:secondaryPhone, email:email}) 
      }, [userFullName, userPhoto, userAddress, userContact])

     //console.log( validUserFirstName,userFirstName, validUserLastName, validUsername, validPassword, validUserDob, 
        //validStreet,  validPrimaryPhone, userRoles, validEmail, userRoles.length, isParent, isEmployee, userIsActive )
     
        const onSaveUserClicked = async (e) => {        
            console.log(` 'first name' ${userFirstName}', fullfirstname,' ${userFullName.userFirstName}', house: '${house}', usercontact house' ${userContact.house},    ${userRoles.length},${isParent}, ${isEmployee}` )
     
        if (password) {
           
            await updateUser({ id: user.id, userFullName, username, password, isParent, isEmployee, userDob, userIsActive, userRoles, userPhoto, userAddress, userContact })
        } else {
           
            await updateUser({ id: user.id, userFullName, username, isParent, isEmployee, userDob, userIsActive, userRoles, userPhoto, userAddress, userContact })
        }
    }


    const onDeleteUserClicked = async () => {
        
        await deleteUser({ id: user.id })
    }

    // const options = Object.values(ROLES).map(role => {
    //     return (
    //         <option
    //             key={role}
    //             value={role}

    //         > {role}</option >
    //     )
    // })

    let canSave
    if (password) {
        canSave = [validUserFirstName, validUserLastName, validUsername, validPassword, validUserDob,     validStreet,  validPrimaryPhone, validEmail, userRoles.length].every(Boolean) && !isLoading
    } else {
        canSave = [validUserFirstName, validUserLastName, validUsername, validUserDob,     validStreet,  validPrimaryPhone, validEmail, userRoles.length].every(Boolean) && !isLoading
    }

    const errClass = (isError || isDelError) ? "errmsg" : "offscreen"
    const validUserClass = !validUsername ? 'form__input--incomplete' : ''
    const validPwdClass = password && !validPassword ? 'form__input--incomplete' : ''//to avoid the red square around the input
    const validRolesClass = !Boolean(userRoles.length) ? 'form__input--incomplete' : ''

    const errContent = (error?.data?.message || delerror?.data?.message) ?? ''


    const content = (
        <>
            <SectionTabsDown />
            <p className={errClass}>{errContent}</p>{/*if no error message will not show any on the screen*/}

            <form className="form" onSubmit={e => e.preventDefault()}>
                <div className="form__title-row">
                    <h2>Edit User</h2>
                    <div className="form__action-buttons">
                        <button
                            className="icon-button"
                            title="Save"
                            onClick={onSaveUserClicked}
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                        <button
                            className="icon-button"
                            title="Delete"
                            onClick={onDeleteUserClicked}
                        >
                            <FontAwesomeIcon icon={faTrashCan} />
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
               
                <label className="form__label" htmlFor="label">
                    Photo: <span className="nowrap">[3-12 letters]</span></label>
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

<label className="form__label" htmlFor="label">
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
                 <label className="form__label" htmlFor="label">
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
                       
                        className={`form__select ${validRolesClass}`}
                        type="checkbox"
                        value={ROLES[key]}
                        checked={userRoles.includes(ROLES[key])}
                        onChange={onUserRolesChanged}
                        />
                        {ROLES[key]}
                    </label>
                    </div>
                ))}

               
                {/* <label className="form__label" htmlFor="userRoles">
                    ASSIGNED ROLES:</label>
                <select
                    id="userRoles"
                    name="userRoles"
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
export default EditUserForm