import { useState, useEffect } from "react";
import { useContext } from "react";
import { StepperContext } from "../../../../contexts/StepperContext";
import { NAME_REGEX, PHONE_REGEX, DATE_REGEX } from "../../../../config/REGEX";

export default function EditMotherForm() {
  useEffect(() => {
    document.title = "Edit Mother";
  });
  //an add parent function that can be called inside the component
  //const {userData, setUserData} = useContext(StepperContext)
  const { mother, setMother } = useContext(StepperContext);

  const { canSaveMother, setCanSaveMother } = useContext(StepperContext);
  //const { username, password,  userFullName,  userDob, userSex,  userIsActive, userRoles, userAllowedActions, userAddress, userContact } = mother

  //initialisation of states for each input

  const [validUserFirstName, setValidUserFirstName] = useState(false);
  const [validUserLastName, setValidUserLastName] = useState(false);
  const [validCin, setValidCin] = useState(false);
  const [validUserDob, setValidUserDob] = useState(false);
  const [validHouse, setValidHouse] = useState(false);
  const [validStreet, setValidStreet] = useState(false);
  const [validCity, setValidCity] = useState(false);
  const [validPrimaryPhone, setValidPrimaryPhone] = useState(false);
  const [cin, setCin] = useState(mother?.cin || "");
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

    setCin(mother?.cin);
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
    setValidCin(PHONE_REGEX.test(cin));
  }, [cin]);
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
  const onCinChanged = (e) => setCin(e.target.value);

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
    cin,
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
        validCin &&
        validStreet &&
        validCity &&
        validPrimaryPhone
    );
  }, [
    validUserFirstName,
    validUserLastName,
    validUserDob,
    validHouse,
    validCin,
    validStreet,
    validCity,
    validPrimaryPhone,
  ]);

  const content = (
    <div className="flex flex-col p-6 space-y-6 max-w-2xl mx-auto bg-white shadow-lg rounded-lg">
      {/* Error message placeholder */}
      {/* <p className={errClass}>{addFamilyError?.data?.message}</p> */}

      <form className="form-container">
        <h2 className="formTitle">Mother Details</h2>

        <div className="formSectionContainer">
          <h3 className="formSectionTitle">Personal details</h3>
          <div className="formSection">
            <div className="formLineDiv">
              <label
                className="text-gray-700 font-semibold"
                htmlFor="userFirstName"
              >
                Mother First Name{" "}
                {!validUserFirstName && <span className="text-red-600">*</span>}
                <span className="text-sm text-gray-500">[3-25 letters]</span>
                <input
                  className={`formInputText`}
                  id="userFirstName"
                  name="userFirstName"
                  type="text"
                  autoComplete="off"
                  value={userFirstName}
                  onChange={onUserFirstNameChanged}
                  required
                />
              </label>

              <label
                className="text-gray-700 font-semibold"
                htmlFor="userMiddleName"
              >
                Mother Middle Name
                <input
                  className={`formInputText`}
                  id="userMiddleName"
                  name="userMiddleName"
                  type="text"
                  autoComplete="off"
                  value={userMiddleName}
                  onChange={onUserMiddleNameChanged}
                />{" "}
              </label>

              <label
                className="text-gray-700 font-semibold"
                htmlFor="userLastName"
              >
                Mother Last Name{" "}
                {!validUserLastName && <span className="text-red-600">*</span>}
                <span className="text-sm text-gray-500">[3-25 letters]</span>
                <input
                  className={`formInputText`}
                  id="userLastName"
                  name="userLastName"
                  type="text"
                  autoComplete="off"
                  value={userLastName}
                  onChange={onUserLastNameChanged}
                  required
                />{" "}
              </label>

              <label className="text-gray-700 font-semibold" htmlFor="userDob">
                Date of Birth{" "}
                {!validUserDob && <span className="text-red-600">*</span>}
                <span className="text-sm text-gray-500">[dd/mm/yyyy]</span>
                <input
                  className={`formInputText`}
                  id="userDob"
                  name="userDob"
                  type="date"
                  autoComplete="off"
                  value={userDob}
                  onChange={onUserDobChanged}
                  required
                />{" "}
              </label>
              <label htmlFor="ID" className="ID">
                ID {!validCin && <span className="text-red-600">*</span>}
                <input
                  aria-invalid={!validCin}
                  placeholder="[3-25 digits]"
                  aria-label="ID"
                  type="text"
                  id="cin"
                  name="cin"
                  value={cin}
                  onChange={onCinChanged}
                  className={`formInputText`}
                  required
                />{" "}
              </label>
            </div>
          </div>

          <h3 className="formSectionTitle">Contact details</h3>
          <div className="formSection">
            {/* Contact Information */}

            <div className="formLineDiv">
              <label className="text-gray-700 font-semibold" htmlFor="house">
                House {!validHouse && <span className="text-red-600">*</span>}
                <span className="text-sm text-gray-500">[3-25 letters]</span>
                <input
                  className={`formInputText`}
                  id="house"
                  name="house"
                  type="text"
                  autoComplete="off"
                  value={house}
                  onChange={onHouseChanged}
                  required
                />{" "}
              </label>

              <label className="text-gray-700 font-semibold" htmlFor="street">
                Street {!validStreet && <span className="text-red-600">*</span>}
                <span className="text-sm text-gray-500">[3-25 letters]</span>
                <input
                  className={`formInputText`}
                  id="street"
                  name="street"
                  type="text"
                  autoComplete="off"
                  value={street}
                  onChange={onStreetChanged}
                  required
                />{" "}
              </label>

              <label className="text-gray-700 font-semibold" htmlFor="area">
                Area
                <input
                  className={`formInputText`}
                  id="area"
                  name="area"
                  type="text"
                  autoComplete="off"
                  value={area}
                  onChange={onAreaChanged}
                />
              </label>

              <label className="text-gray-700 font-semibold" htmlFor="city">
                City {!validCity && <span className="text-red-600">*</span>}
                <span className="text-sm text-gray-500">[3-25 letters]</span>
                <input
                  className={`formInputText`}
                  id="city"
                  name="city"
                  type="text"
                  autoComplete="off"
                  value={city}
                  onChange={onCityChanged}
                  required
                />{" "}
              </label>

              <label className="text-gray-700 font-semibold" htmlFor="postCode">
                Post Code
                <input
                  className={`formInputText`}
                  id="postCode"
                  name="postCode"
                  type="text"
                  autoComplete="off"
                  value={postCode}
                  onChange={onPostCodeChanged}
                />{" "}
              </label>

              <label
                className="text-gray-700 font-semibold"
                htmlFor="primaryPhone"
              >
                Primary Phone{" "}
                {!validPrimaryPhone && <span className="text-red-600">*</span>}
                <span className="text-sm text-gray-500">[6 to 15 digits]</span>
                <input
                  className={`formInputText`}
                  id="primaryPhone"
                  name="primaryPhone"
                  type="tel"
                  autoComplete="off"
                  value={primaryPhone}
                  onChange={onPrimaryPhoneChanged}
                  required
                />{" "}
              </label>

              <label
                className="text-gray-700 font-semibold"
                htmlFor="secondaryPhone"
              >
                Secondary Phone
                <input
                  className={`formInputText`}
                  id="secondaryPhone"
                  name="secondaryPhone"
                  type="tel"
                  autoComplete="off"
                  value={secondaryPhone}
                  onChange={onSecondaryPhoneChanged}
                />{" "}
              </label>

              <label className="text-gray-700 font-semibold" htmlFor="email">
                Email
                <input
                  className={`formInputText`}
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="off"
                  value={email}
                  onChange={onEmailChanged}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Button Section */}
        {/* <div className="cancelSavebuttonsDiv">
      <button
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        type="submit"
        onClick={onSaveMotherClicked}
        disabled={!canSave}
      >
        Save Mother
      </button>
      <button
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600"
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
