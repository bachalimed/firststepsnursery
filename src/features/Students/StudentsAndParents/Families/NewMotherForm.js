import { useState, useEffect } from "react";
import { useAddNewFamilyMutation } from "./familiesApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { ROLES } from "../../../../config/UserRoles";
import { ACTIONS } from "../../../../config/UserActions";
import StudentsParents from "../../StudentsParents";
import { useGetFamiliesByYearQuery } from "./familiesApiSlice";
import { useGetStudentsByYearQuery } from "../Students/studentsApiSlice";
import { useContext } from "react";
import { StepperContext } from "../../../../contexts/StepperContext";
//constrains on inputs when creating new parent
const USER_REGEX = /^[A-z0-9]{6,20}$/;
const PWD_REGEX = /^[A-z0-9!@#-_$%]{8,20}$/;
const NAME_REGEX = /^[A-z 0-9]{3,20}$/;
const HOUSE_REGEX = /^[A-z 0-9]{1,20}$/;
const PHONE_REGEX = /^[0-9]{6,15}$/;
const DOB_REGEX = /^[0-9/-]{4,10}$/;
const EMAIL_REGEX = /^[A-z0-9.@-_]{6,20}$/;

export default function NewMotherForm() {
  //an add parent function that can be called inside the component
  //const {userData, setUserData} = useContext(StepperContext)
  const { mother, setMother } = useContext(StepperContext);
  const { familySituation, setFamilySituation } = useContext(StepperContext);
  const { canSaveMother, setCanSaveMother } = useContext(StepperContext);

  //  const handleChange=(e)=>{
  //     const {name, value} = e.target
  //     setUserData({...userData, [name]:value})
  //  }

  const generateRandomUsername = () => {
    const randomChars = Math.random().toString(36).substring(2, 10); // generate random characters
    return `user${randomChars}`; // prefix with 'user'
  };
  const Navigate = useNavigate();

  //initialisation of states for each input

  const [validUserFirstName, setValidUserFirstName] = useState(false);
  const [validUserLastName, setValidUserLastName] = useState(false);

  const [validUserDob, setValidUserDob] = useState(false);
  const [userAddress, setUserAddress] = useState("");
  const [validHouse, setValidHouse] = useState(false);
  const [validStreet, setValidStreet] = useState(false);
  const [validCity, setValidCity] = useState(false);
  const [validPrimaryPhone, setValidPrimaryPhone] = useState(false);

  const [username, setUsername] = useState(
    mother?.username || generateRandomUsername()
  );
  const [password, setPassword] = useState(mother?.password || "12345678");
  const [userRoles, setUserRoles] = useState(mother?.userRoles || ["Parent"]);
  const [userFullName, setUserFullName] = useState(
    mother?.userFullName || {
      userFirstName: "",
      userMiddleName: "",
      userLastName: "",
    }
  );
  const [userFirstName, setUserFirstName] = useState(
    mother?.userFullName?.userFirstName || ""
  );
  const [userMiddleName, setUserMiddleName] = useState(
    mother?.userFullName?.userMiddleName || ""
  );
  const [userLastName, setUserLastName] = useState(
    mother?.userFullName?.userLastName || ""
  );
  const [userDob, setUserDob] = useState(mother?.userDob || "");
  const [userSex, setUserSex] = useState(mother?.userSex || "Female");
  const [userIsActive, setUserIsActive] = useState(
    mother?.userIsActive || false
  );
  const [house, setHouse] = useState(mother?.userAddress?.house || "");
  const [street, setStreet] = useState(mother?.userAddress?.street || "");
  const [area, setArea] = useState(mother?.userAddress?.area || "");
  const [postCode, setPostCode] = useState(mother?.userAddress?.postCode || "");
  const [city, setCity] = useState(mother?.userAddress?.city || "");
  const [primaryPhone, setPrimaryPhone] = useState(
    mother?.userContact?.primaryPhone || ""
  );
  const [secondaryPhone, setSecondaryPhone] = useState(
    mother?.userContact?.secondaryPhone || ""
  );
  const [email, setEmail] = useState(mother?.userContact?.email || "");
  const [userAllowedActions, setUserAllowedActions] = useState([]);
  const [userContact, setUserContact] = useState("");

  //use effect is used to validate the inputs against the defined REGEX above
  //the previous constrains have to be verified on the form for teh parent to know
  // useEffect(() => {
  //     setValidUsername(USER_REGEX.test(username))
  // }, [username])

  // useEffect(() => {
  //     setValidPassword(PWD_REGEX.test(password))
  // }, [password])

  useEffect(() => {
    setValidUserFirstName(NAME_REGEX.test(userFirstName));
  }, [userFirstName]);

  useEffect(() => {
    setValidUserLastName(NAME_REGEX.test(userLastName));
  }, [userLastName]);

  useEffect(() => {
    setValidUserDob(DOB_REGEX.test(userDob));
  }, [userDob]);
  useEffect(() => {
    setValidHouse(HOUSE_REGEX.test(house));
  }, [house]);
  useEffect(() => {
    setValidStreet(NAME_REGEX.test(street));
  }, [street]);
  useEffect(() => {
    setValidCity(NAME_REGEX.test(city));
  }, [city]);

  useEffect(() => {
    setValidPrimaryPhone(PHONE_REGEX.test(primaryPhone));
  }, [primaryPhone]);

  //handlers to get the individual states from the input
  //const onUsernameChanged = e => setUsername(e.target.value)
  //const onPasswordChanged = e => setPassword(e.target.value)
  const onUserFirstNameChanged = (e) => setUserFirstName(e.target.value);
  const onUserMiddleNameChanged = (e) => setUserMiddleName(e.target.value);
  const onUserLastNameChanged = (e) => setUserLastName(e.target.value);
  const onUserDobChanged = (e) => setUserDob(e.target.value);
  const onUserSexChanged = (e) => setUserSex(e.target.value);
  const onFamilySituationChanged = (e) => setFamilySituation(e.target.value);
  const onHouseChanged = (e) => setHouse(e.target.value);
  const onStreetChanged = (e) => setStreet(e.target.value);
  const onAreaChanged = (e) => setArea(e.target.value);
  const onPostCodeChanged = (e) => setPostCode(e.target.value);
  const onCityChanged = (e) => setCity(e.target.value);
  const onPrimaryPhoneChanged = (e) => setPrimaryPhone(e.target.value);
  const onSecondaryPhoneChanged = (e) => setSecondaryPhone(e.target.value);
  const onEmailChanged = (e) => setEmail(e.target.value);

  //we do not  need to retriev the employee and parent ids from the DB ans set their state because they are saved before the parent
  //check if the parent and employee id is available or delete the variable

  useEffect(() => {
    setUserFullName({
      userFirstName: userFirstName,
      userMiddleName: userMiddleName,
      userLastName: userLastName,
    });
  }, [userFirstName, userMiddleName, userLastName]);

  useEffect(() => {
    setUserAddress({
      house: house,
      street: street,
      area: area,
      postCode: postCode,
      city: city,
    });
  }, [house, street, street, area, postCode, city]);

  useEffect(() => {
    setUserContact({
      primaryPhone: primaryPhone,
      secondaryPhone: secondaryPhone,
      email: email,
    });
  }, [primaryPhone, secondaryPhone, email]);
  useEffect(() => {
    setMother({
      username: username,
      password: password,
      userFullName: userFullName,
      userDob: userDob,
      userSex: userSex,
      userIsActive: userIsActive,
      userRoles: userRoles,
      userAllowedActions: userAllowedActions,
      userAddress: userAddress,
      userContact: userContact,
    });
  }, [
    username,
    password,
    userFullName,
    userDob,
    userSex,
    userIsActive,
    userRoles,
    userAllowedActions,
    userAddress,
    userContact,
  ]);
  //console.log('mother in mother', mother)

  //the error messages to be displayed in every case according to the class we put in like 'form input incomplete... which will underline and highlight the field in that cass
  // const errClass = isAddFamilyError ? "errmsg" : "offscreen"

  // const validRolesClass = !Boolean(userRoles.length) ? 'form__input--incomplete' : ''
  setCanSaveMother(
    [
      validUserFirstName,
      validUserLastName,
      validUserDob,
      validStreet,
      validCity,
      validPrimaryPhone,
    ].every(Boolean)
  );

  const content = (
    <div className="flex flex-col p-6 space-y-6 max-w-2xl mx-auto bg-white shadow-lg rounded-lg">
      {/* Error message placeholder */}
      {/* <p className={errClass}>{addFamilyError?.data?.message}</p> */}

      <form className="w-full flex flex-col space-y-6">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Mother Details</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label
              className="text-gray-700 font-semibold"
              htmlFor="userFirstName"
            >
              Mother First Name*{" "}
              <span className="text-sm text-gray-500">[3-20 letters]</span>
            </label>
            <input
              className="form__input w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              id="userFirstName"
              name="userFirstName"
              type="text"
              autoComplete="off"
              value={userFirstName}
              onChange={onUserFirstNameChanged}
              required
            />
          </div>

          <div>
            <label
              className="text-gray-700 font-semibold"
              htmlFor="userMiddleName"
            >
              Mother Middle Name
            </label>
            <input
              className="form__input w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              id="userMiddleName"
              name="userMiddleName"
              type="text"
              autoComplete="off"
              value={userMiddleName}
              onChange={onUserMiddleNameChanged}
            />
          </div>

          <div>
            <label
              className="text-gray-700 font-semibold"
              htmlFor="userLastName"
            >
              Mother Last Name*{" "}
              <span className="text-sm text-gray-500">[3-20 letters]</span>
            </label>
            <input
              className="form__input w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              id="userLastName"
              name="userLastName"
              type="text"
              autoComplete="off"
              value={userLastName}
              onChange={onUserLastNameChanged}
              required
            />
          </div>

          <div>
            <label className="text-gray-700 font-semibold" htmlFor="userDob">
              Date of Birth*{" "}
              <span className="text-sm text-gray-500">[dd/mm/yyyy]</span>
            </label>
            <input
              className="form__input w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              id="userDob"
              name="userDob"
              type="date"
              autoComplete="off"
              value={userDob}
              onChange={onUserDobChanged}
              required
            />
          </div>

          {/* Address Section */}
          <div>
            <label className="text-gray-700 font-semibold" htmlFor="house">
              House*{" "}
              <span className="text-sm text-gray-500">[3-20 letters]</span>
            </label>
            <input
              className="form__input w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              id="house"
              name="house"
              type="text"
              autoComplete="off"
              value={house}
              onChange={onHouseChanged}
              required
            />
          </div>

          <div>
            <label className="text-gray-700 font-semibold" htmlFor="street">
              Street*{" "}
              <span className="text-sm text-gray-500">[3-20 letters]</span>
            </label>
            <input
              className="form__input w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              id="street"
              name="street"
              type="text"
              autoComplete="off"
              value={street}
              onChange={onStreetChanged}
              required
            />
          </div>

          <div>
            <label className="text-gray-700 font-semibold" htmlFor="area">
              Area
            </label>
            <input
              className="form__input w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              id="area"
              name="area"
              type="text"
              autoComplete="off"
              value={area}
              onChange={onAreaChanged}
            />
          </div>

          <div>
            <label className="text-gray-700 font-semibold" htmlFor="city">
              City*{" "}
              <span className="text-sm text-gray-500">[3-20 letters]</span>
            </label>
            <input
              className="form__input w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              id="city"
              name="city"
              type="text"
              autoComplete="off"
              value={city}
              onChange={onCityChanged}
              required
            />
          </div>

          <div>
            <label className="text-gray-700 font-semibold" htmlFor="postCode">
              Post Code
            </label>
            <input
              className="form__input w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              id="postCode"
              name="postCode"
              type="text"
              autoComplete="off"
              value={postCode}
              onChange={onPostCodeChanged}
            />
          </div>

          <div>
            <label
              className="text-gray-700 font-semibold"
              htmlFor="primaryPhone"
            >
              Primary Phone*{" "}
              <span className="text-sm text-gray-500">[6 to 15 digits]</span>
            </label>
            <input
              className="form__input w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              id="primaryPhone"
              name="primaryPhone"
              type="tel"
              autoComplete="off"
              value={primaryPhone}
              onChange={onPrimaryPhoneChanged}
              required
            />
          </div>

          <div>
            <label
              className="text-gray-700 font-semibold"
              htmlFor="secondaryPhone"
            >
              Secondary Phone
            </label>
            <input
              className="form__input w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              id="secondaryPhone"
              name="secondaryPhone"
              type="tel"
              autoComplete="off"
              value={secondaryPhone}
              onChange={onSecondaryPhoneChanged}
            />
          </div>

          <div>
            <label className="text-gray-700 font-semibold" htmlFor="email">
              Email
            </label>
            <input
              className="form__input w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              id="email"
              name="email"
              type="email"
              autoComplete="off"
              value={email}
              onChange={onEmailChanged}
            />
          </div>
        </div>

        {/* Button Section */}
        {/* <div className="flex justify-end space-x-4">
            <button
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              type="submit"
              onClick={onSaveMotherClicked}
              disabled={!canSave}
            >
              Save Mother
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div> */}
      </form>
    </div>
  );

  return content;
}
