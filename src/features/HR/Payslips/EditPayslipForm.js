import { useState, useEffect } from "react";
import { useUpdatePayslipMutation } from "./payslipsApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { ROLES } from "../../../config/UserRoles";
import { ACTIONS } from "../../../config/UserActions";
import useAuth from "../../../hooks/useAuth";
import HR from "../HR";
import {
  POSITIONS,
  CONTRACT_TYPES,
  PAYMENT_PERIODS,
} from "../../../config/UserRoles";
import {
  USER_REGEX,
  YEAR_REGEX,
  PHONE_REGEX,
  DATE_REGEX,
  NUMBER_REGEX,
  NAME_REGEX,
} from "../../../config/REGEX";
import {
  selectAllAcademicYears,
  selectCurrentAcademicYearId,
  selectAcademicYearById,
} from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import { useSelector } from "react-redux";
import ConfirmationModal from "../../../Components/Shared/Modals/ConfirmationModal";
import { useGetAcademicYearsQuery } from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsApiSlice";

const EditPayslipForm = ({ payslip }) => {
  const navigate = useNavigate();

  const { isAdmin, isManager } = useAuth();
  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  const academicYears = useSelector(selectAllAcademicYears);
  // console.log(payslip,'payslip')

  const [updatePayslip, { isLoading, isSuccess, isError, error }] =
    useUpdatePayslipMutation();

  //confirmation Modal states
  const [showConfirmation, setShowConfirmation] = useState(false);
  // Consolidated form state
  const [formData, setFormData] = useState({
    payslipId: payslip?.payslipId._id,
    userId: payslip?._id,
    userFullName: payslip?.userFullName,
    userDob: payslip?.userDob.split("T")[0],
    userSex: payslip?.userSex,
    userAddress: payslip?.userAddress,
    userContact: payslip?.userContact,
    userRoles: payslip?.userRoles,
    payslipAssessment: payslip?.payslipId?.payslipAssessment,
    payslipWorkHistory: payslip?.payslipId?.payslipWorkHistory || [],
    payslipIsActive: payslip?.payslipId?.payslipIsActive,
    payslipYears: payslip?.payslipId?.payslipYears || [],
    payslipCurrentEmployment: payslip?.payslipId?.payslipCurrentEmployment || {
      position: "",
      joinDate: "",
      contractType: "",
      salaryPackage: {
        basic: "",
        payment: "",
      },
    },
  });
  //console.log(formData.userRoles);
  const [validity, setValidity] = useState({
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
    validPayslipYear: false,
  });

  // Validate inputs using regex patterns
  useEffect(() => {
    setValidity((prev) => ({
      ...prev,

      validFirstName: NAME_REGEX.test(formData.userFullName?.userFirstName),
      validLastName: NAME_REGEX.test(formData.userFullName?.userLastName),
      validDob: DATE_REGEX.test(formData.userDob.split("T")[0]),
      validUserSex: NAME_REGEX.test(formData.userSex),
      validHouse: NAME_REGEX.test(formData.userAddress?.house),
      validStreet: NAME_REGEX.test(formData.userAddress?.street),
      validCity: NAME_REGEX.test(formData.userAddress?.city),
      validPrimaryPhone: PHONE_REGEX.test(formData.userContact?.primaryPhone),
      validCurrentPosition: NAME_REGEX.test(
        formData.payslipCurrentEmployment?.position
      ),
      validJoinDate: DATE_REGEX.test(
        formData.payslipCurrentEmployment.joinDate.split("T")[0]
      ),
      validContractType: USER_REGEX.test(
        formData.payslipCurrentEmployment?.contractType
      ),

      validBasic: NUMBER_REGEX.test(
        formData.payslipCurrentEmployment?.salaryPackage?.basic
      ),
      validPayment: NAME_REGEX.test(
        formData.payslipCurrentEmployment?.salaryPackage?.payment
      ),
      validPayslipYear: YEAR_REGEX.test(formData.payslipYears[0]?.academicYear),
    }));
  }, [formData]);

  console.log(
    validity.validFirstName,
    validity.validLastName,
    validity.validDob,
    validity.validUserSex,
    validity.validHouse,
    validity.validStreet,
    validity.validCity,
    validity.validPrimaryPhone,
    validity.validCurrentPosition,
    validity.validJoinDate,
    validity.validContractType,
    validity.validBasic,
    validity.validPayment,
    validity.validPayslipYear
  );
  useEffect(() => {
    if (isSuccess) {
      setFormData({});

      navigate("/hr/payslips/payslipsList/");
    }
  }, [isSuccess, navigate]);
  const handleInputChange = (e) => {
    console.log(e.target.name, e.target.value); // Debugging line
    const { name, value } = e.target;

    // Handle nested object updates
    if (name.startsWith("userFullName.")) {
      const field = name.split(".")[1]; // Get the field name after 'userFullName.'
      setFormData((prev) => ({
        ...prev,
        userFullName: {
          ...prev.userFullName,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  const onAcademicYearChanged = (e, yearTitle) => {
    const { checked } = e.target;

    setFormData((prev) => {
      const updatedYears = [...prev.payslipYears];

      if (checked) {
        // Add the selected year if it's checked and not already in the array
        if (
          !updatedYears.some((empYear) => empYear.academicYear === yearTitle)
        ) {
          updatedYears.push({ academicYear: yearTitle });
        }
      } else {
        // Remove the year if unchecked
        const filteredYears = updatedYears.filter(
          (empYear) => empYear.academicYear !== yearTitle
        );
        return { ...prev, payslipYears: filteredYears };
      }

      return { ...prev, payslipYears: updatedYears };
    });
  };
  const onUserRolesChanged = (e, role) => {
    const { checked } = e.target;

    setFormData((prev) => {
      // Clone the previous userRoles array to avoid direct mutation
      const updatedUserRoles = [...prev.userRoles];

      if (checked) {
        // Add the selected role if it's checked and not already in the array
        if (!updatedUserRoles.includes(role)) {
          updatedUserRoles.push(role);
        }
      } else {
        // Remove the role if unchecked
        const filteredRoles = updatedUserRoles.filter(
          (userRole) => userRole !== role
        );
        return { ...prev, userRoles: filteredRoles };
      }

      return { ...prev, userRoles: updatedUserRoles };
    });
  };
  // Handler to update work history
  const handleWorkHistoryChange = (index, field, value) => {
    // Create a new copy of payslipWorkHistory
    const updatedWorkHistory = formData.payslipWorkHistory.map((work, i) => {
      if (i === index) {
        return {
          ...work, // Spread the existing work object
          [field]: value, // Update the specific field
        };
      }
      return work; // Return the existing work object for others
    });

    // Update the formData state
    setFormData((prevState) => ({
      ...prevState,
      payslipWorkHistory: updatedWorkHistory, // Set the updated work history
    }));
  };

  // Handler to remove work history
  const handleRemoveWorkHistory = (index) => {
    // Filter out the work history item to be removed
    const updatedWorkHistory = formData.payslipWorkHistory.filter(
      (_, i) => i !== index
    );

    // Update the formData state
    setFormData((prevState) => ({
      ...prevState,
      payslipWorkHistory: updatedWorkHistory,
    }));
  };

  // Handler to add work history
  const handleAddWorkHistory = () => {
    // Add a new empty work history object
    const newWorkHistory = {
      institution: "",
      fromDate: "",
      toDate: "",
      position: "",
      contractType: "",
      salaryPackage: "",
    };

    // Update the formData state
    setFormData((prevState) => ({
      ...prevState,
      payslipWorkHistory: [...prevState.payslipWorkHistory, newWorkHistory],
    }));
  };

  const canSave =
    Object.values(validity).every(Boolean) &&
    formData?.userRoles?.length > 0 &&
    !isLoading;

  console.log(formData, "formData");
  console.log(canSave, "canSave");

  const onSavePayslipClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      setShowConfirmation(true);
    }
  };

  const handleConfirmSave = async () => {
    // Close the confirmation modal
    setShowConfirmation(false);

    try {
      await updatePayslip(formData);
    } catch (err) {
      console.error("Failed to save the payslip:", err);
    }
  };

  // Close the modal without saving
  const handleCloseModal = () => {
    setShowConfirmation(false);
  };

  const content = (
    <>
      <HR />

      <form onSubmit={onSavePayslipClicked} className="form-container">
        <h2  className="formTitle ">
          Edit Payslip :{" "}
          {`${formData?.userFullName?.userFirstName} ${formData?.userFullName?.userMiddleName} ${formData?.userFullName?.userLastName}`}
        </h2>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Payslip Information</h3>
          <div className="border border-gray-200 p-4 rounded-md shadow-sm space-y-2">
            <div>
              <label htmlFor=""  className="formInputLabel">
                First Name{" "}
                {!validity.validFirstName && (
                  <span className="text-red-600">*</span>
                )}
              </label>
              <input
                type="text"
                name="userFullName.userFirstName" // Changed to match the nested structure
                value={formData?.userFullName?.userFirstName}
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
                Middle Name
              </label>
              <input
                type="text"
                name="userFullName.userMiddleName" // Changed to match the nested structure
                value={formData.userFullName.userMiddleName}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor=""  className="formInputLabel">
                Last Name{" "}
                {!validity.validLastName && (
                  <span className="text-red-600">*</span>
                )}
              </label>
              <input
                type="text"
                name="userFullName.userLastName" // Changed to match the nested structure
                value={formData.userFullName.userLastName}
                onChange={handleInputChange}
                required
              />
            </div>
            {/* DOB and Sex */}
            <div className="space-y-4">
              <div>
                <label htmlFor=""
                   className="formInputLabel"
                  htmlFor="userDob"
                >
                  Date of Birth{" "}
                  {!validity.validDob && (
                    <span className="text-red-600">*</span>
                  )}
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

              <div>
                <label htmlFor=""  className="formInputLabel">
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

                {/* Payslip Years */}
                <h3 className="text-lg font-semibold mt-6">Payslip Years</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {academicYears && academicYears.length > 0 ? (
                    academicYears.map((year, index) => {
                      const isChecked = formData.payslipYears.some(
                        (empYear) => empYear.academicYear === year.title
                      );

                      return (
                        <div key={index} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) =>
                              onAcademicYearChanged(e, year.title)
                            }
                            className="mr-2"
                          />
                          <label htmlFor="" className="text-gray-700">{year.title}</label>
                        </div>
                      );
                    })
                  ) : (
                    <p>No academic years available.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Current Employment */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            Payslip Current EmploymentWork History
          </h3>
          <div className="border border-gray-200 p-4 rounded-md shadow-sm space-y-2">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="payslipIsActive"
                checked={formData.payslipIsActive === true}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    payslipIsActive: e.target.checked ? true : false,
                  }));
                }}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label htmlFor=""
                htmlFor="payslipIsActive"
                className="text-sm font-medium text-gray-700"
              >
                Payslip is Active
              </label>
            </div>
            <div>
              <label htmlFor=""  className="formInputLabel">
                Current Position{" "}
                {!validity.validCurrentPosition && (
                  <span className="text-red-600">*</span>
                )}
              </label>
              <select
                name="position"
                value={formData.payslipCurrentEmployment.position}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    payslipCurrentEmployment: {
                      ...prev.payslipCurrentEmployment,
                      position: e.target.value,
                    },
                  }))
                }
                className={`mt-1 block w-full border ${
                  validity.validCurrentPosition
                    ? "border-gray-300"
                    : "border-red-600"
                } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
                required
              >
                {/* <option value="">Select Position</option> */}
                {Object.values(POSITIONS).map((position) => (
                  <option key={position} value={position}>
                    {position}
                  </option>
                ))}
              </select>
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
                value={formData.payslipCurrentEmployment.joinDate.split("T")[0]}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    payslipCurrentEmployment: {
                      ...prev.payslipCurrentEmployment,
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
              <select
                name="contractType"
                value={formData.payslipCurrentEmployment.contractType}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    payslipCurrentEmployment: {
                      ...prev.payslipCurrentEmployment,
                      contractType: e.target.value,
                    },
                  }))
                }
                className={`mt-1 block w-full border ${
                  validity.validContractType
                    ? "border-gray-300"
                    : "border-red-600"
                } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
                required
              >
                {/* <option value="">Select Contract Type</option> */}
                {CONTRACT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
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
                      formData.payslipCurrentEmployment.salaryPackage.basic
                    }
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        payslipCurrentEmployment: {
                          ...prev.payslipCurrentEmployment,
                          salaryPackage: {
                            ...prev.payslipCurrentEmployment.salaryPackage,
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
                  <select
                    name="payment"
                    value={
                      formData.payslipCurrentEmployment.salaryPackage.payment
                    }
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        payslipCurrentEmployment: {
                          ...prev.payslipCurrentEmployment,
                          salaryPackage: {
                            ...prev.payslipCurrentEmployment.salaryPackage,
                            payment: e.target.value,
                          },
                        },
                      }))
                    }
                    className={`mt-1 block w-full border ${
                      validity.validPayment
                        ? "border-gray-300"
                        : "border-red-600"
                    } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
                    required
                  >
                    {/* <option value="">Select Payment Period</option> */}
                    {PAYMENT_PERIODS.map((period) => (
                      <option key={period} value={period}>
                        {period}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor=""  className="formInputLabel">
                    CNSS
                  </label>
                  <input
                    type="number"
                    name="cnss"
                    value={formData.payslipCurrentEmployment.salaryPackage.cnss}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        payslipCurrentEmployment: {
                          ...prev.payslipCurrentEmployment,
                          salaryPackage: {
                            ...prev.payslipCurrentEmployment.salaryPackage,
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
                      formData.payslipCurrentEmployment.salaryPackage.other
                    }
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        payslipCurrentEmployment: {
                          ...prev.payslipCurrentEmployment,
                          salaryPackage: {
                            ...prev.payslipCurrentEmployment.salaryPackage,
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
          {(isAdmin || isManager) && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Assign User Roles</h3>

              <div className="border border-gray-200 p-4 rounded-md shadow-sm space-y-2">
                <div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.values(ROLES).map((role) => (
                      <div key={role} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id={`role-${role}`}
                          checked={formData.userRoles.includes(role)}
                          onChange={(e) => onUserRolesChanged(e, role)}
                          className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                        <label htmlFor=""
                          htmlFor={`role-${role}`}
                          className="text-sm font-medium text-gray-700"
                        >
                          {role}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Payslip Work History</h3>
          {formData.payslipWorkHistory.map((work, index) => (
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
            onClick={() => navigate("/hr/payslips/payslips")}
            className="cancel-button"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!canSave || isLoading}
            className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
              canSave
                ? "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                : "bg-gray-400 cursor-not-allowed"
            } focus:outline-none focus:ring-2 focus:ring-offset-2`}
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

export default EditPayslipForm;
