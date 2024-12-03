import { useState, useEffect } from "react";
import { useUpdateUserMutation } from "./usersApiSlice";
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
} from "../../../config/REGEX"
import ConfirmationModal from "../../../Components/Shared/Modals/ConfirmationModal";

import { useOutletContext } from "react-router-dom";

const EditUserForm = ({ user }) => {
  //user was passed as prop in editUser
  const navigate = useNavigate();

  //initialise the mutation to be used later
  const [updateUser, { isLoading, isSuccess, isError, error }] =
    useUpdateUserMutation();


    //confirmation Modal states
const [showConfirmation, setShowConfirmation] = useState(false);

  //initialise the parameters with the user details
  // Consolidated form state
  const [formData, setFormData] = useState({
    id: user.id,
    username: user.username,
    password: "",
    userRoles: user.userRoles,
    userAllowedActions: user.userAllowedActions || [],
    userFullName: {
      userFirstName: user.userFullName.userFirstName,
      userMiddleName: user.userFullName?.userMiddleName || "",
      userLastName: user.userFullName.userLastName,
    },
    userDob: user.userDob.split("T")[0],
    userSex: user.userSex,
    userIsActive: user.userIsActive,
    userPhoto: user?.userPhoto || "",
    userAddress: {
      house: user.userAddress.house,
      street: user.userAddress.street,
      area: user.userAddress?.area,
      postCode: user.userAddress?.postCode,
      city: user.userAddress.city,
    },
    userContact: {
      primaryPhone: user.userContact.primaryPhone,
      secondaryPhone: user.userContact?.secondaryPhone || "",
      email: user.email || "",
    },
    familyId: user?.familyId,
    employeeId: user?.employeeId,
  });
  const [validity, setValidity] = useState({
    validUsername: false,
    validPassword: false,
    validFirstName: false,
    validLastName: false,
    validUserDob: false,
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
      validPassword: formData.password
        ? PWD_REGEX.test(formData.password)
        : true, //if not changed, set to true
      validFirstName: NAME_REGEX.test(formData.userFullName.userFirstName),
      validLastName: NAME_REGEX.test(formData.userFullName.userLastName),
      validUserDob: DATE_REGEX.test(formData.userDob),
      validUserSex: NAME_REGEX.test(formData.userSex),
      validHouse: NAME_REGEX.test(formData.userAddress.house),
      validStreet: NAME_REGEX.test(formData.userAddress.street),
      validCity: NAME_REGEX.test(formData.userAddress.city),
      validPrimaryPhone: PHONE_REGEX.test(formData.userContact.primaryPhone),
      validEmployeeId: formData.employeeId
        ? OBJECTID_REGEX.test(formData.employeeId)
        : true,
      validFamilyId: formData.familyId
        ? OBJECTID_REGEX.test(formData.familyId)
        : true,
      validUserRoles: formData.userRoles.length > 0, // At least one role should be selected
      // validUserAllowedActions: formData.userAllowedActions.length > 0, // At least one action should be selected
    }));
  }, [formData]);

  useEffect(() => {
    if (isSuccess) {
      setFormData({
        username: "",
        password: undefined,
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
        userPhoto: "",
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
    //console.log(` 'first name' ${userFirstName}', fullfirstname,' ${userFullName.userFirstName}', house: '${house}', usercontact house' ${userContact.house},    ${userRoles.length},${isParent}, ${employeeId}` )
    e.preventDefault();

    if (canSave) {
      setShowConfirmation(true);
    }
  };

  const handleConfirmSave = async () => {
    // Close the confirmation modal
    setShowConfirmation(false);


      try {
      const response =await updateUser({ formData });
      console.log(response,'response')
      if (response.data && response.data.message) {
        // Success response
        triggerBanner(response.data.message, "success");

      } else if (response?.error && response?.error?.data && response?.error?.data?.message) {
        // Error response
        triggerBanner(response.error.data.message, "error");
      } else {
        // In case of unexpected response format
        triggerBanner("Unexpected response from server.", "error");
      }
    } catch (error) {
      triggerBanner("Failed to update user. Please try again.", "error");

      console.error("Error saving:", error);
    }
    }
 
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
        {isError && <p className="text-red-600">{error?.data?.message}</p>}
        <h2 className="text-2xl font-bold mb-4">
          Edit User{" "}
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
                      <span className="text-red-500">*</span>
                    )}
                  </label>
                  <input
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
                        : "border-red-500"
                    } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
                    placeholder="Enter username"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                    {!validity.validPassword && (
                      <span className="text-red-500">*</span>
                    )}
                  </label>
                  <input
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
                        : "border-red-500"
                    } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
                    placeholder="Enter password"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  First Name
                  {!validity.validFirstName && (
                    <span className="text-red-500">*</span>
                  )}
                </label>
                <input
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
                      : "border-red-500"
                  } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
                  placeholder="Enter First Name"
                  required
                />
              </div>
              {/* Middle Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Middle Name
                </label>
                <input
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
                  placeholder="Enter Middle Name"
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Last Name{" "}
                  {!validity.validLastName && (
                    <span className="text-red-500">*</span>
                  )}
                </label>
                <input
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
                      : "border-red-500"
                  } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
                  placeholder="Enter Last Name"
                  required
                />
              </div>

              {/* Date of Birth */}
              <div>
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="userDob"
                >
                  Date of Birth{" "}
                  {!validity.validUserDob && (
                    <span className="text-red-500">*</span>
                  )}
                </label>
                <input
                  type="date"
                  name="userDob"
                  value={formData.userDob}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full border ${
                    validity.validUserDob ? "border-gray-300" : "border-red-500"
                  } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
                  required
                />
              </div>

              {/* Sex Selection */}

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Sex{" "}
                  {!validity.validUserSex && (
                    <span className="text-red-500">*</span>
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
                          : "border-red-500 rounded"
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
          <h3 className="text-lg font-semibold">User Contact</h3>
          <div className="border border-gray-200 p-4 rounded-md shadow-sm space-y-2">
            {/* Contact Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Primary Phone{" "}
                  {!validity.validPrimaryPhone && (
                    <span className="text-red-500">*</span>
                  )}
                </label>
                <input
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
                      : "border-red-500"
                  } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
                  placeholder="Enter Primary Phone"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Secondary Phone
                </label>
                <input
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
                  placeholder="Enter Secondary Phone"
                />
              </div>
            </div>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
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
                placeholder="Enter Email Address"
              />
            </div>
         
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  House{" "}
                  {!validity.validHouse && (
                    <span className="text-red-500">*</span>
                  )}
                </label>
                <input
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
                    validity.validHouse ? "border-gray-300" : "border-red-500"
                  } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
                  placeholder="Enter House"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Street{" "}
                  {!validity.validStreet && (
                    <span className="text-red-500">*</span>
                  )}
                </label>
                <input
                  type="text"
                  name="street"
                  value={formData.userAddress.street}
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
                    validity.validStreet ? "border-gray-300" : "border-red-500"
                  } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
                  placeholder="Enter Street"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Area
                  </label>
                  <input
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
                    placeholder="Enter Area"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Post Code
                  </label>
                  <input
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
                    placeholder="Enter Post Code"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  City{" "}
                  {!validity.validCity && (
                    <span className="text-red-500">*</span>
                  )}
                </label>
                <input
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
                    validity.validCity ? "border-gray-300" : "border-red-500"
                  } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
                  placeholder="Enter City"
                />
              </div>
            </div>
          </div>
          <h3 className="text-lg font-semibold">User Roles and Permissions</h3>
          <div className="border border-gray-200 p-4 rounded-md shadow-sm space-y-2">
            {/* Family ID Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Family ID
              </label>
              <input
                type="text"
                name="familyId"
                value={formData.familyId}
                onChange={handleInputChange}
                className="form-input mt-1 block w-full"
              />
            </div>

            {/* Employee ID Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Employee ID
              </label>
              <input
                type="text"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleInputChange}
                className="form-input mt-1 block w-full"
              />
            </div>

            {/* User Is Active Checkbox */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                User Is Active
              </label>
              <input
                type="checkbox"
                name="userIsActive"
                checked={formData.userIsActive}
                onChange={handleInputChange}
                className="h-4 w-4"
              />
            </div>
            {/* User role selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                User Roles
              </label>
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
              onClick={onSaveUserClicked}
              disabled={!canSave||isLoading}
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
        message="Are you sure you want to save Changes?"
      />
    </>
  );

  return content;
};
export default EditUserForm;
