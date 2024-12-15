import { useState, useEffect } from "react";
import { useAddNewNotificationMutation } from "./notificationsApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { ROLES } from "../../../config/UserRoles";
import { ACTIONS } from "../../../config/UserActions";
import Notifications from "../Notifications";

import { useSelector } from "react-redux";
import {
  selectAllAcademicYears,
  selectCurrentAcademicYearId,
  selectAcademicYearById,
} from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";

//constrains on inputs when creating new user
const USER_REGEX = /^[A-z 0-9]{6,20}$/;
const NAME_REGEX = /^[A-z 0-9]{3,18}$/;
const NUMBER_REGEX = /^[0-9]{1,4}(\.[0-9]{0,3})?$/;
const PHONE_REGEX = /^[0-9]{6,15}$/;
const DOB_REGEX = /^[0-9/-]{4,10}$/;
const YEAR_REGEX = /^[0-9]{4}\/[0-9]{4}$/;
const NewNotificationForm = () => {
  const navigate = useNavigate();

  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  const academicYears = useSelector(selectAllAcademicYears);
  console.log(selectedAcademicYear.title, "selectedAcademicYear");
  const [addNewNotification, { isLoading, isSuccess, isError, error }] =
    useAddNewNotificationMutation();

  const generateRandomUsername = () =>
    `user${Math.random().toString(36).substring(2, 10)}`;

  // Consolidated form state
  const [formData, setFormData] = useState({
    username: generateRandomUsername(),
    password: "12345678",
    userRoles: ["Notification"],
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

    notificationAssessment: [],
    notificationWorkHistory: [],
    notificationIsActive: false,
    notificationYears: [{ academicYear: selectedAcademicYear?.title }],
    notificationCurrentEmployment: {
      position: "",
      joinDate: "",
      contractType: "",
      salaryPackage: {
        basic: "",
        cnss: "",
        other: "",
        payment: "",
      },
    },
  });

  const [validity, setValidity] = useState({
    validUsername: false,
    validFirstName: false,
    validLastName: false,
    validDob: false,
    validUserSex: false,
    validHouse: false,
    validStreet: false,
    validCity: false,
    validPrimaryPhone: false,
    validCurrentPosition: false,
    validJoinDate: false,
    validContractType: false,
    validBasic: false,
    validPayment: false,
    validNotificationYear: false,
  });

  // Validate inputs using regex patterns
  useEffect(() => {
    setValidity((prev) => ({
      ...prev,
      validUsername: USER_REGEX.test(formData.username),
      validFirstName: NAME_REGEX.test(formData.userFullName.userFirstName),
      validLastName: NAME_REGEX.test(formData.userFullName.userLastName),
      validDob: DOB_REGEX.test(formData.userDob),
      validUserSex: NAME_REGEX.test(formData.userSex),
      validHouse: NAME_REGEX.test(formData.userAddress.house),
      validStreet: NAME_REGEX.test(formData.userAddress.street),
      validCity: NAME_REGEX.test(formData.userAddress.city),
      validPrimaryPhone: PHONE_REGEX.test(formData.userContact.primaryPhone),
      validCurrentPosition: USER_REGEX.test(
        formData.notificationCurrentEmployment.position
      ),
      validJoinDate: DOB_REGEX.test(
        formData.notificationCurrentEmployment.joinDate
      ),
      validContractType: USER_REGEX.test(
        formData.notificationCurrentEmployment.contractType
      ),
      validBasic: NUMBER_REGEX.test(
        formData.notificationCurrentEmployment.salaryPackage.basic
      ),
      validPayment: NAME_REGEX.test(
        formData.notificationCurrentEmployment.salaryPackage.payment
      ),
      validNotificationYear: YEAR_REGEX.test(
        formData.notificationYears[0].academicYear
      ),
    }));
  }, [formData]);

  useEffect(() => {
    if (isSuccess) {
      setFormData({
        username: generateRandomUsername(),
        password: "12345678",
        userRoles: ["Notification"],
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
        notificationAssessment: [],
        notificationWorkHistory: [],
        notificationIsActive: false,
        notificationYears: [{ academicYear: "" }],
        notificationCurrentEmployment: {
          position: "",
          joinDate: "",
          contractType: "",
          salaryPackage: {
            basic: "",
            cnss: "",
            other: "",
            payment: "",
          },
        },
      });
      navigate("/hr/notifications/");
    }
  }, [isSuccess, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onAcademicYearChanged = (e, index) => {
    const { checked } = e.target;
    setFormData((prev) => {
      const updatedYears = [...prev.notificationYears];
      // Update based on checked state
      updatedYears[index].academicYear = checked
        ? selectedAcademicYear?.title
        : "";
      return { ...prev, notificationYears: updatedYears };
    });
  };

  const handleWorkHistoryChange = (index, field, value) => {
    const updatedWorkHistory = [...formData.notificationWorkHistory];
    updatedWorkHistory[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      notificationWorkHistory: updatedWorkHistory,
    }));
  };

  const handleAddWorkHistory = () => {
    setFormData((prev) => ({
      ...prev,
      notificationWorkHistory: [
        ...prev.notificationWorkHistory,
        {
          institution: "",
          fromDate: "",
          toDate: "",
          position: "",
          contractType: "",
          salaryPackage: "",
        },
      ],
    }));
  };

  const handleRemoveWorkHistory = (index) => {
    setFormData((prev) => ({
      ...prev,
      notificationWorkHistory: prev.notificationWorkHistory.filter(
        (_, i) => i !== index
      ),
    }));
  };
  const canSave =
    Object.values(validity).every(Boolean) &&
    // ((formData.notificationYears[0].academicYear)!=='') &&

    !isLoading;
  //console.log(validity,'validity')
  //console.log(formData,'formData')
  // console.log(canSave,'canSave')
  // console.log(validity.validUsername,
  // 	validity.validFirstName,
  // 	validity.validLastName,
  // 	validity.validDob,
  // 	validity.validUserSex,
  // 	validity.validHouse,
  // 	validity.validStreet,
  // 	validity.validCity,
  // 	validity.validPrimaryPhone,
  // 	validity.validCurrentPosition,
  // 	validity.validJoinDate,
  // 	validity.validContractType,
  // 	validity.validBasic,
  // 	validity.validPayment,
  // 	validity.validNotificationYear)

  const onSaveNotificationClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      try {
        await addNewNotification(formData);
      } catch (err) {
        console.error("Failed to save the notification:", err);
      }
    }
  };
  const handleCancel = () => {
    navigate("/hr/notifications/");
  };

  const content = (
    <>
      <Notifications />

      <form onSubmit={onSaveNotificationClicked} className="form-container">
        <h2  className="formTitle ">
          Add New Notification:{" "}
          {`${formData.userFullName.userFirstName} ${formData.userFullName.userMiddleName} ${formData.userFullName.userLastName}`}
        </h2>
        {/* username and password should be visible for admin isAdmin&& */}
        {/* <div>
          <label htmlFor=""  className="formInputLabel">
            username*
          </label>
          <input
            type="text"
            name="userFirstName"
            value={formData.userFirstName}
            onChange={handleInputChange}
            className={`mt-1 block w-full border ${
              validity.validFirstName ? "border-gray-300" : "border-red-600"
            } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
            placeholder="Enter First Name"
            required
          />
        </div>
        <div>
          <label htmlFor=""  className="formInputLabel">
            Password*
          </label>
          <input
            type="text"
            name="userFirstName"
            value={formData.userFirstName}
            onChange={handleInputChange}
            className={`mt-1 block w-full border ${
              validity.validFirstName ? "border-gray-300" : "border-red-600"
            } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
            placeholder="Enter First Name"
            required
          />
        </div> */}
        <div>
          <label htmlFor=""  className="formInputLabel">
            First Name{" "}
            {!validity.validFirstName && (
              <span className="text-red-600">*</span>
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
              validity.validFirstName ? "border-gray-300" : "border-red-600"
            } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
            placeholder="Enter First Name"
            required
          />
        </div>
        {/* Middle Name */}
        <div>
          <label htmlFor=""  className="formInputLabel">
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
          <label htmlFor=""  className="formInputLabel">
            Last Name{" "}
            {!validity.validLastName && <span className="text-red-600">*</span>}
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
              validity.validLastName ? "border-gray-300" : "border-red-600"
            } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
            placeholder="Enter Last Name"
            required
          />
        </div>

        {/* Date of Birth */}
        <div>
          <label htmlFor=""
             className="formInputLabel"
            htmlFor="userDob"
          >
            Date of Birth{" "}
            {!validity.validDob && <span className="text-red-600">*</span>}
          </label>
          <input
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
          <label htmlFor=""  className="formInputLabel">
            Sex{" "}
            {!validity.validUserSex && <span className="text-red-600">*</span>}
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
              <label htmlFor="" className="ml-2 text-sm text-gray-700">Male</label>
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
              <label htmlFor="" className="ml-2 text-sm text-gray-700">Female</label>
            </div>
          </div>
        </div>
        {/* Notification Years Selection */}
        {formData.notificationYears.map((year, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="checkbox"
              id={`notificationYear-${index}`}
              value={year.academicYear}
              checked={year.academicYear === selectedAcademicYear?.title}
              onChange={(e) => onAcademicYearChanged(e, index)}
              className="h-4 w-4 text-blue-600 focus:ring-sky-700 border-gray-300 rounded"
            />
            <label htmlFor=""
              htmlFor={`notificationYear-${index}`}
              className="ml-2 text-sm font-medium text-gray-700"
            >
              Academic Year{" "}
              {!validity.validNotificationYear && (
                <span className="text-red-600">*</span>
              )}{" "}
              : {selectedAcademicYear?.title}
            </label>
          </div>
        ))}

        <div className="flex items-center mb-2">
          <input
            type="checkbox"
            id="notificationIsActive"
            name="notificationIsActive"
            checked={formData.notificationIsActive === true}
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                notificationIsActive: e.target.checked,
              }));
            }}
            className='h-4 w-4  "text-blue-600"  focus:ring-sky-700 border-gray-300 rounded'
          />

          <label htmlFor=""
            htmlFor="notificationIsActive"
            className="ml-2 text-sm font-medium text-gray-700"
          >
            Notification IsActive {validity.validNotificationIsActive && "*"}
          </label>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor=""  className="formInputLabel">
              Primary Phone{" "}
              {!validity.validPrimaryPhone && (
                <span className="text-red-600">*</span>
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
                  : "border-red-600"
              } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
              placeholder="Enter Primary Phone"
              required
            />
          </div>

          <div>
            <label htmlFor=""  className="formInputLabel">
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

        {/* Address Information */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor=""  className="formInputLabel">
              House{" "}
              {!validity.validHouse && <span className="text-red-600">*</span>}
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
                validity.validHouse ? "border-gray-300" : "border-red-600"
              } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
              placeholder="Enter House"
            />
          </div>

          <div>
            <label htmlFor=""  className="formInputLabel">
              Street{" "}
              {!validity.validStreet && <span className="text-red-600">*</span>}
            </label>
            <input
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
              placeholder="Enter Street"
            />
          </div>

          <div className="col-span-2">
            <label htmlFor=""  className="formInputLabel">
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
            <label htmlFor=""  className="formInputLabel">
              City{" "}
              {!validity.validCity && <span className="text-red-600">*</span>}
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
                validity.validCity ? "border-gray-300" : "border-red-600"
              } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
              placeholder="Enter City"
            />
          </div>

          <div>
            <label htmlFor=""  className="formInputLabel">
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

        {/* Email */}
        <div>
          <label htmlFor=""  className="formInputLabel">
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

        {/* Current Employment */}
        <div className="space-y-4">
          <div>
            <label htmlFor=""  className="formInputLabel">
              Current Position{" "}
              {!validity.validCurrentPosition && (
                <span className="text-red-600">*</span>
              )}
            </label>
            <input
              type="text"
              name="position"
              value={formData.notificationCurrentEmployment.position}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  notificationCurrentEmployment: {
                    ...prev.notificationCurrentEmployment,
                    position: e.target.value,
                  },
                }))
              }
              className={`mt-1 block w-full border ${
                validity.validCurrentPosition
                  ? "border-gray-300"
                  : "border-red-600"
              } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
              placeholder="Enter Position"
              required
            />
          </div>

          <div>
            <label htmlFor=""  className="formInputLabel">
              Join Date{" "}
              {!validity.validJoinDate && (
                <span className="text-red-600">*</span>
              )}
            </label>
            <input
              type="date"
              name="joinDate"
              value={formData.notificationCurrentEmployment.joinDate}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  notificationCurrentEmployment: {
                    ...prev.notificationCurrentEmployment,
                    joinDate: e.target.value,
                  },
                }))
              }
              className={`mt-1 block w-full border ${
                validity.validJoinDate ? "border-gray-300" : "border-red-600"
              } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
              required
            />
          </div>

          <div>
            <label htmlFor=""  className="formInputLabel">
              Contract Type{" "}
              {!validity.validContractType && (
                <span className="text-red-600">*</span>
              )}
            </label>
            <input
              type="text"
              name="contractType"
              value={formData.notificationCurrentEmployment.contractType}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  notificationCurrentEmployment: {
                    ...prev.notificationCurrentEmployment,
                    contractType: e.target.value,
                  },
                }))
              }
              className={`mt-1 block w-full border ${
                validity.validContractType
                  ? "border-gray-300"
                  : "border-red-600"
              } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
              placeholder="Enter Contract Type"
              required
            />
          </div>

          <div>
            <label htmlFor=""  className="formInputLabel">
              Salary Package
            </label>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor=""  className="formInputLabel">
                  Basic{" "}
                  {!validity.validBasic && (
                    <span className="text-red-600">*</span>
                  )}
                </label>
                <input
                  type="number"
                  name="basic"
                  value={
                    formData.notificationCurrentEmployment.salaryPackage.basic
                  }
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      notificationCurrentEmployment: {
                        ...prev.notificationCurrentEmployment,
                        salaryPackage: {
                          ...prev.notificationCurrentEmployment.salaryPackage,
                          basic: e.target.value,
                        },
                      },
                    }))
                  }
                  className={`mt-1 block w-full border ${
                    validity.validCity ? "border-gray-300" : "border-red-600"
                  } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
                  placeholder="Enter Basic Salary"
                />
              </div>
              <div>
                <label htmlFor=""  className="formInputLabel">
                  Payment{" "}
                  {!validity.validPayment && (
                    <span className="text-red-600">*</span>
                  )}
                </label>
                <input
                  type="text"
                  name="payment"
                  value={
                    formData.notificationCurrentEmployment.salaryPackage.payment
                  }
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      notificationCurrentEmployment: {
                        ...prev.notificationCurrentEmployment,
                        salaryPackage: {
                          ...prev.notificationCurrentEmployment.salaryPackage,
                          payment: e.target.value,
                        },
                      },
                    }))
                  }
                  className={`mt-1 block w-full border ${
                    validity.validPayment ? "border-gray-300" : "border-red-600"
                  } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
                  placeholder="Enter Salary payment period"
                />
              </div>

              <div>
                <label htmlFor=""  className="formInputLabel">
                  CNSS
                </label>
                <input
                  type="number"
                  name="cnss"
                  value={
                    formData.notificationCurrentEmployment.salaryPackage.cnss
                  }
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      notificationCurrentEmployment: {
                        ...prev.notificationCurrentEmployment,
                        salaryPackage: {
                          ...prev.notificationCurrentEmployment.salaryPackage,
                          cnss: e.target.value,
                        },
                      },
                    }))
                  }
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Enter CNSS"
                />
              </div>

              <div>
                <label htmlFor=""  className="formInputLabel">
                  Other
                </label>
                <input
                  type="number"
                  name="other"
                  value={
                    formData.notificationCurrentEmployment.salaryPackage.other
                  }
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      notificationCurrentEmployment: {
                        ...prev.notificationCurrentEmployment,
                        salaryPackage: {
                          ...prev.notificationCurrentEmployment.salaryPackage,
                          other: e.target.value,
                        },
                      },
                    }))
                  }
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Enter Other Salary"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Notification Work History</h3>
          {formData.notificationWorkHistory.map((work, index) => (
            <div
              key={index}
              className="border border-gray-200 p-4 rounded-md shadow-sm space-y-2"
            >
              {/* Institution */}
              <div>
                <label htmlFor=""  className="formInputLabel">
                  Institution{" "}
                  {!work.institution && <span className="text-red-600">*</span>}
                </label>
                <input
                  type="text"
                  name="institution"
                  value={work.institution}
                  onChange={(e) =>
                    handleWorkHistoryChange(
                      index,
                      "institution",
                      e.target.value
                    )
                  }
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Enter Institution"
                />
              </div>

              {/* From Date */}
              <div>
                <label htmlFor=""  className="formInputLabel">
                  From Date{" "}
                  {!work.fromDate && <span className="text-red-600">*</span>}
                </label>
                <input
                  type="date"
                  name="fromDate"
                  value={work.fromDate}
                  onChange={(e) =>
                    handleWorkHistoryChange(index, "fromDate", e.target.value)
                  }
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              {/* To Date */}
              <div>
                <label htmlFor=""  className="formInputLabel">
                  To Date{" "}
                  {!work.toDate && <span className="text-red-600">*</span>}
                </label>
                <input
                  type="date"
                  name="toDate"
                  value={work.toDate}
                  onChange={(e) =>
                    handleWorkHistoryChange(index, "toDate", e.target.value)
                  }
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              {/* Position */}
              <div>
                <label htmlFor=""  className="formInputLabel">
                  Position{" "}
                  {!work.position && <span className="text-red-600">*</span>}
                </label>
                <input
                  type="text"
                  name="position"
                  value={work.position}
                  onChange={(e) =>
                    handleWorkHistoryChange(index, "position", e.target.value)
                  }
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Enter Position"
                />
              </div>

              {/* Contract Type */}
              <div>
                <label htmlFor=""  className="formInputLabel">
                  Contract Type{" "}
                  {!work.contractType && (
                    <span className="text-red-600">*</span>
                  )}
                </label>
                <input
                  type="text"
                  name="contractType"
                  value={work.contractType}
                  onChange={(e) =>
                    handleWorkHistoryChange(
                      index,
                      "contractType",
                      e.target.value
                    )
                  }
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Enter Contract Type"
                />
              </div>

              {/* Salary Package */}
              <div>
                <label htmlFor=""  className="formInputLabel">
                  Salary Package
                </label>
                <input
                  type="text"
                  name="salaryPackage"
                  value={work.salaryPackage}
                  onChange={(e) =>
                    handleWorkHistoryChange(
                      index,
                      "salaryPackage",
                      e.target.value
                    )
                  }
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Enter Salary Package"
                />
              </div>

              {/* Remove Work History Button */}
              <button
                type="button"
                onClick={() => handleRemoveWorkHistory(index)}
                className="mt-2 text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Remove
              </button>
            </div>
          ))}

          {/* Add Work History Button */}
          <button
            type="button"
            onClick={handleAddWorkHistory}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Work History
          </button>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/hr/notifications/notifications/")}
            className="cancel-button"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!canSave || isLoading}
            className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
              canSave
                ? "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
                : "bg-gray-400 cursor-not-allowed"
            } focus:outline-none focus:ring-2 focus:ring-offset-2`}
          >
            Save
          </button>
        </div>
      </form>
    </>
  );
  return content;
};

export default NewNotificationForm;
