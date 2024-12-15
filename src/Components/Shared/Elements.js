

import { useState, useEffect } from "react";
import { useAddNewUserMutation } from "../../features/Admin/UsersManagement/usersApiSlice";
import { useNavigate } from "react-router-dom";

import { ROLES } from "../../config/UserRoles";
import { ACTIONS } from "../../config/UserActions";

import {
  DATE_REGEX,
  USER_REGEX,
  PWD_REGEX,
  NAME_REGEX,
  PHONE_REGEX,
  OBJECTID_REGEX,
} from "../../config/REGEX";


const Elements = () => {
  //an add user function that can be called inside the component
  const [
    addNewUser,
    {
      //an object that calls the status when we execute the newUserForm function
      isLoading,
      isSuccess,
      isError,
      error,
    },
  ] = useAddNewUserMutation(); //it will not execute the mutation nownow but when called

  const navigate = useNavigate();

  // Consolidated form state
  const [formData, setFormData] = useState({
    username: `user${Math.random().toString(36).substring(2, 10)}`,
    password: "",
    userRoles: [],
    userAllowedActions: [],
    userFullName: {
      userFirstName: "",
      userMiddleName: "",
      userLastName: "",
    },
    userDob: "",
    userSex: "",
    userIsActive: false,
    userAddress: {
      house: "",
      street: "",
      area: "",
      postCode: "",
      city: "",
    },
    userContact: {
      primaryPhone: "",
      secondaryPhone: "",
      email: "",
    },
    familyId: undefined,
    employeeId: undefined,
  });

  //confirmation Modal states
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [validity, setValidity] = useState({
    validUsername: false,
    validPassword: false,
    validFirstName: false,
    validLastName: false,
    validDob: false,
    validUserSex: false,
    validHouse: false,
    validStreet: false,
    validCity: false,
    validPrimaryPhone: false,
    validEmployeeId: false,
    validFamilyId: false,
  });
  // Validate inputs using regex patterns
  useEffect(() => {
    setValidity((prev) => ({
      ...prev,
      validUsername: USER_REGEX.test(formData.username),
      validPassword: PWD_REGEX.test(formData.password),
      validFirstName: NAME_REGEX.test(formData.userFullName.userFirstName),
      validLastName: NAME_REGEX.test(formData.userFullName.userLastName),
      validDob: DATE_REGEX.test(formData.userDob),
      validUserSex: NAME_REGEX.test(formData.userSex),
      validHouse: NAME_REGEX.test(formData.userAddress.house),
      validStreet: NAME_REGEX.test(formData.userAddress.street),
      validCity: NAME_REGEX.test(formData.userAddress.city),
      validPrimaryPhone: PHONE_REGEX.test(formData.userContact.primaryPhone),
      validEmployeeId:
        formData.employeeId !== undefined && formData.employeeId !== ""
          ? OBJECTID_REGEX.test(formData.employeeId)
          : true,
      validFamilyId:
        formData.familyId !== undefined && formData.familyId !== ""
          ? OBJECTID_REGEX.test(formData.familyId)
          : true,
      validUserRoles: formData.userRoles.length > 0, // At least one role should be selected
      // validUserAllowedActions: formData.userAllowedActions.length > 0, // At least one action should be selected
    }));
  }, [formData]);

  console.log(
    validity.validUsername,
    validity.validPassword,
    validity.validFirstName,
    validity.validLastName,
    validity.validDob,
    validity.validUserSex,
    validity.validHouse,
    validity.validStreet,
    validity.validCity,
    validity.validPrimaryPhone,
    validity.validEmployeeId,
    validity.validFamilyId,
    validity.validUserRoles
  );

  useEffect(() => {
    if (isSuccess) {
      setFormData({
        username: "",
        password: "",
        userRoles: [],
        userAllowedActions: [],
        userFullName: {
          userFirstName: "",
          userMiddleName: "",
          userLastName: "",
        },
        userDob: "",
        userSex: "",
        userIsActive: false,
        userAddress: {
          house: "",
          street: "",
          area: "",
          postCode: "",
          city: "",
        },
        userContact: {
          primaryPhone: "",
          secondaryPhone: "",
          email: "",
        },
        familyId: undefined,
        employeeId: undefined,
      });
      navigate("/admin/usersManagement/users/");
    }
  }, [isSuccess, navigate]);

  // Handle form field changes generically
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handleRoleChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      userRoles: checked
        ? [...prev.userRoles, value] // Add role
        : prev.userRoles.filter((role) => role !== value), // Remove role
    }));
  };

  // Handle action change
  const handleActionChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      userAllowedActions: checked
        ? [...prev.userAllowedActions, value] // Add action
        : prev.userAllowedActions.filter((action) => action !== value), // Remove action
    }));
  };

  //to check if we can save before onsave, if every one is true, and also if we are not loading status
  const canSave = Object.values(validity).every(Boolean) && !isLoading;
 
  const onSaveUserClicked = async (e) => {
    e.preventDefault();

    if (canSave) {
      setShowConfirmation(true);
    }
  };
  // This function handles the confirmed save action
  const handleConfirmSave = async () => {
    // Close the confirmation modal
    setShowConfirmation(false);

      const response = await addNewUser({ formData }); //we call the add new user mutation and set the arguments to be saved
      //added this to confirm save
      console.log(response, "response");
     
  };
  
  const handleCancel = () => {
    navigate("/admin/usersManagement/users/");
  };
  console.log(formData, "formData");
  const content = (
    <>
    

      <form onSubmit={onSaveUserClicked} className="form-container">
        <h2 className="formTitle ">
          Create New User{" "}
          {`${formData.userFullName.userFirstName} ${formData.userFullName.userMiddleName} ${formData.userFullName.userLastName}`}
        </h2>
        <div className="formSectionContainer">
          <h3 className="formSectionTitle">User Information</h3>
          <div className="formSection">
            <div className="formLineDiv">
              <div>
                <label htmlFor="username" className="formInputLabel">
                  UserName
                  {!validity.validUsername && (
                    <span className="text-red-600">*</span>
                  )}
                
                <input
                  aria-invalid={!validity.validUsername}
                  aria-label="username"
                  placeholder="[6-20 characters]"
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      username: e.target.value,
                    }))
                  }
                  className={`formInputText`}
                  required
                /></label>
              </div>
              <div>
                <label htmlFor="password" className="formInputLabel">
                  Password
                  {!validity.validPassword && (
                    <span className="text-red-600">*</span>
                  )}
               
                <input
                  aria-invalid={!validity.validPassword}
                  aria-label="password"
                  placeholder="[8-20 characters]"
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  className={`formInputText`}
                  required
                /> </label>
              </div>
            </div>
            <div>
              <label className="formInputLabel">
                First Name
                {!validity.validFirstName && (
                  <span className="text-red-600">*</span>
                )}
                <input
                  aria-invalid={!validity.validFirstName}
                  placeholder="[3-20 letters]"
                  aria-label="first name"
                  type="text"
                  name="userFirstName"
                  value={formData.userFullName.userFirstName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      userFullName: {
                        ...prev.userFullName,
                        userFirstName: e.target.value,
                      },
                    }))
                  }
                  className={`formInputText`}
                  required
                />{" "}
              </label>
            </div>
          
            {/* Date of Birth */}
            <div>
              <label
                className="formInputLabel"
                htmlFor="userDob"
              >
                Date of Birth{" "}
                {!validity.validDob && <span className="text-red-600">*</span>}
              </label>
              <input
                aria-invalid={!validity.validDob}
                placeholder="[dd/mm/yyyy]"
                aria-label="userDob"
                type="date"
                name="userDob"
                value={formData.userDob}
                onChange={handleInputChange}
                className={`formInputText`}
                required
              />
            </div>

            {/* Sex Selection new student form is ok */}

            <div>
              <label htmlFor="userSex" className="formInputLabel">
                Sex{" "}
                {!validity.validUserSex && (
                  <span className="text-red-600">*</span>
                )}
              </label>
              <div id="userSex" className="formCheckboxItemsDiv">
                <div className="formCheckboxChoiceDiv">
                <label aria-label="male" className="ml-2 text-sm text-gray-700">
                  <input 
                  id="userSex"
                    type="checkbox"
                    name="userSex"
                    value="Male"
                    checked={formData.userSex === "Male"}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        userSex: e.target.checked
                          ? "Male"
                          : formData.userSex === "Male"
                          ? ""
                          : formData.userSex,
                      }));
                    }}
                    className={`formCheckbox`}
                  />
                  Male</label>
                </div>

                <div className="formCheckboxChoiceDiv">
                <label  aria-label="female" className="ml-2 text-sm text-gray-700">
                  <input
                  id="userSex"
                    type="checkbox"
                    name="userSex"
                    value="Female"
                    checked={formData.userSex === "Female"}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        userSex: e.target.checked
                          ? "Female"
                          : formData.userSex === "Female"
                          ? ""
                          : formData.userSex,
                      }));
                    }}
                    className="formCheckbox"
                  />
                  Female</label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <h3 className="formSectionTitle">User Information</h3>
        <div className="formSection">
          {/* Family ID Input */}
          <div>
            <label  className="formInputLabel">
              Family ID
              <input
                aria-label="family id"
                placeholder="[24 characters]"
                type="text"
                name="familyId"
                value={formData.familyId}
                onChange={handleInputChange}
                className="form-input mt-1 block w-full"
              />{" "}
            </label>
          </div>

          {/* Employee ID Input */}
          <div>
            <label  className="formInputLabel">
              Employee ID
              <input
                aria-label="employee id"
                placeholder="[24 characters]"
                type="text"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleInputChange}
                className="form-input mt-1 block w-full"
              />{" "}
            </label>
          </div>

          {/* User Is Active Checkbox */}
          <div>
            <label  className="formInputLabel">
              User Is Active
              <input
                aria-label="user is active"
                type="checkbox"
                name="userIsActive"
                checked={formData.userIsActive}
                onChange={handleInputChange}
                className="h-4 w-4"
              />
            </label>
          </div>
          {/* User role selection */}

          <div className="formInputLabel">
            User Roles
            <div className="formCheckboxItemsDiv ">
              {Object.keys(ROLES).map((role) => (
                <div key={role} className="mr-4">
                  <label className="formCheckboxChoiceDiv">
                    <input
                      type="checkbox"
                      name="userRoles"
                      value={role}
                      checked={formData.userRoles.includes(role)}
                      onChange={handleRoleChange}
                      className="formCheckbox"
                    />
                    <span className="ml-2">{role}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* User action selection */}
          <div>
            <label  className="formInputLabel">
              Allowed Actions
            </label>
            <div className="flex flex-wrap">
              {Object.keys(ACTIONS).map((action) => (
                <div key={action} className="mr-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="userAllowedActions"
                      value={action}
                      checked={formData.userAllowedActions.includes(action)}
                      onChange={handleActionChange}
                      className="h-4 w-4"
                    />
                    <span className="ml-2">{action}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <button className="cancel-button" onClick={handleCancel}>
            Cancel
          </button>
          <button
            className=" px-4 py-2 bg-green-600 text-white rounded"
            type="submit"
            title="Save"
            onClick={onSaveUserClicked}
            disabled={!canSave || isLoading}
          >
            Save Changes
          </button>
        </div>
      </form>

     
    </>
  );

  return content;
};
export default Elements;
