import { useState, useEffect } from "react";
import { useAddNewEmployeeMutation } from "./employeesApiSlice";
import { useNavigate } from "react-router-dom";
import {
  POSITIONS,
  CONTRACT_TYPES,
  PAYMENT_PERIODS,
} from "../../../config/UserRoles";
import HR from "../HR";
import { useSelector } from "react-redux";
import {
  selectAllAcademicYears,
  selectCurrentAcademicYearId,
  selectAcademicYearById,
} from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import {
  SHORTCOMMENT_REGEX,
  NAME_REGEX,
  NUMBER_REGEX,
  USER_REGEX,
  PHONE_REGEX,
  DATE_REGEX,
  YEAR_REGEX,
  EMAIL_REGEX,
} from "../../../config/REGEX";

import { useOutletContext } from "react-router-dom";
import ConfirmationModal from "../../../Components/Shared/Modals/ConfirmationModal";
const NewEmployeeForm = () => {
  useEffect(() => {
    document.title = "New Employee";
  });
  const navigate = useNavigate();

  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  const academicYears = useSelector(selectAllAcademicYears);
  //console.log(selectedAcademicYear?.title, "selectedAcademicYear");
  const [addNewEmployee, {  isLoading:isAddLoading,
    isSuccess:isAddSuccess,
    isError:isAddError,
    error:addError }] =
    useAddNewEmployeeMutation();

  const generateRandomUsername = () =>
    `user${Math.random().toString(36).substring(2, 10)}`;
  //confirmation Modal states
  const [showConfirmation, setShowConfirmation] = useState(false);
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
        allowance: "",
        other: "",
        payment: "",
      },
    },
  });

  const [validity, setValidity] = useState({
    validUsername: false,
    validFirstName: false,
    validMiddleName: false,
    validLastName: false,
    validDob: false,
    validUserSex: false,
    validHouse: false,
    validStreet: false,
    validCity: false,
    validArea: false,

    validSecondaryPhone: false,
    validPrimaryPhone: false,
    validPostCode: false,
    validEmail: false,
    validCurrentPosition: false,
    validJoinDate: false,
    validContractType: false,
    validBasic: false,
    validPayment: false,
    validEmployeeYear: false,
    validWorkHistory: false,
  });

  //validation for workhjistory for non empty fields
  const validateWorkHistory = () => {
    return formData.employeeWorkHistory.every((work) => {
      const requiredFields = [
        "institution",
        "fromDate",
        "toDate",
        "contractType",
        "position",
      ];
      return requiredFields.every((field) => work[field]?.trim() !== "");
    });
  };
  // Validate inputs using regex patterns
  useEffect(() => {
    setValidity((prev) => ({
      ...prev,
      validUsername: USER_REGEX.test(formData.username),
      validFirstName: NAME_REGEX.test(formData.userFullName.userFirstName),
      validMiddleName:
        formData?.userFullName?.userMiddleName !== ""
          ? NAME_REGEX.test(formData.userFullName.userMiddleName)
          : true,
      validLastName: NAME_REGEX.test(formData.userFullName.userLastName),
      validDob: DATE_REGEX.test(formData.userDob),
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
      validWorkHistory: validateWorkHistory(),
    }));
  }, [formData]);

  useEffect(() => {
    if (isAddSuccess) {
      setFormData({});
      navigate("/hr/employees/employeesList/");
    }
  }, [isAddSuccess, navigate]);

  const { triggerBanner } = useOutletContext(); // Access banner trigger
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //related to employee years ch3ckbox
  // const onAcademicYearChanged = (e, index) => {
  //   const { checked } = e.target;
  //   setFormData((prev) => {
  //     const updatedYears = [...prev.employeeYears];
  //     // Update based on checked state
  //     updatedYears[index].academicYear = checked
  //       ? selectedAcademicYear?.title
  //       : "";
  //     return { ...prev, employeeYears: updatedYears };
  //   });
  // };

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
  const canSave = Object.values(validity).every(Boolean) && !isAddLoading;
  // console.log(validity, "validity");
  // console.log(formData, "formData");

  const onSaveEmployeeClicked = async (e) => {
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
      const response = await addNewEmployee(formData);
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

  const content = (
    <>
      <HR />

      <form onSubmit={onSaveEmployeeClicked} className="form-container">
        <h2 className="formTitle">
          Add employee:{" "}
          {`${formData.userFullName.userFirstName} ${formData.userFullName.userMiddleName} ${formData.userFullName.userLastName}`}
        </h2>
        <div className="formSectionContainer">
          <h3 className="formSectionTitle">Personal details</h3>
          <div className="formSection">
            <div className="formLineDiv">
              <label htmlFor="userFirstName" className="formInputLabel">
                First Name{" "}
                {!validity.validFirstName && (
                  <span className="text-red-600">*</span>
                )}
                <input
                  aria-label="userFirstName"
                  aria-invalid={!validity.validFirstName}
                  id="userFirstName"
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
                  placeholder="[3-25] letters"
                  required
                />{" "}
              </label>

              {/* Middle Name */}

              <label htmlFor="userMiddleName" className="formInputLabel">
                Middle Name{" "}
                {!validity?.validMiddleName &&
                  formData.userFullName.userMiddleName !== "" && (
                    <span className="text-red-600 ">[3-25] letters</span>
                  )}
                <input
                  aria-label="userMiddleName"
                  aria-invalid={!validity.validMiddleName}
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
                  placeholder="[3-25] letters"
                />{" "}
              </label>
            </div>
            <div className="formLineDiv">
              {/* Last Name */}

              <label htmlFor="userLastName" className="formInputLabel">
                Last Name{" "}
                {!validity.validLastName && (
                  <span className="text-red-600">*</span>
                )}
                <input
                  aria-label="userLastName"
                  aria-invalid={!validity.validLastName}
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
                  placeholder="[3-25] letters"
                  required
                />
              </label>

              {/* Date of Birth */}

              <label className="formInputLabel" htmlFor="userDob">
                Date of Birth{" "}
                {!validity.validDob && <span className="text-red-600">*</span>}
                <input
                  type="date"
                  id="userDob"
                  name="userDob"
                  value={formData.userDob}
                  onChange={handleInputChange}
                  className={`formInputText`}
                  required
                />
              </label>
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

              {/* Employee Years Selection */}
              {/* {formData.employeeYears.map((year, index) => (
                <div key={index} className="flex items-center mb-2">
                  <label
                    htmlFor={`employeeYear-${index}`}
                    className="ml-2 text-sm font-medium text-gray-700"
                  >
                    <input
                      type="checkbox"
                      id={`employeeYear-${index}`}
                      value={year.academicYear}
                      checked={
                        year.academicYear === selectedAcademicYear?.title
                      }
                      onChange={(e) => onAcademicYearChanged(e, index)}
                      className="h-4 w-4 text-blue-600 focus:ring-sky-700 border-gray-300 rounded"
                    />
                    Academic Year{" "}
                    {!validity.validEmployeeYear && (
                      <span className="text-red-600">*</span>
                    )}{" "}
                    : {selectedAcademicYear?.title}
                  </label>
                </div>
              ))} */}
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

          <h3 className="formSectionTitle">Current position</h3>
          <div className="formSection">
            <div className="formLineDiv">
              <label className="formInputLabel">
                Employee Active:
                <div className="formCheckboxItemsDiv">
                  <label
                    htmlFor="employeeIsActive"
                    className="formCheckboxChoice"
                  >
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
                      className="formCheckbox"
                    />
                    Employee is active {validity.validEmployeeIsActive && "*"}
                  </label>
                </div>
              </label>
              {/* Current Employment */}

              <label htmlFor="currentPosition" className="formInputLabel">
                Current Position{" "}
                {!validity.validCurrentPosition && (
                  <span className="text-red-600">*</span>
                )}
                <select
                  aria-invalid={!validity.validCurrentPosition}
                  id="currentPosition"
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
                  className={`formInputText`}
                  required
                >
                  <option value="">Select Position</option>
                  {Object.values(POSITIONS).map((position) => (
                    <option key={position} value={position}>
                      {position}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="formLineDiv">
              <label htmlFor="joinDate" className="formInputLabel">
                Join Date{" "}
                {!validity.validJoinDate && (
                  <span className="text-red-600">*</span>
                )}
                <input
                  aria-label="joinDate"
                  aria-invalid={!validity.validJoinDate}
                  type="date"
                  id="joinDate"
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
                  className={`formInputText`}
                  required
                />{" "}
              </label>

              <label htmlFor="currentContractType" className="formInputLabel">
                Contract Type{" "}
                {!validity.validContractType && (
                  <span className="text-red-600">*</span>
                )}
                <select
                  aria-label="contractType"
                  aria-invalid={!validity.validContractType}
                  id="currentContractType"
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
                  className={`formInputText`}
                  required
                >
                  <option value="">Select Contract Type</option>
                  {CONTRACT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>{" "}
              </label>
            </div>

            <h4 className="formSectionTitle">Salary Package</h4>
            <div className="formSection">
              <div className="formLineDiv">
                <label htmlFor="basic" className="formInputLabel">
                  Basic{" "}
                  {!validity.validBasic && (
                    <span className="text-red-600">*</span>
                  )}
                  <input
                    aria-label="basic"
                    aria-invalid={!validity.validBasic}
                    type="number"
                    id="basic"
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
                    className={`formInputText`}
                    placeholder="[$$$$.$$$]"
                  />{" "}
                </label>

                <label htmlFor="payment" className="formInputLabel">
                  Payment{" "}
                  {!validity.validPayment && (
                    <span className="text-red-600">*</span>
                  )}
                  <select
                    aria-label="payment"
                    aria-invalid={!validity.validPayment}
                    id="payment"
                    name="payment"
                    value={
                      formData.employeeCurrentEmployment.salaryPackage.payment
                    }
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
                    className={`formInputText`}
                    required
                  >
                    <option value="">Select Payment Period</option>
                    {PAYMENT_PERIODS.map((period) => (
                      <option key={period} value={period}>
                        {period}
                      </option>
                    ))}
                  </select>{" "}
                </label>
              </div>
              <div className="formLineDiv">
                <label htmlFor="allowance" className="formInputLabel">
                  ALLOWANCE{" "}
                  {formData?.employeeCurrentEmployment?.salaryPackage?.allowance &&
                    !NUMBER_REGEX.test(
                      formData?.employeeCurrentEmployment?.salaryPackage?.allowance
                    ) && <span className="text-red-600">[$$$$.$$$]</span>}
                  <input
                    aria-label="allowance"
                    type="number"
                    id="allowance"
                    name="allowance"
                    value={
                      formData.employeeCurrentEmployment.salaryPackage.allowance
                    }
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        employeeCurrentEmployment: {
                          ...prev.employeeCurrentEmployment,
                          salaryPackage: {
                            ...prev.employeeCurrentEmployment.salaryPackage,
                            allowance: e.target.value,
                          },
                        },
                      }))
                    }
                    className={`formInputText`}
                    placeholder="[$$$$.$$$]"
                  />{" "}
                </label>

                <label htmlFor="other" className="formInputLabel">
                  Other{" "}
                  {formData?.employeeCurrentEmployment?.salaryPackage?.other &&
                    !NUMBER_REGEX.test(
                      formData?.employeeCurrentEmployment?.salaryPackage?.other
                    ) && <span className="text-red-600">[$$$$.$$$]</span>}
                  <input
                    aria-label="other"
                    type="number"
                    id="other"
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
                    className={`formInputText`}
                    placeholder="[$$$$.$$$]"
                  />{" "}
                </label>
              </div>
            </div>

            <h3 className="formSectionTitle">Employement history</h3>
            <div className="formSection">
              {formData.employeeWorkHistory.map((work, index) => (
                <div key={index} className="formSection">
                  <div className="formLineDiv">
                    {/* Institution */}

                    <label htmlFor="institution" className="formInputLabel">
                      Institution
                      {!NAME_REGEX.test(
                        formData?.employeeWorkHistory?.[index]?.institution
                      ) && <span className="text-red-600">*</span>}
                      <input
                        aria-label="institution"
                        type="text"
                        id="institution"
                        name="institution"
                        value={work.institution}
                        onChange={(e) =>
                          handleWorkHistoryChange(
                            index,
                            "institution",
                            e.target.value
                          )
                        }
                        className={`formInputText`}
                        placeholder="[3-25 letters]"
                      />{" "}
                    </label>

                    {/* From Date */}

                    <label htmlFor="fromDate" className="formInputLabel">
                      From Date{" "}
                      {!work.fromDate && (
                        <span className="text-red-600">*</span>
                      )}
                      <input
                        aria-label="fromDate"
                        type="date"
                        id="fromDate"
                        name="fromDate"
                        value={work.fromDate}
                        onChange={(e) =>
                          handleWorkHistoryChange(
                            index,
                            "fromDate",
                            e.target.value
                          )
                        }
                        className={`formInputText`}
                      />{" "}
                    </label>

                    {/* To Date */}

                    <label htmlFor="toDate" className="formInputLabel">
                      To Date{" "}
                      {!work.toDate && <span className="text-red-600">*</span>}
                      <input
                        aria-label="toDate"
                        type="date"
                        id="toDate"
                        name="toDate"
                        value={work.toDate}
                        onChange={(e) =>
                          handleWorkHistoryChange(
                            index,
                            "toDate",
                            e.target.value
                          )
                        }
                        className={`formInputText`}
                      />{" "}
                    </label>

                    {/* Position */}

                    <label
                      htmlFor={`position-${index}`}
                      className="formInputLabel"
                    >
                      Position{" "}
                      {!NAME_REGEX.test(
                        formData?.employeeWorkHistory?.[index]?.position
                      ) && <span className="text-red-600">*</span>}
                      <input
                        aria-label="position"
                        type="text"
                        id={`position-${index}`}
                        name="position"
                        value={work.position}
                        onChange={(e) =>
                          handleWorkHistoryChange(
                            index,
                            "position",
                            e.target.value
                          )
                        }
                        className={`formInputText`}
                        placeholder="[3-25 letters]"
                      />{" "}
                    </label>

                    {/* Contract Type */}

                    <label
                      htmlFor={`contractType-${index}`}
                      className="formInputLabel"
                    >
                      Contract Type{" "}
                      {!NAME_REGEX.test(
                        formData?.employeeWorkHistory?.[index]?.contractType
                      ) && <span className="text-red-600">*</span>}
                      <input
                        aria-label="contractType"
                        aria-invalid={!validity.contractType}
                        type="text"
                        id={`contractType-${index}`}
                        name="contractType"
                        value={work.contractType}
                        onChange={(e) =>
                          handleWorkHistoryChange(
                            index,
                            "contractType",
                            e.target.value
                          )
                        }
                        className={`formInputText`}
                        placeholder="[3-25 letters]"
                      />
                    </label>

                    {/* Salary Package */}

                    <label htmlFor="salaryPackage" className="formInputLabel">
                      Salary Package
                      {formData?.employeeWorkHistory?.[index]?.salaryPackage &&
                        !NUMBER_REGEX.test(
                          formData?.employeeWorkHistory?.[index]?.salaryPackage
                        ) && (
                          <span className="text-red-600">
                            {" "}
                            [Format: $$$$.$$$]
                          </span>
                        )}
                      <input
                        aria-label="salaryPackage"
                        type="text"
                        id="salaryPackage"
                        name="salaryPackage"
                        value={work.salaryPackage}
                        onChange={(e) =>
                          handleWorkHistoryChange(
                            index,
                            "salaryPackage",
                            e.target.value
                          )
                        }
                        className={`formInputText`}
                        placeholder="[$$$$.$$$]"
                      />
                    </label>
                  </div>
                  {/* Remove Work History Button */}
                  <button
                    aria-label="remove work history"
                    type="button"
                    onClick={() => handleRemoveWorkHistory(index)}
                    className="delete-button w-full"
                  >
                    Remove
                  </button>
                </div>
              ))}

              {/* Add Work History Button */}
              <button
                aria-label="add work history"
                type="button"
                onClick={handleAddWorkHistory}
                className="add-button w-full"
              >
                Add Work History
              </button>
            </div>
          </div>
        </div>
        {/* Submit Button */}
        <div className="cancelSavebuttonsDiv">
          <button
            aria-label="cancel employee"
            type="button"
            onClick={() => navigate("/hr/employees/employeesList/")}
            className="cancel-button"
          >
            Cancel
          </button>
          <button
            aria-label="submit employee"
            type="submit"
            disabled={!canSave || isAddLoading}
            className="save-button"
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

export default NewEmployeeForm;
