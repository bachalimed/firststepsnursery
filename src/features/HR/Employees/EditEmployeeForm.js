import { useState, useEffect } from "react";
import { useUpdateEmployeeMutation } from "./employeesApiSlice";
import { useNavigate } from "react-router-dom";
import { ROLES } from "../../../config/UserRoles";
import useAuth from "../../../hooks/useAuth";
import HR from "../HR";
import {
  POSITIONS,
  CONTRACT_TYPES,
  PAYMENT_PERIODS,
} from "../../../config/UserRoles";
import {
  SHORTCOMMENT_REGEX,
  NAME_REGEX,
  NUMBER_REGEX,
  USER_REGEX,
  PHONE_REGEX,
  DATE_REGEX,
  YEAR_REGEX,
  EMAIL_REGEX,
  FEE_REGEX,
} from "../../../config/REGEX";
import {
  selectAllAcademicYears,
  selectCurrentAcademicYearId,
  selectAcademicYearById,
} from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import { useSelector } from "react-redux";
import ConfirmationModal from "../../../Components/Shared/Modals/ConfirmationModal";

import { useOutletContext } from "react-router-dom";
const EditEmployeeForm = ({ employee }) => {
  useEffect(() => {
    document.title = "Edit Employee";
  });
  const navigate = useNavigate();

  const { isAdmin, isManager, isDirector, userId } = useAuth();
  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  const academicYears = useSelector(selectAllAcademicYears);
  // console.log(employee,'employee')

  const [
    updateEmployee,
    {
      isLoading: isUpdateLoading,
      isSuccess: isUpdateSuccess,
      isError: isUpdateError,
      error: updateError,
    },
  ] = useUpdateEmployeeMutation();

  //confirmation Modal states
  const [showConfirmation, setShowConfirmation] = useState(false);
  // Consolidated form state
  const [formData, setFormData] = useState({
    employeeId: employee?.employeeId._id,
    userId: employee?._id,
    userFullName: employee?.userFullName,
    userDob: employee?.userDob.split("T")[0],
    userSex: employee?.userSex,
    cin: employee?.cin,
    userAddress: employee?.userAddress,
    userContact: employee?.userContact,
    userRoles: employee?.userRoles,
    employeeAssessment: employee?.employeeId?.employeeAssessment,
    employeeWorkHistory: employee?.employeeId?.employeeWorkHistory || [],
    employeeIsActive: employee?.employeeId?.employeeIsActive,
    employeeYears: employee?.employeeId?.employeeYears || [],
    employeeCurrentEmployment: employee?.employeeId
      ?.employeeCurrentEmployment || {
      position: "",
      joinDate: "",
      contractType: "",
    },
    employeeOperator: userId,
    salaryPackage: employee?.employeeId?.salaryPackage || [
      {
        salaryFrom: "",
        salaryTo: "",
        basicSalary: "",
        allowances: [
          // {
          //   allowanceLabel: "",
          //   allowanceUnitValue: "",
          //   allowancePeriodicity: "",
          // },
        ],
        deduction: { deductionLabel: "", deductionAmount: "" },
      },
    ],
  });

  const { triggerBanner } = useOutletContext(); // Access banner trigger
  //console.log(formData.userRoles);

  const [validity, setValidity] = useState({
    validFirstName: false,
    validMiddleName: false,
    validLastName: false,
    validDob: false,
    validUserSex: false,
    validCin: false,
    validHouse: false,
    validArea: false,
    validStreet: false,
    validCity: false,
    validPostCode: false,
    validEmail: false,
    validPrimaryPhone: false,
    validSecondaryPhone: false,
    validCurrentPosition: false,
    validJoinDate: false,
    validContractType: false,
    validEmployeeYear: false,
    salaryPackages: [], // Will hold per-package validity
    noOverlap: false,
  });

  const validateSalaryPackageDates = () => {
    const packages = formData.salaryPackage;
    for (let i = 0; i < packages.length; i++) {
      for (let j = i + 1; j < packages.length; j++) {
        const startA = new Date(packages[i].salaryFrom);
        const endA = new Date(packages[i].salaryTo);
        const startB = new Date(packages[j].salaryFrom);
        const endB = new Date(packages[j].salaryTo);

        if (
          (startA <= endB && endA >= startB) || // Overlap check
          (startB <= endA && endB >= startA)
        ) {
          return false;
        }
      }
    }
    return true;
  };

  const validateSalaryPackages = () => {
    return formData.salaryPackage.map((pkg, pkgIndex) => {
      const salaryFromDate = new Date(pkg.salaryFrom);
      const salaryToDate = pkg.salaryTo ? new Date(pkg.salaryTo) : null;

      // Check for conflicts with other packages
      const hasConflict = formData.salaryPackage.some(
        (otherPkg, otherIndex) => {
          if (otherIndex !== pkgIndex) {
            const otherSalaryFrom = new Date(otherPkg.salaryFrom);
            const otherSalaryTo = otherPkg.salaryTo
              ? new Date(otherPkg.salaryTo)
              : null;

            // Conflict case: This package has no salaryTo and its salaryFrom is within another range
            if (
              !salaryToDate &&
              salaryFromDate > otherSalaryFrom &&
              salaryFromDate <= otherSalaryTo
            ) {
              return true;
            }

            // Conflict case: This package has a salary range overlapping with another range
            if (
              salaryToDate &&
              ((salaryFromDate <= otherSalaryTo &&
                salaryToDate >= otherSalaryFrom) ||
                (salaryFromDate >= otherSalaryFrom &&
                  salaryFromDate <= otherSalaryTo))
            ) {
              return true;
            }
          }
          return false;
        }
      );

      return {
        salaryFrom: DATE_REGEX.test(pkg.salaryFrom?.split("T")[0] || ""),
        salaryTo:
          (!pkg.salaryTo ||
            DATE_REGEX.test(pkg.salaryTo?.split("T")[0] || "")) &&
          (!salaryToDate || salaryToDate >= salaryFromDate), // Ensure salaryTo is not before salaryFrom
        basicSalary: NUMBER_REGEX.test(pkg.basicSalary),
        allowances: pkg.allowances.map((allowance) =>
          !allowance.allowanceLabel &&
          !allowance.allowanceUnitValue &&
          !allowance.allowancePeriodicity
            ? true
            : NAME_REGEX.test(allowance.allowanceLabel) &&
              FEE_REGEX.test(allowance.allowanceUnitValue) &&
              SHORTCOMMENT_REGEX.test(allowance.allowancePeriodicity)
        ),
        deduction: {
          deductionLabel:
            !pkg?.deduction?.deductionLabel ||
            NAME_REGEX.test(pkg.deduction?.deductionLabel),
          deductionAmount:
            !pkg?.deduction?.deductionAmount ||
            FEE_REGEX.test(pkg?.deduction?.deductionAmount),
        },
        noConflict: !hasConflict, // Ensure no date conflict
      };
    });
  };

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

      validFirstName: NAME_REGEX.test(formData.userFullName?.userFirstName),
      validMiddleName:
        formData?.userFullName?.userMiddleName !== ""
          ? NAME_REGEX.test(formData.userFullName.userMiddleName)
          : true,
      validLastName: NAME_REGEX.test(formData.userFullName?.userLastName),
      validDob: DATE_REGEX.test(formData.userDob.split("T")[0]),
      validUserSex: NAME_REGEX.test(formData.userSex),
      validCin: PHONE_REGEX.test(formData?.cin),
      validHouse: NAME_REGEX.test(formData.userAddress?.house),
      validStreet: NAME_REGEX.test(formData.userAddress?.street),
      validCity: NAME_REGEX.test(formData.userAddress?.city),
      validArea:
        formData?.userAddress?.area === "" ||
        SHORTCOMMENT_REGEX.test(formData.userAddress.area),
      validPostCode: SHORTCOMMENT_REGEX.test(formData.userAddress.postCode),
      validPrimaryPhone: PHONE_REGEX.test(formData.userContact?.primaryPhone),
      validEmail:
        formData.userContact.email === "" ||
        EMAIL_REGEX.test(formData.userContact.email),
      validSecondaryPhone:
        formData.userContact.secondaryPhone === "" ||
        PHONE_REGEX.test(formData.userContact.secondaryPhone),
      validCurrentPosition: NAME_REGEX.test(
        formData.employeeCurrentEmployment?.position
      ),
      validJoinDate: DATE_REGEX.test(
        formData.employeeCurrentEmployment.joinDate.split("T")[0]
      ),
      validContractType: USER_REGEX.test(
        formData.employeeCurrentEmployment?.contractType
      ),
      validEmployeeYear: YEAR_REGEX.test(
        formData.employeeYears[0]?.academicYear
      ),
      validWorkHistory: validateWorkHistory(),
      salaryPackages: validateSalaryPackages(),
      noOverlap: validateSalaryPackageDates(),
    }));
  }, [formData]);

  // console.log(validity);
  // console.log(formData, "formData");

  useEffect(() => {
    if (isUpdateSuccess) {
      setFormData({});

      navigate("/hr/employees/employeesList/");
    }
  }, [isUpdateSuccess, navigate]);
  const handleInputChange = (e) => {
    // console.log(e.target.name, e.target.value); // Debugging line
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

  const handleSalaryPackageChange = (
    pkgIndex,
    field,
    value,
    allowanceIndex = null
  ) => {
    setFormData((prev) => {
      const updatedPackages = prev.salaryPackage.map((pkg, index) => ({
        ...pkg,
        allowances: pkg.allowances.map((allowance) => ({ ...allowance })),
        deduction: { ...pkg.deduction }, // Ensure deep copy of the deduction object
      }));

      if (allowanceIndex !== null) {
        // Update allowance fields
        updatedPackages[pkgIndex].allowances[allowanceIndex][field] = value;
      } else if (field === "deductionLabel" || field === "deductionAmount") {
        // Update deduction fields
        updatedPackages[pkgIndex].deduction = {
          ...updatedPackages[pkgIndex].deduction,
          [field]: value,
        };
      } else {
        // Update other fields
        updatedPackages[pkgIndex][field] = value;
      }

      return { ...prev, salaryPackage: updatedPackages };
    });
  };

  const handleAddSalaryPackage = () => {
    setFormData((prev) => ({
      ...prev,
      salaryPackage: [
        ...prev.salaryPackage,
        {
          salaryFrom: "",
          salaryTo: "",
          basicSalary: "",
          allowances: [
            {
              allowanceLabel: "",
              allowanceUnitValue: "",
              allowancePeriodicity: "",
            },
          ],
          deduction: { deductionLabel: "", deductionAmount: "" },
        },
      ],
    }));
  };

  const handleRemoveSalaryPackage = (pkgIndex) => {
    setFormData((prev) => ({
      ...prev,
      salaryPackage: prev.salaryPackage.filter((_, i) => i !== pkgIndex),
    }));
  };

  const handleAddAllowance = (pkgIndex) => {
    setFormData((prev) => {
      const updatedPackages = [...prev.salaryPackage];
      updatedPackages[pkgIndex].allowances.push({
        allowanceLabel: "",
        allowanceUnitValue: "",
        allowancePeriodicity: "",
      });
      return { ...prev, salaryPackage: updatedPackages };
    });
  };

  const handleRemoveAllowance = (pkgIndex, allowanceIndex) => {
    setFormData((prev) => {
      // Ensure salaryPackage exists and deep copy the structure to avoid mutating the state directly
      const updatedPackages = prev.salaryPackage.map((pkg) => ({
        ...pkg,
        allowances: pkg.allowances ? [...pkg.allowances] : [], // Ensure allowances is an array
      }));

      // Ensure allowances exist at the specified package index
      if (updatedPackages[pkgIndex]?.allowances) {
        // Remove the specified allowance
        updatedPackages[pkgIndex].allowances.splice(allowanceIndex, 1);
      }

      return { ...prev, salaryPackage: updatedPackages };
    });
  };

  // const handleRemoveAllowance = (pkgIndex, allowanceIndex) => {
  //   setFormData((prev) => {
  //     const updatedPackages = [...prev.salaryPackage];
  //     updatedPackages[pkgIndex].allowances.splice(allowanceIndex, 1);
  //     return { ...prev, salaryPackage: updatedPackages };
  //   });
  // };

  const onAcademicYearChanged = (e, yearTitle) => {
    setFormData((prev) => {
      const updatedYears = [...prev.employeeYears];

      // Check if the year is already selected
      const isAlreadySelected = updatedYears.some(
        (empYear) => empYear.academicYear === yearTitle
      );

      if (isAlreadySelected) {
        // Remove the year if already selected
        return {
          ...prev,
          employeeYears: updatedYears.filter(
            (empYear) => empYear.academicYear !== yearTitle
          ),
        };
      } else {
        // Add the year if not already selected
        updatedYears.push({ academicYear: yearTitle });
        return { ...prev, employeeYears: updatedYears };
      }
    });
  };

  const onUserRolesChanged = (e, role) => {
    setFormData((prev) => {
      const updatedUserRoles = [...prev.userRoles];

      if (updatedUserRoles.includes(role)) {
        // Remove the role if it's already in the array (unselect)
        const filteredRoles = updatedUserRoles.filter(
          (userRole) => userRole !== role
        );
        return { ...prev, userRoles: filteredRoles };
      } else {
        // Add the role if it's not already in the array (select)
        updatedUserRoles.push(role);
        return { ...prev, userRoles: updatedUserRoles };
      }
    });
  };

  // Handler to update work history
  const handleWorkHistoryChange = (index, field, value) => {
    // Create a new copy of employeeWorkHistory
    const updatedWorkHistory = formData.employeeWorkHistory.map((work, i) => {
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
      employeeWorkHistory: updatedWorkHistory, // Set the updated work history
    }));
  };

  // Handler to remove work history
  const handleRemoveWorkHistory = (index) => {
    // Filter out the work history item to be removed
    const updatedWorkHistory = formData.employeeWorkHistory.filter(
      (_, i) => i !== index
    );

    // Update the formData state
    setFormData((prevState) => ({
      ...prevState,
      employeeWorkHistory: updatedWorkHistory,
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
      employeeWorkHistory: [...prevState.employeeWorkHistory, newWorkHistory],
    }));
  };

  const canSave =
    Object.values(validity).every(Boolean) &&
    formData?.userRoles?.length > 0 &&
    validity.salaryPackages.every((pkg) =>
      Object.values(pkg).every((value) =>
        Array.isArray(value) ? value.every(Boolean) : value
      )
    ) &&
    !isUpdateLoading;

  console.log(validity, "validity");
  console.log(canSave, "canSave");

  const onSaveEmployeeClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      setShowConfirmation(true);
    }
  };

  const handleConfirmSave = async () => {
    // Ensure the deduction object contains both label and amount

    // Close the confirmation modal
    setShowConfirmation(false);

    try {
      const response = await updateEmployee(formData);
      if (response?.message) {
        // Success response
        triggerBanner(response?.message, "success");
      } else if (response?.data?.message) {
        // Success response
        triggerBanner(response?.data?.message, "success");
      } else if (response?.error?.data?.message) {
        // Error response
        triggerBanner(response?.error?.data?.message, "error");
      } else if (isUpdateError) {
        // In case of unexpected response format
        triggerBanner(updateError?.data?.message, "error");
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
  console.log(formData, "formData");
  const content = (
    <>
      <HR />

      <form onSubmit={onSaveEmployeeClicked} className="form-container">
        <h2 className="formTitle ">
          Edit Employee :{" "}
          {`${formData?.userFullName?.userFirstName} ${formData?.userFullName?.userMiddleName} ${formData?.userFullName?.userLastName}`}
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
                  type="text"
                  id="userFirstName"
                  name="userFullName.userFirstName" // Changed to match the nested structure
                  value={formData?.userFullName?.userFirstName}
                  onChange={handleInputChange}
                  className={`formInputText`}
                  placeholder="[3-25] letters"
                  required
                />
              </label>

              <label htmlFor="userMiddleName" className="formInputLabel">
                Middle Name
                <input
                  aria-label="userMiddleName"
                  aria-invalid={!validity.validMiddleName}
                  id="userMiddleName"
                  type="text"
                  className={`formInputText`}
                  placeholder="[3-25] letters"
                  name="userFullName.userMiddleName" // Changed to match the nested structure
                  value={formData.userFullName.userMiddleName}
                  onChange={handleInputChange}
                />{" "}
              </label>
            </div>
            <div className="formLineDiv">
              <label htmlFor="userLastName" className="formInputLabel">
                Last Name{" "}
                {!validity.validLastName && (
                  <span className="text-red-600">*</span>
                )}
                <input
                  aria-label="userLastName"
                  aria-invalid={!validity.validLastName}
                  id="userLastName"
                  type="text"
                  name="userFullName.userLastName" // Changed to match the nested structure
                  value={formData.userFullName.userLastName}
                  onChange={handleInputChange}
                  required
                  className={`formInputText`}
                  placeholder="[3-25] letters"
                />{" "}
              </label>

              {/* DOB and Sex */}

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
              {/* CIN */}

              <label htmlFor="ID" className="ID">
                ID{" "}
                {!validity.validCin && <span className="text-red-600">*</span>}
                <input
                  aria-invalid={!validity.validCin}
                  placeholder="[3-25 digits]"
                  aria-label="ID"
                  type="text"
                  id="cin"
                  name="cin"
                  value={formData.cin}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      cin: e.target.value,
                    }))
                  }
                  className={`formInputText`}
                  required
                />{" "}
              </label>
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
        </div>
        <h3 className="formSectionTitle">Contact details</h3>
        <div className="formSection">
          {/* Contact Information */}

          <div className="formLineDiv">
            {/* Address Information */}
            <label htmlFor="house" className="formInputLabel">
              House{" "}
              {!validity.validHouse && <span className="text-red-600">*</span>}
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
              {!validity.validStreet && <span className="text-red-600">*</span>}
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
              {!validity?.validEmail && formData?.userContact.email !== "" && (
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

        {/* Current Employment */}

        <h3 className="formSectionTitle">Employee Current Employment</h3>
        <div className="formSection">
          <div className="formSection">
            {/* Employee Years */}
            <h3 className="formInputLabel">Employee Years</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2 mt-1 max-h-80 overflow-y-auto">
              {academicYears &&
                academicYears.length > 0 &&
                academicYears
                  .filter((year) => year?.title !== "1000") // Exclude the year with title "1000"

                  .map((year, index) => {
                    const isChecked = formData.employeeYears.some(
                      (empYear) => empYear.academicYear === year.title
                    );

                    return (
                      <button
                        aria-label="employee year"
                        key={index}
                        type="button"
                        hidden={
                          isManager
                            ? false
                            : year?.title !== selectedAcademicYear?.title
                        }
                        onClick={(e) => onAcademicYearChanged(e, year.title)}
                        className={`px-3 py-2 text-left rounded-md ${
                          isChecked
                            ? "bg-sky-700 text-white hover:bg-sky-600"
                            : "bg-gray-200 text-gray-700 hover:bg-sky-600 hover:text-white"
                        }`}
                      >
                        <div className="font-semibold">{year.title}</div>
                      </button>
                    );
                  })}
            </div>
          </div>

          <div className="formLineDiv">
            <label className="formInputLabel">
              Employee Active:
              <div className="formCheckboxItemsDiv">
                <label
                  htmlFor="employeeIsActive"
                  className="text-sm font-medium text-gray-700"
                >
                  <input
                    type="checkbox"
                    id="employeeIsActive"
                    name="employeeIsActive"
                    checked={formData.employeeIsActive === true}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        employeeIsActive: e.target.checked ? true : false,
                      }));
                    }}
                    className="formCheckbox"
                  />
                  Employee is active
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
                aria-label="position"
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
                {/* <option value="">Select Position</option> */}
                {Object.values(POSITIONS).map((position) => (
                  <option key={position} value={position}>
                    {position}
                  </option>
                ))}
              </select>{" "}
            </label>

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
                value={
                  formData.employeeCurrentEmployment.joinDate.split("T")[0]
                }
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
              />
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
                {/* <option value="">Select Contract Type</option> */}
                {CONTRACT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <h4 className="formSectionTitle">
          Salary Package{" "}
          {!validity.noOverlap && (
            <span className="text-red-600"> Some dates areoverlapping</span>
          )}
        </h4>

        {formData.salaryPackage.map((pkg, pkgIndex) => (
          <div key={pkgIndex} className="formSection border rounded p-2 mb-4">
            <div className="formSection">
              <h4 className="formSectionTitle">Package {pkgIndex + 1}</h4>

              <div className="formLineDiv">
                <label
                  htmlFor={`fromDate-${pkgIndex}`}
                  className="formInputLabel"
                >
                  Salary From:
                  {(!validity.salaryPackages[pkgIndex]?.salaryFrom ||
                    !validity.salaryPackages[pkgIndex]?.noConflict) && (
                    <span className="text-red-600">
                      {" "}
                      * Date conflict with another package
                    </span>
                  )}
                  <input
                    id={`fromDate-${pkgIndex}`}
                    type="date"
                    value={pkg.salaryFrom.split("T")[0]}
                    onChange={(e) =>
                      handleSalaryPackageChange(
                        pkgIndex,
                        "salaryFrom",
                        e.target.value
                      )
                    }
                    min={formData?.employeeCurrentEmployment?.joinDate} //////////////////
                    className="formInputText"
                  />
                </label>
                <label
                  htmlFor={`toDate-${pkgIndex}`}
                  className="formInputLabel"
                >
                  Salary To:
                  {(!validity.salaryPackages[pkgIndex]?.salaryTo ||
                    !validity.noOverlap) && (
                    <span className="text-red-600"> *</span>
                  )}
                  <input
                    id={`toDate-${pkgIndex}`}
                    type="date"
                    value={pkg?.salaryTo?.split("T")[0] || ""}
                    onChange={(e) =>
                      handleSalaryPackageChange(
                        pkgIndex,
                        "salaryTo",
                        e.target.value
                      )
                    }
                    min={pkg.salaryFrom} /////////////////no less than the salaryTo date
                    className="formInputText"
                  />
                </label>
                <label
                  id={`basicSalary-${pkgIndex}`}
                  className="formInputLabel"
                >
                  Basic Salary:
                  {!validity.salaryPackages[pkgIndex]?.basicSalary && (
                    <span className="text-red-600"> *</span>
                  )}
                  <input
                    id={`basicSalary-${pkgIndex}`}
                    type="number"
                    value={pkg.basicSalary}
                    onChange={(e) =>
                      handleSalaryPackageChange(
                        pkgIndex,
                        "basicSalary",
                        e.target.value
                      )
                    }
                    className="formInputText"
                  />
                </label>
              </div>
              <h5 className="formSectionTitle">Allowances</h5>
              {pkg.allowances.map((allowance, allowanceIndex) => (
                <div className="formSection">
                  <div key={allowanceIndex} className="formLineDiv">
                    <label
                      htmlFor={`allowanceLabel-${allowanceIndex}`}
                      className="formInputLabel"
                    >
                      Label:
                      {!validity.salaryPackages[pkgIndex]?.allowances[
                        allowanceIndex
                      ] && <span className="text-red-600"> *</span>}
                      <input
                        id={`allowanceLabel-${allowanceIndex}`}
                        type="text"
                        value={allowance.allowanceLabel}
                        onChange={(e) =>
                          handleSalaryPackageChange(
                            pkgIndex,
                            "allowanceLabel",
                            e.target.value,
                            allowanceIndex
                          )
                        }
                        className="formInputText"
                      />
                    </label>
                    <label
                      htmlFor={`allowanceUnitValue-${allowanceIndex}`}
                      className="formInputLabel"
                    >
                      Unit Value:
                      {!validity.salaryPackages[pkgIndex]?.allowances[
                        allowanceIndex
                      ] && <span className="text-red-600"> *</span>}
                      <input
                        id={`allowanceUnitValue-${allowanceIndex}`}
                        type="number"
                        value={allowance.allowanceUnitValue}
                        onChange={(e) =>
                          handleSalaryPackageChange(
                            pkgIndex,
                            "allowanceUnitValue",
                            e.target.value,
                            allowanceIndex
                          )
                        }
                        className="formInputText"
                      />
                    </label>
                    <label
                      htmlFor={`allowancePeriodicity-${allowanceIndex}`}
                      className="formInputLabel"
                    >
                      Periodicity:
                      {!validity.salaryPackages[pkgIndex]?.allowances[
                        allowanceIndex
                      ] && <span className="text-red-600"> *</span>}
                      <input
                        id={`allowancePeriodicity-${allowanceIndex}`}
                        type="text"
                        value={allowance.allowancePeriodicity}
                        onChange={(e) =>
                          handleSalaryPackageChange(
                            pkgIndex,
                            "allowancePeriodicity",
                            e.target.value,
                            allowanceIndex
                          )
                        }
                        className="formInputText"
                      />
                    </label>{" "}
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveAllowance(pkgIndex, allowanceIndex)
                    }
                    className="delete-button w-full"
                  >
                    Remove Allowance
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddAllowance(pkgIndex)}
                className="add-button w-full"
              >
                Add Allowance
              </button>
              {/* Deduction Label Input */}
              <h5 className="formSectionTitle">Deduction</h5>
              <div className="formLineDiv">
                {/* Deduction Label Input */}
                <label
                  htmlFor={`deductionLabel-${pkgIndex}`}
                  className="formInputLabel"
                >
                  Deduction Label:
                  {!validity.salaryPackages[pkgIndex]?.deduction
                    ?.deductionLabel && (
                    <span className="text-red-600"> *</span>
                  )}
                  <input
                    type="text"
                    id={`deductionLabel-${pkgIndex}`}
                    value={pkg.deduction?.deductionLabel || ""}
                    onChange={(e) =>
                      handleSalaryPackageChange(
                        pkgIndex,
                        "deductionLabel",
                        e.target.value
                      )
                    }
                    className="formInputText"
                  />
                </label>

                {/* Deduction Amount Input */}
                <label
                  htmlFor={`deductionAmount-${pkgIndex}`}
                  className="formInputLabel"
                >
                  Deduction Amount:
                  {!validity.salaryPackages[pkgIndex]?.deduction
                    ?.deductionAmount && (
                    <span className="text-red-600"> *</span>
                  )}
                  <input
                    type="number"
                    id={`deductionAmount-${pkgIndex}`}
                    value={pkg.deduction?.deductionAmount || ""}
                    onChange={(e) =>
                      handleSalaryPackageChange(
                        pkgIndex,
                        "deductionAmount",
                        e.target.value
                      )
                    }
                    className="formInputText"
                  />
                </label>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleRemoveSalaryPackage(pkgIndex)}
              className="delete-button mt-2 w-full"
            >
              Remove Salary Package {pkgIndex + 1}
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddSalaryPackage}
          className="add-button w-full"
        >
          Add New Salary Package
        </button>
        <h3 className="formSectionTitle">Employee roles</h3>
        {(isAdmin || isManager || isDirector) && (
          <div className="formSection">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2 mt-1 max-h-80 overflow-y-auto">
              {Object.values(ROLES)
                .filter((role) => role !== "Employee" && role !== "Parent") // Filter out Employee and Parent
                .map((role, index) => {
                  const checked = formData?.userRoles?.includes(role);
                  return (
                    <button
                      aria-label="role"
                      key={index}
                      type="button"
                      onClick={(e) => onUserRolesChanged(e, role)}
                      className={`px-3 py-2 text-left rounded-md ${
                        checked
                          ? "bg-sky-700 text-white hover:bg-sky-600"
                          : "bg-gray-200 text-gray-700 hover:bg-sky-600 hover:text-white"
                      }`}
                    >
                      <div className="font-semibold">{role}</div>
                    </button>
                  );
                })}
            </div>
          </div>
        )}

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
                  {!work.fromDate && <span className="text-red-600">*</span>}
                  <input
                    aria-label="fromDate"
                    type="date"
                    id="fromDate"
                    name="fromDate"
                    value={work.fromDate}
                    onChange={(e) =>
                      handleWorkHistoryChange(index, "fromDate", e.target.value)
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
                      handleWorkHistoryChange(index, "toDate", e.target.value)
                    }
                    className={`formInputText`}
                  />{" "}
                </label>

                {/* Position */}

                <label htmlFor={`position-${index}`} className="formInputLabel">
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
                      handleWorkHistoryChange(index, "position", e.target.value)
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
                      <span className="text-red-600"> [Format: $$$$.$$$]</span>
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
            disabled={!canSave || isUpdateLoading}
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

export default EditEmployeeForm;
