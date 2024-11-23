import { useState, useEffect } from "react";
import { useUpdatePayeeMutation } from "./payeesApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";

import { ACTIONS } from "../../../../config/UserActions";
import useAuth from "../../../../hooks/useAuth";
import FinancesSet from "../../FinancesSet";
import { POSITIONS, CONTRACT_TYPES, PAYMENT_PERIODS, ROLES } from "../../../../config/UserRoles";
import {
  USER_REGEX,
  YEAR_REGEX,
  PHONE_REGEX,
  DATE_REGEX,
  NUMBER_REGEX,
  NAME_REGEX,
} from "../../../../config/REGEX"
import {
  selectAllAcademicYears,
  selectCurrentAcademicYearId,
  selectAcademicYearById,
} from "../../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import { useSelector } from "react-redux";
import ConfirmationModal from "../../../../Components/Shared/Modals/ConfirmationModal";
import { useGetAcademicYearsQuery } from "../../../AppSettings/AcademicsSet/AcademicYears/academicYearsApiSlice";

const EditPayeeForm = ({ payee }) => {
  const navigate = useNavigate();

  const { isAdmin, isManager } = useAuth();
  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  const academicYears = useSelector(selectAllAcademicYears);
  // console.log(payee,'payee')

  const [updatePayee, { isLoading, isSuccess, isError, error }] =
    useUpdatePayeeMutation();

//confirmation Modal states
const [showConfirmation, setShowConfirmation] = useState(false);
  // Consolidated form state
  const [formData, setFormData] = useState({
    payeeId: payee?.payeeId._id,
    payeeId: payee?._id,
    payeeFullName: payee?.payeeFullName,
    payeeDob: payee?.payeeDob.split("T")[0],
    payeeSex: payee?.payeeSex,
    payeeAddress: payee?.payeeAddress,
    payeeContact: payee?.payeeContact,
    payeeRoles: payee?.payeeRoles,
    payeeAssessment: payee?.payeeId?.payeeAssessment,
    payeeWorkHistory: payee?.payeeId?.payeeWorkHistory || [],
    payeeIsActive: payee?.payeeId?.payeeIsActive,
    payeeYears: payee?.payeeId?.payeeYears || [],
    payeeCurrentEmployment: payee?.payeeId
      ?.payeeCurrentEmployment || {
      position: "",
      joinDate: "",
      contractType: "",
      salaryPackage: {
        basic: "",
        payment: "",
      },
    },
  });
  //console.log(formData.payeeRoles);
  const [validity, setValidity] = useState({
    validFirstName: false,
    validLastName: false,
    validDob: false,
    validPayeeSex: false,
    validHouse: false,

    validStreet: false,
    validCity: false,
    validPrimaryPhone: false,
    validCurrentPosition: false,
    validJoinDate: false,
    validContractType: false,
    validBasic: false,
    validPayment: false,
    validPayeeYear: false,
  });

  // Validate inputs using regex patterns
  useEffect(() => {
    setValidity((prev) => ({
      ...prev,

      validFirstName: NAME_REGEX.test(formData.payeeFullName?.payeeFirstName),
      validLastName: NAME_REGEX.test(formData.payeeFullName?.payeeLastName),
      validDob: DATE_REGEX.test(formData.payeeDob.split("T")[0]),
      validPayeeSex: NAME_REGEX.test(formData.payeeSex),
      validHouse: NAME_REGEX.test(formData.payeeAddress?.house),
      validStreet: NAME_REGEX.test(formData.payeeAddress?.street),
      validCity: NAME_REGEX.test(formData.payeeAddress?.city),
      validPrimaryPhone: PHONE_REGEX.test(formData.payeeContact?.primaryPhone),
      validCurrentPosition: NAME_REGEX.test(
        formData.payeeCurrentEmployment?.position
      ),
      validJoinDate: DATE_REGEX.test(
        formData.payeeCurrentEmployment.joinDate.split("T")[0]
      ),
      validContractType: USER_REGEX.test(
        formData.payeeCurrentEmployment?.contractType
      ),
     
      validBasic: NUMBER_REGEX.test(
        formData.payeeCurrentEmployment?.salaryPackage?.basic
      ),
      validPayment: NAME_REGEX.test(
        formData.payeeCurrentEmployment?.salaryPackage?.payment
      ),
      validPayeeYear: YEAR_REGEX.test(
        formData.payeeYears[0]?.academicYear
      ),
    }));
  }, [formData]);

  console.log(
    validity.validFirstName,
    validity.validLastName,
    validity.validDob,
    validity.validPayeeSex,
    validity.validHouse,
    validity.validStreet,
    validity.validCity,
    validity.validPrimaryPhone,
    validity.validCurrentPosition,
    validity.validJoinDate,
    validity.validContractType,
    validity.validBasic,
    validity.validPayment,
    validity.validPayeeYear
  );
  useEffect(() => {
    if (isSuccess) {
      setFormData({});

      navigate("/hr/payees/payeesList/");
    }
  }, [isSuccess, navigate]);
  const handleInputChange = (e) => {
    console.log(e.target.name, e.target.value); // Debugging line
    const { name, value } = e.target;

    // Handle nested object updates
    if (name.startsWith("payeeFullName.")) {
      const field = name.split(".")[1]; // Get the field name after 'payeeFullName.'
      setFormData((prev) => ({
        ...prev,
        payeeFullName: {
          ...prev.payeeFullName,
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
      const updatedYears = [...prev.payeeYears];

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
        return { ...prev, payeeYears: filteredYears };
      }

      return { ...prev, payeeYears: updatedYears };
    });
  };
  const onPayeeRolesChanged = (e, role) => {
    const { checked } = e.target;

    setFormData((prev) => {
      // Clone the previous payeeRoles array to avoid direct mutation
      const updatedPayeeRoles = [...prev.payeeRoles];

      if (checked) {
        // Add the selected role if it's checked and not already in the array
        if (!updatedPayeeRoles.includes(role)) {
          updatedPayeeRoles.push(role);
        }
      } else {
        // Remove the role if unchecked
        const filteredRoles = updatedPayeeRoles.filter(
          (payeeRole) => payeeRole !== role
        );
        return { ...prev, payeeRoles: filteredRoles };
      }

      return { ...prev, payeeRoles: updatedPayeeRoles };
    });
  };
  // Handler to update work history
  const handleWorkHistoryChange = (index, field, value) => {
    // Create a new copy of payeeWorkHistory
    const updatedWorkHistory = formData.payeeWorkHistory.map((work, i) => {
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
      payeeWorkHistory: updatedWorkHistory, // Set the updated work history
    }));
  };

  // Handler to remove work history
  const handleRemoveWorkHistory = (index) => {
    // Filter out the work history item to be removed
    const updatedWorkHistory = formData.payeeWorkHistory.filter(
      (_, i) => i !== index
    );

    // Update the formData state
    setFormData((prevState) => ({
      ...prevState,
      payeeWorkHistory: updatedWorkHistory,
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
      payeeWorkHistory: [...prevState.payeeWorkHistory, newWorkHistory],
    }));
  };

  const canSave =
    Object.values(validity).every(Boolean) &&
    formData?.payeeRoles?.length > 0 &&
    !isLoading;

  console.log(formData, "formData");
  console.log(canSave, "canSave");


  const onSavePayeeClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
        setShowConfirmation(true);
      }
    };

    const handleConfirmSave = async () => {
      // Close the confirmation modal
      setShowConfirmation(false);

      try {
        await updatePayee(formData);
      } catch (err) {
        console.error("Failed to save the payee:", err);
      }
    }
  
 // Close the modal without saving
 const handleCloseModal = () => {
  setShowConfirmation(false);
};

  const content = (
    <>
      <FinancesSet />
      <section className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">
          Edit Payee :{" "}
          {`${formData?.payeeFullName?.payeeFirstName} ${formData?.payeeFullName?.payeeMiddleName} ${formData?.payeeFullName?.payeeLastName}`}
        </h2>
        <form onSubmit={onSavePayeeClicked} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Payee Information</h3>
            <div className="border border-gray-200 p-4 rounded-md shadow-sm space-y-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  First Name{" "}
                  {!validity.validFirstName && (
                    <span className="text-red-500">*</span>
                  )}
                </label>
                <input
                  type="text"
                  name="payeeFullName.payeeFirstName" // Changed to match the nested structure
                  value={formData?.payeeFullName?.payeeFirstName}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full border ${
                    validity.validFirstName
                      ? "border-gray-300"
                      : "border-red-500"
                  } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
                  placeholder="Enter First Name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Middle Name
                </label>
                <input
                  type="text"
                  name="payeeFullName.payeeMiddleName" // Changed to match the nested structure
                  value={formData.payeeFullName.payeeMiddleName}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Last Name{" "}
                  {!validity.validLastName && (
                    <span className="text-red-500">*</span>
                  )}
                </label>
                <input
                  type="text"
                  name="payeeFullName.payeeLastName" // Changed to match the nested structure
                  value={formData.payeeFullName.payeeLastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              {/* DOB and Sex */}
              <div className="space-y-4">
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700"
                    htmlFor="payeeDob"
                  >
                    Date of Birth{" "}
                    {!validity.validDob && (
                      <span className="text-red-500">*</span>
                    )}
                  </label>
                  <input
                    type="date"
                    name="payeeDob"
                    value={formData.payeeDob}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full border ${
                      validity.validDob ? "border-gray-300" : "border-red-500"
                    } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Sex{" "}
                    {!validity.validPayeeSex && (
                      <span className="text-red-500">*</span>
                    )}
                  </label>
                  <div className="flex items-center space-x-4 mt-1">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="payeeSex"
                        value="Male"
                        checked={formData.payeeSex === "Male"}
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            payeeSex: e.target.checked
                              ? "Male"
                              : formData.payeeSex === "Male"
                              ? ""
                              : formData.payeeSex,
                          }));
                        }}
                        className={`h-4 w-4 ${
                          validity.validPayeeSex
                            ? "border-gray-300 rounded"
                            : "border-red-500 rounded"
                        } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
                      />
                      <label className="ml-2 text-sm text-gray-700">Male</label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="payeeSex"
                        value="Female"
                        checked={formData.payeeSex === "Female"}
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            payeeSex: e.target.checked
                              ? "Female"
                              : formData.payeeSex === "Female"
                              ? ""
                              : formData.payeeSex,
                          }));
                        }}
                        className="h-4 w-4 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <label className="ml-2 text-sm text-gray-700">
                        Female
                      </label>
                    </div>
                  </div>

                  {/* Payee Years */}
                  <h3 className="text-lg font-semibold mt-6">Payee Years</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {academicYears && academicYears.length > 0 ? (
                      academicYears.map((year, index) => {
                        const isChecked = formData.payeeYears.some(
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
                            <label className="text-gray-700">
                              {year.title}
                            </label>
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
              Payee Current EmploymentWork History
            </h3>
            <div className="border border-gray-200 p-4 rounded-md shadow-sm space-y-2">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="payeeIsActive"
                  checked={formData.payeeIsActive === true}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      payeeIsActive: e.target.checked ? true : false,
                    }));
                  }}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label
                  htmlFor="payeeIsActive"
                  className="text-sm font-medium text-gray-700"
                >
                  Payee is Active
                </label>
              </div>
              <div>
              <label className="block text-sm font-medium text-gray-700">
                Current Position{" "}
                {!validity.validCurrentPosition && (
                  <span className="text-red-500">*</span>
                )}
              </label>
              <select
                name="position"
                value={formData.payeeCurrentEmployment.position}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    payeeCurrentEmployment: {
                      ...prev.payeeCurrentEmployment,
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
                {/* <option value="">Select Position</option> */}
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
                  value={
                    formData.payeeCurrentEmployment.joinDate.split("T")[0]
                  }
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      payeeCurrentEmployment: {
                        ...prev.payeeCurrentEmployment,
                        joinDate: e.target.value,
                      },
                    }))
                  }
                  className={`mt-1 block w-full border ${
                    validity.validJoinDate
                      ? "border-gray-300"
                      : "border-red-500"
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
      value={formData.payeeCurrentEmployment.contractType}
      onChange={(e) =>
        setFormData((prev) => ({
          ...prev,
          payeeCurrentEmployment: {
            ...prev.payeeCurrentEmployment,
            contractType: e.target.value,
          },
        }))
      }
      className={`mt-1 block w-full border ${
        validity.validContractType ? "border-gray-300" : "border-red-500"
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
                        formData.payeeCurrentEmployment.salaryPackage.basic
                      }
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          payeeCurrentEmployment: {
                            ...prev.payeeCurrentEmployment,
                            salaryPackage: {
                              ...prev.payeeCurrentEmployment.salaryPackage,
                              basic: e.target.value,
                            },
                          },
                        }))
                      }
                      className={`mt-1 block w-full border ${
                        validity.validCity
                          ? "border-gray-300"
                          : "border-red-500"
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
      value={formData.payeeCurrentEmployment.salaryPackage.payment}
      onChange={(e) =>
        setFormData((prev) => ({
          ...prev,
          payeeCurrentEmployment: {
            ...prev.payeeCurrentEmployment,
            salaryPackage: {
              ...prev.payeeCurrentEmployment.salaryPackage,
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
      {/* <option value="">Select Payment Period</option> */}
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
                        formData.payeeCurrentEmployment.salaryPackage.cnss
                      }
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          payeeCurrentEmployment: {
                            ...prev.payeeCurrentEmployment,
                            salaryPackage: {
                              ...prev.payeeCurrentEmployment.salaryPackage,
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
                        formData.payeeCurrentEmployment.salaryPackage.other
                      }
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          payeeCurrentEmployment: {
                            ...prev.payeeCurrentEmployment,
                            salaryPackage: {
                              ...prev.payeeCurrentEmployment.salaryPackage,
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
                <h3 className="text-lg font-semibold">Assign Payee Roles</h3>

                <div className="border border-gray-200 p-4 rounded-md shadow-sm space-y-2">
                  <div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.values(ROLES).map((role) => (
                        <div key={role} className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            id={`role-${role}`}
                            checked={formData.payeeRoles.includes(role)}
                            onChange={(e) => onPayeeRolesChanged(e, role)}
                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                          />
                          <label
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
            <h3 className="text-lg font-semibold">Payee Work History</h3>
            {formData.payeeWorkHistory.map((work, index) => (
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
              onClick={() => navigate("/hr/payees/payees")}
              className="cancel-button"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSave||isLoading}
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

export default EditPayeeForm;
