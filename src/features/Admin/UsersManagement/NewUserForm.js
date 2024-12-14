import { useState, useEffect } from "react";
import { useAddNewUserMutation } from "./usersApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { ROLES } from "../../../config/UserRoles";
import { ACTIONS } from "../../../config/UserActions";
import UsersManagement from "../UsersManagement";
import {
  DATE_REGEX,
  USER_REGEX,
  PWD_REGEX,
  NAME_REGEX,
  PHONE_REGEX,
  OBJECTID_REGEX,
} from "../../../config/REGEX";
import ConfirmationModal from "../../../Components/Shared/Modals/ConfirmationModal";
import { useOutletContext } from "react-router-dom";

const NewUserForm = () => {
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
      //added this to confirm save
      console.log(response, "response");
      if (response.data && response.data.message) {
        // Success response
        triggerBanner(response.data.message, "success");
      } else if (
        response?.error &&
        response?.error?.data &&
        response?.error?.data?.message
      ) {
        // Error response
        triggerBanner(response.error.data.message, "error");
      } else {
        // In case of unexpected response format
        triggerBanner("Unexpected response from server.", "error");
      }
    } catch (error) {
      triggerBanner("Failed to add user. Please try again.", "error");

      console.error("Error saving:", error);
    }
  };
  // Close the modal without saving
  const handleCloseModal = () => {
    setShowConfirmation(false);
  };
  const handleCancel = () => {
    navigate("/admin/usersManagement/users/");
  };
  console.log(formData, "formData");
  const content = (
    <>
      <UsersManagement />
      <section className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">
          Create New User{" "}
          {`${formData.userFullName.userFirstName} ${formData.userFullName.userMiddleName} ${formData.userFullName.userLastName}`}
        </h2>

        <form onSubmit={onSaveUserClicked} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">User Information</h3>
            <div className="border border-gray-200 p-4 rounded-md shadow-sm space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    UserName
                    {!validity.validUsername && (
                      <span className="text-red-600">*</span>
                    )}
                  </label>
                  <input
                    aria-invalid={!validity.validUsername}
                    aria-label="username"
                    placeholder="[6-20 characters]"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        username: e.target.value,
                      }))
                    }
                    className={`mt-1 block w-full border ${
                      validity.validUsername
                        ? "border-gray-300"
                        : "border-red-600"
                    } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                    {!validity.validPassword && (
                      <span className="text-red-600">*</span>
                    )}
                  </label>
                  <input
                    aria-invalid={!validity.validPassword}
                    aria-label="password"
                    placeholder="[8-20 characters]"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    className={`mt-1 block w-full border ${
                      validity.validFirstName
                        ? "border-gray-300"
                        : "border-red-600"
                    } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
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
                    className={`mt-1 block w-full border ${
                      validity.validFirstName
                        ? "border-gray-300"
                        : "border-red-600"
                    } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
                    required
                  />{" "}
                </label>
              </div>
              {/* Middle Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Middle Name
                  <input
                    placeholder="[3-20 letters]"
                    aria-label="middle name"
                    type="text"
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
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </label>
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Last Name{" "}
                  {!validity.validLastName && (
                    <span className="text-red-600">*</span>
                  )}
                  <input
                    aria-invalid={!validity.validLastName}
                    placeholder="[3-20 letters]"
                    aria-label="last name"
                    type="text"
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
                    className={`mt-1 block w-full border ${
                      validity.validLastName
                        ? "border-gray-300"
                        : "border-red-600"
                    } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
                    required
                  />{" "}
                </label>
              </div>

              {/* Date of Birth */}
              <div>
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="userDob"
                >
                  Date of Birth{" "}
                  {!validity.validDob && (
                    <span className="text-red-600">*</span>
                  )}
                </label>
                <input
                 aria-invalid={!validity.validDob}
                placeholder="[dd/mm/yyyy]"
                 aria-label="userDob"
                  type="date"
                  name="userDob"
                  value={formData.userDob}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full border ${
                    validity.validDob ? "border-gray-300" : "border-red-600"
                  } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
                  required
                />
              </div>

              {/* Sex Selection */}

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Sex{" "}
                  {!validity.validUserSex && (
                    <span className="text-red-600">*</span>
                  )}
                </label>
                <div className="flex items-center space-x-4 mt-1">
                  <div className="flex items-center">
                    <input
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
                      className={`h-4 w-4 ${
                        validity.validUserSex
                          ? "border-gray-300 rounded"
                          : "border-red-600 rounded"
                      } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
                    />
                    <label className="ml-2 text-sm text-gray-700">Male</label>
                  </div>

                  <div className="flex items-center">
                    <input
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
                      className="h-4 w-4 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label className="ml-2 text-sm text-gray-700">Female</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <h3 className="text-lg font-semibold">Contact</h3>
          <div className="border border-gray-200 p-4 rounded-md shadow-sm space-y-2">
            {/* Contact Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Primary Phone{" "}
                  {!validity.validPrimaryPhone && (
                    <span className="text-red-600">*</span>
                  )}
                
                <input
                 aria-invalid={!validity.validPrimaryPhone}
                 placeholder="[6-15 digits]"
                 aria-label="primary phone number"
                  type="text"
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
                  className={`mt-1 block w-full border ${
                    validity.validPrimaryPhone
                      ? "border-gray-300"
                      : "border-red-600"
                  } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
                 
                  required
                /></label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Secondary Phone
               
                <input
                  placeholder="[6-15 digits]"
                    aria-label="secondary phone number"
                  type="text"
                  name="secondaryPhone"
                  value={formData.userContact.secondaryPhone}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      userContact: {
                        ...prev.userContact,
                        secondaryPhone: e.target.value,
                      },
                    }))
                  }
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                 
                /> </label>
              </div>
            </div>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
             
              <input
               placeholder="[email@address.com]"
                  aria-label="email"
                type="email"
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
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
               
              /> </label>
            </div>
          </div>
          {/* Address Information */}
          <h3 className="text-lg font-semibold">Contact</h3>
          <div className="border border-gray-200 p-4 rounded-md shadow-sm space-y-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  House{" "}
                  {!validity.validHouse && (
                    <span className="text-red-600">*</span>
                  )}
               
                <input
                 aria-invalid={!validity.validHouse}
                 placeholder="[3-20 letters]"
                 aria-label="house number"
                  type="text"
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
                  className={`mt-1 block w-full border ${
                    validity.validHouse ? "border-gray-300" : "border-red-600"
                  } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
                  
                /> </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Street{" "}
                  {!validity.validStreet && (
                    <span className="text-red-600">*</span>
                  )}
               
                <input
                 aria-invalid={!validity.validStreet}
                 aria-label="street name"
                 placeholder="[3-20 letters]"
                  type="text"
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
                  className={`mt-1 block w-full border ${
                    validity.validStreet ? "border-gray-300" : "border-red-600"
                  } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
                 
                /> </label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Area
                 
                  <input
                     placeholder="[3-20 letters]"
                      aria-label="area"
                    type="text"
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
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                   
                  /> </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Post Code
                
                  <input
                   placeholder="[3-20 letters]"
                      aria-label="post code"
                    type="text"
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
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    
                  />  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  City{" "}
                  {!validity.validCity && (
                    <span className="text-red-600">*</span>
                  )}
               
                <input
                  aria-invalid={!validity.validCity}
                  placeholder="[3-20 letters]"
                  aria-label="city"
                  type="text"
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
                  className={`mt-1 block w-full border ${
                    validity.validCity ? "border-gray-300" : "border-red-600"
                  } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
                 
                /> </label>
              </div>
            </div>
          </div>
          <h3 className="text-lg font-semibold">Permissions</h3>
          <div className="border border-gray-200 p-4 rounded-md shadow-sm space-y-2">
            {/* Family ID Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Family ID
            
              <input
               aria-label="family id"
                  placeholder="[24 characters]"
                type="text"
                name="familyId"
                value={formData.familyId}
                onChange={handleInputChange}
                className="form-input mt-1 block w-full"
              />  </label>
            </div>

            {/* Employee ID Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Employee ID
             
              <input
                 aria-label="employee id"
                  placeholder="[24 characters]"
                type="text"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleInputChange}
                className="form-input mt-1 block w-full"
              /> </label>
            </div>

            {/* User Is Active Checkbox */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                User Is Active
              
              <input
aria-label="user is active"
                type="checkbox"
                name="userIsActive"
                checked={formData.userIsActive}
                onChange={handleInputChange}
                className="h-4 w-4"
              /></label>
            </div>
            {/* User role selection */}
            
              <div className="block text-sm font-medium text-gray-700">
                User Roles
              
              <div className="flex flex-wrap">
                {Object.keys(ROLES).map((role) => (
                  <div key={role} className="mr-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="userRoles"
                        value={role}
                        checked={formData.userRoles.includes(role)}
                        onChange={handleRoleChange}
                        className="h-4 w-4"
                      />
                      <span className="ml-2">{role}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* User action selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
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
      </section>
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
