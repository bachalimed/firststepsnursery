import React, { useState, useEffect } from "react";
import { useGetAdmissionsByYearQuery } from "./admissionsApiSlice";
import { useSelector } from "react-redux"; // Assuming you're using Redux for state management
import { useNavigate } from "react-router-dom";
import Students from "../Students";
import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
} from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import { useGetStudentsByYearQuery } from "../../Students/StudentsAndParents/Students/studentsApiSlice";
import { useGetServicesByYearQuery } from "../../AppSettings/StudentsSet/NurseryServices/servicesApiSlice";
import { useAddNewAdmissionMutation } from "./admissionsApiSlice";
import useAuth from "../../../hooks/useAuth";
import { selectAllAcademicYears } from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import { CurrencySymbol } from "../../../config/Currency";
import {
  FEE_REGEX,
  DATE_REGEX,
  COMMENT_REGEX,
  OBJECTID_REGEX,
} from "../../../config/REGEX";
import { MONTHS } from "../../../config/Months";
import { useOutletContext } from "react-router-dom";
import ConfirmationModal from "../../../Components/Shared/Modals/ConfirmationModal";
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

const NewAdmissionForm = () => {
  // initialising states
  const { isAdmin, userId } = useAuth();
  const navigate = useNavigate();
  const [
    addNewAdmission,
    {
      isLoading: isAdmissionLoading,
      isSuccess: isAdmissionSuccess,
      isError: isAdmissionError,
      error: admissionError,
    },
  ] = useAddNewAdmissionMutation();
  //academic years states
  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  const academicYears = useSelector(selectAllAcademicYears);

  const {
    data: students,
    isLoading: isStudentsLoading,
    isSuccess: isStudentsSuccess,
    isError: isStudentsError,
    error: studentsError,
  } = useGetStudentsByYearQuery(
    {
      // we will only import students that that have been registered for that year
      selectedYear: selectedAcademicYear?.title,
      endpointName: "NewAdmissionForm",
    } || {},
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  const {
    data: admissions, //the data is renamed admissions
    isLoading: isAdmissionGetLoading,
    isSuccess: isAdmissionGetSuccess,
    isError: isAdmissionGetError,
    error: admissionGetError,
  } = useGetAdmissionsByYearQuery(
    {
      selectedYear: selectedAcademicYear?.title,
      endpointName: "NewAdmissionForm",
    } || {},
    {
      pollingInterval: 60000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  const admissionsList = isAdmissionGetSuccess
    ? Object.values(admissions.entities)
    : [];
  const {
    data: services,
    isLoading: isServicesLoading,
    isSuccess: isServicesSuccess,
    isError: isServicesError,
    error: servicesError,
  } = useGetServicesByYearQuery(
    {
      selectedYear: selectedAcademicYear?.title,
      endpointName: "NewAdmissionForm",
    } || {},
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  //confirmation Modal states
  const [showConfirmation, setShowConfirmation] = useState(false);
  // Local state for form data
  const [formData, setFormData] = useState({
    student: "",
    admissionYear: "",
    admissionDate: "",
    agreedServices: [
      {
        service: "",
        feeValue: "",
        feePeriod: "",
        feeStartDate: "",
        feeEndDate: "",
        feeMonths: [], //added recently
        isFlagged: false,
        //authorisedBy:"", it will generate error in mongo if ""
        comment: "",
      },
    ],
    admissionCreator: userId, // Set to the logged-in user id
    admissionOperator: userId, // Set to the operator id
  });

  // Convert data into array format for dropdowns add only students with no admission in their studentYears
  const studentsList = isStudentsSuccess
    ? Object.values(students.entities)
    : [];

  const [noAdmissionStudents, setNoAdmissionStudents] = useState([]);
  useEffect(() => {
    // retreive teh studetns that have no admissin in their studentYEars array under admission key
    //console.log(admissionsList,'admissionsList')
    setNoAdmissionStudents(
      studentsList.filter((student) =>
        student.studentYears.some(
          // (year) => !("admission" in year) || year.admission === ""
          (year) =>
            !admissionsList.some(
              (admission) => admission.id === year.admission
            ) ||
            year.admission === "" ||
            !year.admission
        )
      )
    );
  }, [isStudentsSuccess, isAdmissionGetSuccess]);
  console.log(noAdmissionStudents, "noAdmissionStudents");
  const servicesList = isServicesSuccess
    ? Object.values(services.entities)
    : [];

  // Set default admission service
  useEffect(() => {
    if (isServicesSuccess && formData.agreedServices[0].service === "") {
      const admissionService = servicesList.find(
        (service) => service.serviceType === "Admission"
      );
      if (admissionService) {
        setFormData((prevData) => ({
          ...prevData,
          agreedServices: [
            {
              ...prevData.agreedServices[0],
              service: admissionService.id,
            },
            ...prevData.agreedServices.slice(1),
          ],
        }));
      }
    }
  }, [isServicesSuccess]);

  const [admissionValidity, setAdmissionValidity] = useState([]);

  const handleInputChange = (index, field, value) => {
    const updatedServices = [...formData.agreedServices];

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

  // Validate services when debouncedFeeValue changes
  useEffect(() => {
    if (debouncedFeeValue) {
      const updatedServices = [...formData.agreedServices];
      validateService(updatedServices);
    }
  }, [debouncedFeeValue, formData.agreedServices]);

  const validateService = (services) => {
    const updatedValidity = services.map((service) => {
      const validService = OBJECTID_REGEX.test(service.service);
      const validFeePeriod = service.feePeriod !== "";
      const validFeeValue = FEE_REGEX.test(service.feeValue);
      const validFeeStartDate = DATE_REGEX.test(service.feeStartDate);
      const validComment = COMMENT_REGEX.test(service.comment);

      // Other validations...

      return {
        validService,
        validFeePeriod,
        validFeeValue,
        validFeeStartDate,
        validComment,

        // Other validity checks...
      };
    });

    // console.log(admissionValidity, "admissionvalidity");
    // Only set state if there is a change
    if (JSON.stringify(updatedValidity) !== JSON.stringify(admissionValidity)) {
      setAdmissionValidity(updatedValidity);
    }
  };

  //console.log(admissionValidity, "admissionValidity");
  const [primaryValidity, setPrimaryValidity] = useState({
    validStudent: OBJECTID_REGEX.test(formData.student),
    validAdmissionYear: formData.admissionYear !== "",
    validAdmissionDate: DATE_REGEX.test(formData.admissionDate),
  });

  useEffect(() => {
    setPrimaryValidity((prev) => ({
      ...prev,
      validStudent: OBJECTID_REGEX.test(formData.student),
      validAdmissionYear: formData.admissionYear !== "",
      validAdmissionDate: DATE_REGEX.test(formData.admissionDate),
    }));
  }, [formData.student, formData.admissionYear, formData.admissionDate]); // run whenever formData changes

  //console.log(primaryValidity, "primaryValidity");

  const handleAgreedServicesChange = (index, e) => {
    const { name, value, type, options } = e.target;
    const updatedServices = [...formData.agreedServices];

    if (type === "select-multiple" && name === "feeMonths") {
      // For multi-select (feeMonths), gather selected options into an array
      const selectedOptions = Array.from(options)
        .filter((option) => option.selected)
        .map((option) => option.value);
      updatedServices[index][name] = selectedOptions;
    } else {
      updatedServices[index][name] = value;
    }

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
          feeMonths: [],
          feeStartDate: "",
          feeEndDate: "",
          isFlagged: false,
          comment: "",
        },
      ],
    }));
  };
  const handleMonthSelection = (index, month) => {
    const updatedServices = [...formData.agreedServices];
    const currentMonths = updatedServices[index].feeMonths || [];

    if (currentMonths.includes(month)) {
      // Remove month if already selected
      updatedServices[index].feeMonths = currentMonths.filter(
        (selectedMonth) => selectedMonth !== month
      );
    } else {
      // Add month to selection
      updatedServices[index].feeMonths = [...currentMonths, month];
    }

    setFormData((prevData) => ({
      ...prevData,
      agreedServices: updatedServices,
    }));
  };

  const { triggerBanner } = useOutletContext(); // Access banner trigger
  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const handleConfirmSave = async () => {
    // Close the confirmation modal
    setShowConfirmation(false);
    try {
      const response = await addNewAdmission(formData).unwrap();
      // navigate("/students/admissions/admissions");
      if ((response.data && response.data.message) || response?.message) {
        // Success response
        triggerBanner(response?.data?.message || response?.message, "success");
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
      triggerBanner("Failed to add admission. Please try again.", "error");

      console.error("Error saving:", error);
    }
  };
  // Close the modal without saving
  const handleCloseModal = () => {
    setShowConfirmation(false);
  };
  useEffect(() => {
    if (isAdmissionSuccess) {
      //if the add of new user using the mutation is success, empty all the individual states and navigate back to the users list
      setFormData({
        student: "",
        admissionYear: "",
        admissionDate: "",
        agreedServices: [
          {
            service: "",
            feeValue: "",
            feeMonths: [],
            feePeriod: "",
            feeStartDate: "",
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
  }, [isAdmissionSuccess, navigate]); //even if no success it will navigate and not show any warning if failed or success

  // Function to filter available services based on previous selections

  const getAvailableServices = (index) => {
    const selectedServiceIds = formData.agreedServices
      .map((service, i) => (i !== index ? service.service : null))
      .filter((serviceId) => serviceId);

    return servicesList.filter(
      (service) => !selectedServiceIds.includes(service.id)
    );
  };

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

        // Only update state if `isFlagged` changes
        if (formData?.agreedServices[index]?.isFlagged !== isFlaggedNew) {
          setFormData((prevData) => ({
            ...prevData,
            agreedServices: prevData.agreedServices.map((serv, idx) =>
              idx === index
                ? { ...serv, isFlagged: isFlaggedNew } // Set new flag value
                : serv
            ),
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
  // const canSave =
  //   Object.values(admissionValidity).every(Boolean) && !isAdmissionLoading;

  const removeAgreedService = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      agreedServices: prevData.agreedServices.filter((_, idx) => idx !== index),
    }));
  };
  // For checking whether the form is valid
  const canSave =
    admissionValidity.length > 0 &&
    admissionValidity.every((validity) =>
      Object.values(validity).every(Boolean)
    ) &&
    Object.values(primaryValidity).every(Boolean) &&
    !isAdmissionLoading;
  const handleCancel = () => {
    navigate("/students/admissions/admissions/");
  };
  console.log(formData, "formData");
  const content = (
    <>
      <Students />

      {noAdmissionStudents?.length !== 0 ? (
        <form onSubmit={handleSubmit} className="form-container">
          <h2 className="formTitle">New Admission </h2>
          <div className="formSectionContainer">
            <h3 className="formSectionTitle">Admission Information</h3>
            <div className="formSection">
              <label htmlFor="student" className="formInputLabel">
                Student{" "}
                {!primaryValidity?.validStudent && (
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
                  className={`formInputText`}
                  required
                >
                  <option value="">Select Student</option>
                  {isStudentsSuccess &&
                    noAdmissionStudents.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.studentName?.firstName}{" "}
                        {student.studentName?.middleName}{" "}
                        {student.studentName?.lastName}
                      </option>
                    ))}
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
                    className={`formInputText`}
                    required
                  >
                    <option value="">Select Year</option>
                    <option
                      key={selectedAcademicYear?._id}
                      value={selectedAcademicYear?.title}
                    >
                      {selectedAcademicYear?.title}
                    </option>
                    {/* {academicYears.map((year) => (
              <option key={year._id} value={year.title}>
                {year.title}
              </option>
            ))} */}
                  </select>{" "}
                </label>

                {/* Admission Date Input */}

                <label htmlFor="admissionDate" className="formInputLabel">
                  Effective start{" "}
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
                    className={`formInputText`}
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
                    {index === 0 && "(default)"}
                    <select
                      aria-invalid={!admissionValidity[index]?.validService}
                      id={`service-${index}`}
                      name="service"
                      value={service.id}
                      onChange={(e) => handleAgreedServicesChange(index, e)}
                      className={`formInputText`}
                      disabled={index === 0} // Disable the first service since it's "Admission"
                      required
                    >
                      {index === 0 ? (
                        <option value="Admission">Admission</option>
                      ) : (
                        <>
                          <option value="">Select Service</option>
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
                      value={service.feePeriod}
                      onChange={(e) => handleAgreedServicesChange(index, e)}
                      className={`formInputText`}
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
                            } (anchor: ${value} ${CurrencySymbol})`}
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
                    Fee Value ({CurrencySymbol})
                    {!admissionValidity[index]?.validFeeValue && (
                      <span className="text-red-600">*</span>
                    )}
                    <input
                      aria-invalid={!admissionValidity[index]?.validFeeValue}
                      type="number"
                      id={`feeValue-${index}`}
                      name="feeValue"
                      value={service.feeValue}
                      placeholder="[$$$.$$]"
                      onChange={(e) => {
                        setFeeValue(e.target.value);
                        handleInputChange(index, "feeValue", e.target.value);
                      }}
                      className={`formInputText`}
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
                      value={service.feeStartDate}
                      onChange={(e) => handleAgreedServicesChange(index, e)}
                      placeholder="YYYY-MM-DD"
                      className={`formInputText`}
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
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-2">
                      {MONTHS?.map((month) => (
                        <button
                          aria-label="feeMonth"
                          id="feeMonth"
                          key={month}
                          type="button"
                          className={`px-4 py-2 border border-sky-600 rounded cursor-pointer transition-colors hover:bg-sky-500 hover:text-white ${
                            service.feeMonths.includes(month)
                              ? "bg-sky-600 text-white"
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

                {/* {index !== 0 && (
                          <div>
                            <label
                              htmlFor={`feeEndDate-${index}`}
                              className="formInputLabel"
                            >
                              Fee End Date
                            </label>
                            <input
                              type="date"
                              id={`feeEndDate-${index}`}
                              name="feeEndDate"
                              value={service.feeEndDate}
                              onChange={(e) => handleAgreedServicesChange(index, e)}
                              placeholder="YYYY-MM-DD"
                              className={`formInputText`}
                            />
                          </div>
                        )} */}

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
                      placeholder="[1-150 characters]"
                      value={service.comment}
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
                type="button"
                onClick={addAgreedService}
                className="add-button w-full"
                aria-label="add service"
              >
                Add Another Service
              </button>
            )}

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                className={"cancel-button"}
                onClick={handleCancel}
                aria-label="cancel admission"
              >
                Cancel
              </button>
              <button
                className={"save-button"}
                type="submit"
                aria-label="submit admission"
                disabled={!canSave || isAdmissionLoading}
              >
                save
              </button>
            </div>
          </div>
        </form>
      ) : (
        "No new Students for admission available"
      )}
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

  //if (noAdmissionStudents.length === 0) return <LoadingStateIcon />;
  //if (noAdmissionStudents.length) return content;
  return content;
};

export default NewAdmissionForm;
