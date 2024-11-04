import { useState, useEffect } from "react";

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
import {USER_REGEX,PWD_REGEX,NAME_REGEX,PHONE_REGEX,DATE_REGEX} from '../../../../Components/lib/Utils/REGEX'

export default function EditMotherForm() {
  //an add parent function that can be called inside the component
  //const {userData, setUserData} = useContext(StepperContext)
  const { mother, setMother } = useContext(StepperContext);

  const { canSaveMother, setCanSaveMother } = useContext(StepperContext);
  //const { username, password,  userFullName,  userDob, userSex,  userIsActive, userRoles, userAllowedActions, userAddress, userContact } = mother

  //initialisation of states for each input

  const [validUserFirstName, setValidUserFirstName] = useState(false);
  const [validUserLastName, setValidUserLastName] = useState(false);

  const [validUserDob, setValidUserDob] = useState(false);
  const [validHouse, setValidHouse] = useState(false);
  const [validStreet, setValidStreet] = useState(false);
  const [validCity, setValidCity] = useState(false);
  const [validPrimaryPhone, setValidPrimaryPhone] = useState(false);

  const [userFullName, setUserFullName] = useState("");
  const [userFirstName, setUserFirstName] = useState("");
  const [userMiddleName, setUserMiddleName] = useState("");
  const [userLastName, setUserLastName] = useState("");
  const [userDob, setUserDob] = useState("");

  const [userIsActive, setUserIsActive] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [house, setHouse] = useState("");
  const [street, setStreet] = useState("");
  const [area, setArea] = useState("");
  const [postCode, setPostCode] = useState("");
  const [city, setCity] = useState("");
  const [primaryPhone, setPrimaryPhone] = useState("");
  const [secondaryPhone, setSecondaryPhone] = useState("");
  const [email, setEmail] = useState("");

  const [userContact, setUserContact] = useState("");
  useEffect(() => {
    setUserFullName(mother?.userFullName);
    setUserFirstName(mother?.userFullName?.userFirstName);
    setUserMiddleName(mother?.userFullName?.userMiddleName);
    setUserLastName(mother?.userFullName?.userLastName);
    setUserDob(mother?.userDob?.split("T")[0]);

    setUserIsActive(mother?.userIsActive);
    setUserAddress(mother?.userAddress);
    setHouse(mother?.userAddress?.house);
    setStreet(mother?.userAddress?.street);
    setArea(mother?.userAddress?.area);
    setPostCode(mother?.userAddress?.postCode);
    setCity(mother?.userAddress?.city);
    setPrimaryPhone(mother?.userContact?.primaryPhone);
    setSecondaryPhone(mother?.userContact?.secondaryPhone);
    setEmail(mother?.userContact?.email);

    setUserContact(mother?.userContact);
  }, []);

  useEffect(() => {
    setValidUserFirstName(NAME_REGEX.test(userFirstName));
  }, [userFirstName]);

  useEffect(() => {
    setValidUserLastName(NAME_REGEX.test(userLastName));
  }, [userLastName]);

  useEffect(() => {
    setValidUserDob(DATE_REGEX.test(userDob));
  }, [userDob]);

  useEffect(() => {
    setValidHouse(NAME_REGEX.test(house));
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
    setMother((prev) => ({
      ...prev,
      userFullName: {
        userFirstName,
        userMiddleName,
        userLastName,
      },
      userDob,
      userIsActive,
      userAddress: { house, street, area, postCode, city },
      userContact: { primaryPhone, secondaryPhone, email },
    }));
  }, [
    userFirstName,
    userMiddleName,
    userLastName,
    userDob,
    userIsActive,
    house,
    street,
    area,
    postCode,
    city,
    primaryPhone,
    secondaryPhone,
    email,
  ]);

  //the error messages to be displayed in every case according to the class we put in like 'form input incomplete... which will underline and highlight the field in that cass
  // const errClass = isAddFamilyError ? "errmsg" : "offscreen"

  // const validRolesClass = !Boolean(userRoles.length) ? 'form__input--incomplete' : ''
  useEffect(() => {
    setCanSaveMother(
      validUserFirstName &&
        validUserLastName &&
        validUserDob &&
        validHouse &&
        validStreet &&
        validCity &&
        validPrimaryPhone
    );
  }, [
    validUserFirstName,
    validUserLastName,
    validUserDob,
    validHouse,
    validStreet,
    validCity,
    validPrimaryPhone,
  ]);

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
              Mother First Name{" "}{!validUserFirstName && (
                <span className="text-red-500">*</span>
              )}
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
              Mother Last Name{" "}{!validUserLastName && (
                <span className="text-red-500">*</span>
              )}
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
              Date of Birth{" "}{!validUserDob && (
                <span className="text-red-500">*</span>
              )}
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
              House{" "}{!validHouse && (
                <span className="text-red-500">*</span>
              )}
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
              Street{" "}{!validStreet && (
                <span className="text-red-500">*</span>
              )}
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
              City{" "}{!validCity && (
                <span className="text-red-500">*</span>
              )}
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
              Primary Phone{" "}{!validPrimaryPhone && (
                <span className="text-red-500">*</span>
              )}
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
