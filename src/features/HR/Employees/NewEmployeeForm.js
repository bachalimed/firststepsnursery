import { useState, useEffect } from "react";
import { useAddNewEmployeeMutation } from "./employeesApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { POSITIONS, CONTRACT_TYPES, PAYMENT_PERIODS } from "../../../config/UserRoles";
import { ACTIONS } from "../../../config/UserActions";
import Employees from "../Employees";

import { useSelector } from "react-redux";
import {
  selectAllAcademicYears,
  selectCurrentAcademicYearId,
  selectAcademicYearById,
} from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import {
  NAME_REGEX,
  NUMBER_REGEX,
  USER_REGEX,
  PHONE_REGEX,
  DATE_REGEX,
  YEAR_REGEX,
} from "../../../Components/lib/Utils/REGEX";

const NewEmployeeForm = () => {
  const navigate = useNavigate();

  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  const academicYears = useSelector(selectAllAcademicYears);
  console.log(selectedAcademicYear.title, "selectedAcademicYear");
  const [addNewEmployee, { isLoading, isSuccess, isError, error }] =
    useAddNewEmployeeMutation();

  const generateRandomUsername = () =>
    `user${Math.random().toString(36).substring(2, 10)}`;

  // Consolidated form state
  const [formData, setFormData] = useState({
    username: generateRandomUsername(),
    password: "12345678",
    userRoles: ["Employee"],
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

    employeeAssessment: [],
    employeeWorkHistory: [],
    employeeIsActive: false,
    employeeYears: [{ academicYear: selectedAcademicYear?.title }],
    employeeCurrentEmployment: {
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
    validEmployeeYear: false,
  });

  // Validate inputs using regex patterns
  useEffect(() => {
    setValidity((prev) => ({
      ...prev,
      validUsername: USER_REGEX.test(formData.username),
      validFirstName: NAME_REGEX.test(formData.userFullName.userFirstName),
      validLastName: NAME_REGEX.test(formData.userFullName.userLastName),
      validDob: DATE_REGEX.test(formData.userDob),
      validUserSex: NAME_REGEX.test(formData.userSex),
      validHouse: NAME_REGEX.test(formData.userAddress.house),
      validStreet: NAME_REGEX.test(formData.userAddress.street),
      validCity: NAME_REGEX.test(formData.userAddress.city),
      validPrimaryPhone: PHONE_REGEX.test(formData.userContact.primaryPhone),
      validCurrentPosition: USER_REGEX.test(
        formData.employeeCurrentEmployment.position
      ),
      validJoinDate: DATE_REGEX.test(
        formData.employeeCurrentEmployment.joinDate
      ),
      validContractType: USER_REGEX.test(
        formData.employeeCurrentEmployment.contractType
      ),
      validBasic: NUMBER_REGEX.test(
        formData.employeeCurrentEmployment.salaryPackage.basic
      ),
      validPayment: NAME_REGEX.test(
        formData.employeeCurrentEmployment.salaryPackage.payment
      ),
      validEmployeeYear: YEAR_REGEX.test(
        formData.employeeYears[0].academicYear
      ),
    }));
  }, [formData]);

  useEffect(() => {
    if (isSuccess) {
      setFormData({
        username: generateRandomUsername(),
        password: "12345678",
        userRoles: ["Employee"],
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
        employeeAssessment: [],
        employeeWorkHistory: [],
        employeeIsActive: false,
        employeeYears: [{ academicYear: "" }],
        employeeCurrentEmployment: {
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
      navigate("/hr/employees/employees");
    }
  }, [isSuccess, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onAcademicYearChanged = (e, index) => {
    const { checked } = e.target;
    setFormData((prev) => {
      const updatedYears = [...prev.employeeYears];
      // Update based on checked state
      updatedYears[index].academicYear = checked
        ? selectedAcademicYear?.title
        : "";
      return { ...prev, employeeYears: updatedYears };
    });
  };

  const handleWorkHistoryChange = (index, field, value) => {
    const updatedWorkHistory = [...formData.employeeWorkHistory];
    updatedWorkHistory[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      employeeWorkHistory: updatedWorkHistory,
    }));
  };

  const handleAddWorkHistory = () => {
    setFormData((prev) => ({
      ...prev,
      employeeWorkHistory: [
        ...prev.employeeWorkHistory,
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
      employeeWorkHistory: prev.employeeWorkHistory.filter(
        (_, i) => i !== index
      ),
    }));
  };
  const canSave =
    Object.values(validity).every(Boolean) &&
    // ((formData.employeeYears[0].academicYear)!=='') &&

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
  // 	validity.validEmployeeYear)

  const onSaveEmployeeClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      try {
        await addNewEmployee(formData);
      } catch (err) {
        console.error("Failed to save the employee:", err);
      }
    }
  };
  const handleCancel = () => {
    navigate("/hr/employees/");
  };

  const content = (
    <>
      <Employees />

      <section className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">
          Add New Employee:{" "}
          {`${formData.userFullName.userFirstName} ${formData.userFullName.userMiddleName} ${formData.userFullName.userLastName}`}
        </h2>
        {isError && (
          <p className="text-red-500">Error: {error?.data?.message}</p>
        )}
        <form onSubmit={onSaveEmployeeClicked} className="space-y-6">
          {/* username and password should be visible for admin isAdmin&& */}
          {/* <div>
          <label className="block text-sm font-medium text-gray-700">
            username*
          </label>
          <input
            type="text"
            name="userFirstName"
            value={formData.userFirstName}
            onChange={handleInputChange}
            className={`mt-1 block w-full border ${
              validity.validFirstName ? "border-gray-300" : "border-red-500"
            } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
            placeholder="Enter First Name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password*
          </label>
          <input
            type="text"
            name="userFirstName"
            value={formData.userFirstName}
            onChange={handleInputChange}
            className={`mt-1 block w-full border ${
              validity.validFirstName ? "border-gray-300" : "border-red-500"
            } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
            placeholder="Enter First Name"
            required
          />
        </div> */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              First Name{" "}
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
                validity.validFirstName ? "border-gray-300" : "border-red-500"
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
                validity.validLastName ? "border-gray-300" : "border-red-500"
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
              {!validity.validDob && <span className="text-red-500">*</span>}
            </label>
            <input
              type="date"
              name="userDob"
              value={formData.userDob}
              onChange={handleInputChange}
              className={`mt-1 block w-full border ${
                validity.validDob ? "border-gray-300" : "border-red-500"
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
          {/* Employee Years Selection */}
          {formData.employeeYears.map((year, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={`employeeYear-${index}`}
                value={year.academicYear}
                checked={year.academicYear === selectedAcademicYear?.title}
                onChange={(e) => onAcademicYearChanged(e, index)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor={`employeeYear-${index}`}
                className="ml-2 text-sm font-medium text-gray-700"
              >
                Academic Year{" "}
                {!validity.validEmployeeYear && (
                  <span className="text-red-500">*</span>
                )}{" "}
                : {selectedAcademicYear?.title}
              </label>
            </div>
          ))}

          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="employeeIsActive"
              name="employeeIsActive"
              checked={formData.employeeIsActive === true}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  employeeIsActive: e.target.checked,
                }));
              }}
              className='h-4 w-4  "text-blue-600"  focus:ring-blue-500 border-gray-300 rounded'
            />

            <label
              htmlFor="employeeIsActive"
              className="ml-2 text-sm font-medium text-gray-700"
            >
              Employee IsActive {validity.validEmployeeIsActive && "*"}
            </label>
          </div>

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

          {/* Address Information */}
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
                  validity.validStreet ? "border-gray-300" : "border-red-500"
                } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
                placeholder="Enter Street"
              />
            </div>

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
                City{" "}
                {!validity.validCity && <span className="text-red-500">*</span>}
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

          {/* Current Employment */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Current Position{" "}
                {!validity.validCurrentPosition && (
                  <span className="text-red-500">*</span>
                )}
              </label>
              <select
                name="position"
                value={formData.employeeCurrentEmployment.position}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    employeeCurrentEmployment: {
                      ...prev.employeeCurrentEmployment,
                      position: e.target.value,
                    },
                  }))
                }
                className={`mt-1 block w-full border ${
                  validity.validCurrentPosition
                    ? "border-gray-300"
                    : "border-red-500"
                } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
                required
              >
                <option value="">Select Position</option>
                {Object.values(POSITIONS).map((position) => (
                  <option key={position} value={position}>
                    {position}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Join Date{" "}
                {!validity.validJoinDate && (
                  <span className="text-red-500">*</span>
                )}
              </label>
              <input
                type="date"
                name="joinDate"
                value={formData.employeeCurrentEmployment.joinDate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    employeeCurrentEmployment: {
                      ...prev.employeeCurrentEmployment,
                      joinDate: e.target.value,
                    },
                  }))
                }
                className={`mt-1 block w-full border ${
                  validity.validJoinDate ? "border-gray-300" : "border-red-500"
                } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
                required
              />
            </div>

            <div>
    <label className="block text-sm font-medium text-gray-700">
      Contract Type{" "}
      {!validity.validContractType && (
        <span className="text-red-500">*</span>
      )}
    </label>
    <select
      name="contractType"
      value={formData.employeeCurrentEmployment.contractType}
      onChange={(e) =>
        setFormData((prev) => ({
          ...prev,
          employeeCurrentEmployment: {
            ...prev.employeeCurrentEmployment,
            contractType: e.target.value,
          },
        }))
      }
      className={`mt-1 block w-full border ${
        validity.validContractType ? "border-gray-300" : "border-red-500"
      } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
      required
    >
      <option value="">Select Contract Type</option>
      {CONTRACT_TYPES.map((type) => (
        <option key={type} value={type}>
          {type}
        </option>
      ))}
    </select>
  </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Salary Package
              </label>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Basic{" "}
                    {!validity.validBasic && (
                      <span className="text-red-500">*</span>
                    )}
                  </label>
                  <input
                    type="number"
                    name="basic"
                    value={
                      formData.employeeCurrentEmployment.salaryPackage.basic
                    }
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        employeeCurrentEmployment: {
                          ...prev.employeeCurrentEmployment,
                          salaryPackage: {
                            ...prev.employeeCurrentEmployment.salaryPackage,
                            basic: e.target.value,
                          },
                        },
                      }))
                    }
                    className={`mt-1 block w-full border ${
                      validity.validCity ? "border-gray-300" : "border-red-500"
                    } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
                    placeholder="Enter Basic Salary"
                  />
                </div>
                <div>
    <label className="block text-sm font-medium text-gray-700">
      Payment{" "}
      {!validity.validPayment && (
        <span className="text-red-500">*</span>
      )}
    </label>
    <select
      name="payment"
      value={formData.employeeCurrentEmployment.salaryPackage.payment}
      onChange={(e) =>
        setFormData((prev) => ({
          ...prev,
          employeeCurrentEmployment: {
            ...prev.employeeCurrentEmployment,
            salaryPackage: {
              ...prev.employeeCurrentEmployment.salaryPackage,
              payment: e.target.value,
            },
          },
        }))
      }
      className={`mt-1 block w-full border ${
        validity.validPayment ? "border-gray-300" : "border-red-500"
      } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
      required
    >
      <option value="">Select Payment Period</option>
      {PAYMENT_PERIODS.map((period) => (
        <option key={period} value={period}>
          {period}
        </option>
      ))}
    </select>
  </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    CNSS
                  </label>
                  <input
                    type="number"
                    name="cnss"
                    value={
                      formData.employeeCurrentEmployment.salaryPackage.cnss
                    }
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        employeeCurrentEmployment: {
                          ...prev.employeeCurrentEmployment,
                          salaryPackage: {
                            ...prev.employeeCurrentEmployment.salaryPackage,
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
                  <label className="block text-sm font-medium text-gray-700">
                    Other
                  </label>
                  <input
                    type="number"
                    name="other"
                    value={
                      formData.employeeCurrentEmployment.salaryPackage.other
                    }
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        employeeCurrentEmployment: {
                          ...prev.employeeCurrentEmployment,
                          salaryPackage: {
                            ...prev.employeeCurrentEmployment.salaryPackage,
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
            <h3 className="text-lg font-semibold">Employee Work History</h3>
            {formData.employeeWorkHistory.map((work, index) => (
              <div
                key={index}
                className="border border-gray-200 p-4 rounded-md shadow-sm space-y-2"
              >
                {/* Institution */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Institution{" "}
                    {!work.institution && (
                      <span className="text-red-500">*</span>
                    )}
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
                  <label className="block text-sm font-medium text-gray-700">
                    From Date{" "}
                    {!work.fromDate && <span className="text-red-500">*</span>}
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
                  <label className="block text-sm font-medium text-gray-700">
                    To Date{" "}
                    {!work.toDate && <span className="text-red-500">*</span>}
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
                  <label className="block text-sm font-medium text-gray-700">
                    Position{" "}
                    {!work.position && <span className="text-red-500">*</span>}
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
                  <label className="block text-sm font-medium text-gray-700">
                    Contract Type{" "}
                    {!work.contractType && (
                      <span className="text-red-500">*</span>
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
                  <label className="block text-sm font-medium text-gray-700">
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
              onClick={() => navigate("/hr/employees/employees/")}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSave}
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
      </section>
    </>
  );
  return content;
};

export default NewEmployeeForm;
