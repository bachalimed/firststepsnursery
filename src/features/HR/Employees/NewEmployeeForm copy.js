import { useState, useEffect } from "react";
import { useAddNewEmployeeMutation } from "./employeesApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { ROLES } from "../../../config/UserRoles";
import { ACTIONS } from "../../../config/UserActions";
import HR from "../HR";

//constrains on inputs when creating new user
const USER_REGEX = /^[A-z]{6,20}$/;
const NAME_REGEX = /^[A-z 0-9]{3,20}$/;
const PHONE_REGEX = /^[0-9]{6,15}$/;
const DOB_REGEX = /^[0-9/-]{4,10}$/;

const NewEmployeeForm = () => {
  //an add user function that can be called inside the component
  const Navigate = useNavigate();

  const [
    addNewEmployee,
    {
      //an object that calls the status when we execute the newUserForm function
      isLoading: isEmployeeLoading,
      isSuccess: isEmployeeSuccess,
      isError: isEmployeeError,
      error: employeeError,
    },
  ] = useAddNewEmployeeMutation(); //it will not execute the mutation nownow but when called

  const generateRandomUsername = () => {
    const randomChars = Math.random().toString(36).substring(2, 10); // generate random characters
    return `user${randomChars}`; // prefix with 'user'
  };

  //initialisation of states for each input
  const [username, setUsername] = useState(generateRandomUsername());
  const [password, setPassword] = useState("12345678");
  const [userRoles, setUserRoles] = useState(["Employee"]); //the roles array is defaulted to employee
  const [userAllowedActions, setUserAllowedActions] = useState([]); //the roles array is defaulted to employee

  const [validUsername, setValidUsername] = useState(false); //will be true when the username is validated
  const [validPassword, setValidPassword] = useState(false); //will be true when the passwrod is validated
  const [validHouse, setValidHouse] = useState(false);
  const [validUserLastName, setValidUserLastName] = useState(false);
  const [validUserFirstName, setValidUserFirstName] = useState(false);
  const [validStreet, setValidStreet] = useState(false);
  const [validCity, setValidCity] = useState(false);
  const [validUserDob, setValidUserDob] = useState(false);
  const [validPrimaryPhone, setValidPrimaryPhone] = useState(false);

  const [userFullName, setUserFullName] = useState("");
  const [userFirstName, setUserFirstName] = useState("");
  const [userMiddleName, setUserMiddleName] = useState("");
  const [userLastName, setUserLastName] = useState("");
  const [userDob, setUserDob] = useState("");
  const [userSex, setUserSex] = useState("");
  const [userIsActive, setUserIsActive] = useState(false);
  const [userAddress, setUserAddress] = useState("");
  const [house, setHouse] = useState("");
  const [street, setStreet] = useState("");
  const [area, setArea] = useState("");
  const [postCode, setPostCode] = useState("");
  const [city, setCity] = useState("");
  const [userContact, setUserContact] = useState("");
  const [primaryPhone, setPrimaryPhone] = useState();
  const [secondaryPhone, setSecondaryPhone] = useState();
  const [email, setEmail] = useState("");

  const [employeeAssessment, setEmployeeAssessment] = useState([]);
  const [date, setDate] = useState("");
  const [assessor, setAssessor] = useState("");
  const [assessmentComment, setAssessorComment] = useState("");
  const [assessmentScore, setAssessmentScore] = useState("");
  const [employeeWorkHistory, setEmployeeWorkHistory] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [position, setPosition] = useState("");
  const [contractType, setContractType] = useState("");
  const [salaryPackage, setSalaryPackage] = useState("");
  const [basic, setBasic] = useState("");
  const [cnss, setCnss] = useState("");
  const [other, setOther] = useState("");
  const [payment, setPayment] = useState("");
  const [institution, setInstitution] = useState("");
  const [employeeYears, setEmployeeYears] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [employeeIsActive, setEmployeeIsActive] = useState("");
  const [employeeCurrentEmployment, setEmployeeCurrentEmployment] =
    useState("");
  const [joinDate, setJoinDate] = useState("");
  const [currentContractType, setCurrentContractType] = useState("");
  const [currentPosition, setCurrentPosition] = useState("");
  const [currentSalaryPackage, setCurrentSalaryPackage] = useState("");
  const [currentBasic, setCurrentBasic] = useState("");
  const [currentCnss, setCurrentCnss] = useState("");
  const [currentOther, setCurrentOther] = useState("");
  const [currentPayment, setCurrentPayment] = useState("");

  //use effect is used to validate the inputs against the defined REGEX above
  //the previous constrains have to be verified on the form for teh user to know

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

  useEffect(() => {
    if (isEmployeeSuccess) {
      //if the add of new user using the mutation is success, empty all the individual states and navigate back to the users list
      setUsername("");
      setPassword("");
      setUserFirstName("");
      setUserMiddleName("");
      setUserLastName("");
      setUserFullName({
        userFirstName: "",
        userMiddleName: "",
        userLastName: "",
      });

      setUserIsActive(false);
      setUserDob("");
      setUserSex("");
      setEmployeeIsActive(false);
      setHouse("");
      setStreet("");
      setArea("");
      setPostCode("");
      setCity("");
      setUserAddress({
        house: "",
        street: "",
        area: "",
        postcode: "",
        city: "",
      });
      setPrimaryPhone();
      setSecondaryPhone();
      setEmail("");
      setUserContact({ primaryPhone: "", secondaryPhone: "", email: "" });
      setEmployeeAssessment([]);
      setDate("");
      setAssessor("");
      setAssessorComment("");
      setAssessmentScore("");
      setEmployeeWorkHistory([]);
      setFromDate("");
      setToDate("");
      setPosition("");
      setContractType("");
      setSalaryPackage({ basic: "", cnss: "", other: "", payment: "" });
      setBasic("");
      setCnss("");
      setOther("");
      setPayment("");
      setInstitution("");
      setEmployeeYears("");
      setAcademicYear("");
      setEmployeeIsActive("");
      setJoinDate("");
      setCurrentContractType("");
      setCurrentPosition("");
      setCurrentSalaryPackage("");
      setEmployeeCurrentEmployment({
        currentPosition: "",
        joinDate: "",
        contractType: "",
        currentSalaryPackage: "",
      });
      setCurrentBasic("");
      setCurrentCnss("");
      setCurrentOther("");
      setCurrentPayment("");

      Navigate("/hr/employees/"); //will navigate here after saving
    }
  }, [isEmployeeSuccess, Navigate]); //even if no success it will navigate and not show any warning if failed or success

  //handlers to get the individual states from the input

  const onUserFirstNameChanged = (e) => setUserFirstName(e.target.value);
  const onUserMiddleNameChanged = (e) => setUserMiddleName(e.target.value);
  const onUserLastNameChanged = (e) => setUserLastName(e.target.value);

  const onUserDobChanged = (e) => setUserDob(e.target.value);
  const onUserSexChanged = (e) => setUserSex(e.target.value);
  const onEmployeeIsActiveChanged = (e) => setEmployeeIsActive((prev) => !prev); //will invert the previous state

  const onHouseChanged = (e) => setHouse(e.target.value);
  const onStreetChanged = (e) => setStreet(e.target.value);
  const onAreaChanged = (e) => setArea(e.target.value);
  const onPostCodeChanged = (e) => setPostCode(e.target.value);
  const onCityChanged = (e) => setCity(e.target.value);
  const onPrimaryPhoneChanged = (e) => setPrimaryPhone(e.target.value);
  const onSecondaryPhoneChanged = (e) => setSecondaryPhone(e.target.value);
  const onEmailChanged = (e) => setEmail(e.target.value);

  const onDateChanged = (e) => setDate(e.target.value);
  const onAssessorChanged = (e) => setAssessor(e.target.value);
  const onAssessorCommentChanged = (e) => setAssessorComment(e.target.value);
  const onAssessmentScoreChanged = (e) => setAssessmentScore(e.target.value);
  const onFromDateChanged = (e) => setFromDate(e.target.value);
  const onToDateChanged = (e) => setToDate(e.target.value);
  const onInstitutionChanged = (e) => setInstitution(e.target.value);
  const onPositionChanged = (e) => setPosition(e.target.value);
  const onContractTypeChanged = (e) => setContractType(e.target.value);
  const onCurrentPaymentChanged = (e) => setCurrentPayment(e.target.value);
  const onCurrentOtherChanged = (e) => setCurrentOther(e.target.value);
  const onCurrentCnssChanged = (e) => setCurrentCnss(e.target.value);
  const onCurrentBasicChanged = (e) => setCurrentBasic(e.target.value);

  //setEmployeeAssessment([]) no assessement for new employees

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
    setSalaryPackage({
      basic: basic,
      cnss: cnss,
      other: other,
      payment: payment,
    });
  }, [basic, cnss, other, payment]);

  useEffect(() => {
    setCurrentSalaryPackage({
      currentBasic: currentBasic,
      currentCnss: currentCnss,
      currentOther: currentOther,
      currentPayment: currentPayment,
    });
  }, [basic, cnss, other, payment]);

  useEffect(() => {
    setEmployeeCurrentEmployment({
      currentPosition: currentPosition,
      joinDate: joinDate,
      currentContractType: contractType,
      currentSalaryPackage: currentSalaryPackage,
    });
  }, [currentPosition, joinDate, contractType, currentSalaryPackage]);

  // to deal with employee work history entries:
  // Handler to update an entry field
  const handleWorkHistoryFieldChange = (index, field, value) => {
    const updatedEntries = [...employeeWorkHistory];
    updatedEntries[index][field] = value;
    setEmployeeWorkHistory(updatedEntries);
  };

  // Handler to add a new work history
  const handleAddWorkHistoryGardienEntry = () => {
    setEmployeeWorkHistory([
      ...employeeWorkHistory,
      {
        institution: "",
        fromDate: "",
        toDate: "",
        position: "",
        contractType: "",
        salaryPackage: "",
      },
    ]);
  };

  // Handler to remove an education entry
  const handleRemoveEmployeeHistoryEntry = (index) => {
    const updatedEntries = employeeWorkHistory.filter((_, i) => i !== index);
    setEmployeeWorkHistory(updatedEntries);
  };

  //to check if we can save before onsave, if every one is true, and also if we are not loading status
  const canSave =
    [
      validUserFirstName,
      validUserLastName,
      validUsername,
      validPassword,
      validUserDob,
      userSex,
      validStreet,
      validCity,
      validPrimaryPhone,
      currentPosition,
      joinDate,
      currentContractType,
      currentPayment,
      currentBasic,
      institution,
      fromDate,
      toDate,
      position,
      contractType,
      basic,
      userRoles.length,
    ].every(Boolean) && !isEmployeeLoading;
  //console.log(` ${userFirstName}, ${validUserLastName}, ${validUsername}, ${validPassword}, ${validUserDob},${userAllowedActions}    ${ validStreet},  ${validPrimaryPhone}, ${validEmail}, ${userRoles.length}, ${isParent}, ${employeeId}, ${userIsActive}` )
  const onSaveEmployeeClicked = async (e) => {
    e.preventDefault();

    if (canSave) {
      //if cansave is true
      //generate the objects before saving
      //console.log(` 'first name' ${userFirstName}', fullfirstname,' ${userFullName.userFirstName}', house: '${house}', usercontact house' ${userContact.house},    ${userRoles.length},${isParent}, ${employeeId}` )
      await addNewEmployee({
        username,
        password,
        userFullName,
        userDob,
        userSex,
        employeeIsActive,
        userRoles,
        userAllowedActions,
        userAddress,
        userContact,
      }); //we call the add new user mutation and set the arguments to be saved
      //added this to confirm save
      if (isEmployeeError) {
        console.log("error savingg", employeeError); //handle the error msg to be shown  in the logs??
      }
    }
  };
  const handleCancel = () => {
    Navigate("/admin/usersManagement/users/");
  };

  //the error messages to be displayed in every case according to the class we put in like 'form input incomplete... which will underline and highlight the field in that cass
  // const errClass = isEmployeeError ? "errmsg" : "offscreen"
  // const validUserClass = !validUsername ? 'form__input--incomplete' : ''
  // const validPwdClass = !validPassword ? 'form__input--incomplete' : ''
  // const validRolesClass = !Boolean(userRoles.length) ? 'form__input--incomplete' : ''

  const content = (
    <>
      <HR />

      <form className="form" onSubmit={onSaveEmployeeClicked}>
        <div className="form__title-row">
          <h2>New Employee</h2>
        </div>
        <div>
          <label className="form__label" htmlFor="userFirstName">
            First Name* : <span className="nowrap">[3-20 letters]</span>
          </label>
          <input
            className={`form__input `}
            id="userFirstName"
            name="userFirstName"
            type="text"
            autoComplete="off"
            value={userFirstName}
            onChange={onUserFirstNameChanged}
          />
          <label className="form__label" htmlFor="userMiddleName">
            Middle Name : <span className="nowrap"></span>
          </label>
          <input
            className={`form__input `}
            id="userMiddleName"
            name="userMiddleName"
            type="text"
            autoComplete="off"
            value={userMiddleName}
            onChange={onUserMiddleNameChanged}
          />
        </div>
        <div>
          <label className="form__label" htmlFor="userLastName">
            Last Name* : <span className="nowrap">[3-20 letters]</span>
          </label>
          <input
            className={`form__input `}
            id="userLastName"
            name="userLastName"
            type="text"
            autoComplete="off"
            value={userLastName}
            onChange={onUserLastNameChanged}
          />
          <label className="form__label" htmlFor="userDob">
            Date Of Birth* : <span className="nowrap">[dd/mm/yyyy]</span>
          </label>
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
        <div>
          <label>
            {" "}
            <div style={{ marginTop: "10px" }}>
              Selected Sex: {userSex || "None"}
            </div>
            <br />
            <input
              type="radio"
              value="Male"
              checked={userSex === "Male"}
              onChange={onUserSexChanged}
            />
            Male
          </label>

          <label style={{ marginLeft: "10px" }}>
            <input
              type="radio"
              value="Female"
              checked={userSex === "Female"}
              onChange={onUserSexChanged}
            />
            Female
          </label>
        </div>
        <div>
          Address
          <label className="form__label" htmlFor="house">
            House* : <span className="nowrap">[3-20 letters]</span>
          </label>
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
            Street* : <span className="nowrap">[3-20 letters]</span>
          </label>
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
              Area: <span className="nowrap"></span>
            </label>
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
              City* : <span className="nowrap">[3-20 letters]</span>
            </label>
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
            Post Code: <span className="nowrap"></span>
          </label>
          <input
            className={`form__input `}
            id="postCode"
            name="postCode"
            type="text"
            autoComplete="off"
            value={postCode}
            onChange={onPostCodeChanged}
          />
        </div>
        <div>
          {" "}
          contact Details
          <label className="form__label" htmlFor="primaryPhone">
            Primary Phone* : <span className="nowrap">[6 to 15 Digits]</span>
          </label>
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
            Secondary Phone: <span className="nowrap"></span>
          </label>
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
          Email: <span className="nowrap"></span>
        </label>
        <input
          className={`form__input `}
          id="email"
          name="email"
          type="email"
          autoComplete="off"
          value={email}
          onChange={onEmailChanged}
        />

        {/* <label className="form__label" htmlFor="isParent">
                    User Is Parent: <span className="nowrap">[24 digits]</span></label>
                <input
                    className={`form__input `}
                    id="isParent"
                    name="isParent"
                    type="text"
                    autoComplete="off"
                    value={isParent}
                    onChange={onIsParentChanged}
                />
                 <label className="form__label" htmlFor="employeeId">
                 User Is Employee: <span className="nowrap">[24 digits]</span></label>
                <input
                    className={`form__input `}
                    id="employeeId"
                    name="employeeId"
                    type="text"
                    autoComplete="off"
                    value={employeeId}
                    onChange={onEmployeeIdChanged}
                /> */}

        <label>
          <input
            type="checkbox"
            value={employeeIsActive}
            checked={employeeIsActive}
            onChange={onEmployeeIsActiveChanged}
          />
          Employee Is Active
        </label>

        {/* <h1>User Roles: </h1>
                    <div className="flex flex-wrap space-x-4">
                    {Object.keys(ROLES).map((key) => (
                    
                    <label  key={key} className="flex items-center">
                        <input
                        type="checkbox"
                        value={ROLES[key]}
                        checked={userRoles.includes(ROLES[key])}
                        onChange={onUserRolesChanged}
                        />
                        {ROLES[key]}
                    </label>
                    
                    ))}
                    </div> */}

        <div className="flex justify-end items-center space-x-4">
          <button
            className="cancel-button"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            className=" px-4 py-2 bg-green-500 text-white rounded"
            type="submit"
            title="Save"
            onClick={onSaveEmployeeClicked}
            disabled={!canSave}
          >
            Save Employee
          </button>
        </div>
      </form>
    </>
  );

  return content;
};
export default NewEmployeeForm;
