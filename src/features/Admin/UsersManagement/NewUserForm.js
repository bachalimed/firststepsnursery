import { useState, useEffect } from "react";
import { useAddNewUserMutation } from "./usersApiSlice";
import { useNavigate } from "react-router-dom";

import { ROLES } from "../../../config/UserRoles";
import { ACTIONS } from "../../../config/UserActions";
import UsersManagement from "../UsersManagement";
import {
  SHORTCOMMENT_REGEX,
  EMAIL_REGEX,
  DATE_REGEX,
  USER_REGEX,
  PWD_REGEX,
  NAME_REGEX,
  PHONE_REGEX,
  OBJECTID_REGEX,
} from "../../../config/REGEX";
import ConfirmationModal from "../../../Components/Shared/Modals/ConfirmationModal";
import { useOutletContext } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
const NewUserForm = () => {
  //an add user function that can be called inside the component
  const [
    addNewUser,
    {
      //an object that calls the status when we execute the newUserForm function
      isLoading: isAddLoading,
      isSuccess: isAddSuccess,
      isError: isAddError,
      error: addError,
    },
  ] = useAddNewUserMutation(); //it will not execute the mutation nownow but when called
  const { isManager, isAdmin, isDirector } = useAuth();
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
    validMiddleName: false,
    validLastName: false,
    validUserDob: false,
    validUserSex: false,
    validHouse: false,
    validStreet: false,
    validCity: false,
    validArea: false,
    validPrimaryPhone: false,
    validSecondaryPhone: false,
    validPostCode: false,
    validEmail: false,
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
      validMiddleName:
        formData?.userFullName?.userMiddleName !== ""
          ? NAME_REGEX.test(formData.userFullName.userMiddleName)
          : true,
      validLastName: NAME_REGEX.test(formData.userFullName.userLastName),
      validUserDob: DATE_REGEX.test(formData.userDob),
      validUserSex: NAME_REGEX.test(formData.userSex),
      validHouse: NAME_REGEX.test(formData.userAddress.house),
      validStreet: NAME_REGEX.test(formData.userAddress.street),
      validCity: NAME_REGEX.test(formData.userAddress.city),
      validArea:
        formData?.userAddress?.area === "" ||
        SHORTCOMMENT_REGEX.test(formData.userAddress.area),
      validPostCode: SHORTCOMMENT_REGEX.test(formData.userAddress.postCode),
      validPrimaryPhone: PHONE_REGEX.test(formData.userContact.primaryPhone),
      validEmail:
        formData.userContact.email === "" ||
        EMAIL_REGEX.test(formData.userContact.email),
      validSecondaryPhone:
        formData.userContact.secondaryPhone === "" ||
        PHONE_REGEX.test(formData.userContact.secondaryPhone),
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

  useEffect(() => {
    if (isAddSuccess) {
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
  }, [isAddSuccess, navigate]);

  // Handle form field changes generically
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handleRoleChange = (role) => {
    setFormData((prev) => {
      const isChecked = prev.userRoles.includes(role);
      return {
        ...prev,
        userRoles: isChecked
          ? prev.userRoles.filter((r) => r !== role) // Remove role if already selected
          : [...prev.userRoles, role], // Add role if not selected
      };
    });
  };
  const handleActionChange = (action) => {
    setFormData((prev) => {
      const isChecked = prev.userAllowedActions.includes(action);
      return {
        ...prev,
        userAllowedActions: isChecked
          ? prev.userAllowedActions.filter((act) => act !== action) // Remove role if already selected
          : [...prev.userAllowedActions, action], // Add role if not selected
      };
    });
  };

  //to check if we can save before onsave, if every one is true, and also if we are not loading status
  const canSave = Object.values(validity).every(Boolean); //&& !isAddLoading;
  const { triggerBanner } = useOutletContext(); // Access banner trigger
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

    try {
      const response = await addNewUser({ formData }); //we call the add new user mutation and set the arguments to be saved
      if ( response?.message) {
        // Success response
        triggerBanner(response?.message, "success");
      }
      else if (response?.data?.message ) {
        // Success response
        triggerBanner(response?.data?.message, "success");
      } else if (response?.error?.data?.message) {
        // Error response
        triggerBanner(response?.error?.data?.message, "error");
      } else if (isAddError) {
        // In case of unexpected response format
        triggerBanner(addError?.data?.message, "error");
      } else {
        // In case of unexpected response format
        triggerBanner("Unexpected response from server.", "error");
      }
    } catch (error) {
      triggerBanner(error?.data?.message, "error");
    }
  };
  // Close the modal without saving
  const handleCloseModal = () => {
    setShowConfirmation(false);
  };

  // console.log(validity, "validity");
  // console.log(formData, "formData");
  const content = (
    <>
      <UsersManagement />

      <form onSubmit={onSaveUserClicked} className="form-container">
        <h2 className="formTitle">
          Add user{" "}
          {`${formData.userFullName.userFirstName} ${formData.userFullName.userMiddleName} ${formData.userFullName.userLastName}`}
        </h2>
        <div className="formSectionContainer">
          <h3 className="formSectionTitle">Personal details</h3>
          <div className="formSection">
            <div className="formLineDiv">
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
                  className={`formInputText    `}
                  required
                />
              </label>

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
                />
              </label>

              <label htmlFor="userFirstName" className="formInputLabel">
                First Name
                {!validity.validFirstName && (
                  <span className="text-red-600">*</span>
                )}
                <input
                  aria-invalid={!validity.validFirstName}
                  placeholder="[3-25 letters]"
                  aria-label="first name"
                  type="text"
                  id="userFirstName"
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

              {/* Middle Name */}

              <label htmlFor="userMiddleName" className="formInputLabel">
                Middle Name
                {!validity?.validMiddleName &&
                  formData.userFullName.userMiddleName !== "" && (
                    <span className="text-red-600 ">[3-25] letters</span>
                  )}
                <input
                  placeholder="[3-25 letters]"
                  aria-label="middle name"
                  type="text"
                  id="userMiddleName"
                  name="userMiddleName"
                  value={formData.userFullName.userMiddleName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      userFullName: {
                        ...prev.userFullName,
                        userMiddleName: e.target.value,
                      },
                    }))
                  }
                  className={`formInputText`}
                />
              </label>

              {/* Last Name */}

              <label htmlFor="userLastName" className="formInputLabel">
                Last Name{" "}
                {!validity.validLastName && (
                  <span className="text-red-600">*</span>
                )}
                <input
                  aria-invalid={!validity.validLastName}
                  placeholder="[3-25 letters]"
                  aria-label="last name"
                  type="text"
                  id="userLastName"
                  name="userLastName"
                  value={formData.userFullName.userLastName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      userFullName: {
                        ...prev.userFullName,
                        userLastName: e.target.value,
                      },
                    }))
                  }
                  className={`formInputText`}
                  required
                />{" "}
              </label>

              {/* Date of Birth */}

              <label className="formInputLabel" htmlFor="userDob">
                Date of Birth{" "}
                {!validity.validUserDob && <span className="text-red-600">*</span>}
                <input
                  aria-invalid={!validity.validUserDob}
                  placeholder="[dd/mm/yyyy]"
                  aria-label="userDob"
                  type="date"
                  id="userDob"
                  name="userDob"
                  value={formData.userDob}
                  onChange={handleInputChange}
                  className={`formInputText`}
                  required
                />
              </label>

              {/* Sex Selection */}
            </div>
            <div className="formLineDiv">
              {/* Sex Selection */}

              <label className="formInputLabel">
                Sex{" "}
                {!validity.validUserSex && (
                  <span className="text-red-600">*</span>
                )}
                <div className="formCheckboxItemsDiv">
                  <label htmlFor="male" className="formCheckboxChoice">
                    <input
                      type="checkbox"
                      id="male"
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
                      className="formCheckbox"
                    />
                    Male
                  </label>

                  <label htmlFor="female" className="formCheckboxChoice">
                    <input
                      type="checkbox"
                      id="female"
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
                    Female
                  </label>
                </div>
              </label>
            </div>
          </div>

          <h3 className="formSectionTitle">Contact details</h3>
          <div className="formSection">
            {/* Contact Information */}

            <div className="formLineDiv">
              {/* Address Information */}
              <label htmlFor="house" className="formInputLabel">
                House{" "}
                {!validity.validHouse && (
                  <span className="text-red-600">*</span>
                )}
                <input
                  aria-label="house"
                  aria-invalid={!validity.validHouse}
                  type="text"
                  id="house"
                  name="house"
                  value={formData.userAddress.house}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      userAddress: {
                        ...prev.userAddress,
                        house: e.target.value,
                      },
                    }))
                  }
                  className={`formInputText`}
                  placeholder="[3-25] letters"
                />{" "}
              </label>

              <label htmlFor="street" className="formInputLabel">
                Street{" "}
                {!validity.validStreet && (
                  <span className="text-red-600">*</span>
                )}
                <input
                  aria-label="street"
                  aria-invalid={!validity.validStreet}
                  type="text"
                  id="street"
                  name="street"
                  value={formData.street}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      userAddress: {
                        ...prev.userAddress,
                        street: e.target.value,
                      },
                    }))
                  }
                  className={`formInputText`}
                  placeholder="[3-25] letters"
                />{" "}
              </label>
            </div>
            <div className="formLineDiv">
              <label htmlFor="area" className="formInputLabel">
                Area{" "}
                {!validity?.validArea && formData?.userContact.area !== "" && (
                  <span className="text-red-600 ">[0-15] letters</span>
                )}
                <input
                  aria-label="area"
                  type="text"
                  id="area"
                  name="area"
                  value={formData.userAddress.area}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      userAddress: {
                        ...prev.userAddress,
                        area: e.target.value,
                      },
                    }))
                  }
                  className={`formInputText`}
                  placeholder="[0-20] letters"
                />{" "}
              </label>

              <label htmlFor="city" className="formInputLabel">
                City{" "}
                {!validity.validCity && <span className="text-red-600">*</span>}
                <input
                  aria-label="city"
                  aria-invalid={!validity.validCity}
                  type="text"
                  id="city"
                  name="city"
                  value={formData.userAddress.city}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      userAddress: {
                        ...prev.userAddress,
                        city: e.target.value,
                      },
                    }))
                  }
                  className={`formInputText`}
                  placeholder="[3-25] letters"
                />{" "}
              </label>
            </div>
            <div className="formLineDiv">
              <label htmlFor="postCode" className="formInputLabel">
                Post Code{" "}
                {!validity?.validPostCode &&
                  formData?.userContact.postCode !== "" && (
                    <span className="text-red-600 ">[0-15] characters</span>
                  )}
                <input
                  aria-label="postCode"
                  type="text"
                  id="postCode"
                  name="postCode"
                  value={formData.userAddress.postCode}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      userAddress: {
                        ...prev.userAddress,
                        postCode: e.target.value,
                      },
                    }))
                  }
                  className={`formInputText`}
                  placeholder="[0-15] characters"
                />{" "}
              </label>

              {/* Email */}

              <label htmlFor="email" className="formInputLabel">
                Email{" "}
                {!validity?.validEmail &&
                  formData?.userContact.email !== "" && (
                    <span className="text-red-600 ">[6-25] characters</span>
                  )}
                <input
                  aria-label="email"
                  type="email"
                  id="email"
                  name="email"
                  value={formData.userContact.email}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      userContact: {
                        ...prev.userContact,
                        email: e.target.value,
                      },
                    }))
                  }
                  className={`formInputText`}
                  placeholder="[6-25] characters"
                />{" "}
              </label>
            </div>
            <div className="formLineDiv">
              <label htmlFor="primaryPhone" className="formInputLabel">
                Primary Phone{" "}
                {!validity.validPrimaryPhone && (
                  <span className="text-red-600">*</span>
                )}
                <input
                  aria-label="primaryPhone"
                  aria-invalid={!validity.validPrimaryPhone}
                  type="text"
                  id="primaryPhone"
                  name="primaryPhone"
                  value={formData.userContact.primaryPhone}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      userContact: {
                        ...prev.userContact,
                        primaryPhone: e.target.value,
                      },
                    }))
                  }
                  className={`formInputText`}
                  placeholder="[6-15] digits"
                  required
                />{" "}
              </label>

              <label htmlFor="secondaryPhone" className="formInputLabel">
                Secondary Phone
                {!validity?.validSecondaryPhone &&
                  formData?.userContact.secondaryPhone !== "" && (
                    <span className="text-red-600 ">[6-15] digits</span>
                  )}
                <input
                  aria-invalid={!validity.validSecondaryPhone}
                  aria-label="secondaryPhone"
                  type="text"
                  id="secondaryPhone"
                  name="secondaryPhone"
                  value={formData?.userContact?.secondaryPhone}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      userContact: {
                        ...prev.userContact,
                        secondaryPhone: e.target.value,
                      },
                    }))
                  }
                  className={`formInputText`}
                  placeholder="[6-15] digits"
                />{" "}
              </label>
            </div>
          </div>
          <h3 className="formSectionTitle">
            Employee roles
            {formData?.familyId && !formData?.userRoles?.includes("Parent") && (
              <span className="text-red-600 text-sm">
                {" "}
                Activate parent role{" "}
              </span>
            )}
            {formData?.employeeId &&
              !formData?.userRoles?.includes("Employee") && (
                <span className="text-red-600 text-sm">
                  {" "}
                  Activate family role{" "}
                </span>
              )}
          </h3>
          {(isAdmin || isManager || isDirector) && (
            <div className="formSection">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2 mt-1 max-h-80 overflow-y-auto">
                {Object.keys(ROLES).map((role, index) => {
                  const isChecked = formData?.userRoles?.includes(role);
                  return (
                    <button
                      aria-label="role"
                      key={index}
                      type="button"
                      onClick={() => handleRoleChange(role)}
                      className={`px-3 py-2 text-left rounded-md ${
                        isChecked
                          ? "bg-sky-700 text-white hover:bg-sky-600"
                          : "bg-gray-200 text-gray-700 hover:bg-sky-600 hover:text-white"
                      }`}
                    >
                      <div className="font-semibold">{role}</div>
                    </button>
                  );
                })}
              </div>
              {/* Family ID Input */}

              <label htmlFor="familyId" className="formInputLabel">
                Family ID{" "}
                {!validity.validFamilyId && (
                  <span className="text-red-600">*</span>
                )}{" "}
                {!formData?.familyId &&
                  formData?.userRoles?.includes("Parent") && (
                    <span className="text-red-600 text-sm">
                      {" "}
                      Provide family ID{" "}
                    </span>
                  )}
                <input
                  aria-invalid={!validity?.validFamilyId}
                  aria-label="family id"
                  placeholder="[24 characters]"
                  type="text"
                  id="familyId"
                  name="familyId"
                  value={formData.familyId}
                  onChange={handleInputChange}
                  className={`formInputText`}
                />{" "}
              </label>

              {/* Employee ID Input */}

              <label htmlFor="employeeId" className="formInputLabel">
                Employee ID
                {!validity.validEmployeeId && (
                  <span className="text-red-600">*</span>
                )}{" "}
                {!formData?.employeeId &&
                  formData?.userRoles?.includes("Employee") && (
                    <span className="text-red-600 text-sm">
                      {" "}
                      Provide employee ID{" "}
                    </span>
                  )}
                <input
                  aria-invalid={!validity?.validEmployeeId}
                  aria-label="employee id"
                  placeholder="[24 characters]"
                  type="text"
                  id="employeeId"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleInputChange}
                  className={`formInputText`}
                />{" "}
              </label>
            </div>
          )}
          <h3 className="formSectionTitle">User permissions</h3>
          <div className="formSection">
            <label className="formInputLabel">
              User active?
              <div className="formCheckboxItemsDiv">
                <label htmlFor="userIsActive" className="formCheckboxChoice">
                  <input
                    aria-label="user is active"
                    type="checkbox"
                    id="userIsActive"
                    name="userIsActive"
                    checked={formData.userIsActive}
                    onChange={handleInputChange}
                    className="formCheckbox"
                  />{" "}
                  User Is Active
                </label>
              </div>
            </label>

            {/* User action selection */}
            <h3 className="formInputLabel">Allowed user actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2 mt-1 max-h-80 overflow-y-auto">
              {Object.keys(ACTIONS).map((action, index) => {
                const isChecked =
                  formData?.userAllowedActions?.includes(action);
                return (
                  <button
                    aria-label="action"
                    key={index}
                    type="button"
                    onClick={() => handleActionChange(action)}
                    className={`px-3 py-2 text-left rounded-md ${
                      isChecked
                        ? "bg-sky-700 text-white hover:bg-sky-600"
                        : "bg-gray-200 text-gray-700 hover:bg-sky-600 hover:text-white"
                    }`}
                  >
                    <div className="font-semibold">{action}</div>
                  </button>
                );
              })}
            </div>

            {/* {Object.keys(ACTIONS).map((action, index) => (
                  <div key={action} className="mr-4">
                    <label
                      htmlFor={`userAllowedActions-${index}`}
                      className="flex items-center"
                    >
                      <input
                        type="checkbox"
                        id={`userAllowedActions-${index}`}
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
            </div> */}
          </div>
        </div>
        <div className="cancelSavebuttonsDiv">
          <button
            aria-label="cancel user"
            type="button"
            onClick={() => navigate("/admin/usersManagement/users/")}
            className="cancel-button"
          >
            Cancel
          </button>
          <button
            aria-label="submit user"
            className="save-button"
            type="submit"
            disabled={!canSave || isAddLoading}
          >
            Save
          </button>
        </div>
      </form>

      {/* Confirmation Modal */}
      <ConfirmationModal
        show={showConfirmation}
        onClose={handleCloseModal}
        onConfirm={handleConfirmSave}
        title="Confirm Save"
        message="Are you sure you want to save?"
      />
    </>
  );

  return content;
};
export default NewUserForm;
