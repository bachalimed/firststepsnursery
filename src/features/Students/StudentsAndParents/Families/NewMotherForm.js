import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { StepperContext } from "../../../../contexts/StepperContext";
import { NAME_REGEX, PHONE_REGEX, DATE_REGEX } from "../../../../config/REGEX";

export default function NewMotherForm() {
  useEffect(() => {
    document.title = "New Mother";
  });
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
  const [validCin, setValidCin] = useState(false);

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
  const [cin, setCin] = useState(mother?.cin || "");

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
    setValidCin(PHONE_REGEX.test(cin));
  }, [cin]);
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
  const onCinChanged = (e) => setCin(e.target.value);

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
      cin: cin,

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
    cin,
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
      validCin,
      validStreet,
      validCity,
      validPrimaryPhone,
    ].every(Boolean)
  );

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
                />
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
                />
              </label>

              {/* CIN */}

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

          {/* Address Section */}
          {/* Address Section */}

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
                />
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
                />{" "}
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
                />
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
                />
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
                />{" "}
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
