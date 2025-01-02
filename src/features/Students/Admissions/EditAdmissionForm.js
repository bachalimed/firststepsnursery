import React, { useState, useEffect } from "react";
import { CurrencySymbol } from "../../../config/Currency";
import { useSelector } from "react-redux"; // Assuming you're using Redux for state management
import { useNavigate } from "react-router-dom";
import Students from "../Students";
import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
} from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import { useGetServicesByYearQuery } from "../../AppSettings/StudentsSet/NurseryServices/servicesApiSlice";
import { useUpdateAdmissionMutation } from "./admissionsApiSlice";

import useAuth from "../../../hooks/useAuth";
import { selectAllAcademicYears } from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import {
  FEE_REGEX,
  DATE_REGEX,
  COMMENT_REGEX,
  OBJECTID_REGEX,
} from "../../../config/REGEX";
import ConfirmationModal from "../../../Components/Shared/Modals/ConfirmationModal";
import { useOutletContext } from "react-router-dom";

import { MONTHS } from "../../../config/Months";
import LoadingStateIcon from "../../../Components/LoadingStateIcon";
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const EditAdmissionForm = ({ admission }) => {
  // console.log(admission, "admission");
  // initialising states
  const { isAdmin, userId } = useAuth();
  const navigate = useNavigate();
  const [
    updateAdmission,
    {
      isLoading: isUpdateLoading,
      isSuccess: isUpdateSuccess,
      isError: isUpdateError,
      error: updateError,
    },
  ] = useUpdateAdmissionMutation();
  //academic years states
  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  const academicYears = useSelector(selectAllAcademicYears);

  //confirmation Modal states
  const [showConfirmation, setShowConfirmation] = useState(false);
  const {
    data: services,
    isLoading: isServicesLoading,
    isSuccess: isServicesSuccess,
    isError: isServicesError,
    error: servicesError,
  } = useGetServicesByYearQuery(
    {
      selectedYear: selectedAcademicYear?.title,
      endpointName: "servicesList",
    } || {},
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );
  // Local state for form data
  const [formData, setFormData] = useState({
    admissionId: admission?.id,
    student: admission?.student._id,
    admissionYear: admission?.admissionYear,
    admissionDate: admission?.admissionDate
      ? new Date(admission?.admissionDate).toISOString().split("T")[0]
      : "",
    agreedServices: admission?.agreedServices || [
      {
        service: "",
        feeValue: "",
        feePeriod: "",
        feeStartDate: "",
        feeEndDate: "",
        isFlagged: false,
        comment: "",
      },
    ],
    admissionOperator: userId, // Set to the operator id
  });

  const servicesList = isServicesSuccess
    ? Object.values(services.entities)
    : [];

  // Set default admission service
  useEffect(() => {
    if (isServicesSuccess && formData.agreedServices.length === 0) {
      const admissionService = servicesList.find(
        (service) => service.serviceType === "Admission"
      );
      if (admissionService) {
        setFormData((prevData) => ({
          ...prevData,
          agreedServices: [
            {
              service: admissionService.id,
              feeValue: "",
              feePeriod: "",
              feeStartDate: "",
              feeMonths: [],
              feeEndDate: "",
              isFlagged: false,
              comment: "",
            },
          ],
        }));
      }
    }
  }, [isServicesSuccess]);

  const [admissionValidity, setAdmissionValidity] = useState([]);

  const [validFirstAdmission, setValidFirstAdmisison] = useState(false);
  useEffect(() => {
    setValidFirstAdmisison(formData.agreedServices[0].feeMonths?.length === 1);
  }, [formData.agreedServices[0].feeMonths]);

  const handleInputChange = (index, field, value) => {
    // Deep copy the agreedServices array
    const updatedServices = JSON.parse(JSON.stringify(formData.agreedServices));

    // Ensure that the service at the specified index exists
    if (!updatedServices[index]) {
      updatedServices[index] = {}; // Initialize if undefined
    }

    updatedServices[index][field] = value; // Set the value

    setFormData({ ...formData, agreedServices: updatedServices });
  };

  // Debounce feeValue updates
  const [feeValue, setFeeValue] = useState("");

  const debouncedFeeValue = useDebounce(feeValue, 500); //delay500

  const validateService = (services) => {
    const updatedValidity = services.map((service) => {
      if (!service) return {}; // Handle undefined or incomplete service

      const validService = OBJECTID_REGEX.test(service.service);
      const validFeePeriod = service.feePeriod !== "";
      const validFeeValue = FEE_REGEX.test(service.feeValue);
      const validFeeStartDate = DATE_REGEX.test(
        service.feeStartDate.split("T")[0]
      );
      const validComment = COMMENT_REGEX.test(service.comment);

      return {
        validService,
        validFeePeriod,
        validFeeValue,
        validFeeStartDate,
        validComment,
      };
    });

    if (JSON.stringify(updatedValidity) !== JSON.stringify(admissionValidity)) {
      setAdmissionValidity(updatedValidity);
    }
  };

  // Validate services when debouncedFeeValue changes
  useEffect(() => {
    if (debouncedFeeValue) {
      const updatedServices = [...formData.agreedServices];
      validateService(updatedServices);
    }
  }, [debouncedFeeValue, formData.agreedServices]);

  // console.log(admissionValidity, "admissionValidity2");
  const [primaryValidity, setPrimaryValidity] = useState({
    validStudent: false,
    validAdmissionYear: false,
    validAdmissionDate: false,
  });

  useEffect(() => {
    setPrimaryValidity((prev) => ({
      ...prev,
      validStudent: OBJECTID_REGEX.test(formData.student),
      validAdmissionYear: formData.admissionYear !== "",
      validAdmissionDate: DATE_REGEX.test(formData.admissionDate),
    }));
  }, [formData.student, formData.admissionYear, formData.admissionDate]); // run whenever formData changes

  // console.log(primaryValidity, "primaryValidity");
  // Modify handleAgreedServicesChange
  const handleAgreedServicesChange = (index, e) => {
    const { name, value, type, options } = e.target;
    const updatedServices = formData.agreedServices.map((service, idx) => {
      if (idx === index) {
        const updatedService = { ...service }; // Create a shallow copy of the service object
        if (type === "select-multiple" && name === "feeMonths") {
          // For multi-select (feeMonths), gather selected options into an array
          const selectedOptions = Array.from(options)
            .filter((option) => option.selected)
            .map((option) => option.value);
          updatedService[name] = selectedOptions; // Update feeMonths
        } else {
          updatedService[name] = value; // Update other fields
        }
        return updatedService; // Return the updated service object
      }
      return service; // Return the original service object for other indices
    });
    setFormData((prevData) => ({
      ...prevData,
      agreedServices: updatedServices,
    }));
  };

  //Add another agreed service
  const addAgreedService = () => {
    setFormData((prevData) => ({
      ...prevData,
      agreedServices: [
        ...prevData.agreedServices,
        {
          service: "",
          feeValue: "",
          feePeriod: "",
          feeStartDate: "",
          feeMonths: [],
          feeEndDate: "",
          isFlagged: false,
          comment: "",
        },
      ],
    }));
  };

  useEffect(() => {
    if (isUpdateSuccess) {
      //if the add of new user using the mutation is success, empty all the individual states and navigate back to the users list
      setFormData({
        admissionId: "",
        student: "",
        admissionYear: "",
        admissionDate: "",
        agreedServices: [
          {
            service: "",
            feeValue: "",
            feePeriod: "",
            feeStartDate: "",
            feeMonths: [],
            feeEndDate: "",
            isFlagged: false,
            //authorisedBy:"", it will generate error in mongo if ""
            comment: "",
          },
        ],
        admissionCreator: "", // Set to the logged-in user id
        admissionOperator: "", // Set to the operator id
      });
      navigate("/students/admissions/admissions"); //will navigate here after saving
    }
  }, [isUpdateSuccess, navigate]); //even if no success it will navigate and not show any warning if failed or success

  // Function to filter available services based on previous selections

  const getAvailableServices = (index) => {
    const selectedServiceIds = formData.agreedServices
      .map((service, i) => (i !== index ? service.service : null))
      .filter((serviceId) => serviceId);

    return servicesList.filter(
      (service) => !selectedServiceIds.includes(service.id)
    );
  };


  const handleMonthSelection = (index, month) => {
    // Create a deep copy of the agreedServices array
    const updatedServices = formData.agreedServices.map((service, serviceIndex) =>
      serviceIndex === index
        ? {
            ...service,
            feeMonths: service.feeMonths ? [...service.feeMonths] : [],
          }
        : service
    );
  
    // Get the current feeMonths for the selected index
    const currentMonths = updatedServices[index].feeMonths;
  
    if (currentMonths.includes(month)) {
      // Remove month if already selected
      updatedServices[index].feeMonths = currentMonths.filter(
        (selectedMonth) => selectedMonth !== month
      );
    } else {
      // Add month to selection
      updatedServices[index].feeMonths = [...currentMonths, month];
    }
  
    // Update the formData state
    setFormData((prevData) => ({
      ...prevData,
      agreedServices: updatedServices,
    }));
  };
  
  // const handleMonthSelection = (index, month) => {
  //   const updatedServices = [...formData.agreedServices];
  //   const currentMonths = updatedServices[index].feeMonths || []; ////

  //   if (currentMonths.includes(month)) {
  //     // Remove month if already selected
  //     updatedServices[index].feeMonths = currentMonths.filter(
  //       (selectedMonth) => selectedMonth !== month
  //     );
  //   } else {
  //     // Add month to selection
  //     updatedServices[index].feeMonths = [...currentMonths, month];
  //   }

  //   setFormData((prevData) => ({
  //     ...prevData,
  //     agreedServices: updatedServices,
  //   }));
  // };

  // Function to handle agreed services check and set isFlagged if necessary
  const handleAgreedServicesCheck = (index) => {
    // Find the selected service from servicesList
    const selectedService = servicesList.find(
      (service) => service.id === formData?.agreedServices[index]?.service
    );

    // Check if the selected service and its serviceAnchor exist
    if (selectedService && selectedService.serviceAnchor) {
      // Check if the agreed service period exists in serviceAnchor
      if (
        formData?.agreedServices[index]?.feePeriod &&
        selectedService.serviceAnchor[
          formData?.agreedServices[index]?.feePeriod
        ]
      ) {
        const serviceAnchorValue =
          selectedService.serviceAnchor[
            formData?.agreedServices[index]?.feePeriod
          ]; // Get the corresponding serviceAnchor value

        const isFlaggedNew =
          parseFloat(formData?.agreedServices[index]?.feeValue) <
          parseFloat(serviceAnchorValue); // Determine if the new flag should be true or false

        if (isFlaggedNew === true) {
          setFormData((prevData) => ({
            ...prevData,
            agreedServices: prevData.agreedServices.map((serv, idx) => {
              if (idx === index) {
                return {
                  ...serv,
                  isFlagged: isFlaggedNew, // Set new flag value
                  isAuthorised: isFlaggedNew ? false : true, // Set isAuthorised to false if flagged
                };
              }
              return serv;
            }),
          }));
        }
      }
    }
  };

  // Call handleAgreedServicesCheck whenever agreedServices or service selection changes
  useEffect(() => {
    // Call handleAgreedServicesCheck when formData.agreedServices[index] changes
    if (formData?.agreedServices) {
      formData.agreedServices.forEach((_, index) => {
        handleAgreedServicesCheck(index);
      });
    }
  }, [formData.agreedServices]);

  const removeAgreedService = (index) => {
    if (index > 0) {
      setFormData((prevData) => ({
        ...prevData,
        agreedServices: prevData.agreedServices.filter(
          (_, idx) => idx !== index
        ),
      }));
    }
  };
  // For checking whether the form is valid
  const canSave =
    admissionValidity.length > 0 &&
    admissionValidity.every(
      (validity) => validity && Object.values(validity).every(Boolean)
    ) &&
    validFirstAdmission &&
    Object.values(primaryValidity).every(Boolean) &&
    !isUpdateLoading;
  const { triggerBanner } = useOutletContext(); // Access banner trigger
  // Submit the form

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (canSave) {
      setShowConfirmation(true);
    }
  };

  const handleConfirmSave = async () => {
    // Close the confirmation modal
    setShowConfirmation(false);
    try {
      const response = await updateAdmission(formData).unwrap();
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
  const handleCancel = () => {
    navigate("/students/admissions/admissions/");
  };
  // console.log(formData, "formData");
  let content;
  if (isServicesLoading) {
    content = (
      <>
        {" "}
        <Students />
        <LoadingStateIcon />
      </>
    );
  }
  if (isServicesSuccess) {
    content = (
      <>
        <Students />
        <form onSubmit={handleSubmit} className="form-container">
          <h2 className="formTitle">Edit Admission</h2>
          <div className="formSectionContainer">
            <h3 className="formSectionTitle">Admission Information</h3>
            <div className="formSection">
              <label htmlFor="student" className="formInputLabel">
                Student{" "}
                {!primaryValidity.validStudent && (
                  <span className="text-red-600">*</span>
                )}
                <select
                  aria-invalid={!primaryValidity?.validStudent}
                  id="student"
                  name="student"
                  value={formData.student}
                  onChange={(e) =>
                    setFormData((prevData) => ({
                      ...prevData,
                      student: e.target.value, // update formData with input value
                    }))
                  }
                  className="formInputText"
                  required
                  disabled
                >
                  <option
                    key={admission.student._id}
                    value={admission.student._id}
                  >
                    {admission.student?.studentName?.firstName}{" "}
                    {admission.student.studentName?.middleName}{" "}
                    {admission.student.studentName?.lastName}
                  </option>
                </select>{" "}
              </label>

              <div className="formLineDiv">
                <label htmlFor="admissionYear" className="formInputLabel">
                  Admission Year{" "}
                  {!primaryValidity.validAdmissionYear && (
                    <span className="text-red-600">*</span>
                  )}
                  <select
                    aria-invalid={!primaryValidity?.validAdmissionYear}
                    id="admissionYear"
                    name="admissionYear"
                    value={formData.admissionYear}
                    onChange={(e) =>
                      setFormData((prevData) => ({
                        ...prevData,
                        admissionYear: e.target.value, // update formData with input value
                      }))
                    }
                    className="formInputText"
                    required
                    disabled
                  >
                    <option
                      key={formData.admissionYear}
                      value={formData.admissionYear}
                    >
                      {formData.admissionYear}
                    </option>
                  </select>
                </label>

                {/* Admission Date Input */}

                <label htmlFor="admissionDate" className="formInputLabel">
                  Admission Starting Date{" "}
                  {!primaryValidity.validAdmissionDate && (
                    <span className="text-red-600">*</span>
                  )}
                  <input
                    aria-invalid={!primaryValidity?.validAdmissionDate}
                    type="date"
                    id="admissionDate"
                    name="admissionDate"
                    value={formData.admissionDate}
                    onChange={(e) =>
                      setFormData((prevData) => ({
                        ...prevData,
                        admissionDate: e.target.value, // update formData with input value
                      }))
                    }
                    placeholder="YYYY-MM-DD"
                    className="formInputText"
                    required
                  />{" "}
                </label>
              </div>
            </div>

            {/* Agreed Services Section */}
            <h3 className="formSectionTitle">Services provided</h3>
            {formData.agreedServices.map((service, index) => (
              <div className="formSection">
                <div key={index} className="formLineDiv">
                  <label
                    htmlFor={`service-${index}`}
                    className="formInputLabel"
                  >
                    Service{" "}
                    {!admissionValidity[index]?.validService && (
                      <span className="text-red-600">*</span>
                    )}
                    {index === 0 && "(Default: Admission)"}
                    <select
                      aria-invalid={!admissionValidity[index]?.validService}
                      id={`service-${index}`}
                      name="service"
                      value={service.id}
                      onChange={(e) => handleAgreedServicesChange(index, e)}
                      className="formInputText"
                      disabled={index === 0} // Disable the first service since it's "Admission"
                      required
                    >
                      {index === 0 ? (
                        <option value="Admission">Admission</option>
                      ) : (
                        <>
                          {getAvailableServices(index).map((serviceOption) => (
                            <option
                              key={serviceOption.id}
                              value={serviceOption.id}
                            >
                              {serviceOption.serviceType}
                            </option>
                          ))}
                        </>
                      )}
                    </select>{" "}
                  </label>

                  <label
                    htmlFor={`feePeriod-${index}`}
                    className="formInputLabel"
                  >
                    Fee Period{" "}
                    {!admissionValidity[index]?.validFeePeriod && (
                      <span className="text-red-600">*</span>
                    )}
                    <select
                      aria-invalid={!admissionValidity[index]?.validFeePeriod}
                      id={`feePeriod-${index}`}
                      name="feePeriod"
                      value={service?.feePeriod}
                      onChange={(e) => handleAgreedServicesChange(index, e)}
                      className="formInputText"
                      required
                    >
                      <option value="">Select Period</option>
                      {/* Ensure the correct serviceAnchor object is passed */}
                      {servicesList.find(
                        (service) =>
                          service.id ===
                          formData?.agreedServices[index]?.service
                      )?.serviceAnchor &&
                        Object.entries(
                          servicesList.find(
                            (service) =>
                              service.id ===
                              formData?.agreedServices[index]?.service
                          )?.serviceAnchor
                        ).map(([periodKey, value]) => (
                          <option key={periodKey} value={periodKey}>
                            {`${
                              periodKey.charAt(0).toUpperCase() +
                              periodKey.slice(1)
                            } (anchor: ${value})`}
                          </option>
                        ))}
                    </select>
                  </label>
                </div>

                <div className="formLineDiv">
                  <label
                    htmlFor={`feeValue-${index}`}
                    className="formInputLabel"
                  >
                    Fee Value{" "}
                    {!admissionValidity[index]?.validFeeValue && (
                      <span className="text-red-600">*</span>
                    )}
                    <input
                      type="number"
                      id={`feeValue-${index}`}
                      name="feeValue"
                      value={service.feeValue}
                      onChange={(e) => {
                        setFeeValue(e.target.value);
                        handleInputChange(index, "feeValue", e.target.value);
                      }}
                      className="formInputText"
                      required
                    />
                  </label>

                  <label
                    htmlFor={`feeStartDate-${index}`}
                    className="formInputLabel"
                  >
                    Fee Start Date{" "}
                    {!admissionValidity[index]?.validFeeStartDate && (
                      <span className="text-red-600">*</span>
                    )}
                    (Billing start)
                    <input
                      aria-invalid={
                        !admissionValidity[index]?.validFeeStartDate
                      }
                      type="date"
                      id={`feeStartDate-${index}`}
                      name="feeStartDate"
                      value={service.feeStartDate?.split("T")[0]}
                      onChange={(e) => handleAgreedServicesChange(index, e)}
                      placeholder="YYYY-MM-DD"
                      className="formInputText"
                      required
                    />{" "}
                  </label>
                </div>

                <div key={index} className="formSection">
                  <div className="formInputLabel" htmlFor="feeMonth">
                    Select Month(s){" "}
                    {!service.feeMonths?.length > 0 && (
                      <span className="text-red-600">*</span>
                    )}
                     {!validFirstAdmission && index === 0 && (
                        <span className="text-red-600">one-time-off service</span>
                      )}
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-2">
                      {MONTHS?.map((month) => (
                        <button
                          aria-label="feeMonth"
                          id="feeMonth"
                          key={month}
                          type="button"
                          className={`px-4 py-2 border border-sky-700 rounded cursor-pointer transition-colors hover:bg-sky-600 hover:text-white ${
                            service.feeMonths.includes(month)
                              ? "bg-sky-700 text-white"
                              : "bg-white text-sky-700"
                          }`}
                          onClick={() => handleMonthSelection(index, month)}
                        >
                          {month}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  {service.isFlagged && (
                    <div className="text-red-600">
                      The entered fee value is below the minimum required fee
                      for this service, please add note to help with
                      authorisation processing.
                    </div>
                  )}
                  <label
                    htmlFor={`comment-${index}`}
                    className="formInputLabel"
                  >
                    Note
                    {!COMMENT_REGEX.test(service?.comment) && (
                      <span className="text-red-600"> check your input</span>
                    )}
                    <textarea
                      type="text"
                      id={`comment-${index}`}
                      name="comment"
                      value={service?.comment}
                      onChange={(e) => handleAgreedServicesChange(index, e)}
                      className={`formInputText text-wrap`}
                      maxLength="150"
                    ></textarea>
                  </label>
                </div>

                {index !== 0 && (
                  <button
                    aria-label="remove service"
                    type="button"
                    onClick={() => removeAgreedService(index)}
                    className="delete-button w-full"
                  >
                    Remove Service
                  </button>
                )}
              </div>
            ))}
            {/* we should only add the number of services availble */}
            {formData.agreedServices.length <= servicesList.length && (
              <button
                aria-label="add service"
                type="button"
                onClick={addAgreedService}
                className="add-button w-full"
              >
                Add Another Service
              </button>
            )}

            {/* Submit Button */}
            <div className="cancelSavebuttonsDiv">
              <button
                type="button"
                className="cancel-button"
                onClick={handleCancel}
                aria-label="cancel admission"
              >
                Cancel
              </button>
              <button
                type="submit"
                aria-label="submit admission"
                disabled={!canSave || isUpdateLoading}
                className={"save-button"}
              >
                save
              </button>
            </div>
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
  }

  // if (noAdmissionStudents.length === 0) return <LoadingStateIcon />;
  //if (noAdmissionStudents.length) return content;
  return content;
};

export default EditAdmissionForm;
