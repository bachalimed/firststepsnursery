import { useState, useEffect } from "react"
import { useAddNewUserMutation } from "./usersApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from "@fortawesome/free-solid-svg-icons"
import { ROLES } from "../../config/UserRoles"
import SectionTabsDown from '../../Components/Shared/Tabs/SectionTabsDown'

//constrains on inputs when creating new user
const USER_REGEX = /^[A-z]{3,20}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/
const NAME_REGEX= /^[A-z0-9]{3,20}$/

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
    const[ isParent,setIsParent ]= useState(false)
    const[ isEmployee,setIsEmployee ]= useState(true)
    const[ userDob,setUserDob ]= useState('')
    const[ validUserDob,setValidUserDob ]= useState(false)
    const[ userIsActive,setUserIsActive ]= useState(true)
    const[ userPhoto,setUserPhoto ]= useState('')
    const[ userAddress,setUserAddress ]= useState('')
    const[ validUserAddress,setValidUserAddress ]= useState(false)
    const[userContact, setUserContact ]= useState('')
    const[validUserContact, setValidUserContact ]= useState(false)
    

    useEffect(() => {//use effect is used to validate the username and password
        setValidUsername(USER_REGEX.test(username))
    }, [username])

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password))
    }, [password])

    useEffect(() => {
        if (isSuccess) {//if it is success, empty all the individual states and navigaet back to the users list
            setUsername('')
            setPassword('')
            setUserRoles([])
            setUserFullName('')
            setIsParent(false)
            setIsEmployee(true)
            setUserDob('')
            setUserIsActive(true)
            setUserPhoto('')
            setUserAddress('')
            setUserContact('')
            navigate('/admin/usersManagement/allUsers')//will navigate here after saving
        }
    }, [isSuccess, navigate])//even if no success it will navigate and not show any warning if failed or success

    //handlers to get the individual states from the input
    const onUsernameChanged = e => setUsername(e.target.value)
    const onPasswordChanged = e => setPassword(e.target.value)

    const onRolesChanged = e => {//because the roles is a select and allows multiple selections, we get an array from
        const values = Array.from(
            e.target.selectedOptions, //HTMLCollection that s why we have array from
            (option) => option.value// we get the values from options and we put them into Roles array
        )
        setUserRoles(values)
    }
//to check if we can save before onsave, if every one is true, and also if we are not loading status
    const canSave = [userRoles.length, validUsername, validPassword].every(Boolean) && !isLoading

    const onSaveUserClicked = async (e) => {
        e.preventDefault()
        if (canSave) {//if cansave is true
            await addNewUser({ username, password, userRoles })//we call the add new user mutation and set the arguments to be saved
        }
    }



    const options = Object.values(ROLES).map(role => {//the options for the roles in the select menu
        return (
            <option
                key={role}
                value={role}

            > {role}</option >
        )
    })
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
                    <h2>New Userr</h2>
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
                    Password: <span className="nowrap">[4-12 chars incl. !@#$%]</span></label>
                <input
                    className={`form__input ${validPwdClass}`}
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={onPasswordChanged}
                />

                <label className="form__label" htmlFor="roles">
                    ASSIGNED ROLES:</label>
                <select
                    id="roles"
                    name="roles"
                    className={`form__select ${validRolesClass}`}
                    multiple={true}
                    size="3"
                    value={userRoles}
                    onChange={onRolesChanged}
                >
                    {options}
                </select>

            </form>
        </>
    )

    return content
}
export default NewUserForm