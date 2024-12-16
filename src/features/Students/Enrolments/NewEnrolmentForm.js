import React, { useState, useEffect } from "react";
import { useGetAdmissionsByYearQuery } from "../Admissions/admissionsApiSlice";
import { useSelector } from "react-redux"; // Assuming you're using Redux for state management
import { useNavigate } from "react-router-dom";
import Students from "../Students";
import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
} from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import ConfirmationModal from "../../../Components/Shared/Modals/ConfirmationModal";
import { useAddNewEnrolmentMutation } from "./enrolmentsApiSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { ROLES } from "../../../config/UserRoles";
import { ACTIONS } from "../../../config/UserActions";
import useAuth from "../../../hooks/useAuth";
import LoadingStateIcon from "../../../Components/LoadingStateIcon";
import { useOutletContext } from "react-router-dom";
import { selectAllAcademicYears } from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import { MONTHS } from "../../../config/Months";
import {
  FEE_REGEX,
  DATE_REGEX,
  COMMENT_REGEX,
  OBJECTID_REGEX,
} from "../../../config/REGEX";
import { SERVICETYPES } from "../../../config/SchedulerConsts";
import { CurrencySymbol } from "../../../config/Currency";
//import { MONTHS } from "../../../config/Months";
const NewEnrolmentForm = () => {
  // State and hooks initialization
  const { isAdmin, userId } = useAuth();
  const navigate = useNavigate();

  const [
    addNewEnrolment,
    {
      isEnrolmentLoading,
      isEnrolmentSuccess,
      isEnrolmentError,
      enrolmentError,
    },
  ] = useAddNewEnrolmentMutation();

  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId);
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  );
  const academicYears = useSelector(selectAllAcademicYears);
  //confirmation Modal states
  const [showConfirmation, setShowConfirmation] = useState(false);
  //the list of studetns with their admissions was filtered inteh backend and removed the months that are already enrolled for
  const {
    data: admissions, //the data is renamed admissions
    isLoading: isAdmissionLoading,
    isSuccess: isAdmissionSuccess,
    isError: isAdmissionError,
    error: admissionError,
  } = useGetAdmissionsByYearQuery(
    {
      selectedYear: selectedAcademicYear?.title,
      criteria: "noEnrolments",
      endpointName: "NewEnrolmentForm",
    } || {},
    {
      pollingInterval: 60000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  let noEnrolmentStudentsList = [];
  // List for dropdowns
  // const studentsList = isStudentsSuccess
  // ? Object.values(students.entities)
  // : [];

  // console.log(studentsList, "studentsList");

  if (isAdmissionSuccess) {
    //set to the state to be used for other component s and edit enrolment component
    const { entities } = admissions;
    //we need to change into array to be read??
    noEnrolmentStudentsList = Object.values(entities); //got the studtnlisty from admission, nounerolled criteria
  }
  //return curretn month in english langauge
  const getCurrentMonthName = () => {
    const date = new Date();
    return date
      .toLocaleString("en-US", { month: "long" })
      .replace(/^./, (str) => str.toUpperCase());
  };

  // State for form data and validity
  const [formData, setFormData] = useState({
    student: "",
    admission: "",
    enrolmentYear: selectedAcademicYear?.title || "",
    enrolmentMonth: getCurrentMonthName() || "",
    enrolmentNote: "",

    enrolmentCreator: userId,
    enrolmentOperator: userId,
    enrolments: [
      {
        service: "",
        serviceType: "",
        servicePeriod: "",
        serviceAuthorisedFee: "",
        serviceFinalFee: "",

        //enrolmentDuration: "",
        //enrolmentStartDate: "",
        //enrolmentEndDate: "",
      },
    ],
  });
  const [noEnrolmentMonthStudentsList, setNoEnrolmentMonthStudentsList] =
    useState([]);
  const [studentServicesList, setStudentServicesList] = useState([]); //will hold update of service for selected studetn
  const [validity, setValidity] = useState({
    validStudent: false,
    validService: false,
    validAdmission: false,
    validEnrolmentYear: false,
    validEnrolmentMonth: false,
    validEnrolmentNote: false,
    validEnrolmentOperator: false,
    validEnrolmentCreator: false,
  });

  // Function to get services for the selected student and month
  const getServicesFromList = (studentId, month) => {
    //console.log(studentId,"studentId", month,'month')
    const selectedStudent = noEnrolmentStudentsList.find(
      (student) => student.student._id === studentId
    );

    if (selectedStudent?.agreedServices) {
      return selectedStudent.agreedServices
        .filter((service) => service.feeMonths.includes(month))
        .map((service) => ({
          serviceType: service.service.serviceType,
          service: service.service._id,
          servicePeriod: service.feePeriod,
          serviceAuthorisedFee: service.feeValue,
          serviceFinalFee: service.feeValue,
        }));
    }
    return [];
  };

  useEffect(() => {
    if (isEnrolmentSuccess) {
      // Reset the form data
      setFormData({
        student: "",
        admission: "",
        enrolmentYear: "",
        enrolmentMonth: "",
        enrolmentNote: "",
        enrolmentCreator: "",
        enrolmentOperator: "",
        enrolments: [],
      });

      // Navigate to the enrolments page
      navigate("/students/enrolments/enrolments/");
    }
  }, [isEnrolmentSuccess, navigate]);

  console.log(studentServicesList, "studentServicesList");
  // Form Validation using regex
  useEffect(() => {
    setValidity({
      validStudent: OBJECTID_REGEX.test(formData?.student),
      validService: formData.enrolments.some((enrolment) =>
        OBJECTID_REGEX.test(enrolment?.service)
      ),
      validAdmission: OBJECTID_REGEX.test(formData?.admission),
      //validServicePeriod: formData?.servicePeriod !== "",
      //validServiceAuthorisedFee: formData?.serviceAuthorisedFee !== "",
      //validServiceFinalFee: formData?.serviceFinalFee !== "",
      validEnrolmentYear: formData?.enrolmentYear !== "",
      validEnrolmentMonth: formData?.enrolmentMonth !== "",
      validEnrolmentNote: COMMENT_REGEX.test(formData?.enrolmentNote),
      //validEnrolmentDuration: formData?.enrolmentDuration !== "",
      //validEnrolmentStartDate: DATE_REGEX.test(formData?.enrolmentStartDate),
      //validEnrolmentEndDate: DATE_REGEX.test(formData?.enrolmentEndDate),
      validEnrolmentOperator: OBJECTID_REGEX.test(formData?.enrolmentOperator),
      validEnrolmentCreator: OBJECTID_REGEX.test(formData?.enrolmentCreator),
    });
  }, [formData]);
  const canSave = Object.values(validity).every(Boolean) && !isEnrolmentLoading;

  // Populate services list when the enrolment month or student changes
  useEffect(() => {
    if (formData.student && formData.enrolmentMonth) {
      const services = getServicesFromList(
        formData.student,
        formData.enrolmentMonth
      );

      setFormData((prevData) => ({
        ...prevData,
        enrolments: services.map((service) => ({
          ...service,
          serviceFinalFee: service.serviceFinalFee,
        })),
      }));

      setStudentServicesList(services);
    }

    //update teh list so we only have studetn with no enrolment for that selected enrolment month
    const filteredList = noEnrolmentStudentsList.filter((student) =>
      student.agreedServices.some(
        (
          service /////put .some to make sure if any of the agredservice has the month, it will not be excluded
        ) => service.feeMonths.includes(formData.enrolmentMonth)
      )
    );
    setNoEnrolmentMonthStudentsList(filteredList);
    console.log(noEnrolmentMonthStudentsList, "noEnrolmentMonthStudentsList");
  }, [formData.student, formData.enrolmentMonth, isEnrolmentSuccess]);

  // Handle toggling services in the form
  const handleServiceToggle = (serviceId, checked) => {
    const selectedService = studentServicesList.find(
      (service) => service.service === serviceId
    );

    if (checked) {
      setFormData((prevData) => {
        const exists = prevData.enrolments.some(
          (enrolment) => enrolment.service === serviceId
        );
        return exists
          ? prevData
          : {
              ...prevData,
              enrolments: [...prevData.enrolments, { ...selectedService }],
            };
      });
    } else {
      setFormData((prevData) => ({
        ...prevData,
        enrolments: prevData.enrolments.filter(
          (enrolment) => enrolment.service !== serviceId
        ),
      }));
    }
  };

  // useEffect(() => {
  // Update the noEnrolmentMonthStudentsList based on selected enrolmentMonth

  //     const filteredStudents = noEnrolmentStudentsList.filter(student =>
  //       student.agreedServices.some(service =>
  //         service.feeMonths.includes(formData?.enrolmentMonth)
  //       )
  //     );
  //     setNoEnrolmentMonthStudentsList(filteredStudents);

  // }, [formData.enrolmentMonth, noEnrolmentStudentsList]);

  //console.log(noEnrolmentMonthStudentsList, "noEnrolmentMonthStudentsList");
  // Handle changes to final fee for a specific service
  const handleServiceChange = (serviceId, finalFee) => {
    setFormData((prevData) => ({
      ...prevData,
      enrolments: prevData.enrolments.map((enrolment) =>
        enrolment.service === serviceId
          ? { ...enrolment, serviceFinalFee: finalFee }
          : enrolment
      ),
    }));
  };

  const { triggerBanner } = useOutletContext(); // Access banner trigger
  const handleSubmit = async (e) => {
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
      const response = await addNewEnrolment(formData);
      navigate("/students/enrolments/enrolments/");
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
      triggerBanner("Failed to add enrolment. Please try again.", "error");

      console.error("Error saving:", error);
    }
  };

  // Close the modal without saving
  const handleCloseModal = () => {
    setShowConfirmation(false);
  };
  console.log(formData, "formData");
  console.log(noEnrolmentStudentsList[0], "noEnrolmentStudentsList[0]");

  const content = (
    <>
      <Students />
      <form onSubmit={handleSubmit} className="form-container">
        <h2 className="text-xl font-bold">New Enrolment</h2>
        {/* Enrolment Year*/}
        Enrolment Year
        <div>
          <label
            htmlFor="enrolmentYear"
             className="formInputLabel"
          >
            Enrolment Year{" "}
            {!validity.validEnrolmentYear && (
              <span className="text-red-600">*</span>
            )}
          </label>
          <select
            id="enrolmentYear"
            name="enrolmentYear"
            value={formData.enrolmentYear}
            onChange={(e) =>
              setFormData({ ...formData, enrolmentYear: e.target.value })
            }
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          >
            {/* <option value="">Select Enrolment Year</option> */}
            <option value={selectedAcademicYear?.title}>
              {selectedAcademicYear.title}
            </option>
          </select>
        </div>
        {/* Enrolment Month */}
        <div>
          <label
            htmlFor="enrolmentMonth"
             className="formInputLabel"
          >
            Enrolment Month{" "}
            {!validity.validEnrolmentMonth && (
              <span className="text-red-600">*</span>
            )}
          </label>
          <select
            id="enrolmentMonth"
            name="enrolmentMonth"
            value={formData.enrolmentMonth}
            onChange={(e) =>
              setFormData({ ...formData, enrolmentMonth: e.target.value })
            }
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
            disabled={!formData?.enrolmentYear}
          >
            {/* <option value="">Select Enrolment Month</option> */}
            {MONTHS.map((month, index) => (
              <option key={index} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
        {noEnrolmentMonthStudentsList?.length ? (
          <div>
            {/* Student Selection */}
            <div>
              <label
                htmlFor="student"
                 className="formInputLabel"
              >
                Student{" "}
                {!validity.validStudent && (
                  <span className="text-red-600">*</span>
                )}
              </label>
              <select
                id="student"
                name="student"
                value={formData.student}
                onChange={(e) => {
                  const selectedStudent = noEnrolmentMonthStudentsList.find(
                    (student) => student.student._id === e.target.value
                  );
                  //console.log('hello', selectedStudent)
                  setFormData({
                    ...formData,
                    student: e.target.value,
                    admission: selectedStudent?.id, //the list is originally admissions so id is for admission
                  });
                }}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                required
                disabled={!formData?.enrolmentMonth}
              >
                <option value="">Select Student</option>
                {isAdmissionSuccess &&
                  noEnrolmentMonthStudentsList.map((student) => (
                    <option
                      key={student.student._id}
                      value={student.student._id}
                    >
                      {`${student.student.studentName?.firstName} ${
                        student.student.studentName?.middleName || ""
                      } ${student.student.studentName?.lastName}`}
                    </option>
                  ))}
              </select>
            </div>
            {/* enrolment note */}
            <div>
              <label
                htmlFor="enrolmentNote"
                 className="formInputLabel"
              >
                Enrolment Note
              </label>
              <textarea
                id="enrolmentNote"
                name="enrolmentNote"
                value={formData.enrolmentNote}
                onChange={(e) =>
                  setFormData({ ...formData, enrolmentNote: e.target.value })
                }
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                rows="4" // Adjust the number of rows as needed
                placeholder="Enter any additional notes here..."
              />
            </div>
            {/* Services Section */}
            <fieldset>
              <legend  className="formInputLabel">
                Services
              </legend>
              <div className="mt-4 space-y-4">
                {studentServicesList.map((service) => {
                  const isChecked = formData.enrolments.some(
                    (enrolment) => enrolment.service === service.service
                  );

                  return (
                    <div key={service.service} className="flex items-center">
                      <input
                        type="checkbox"
                        id={service.service}
                        checked={isChecked}
                        onChange={(e) =>
                          handleServiceToggle(service.service, e.target.checked)
                        }
                        className="mr-2"
                      />
                      <label htmlFor={service.service}>
                        {service.serviceType}
                      </label>
                      <span className="ml-4">
                        Authorized Fee: {service.serviceAuthorisedFee}{" "}
                        {`${CurrencySymbol}`}
                      </span>
                      <span className="ml-4">
                        Period: {service.servicePeriod}
                      </span>
                      {isChecked && (
                        <input
                          type="number"
                          value={
                            formData.enrolments.find(
                              (enrolment) =>
                                enrolment.service === service.service
                            )?.serviceFinalFee || ""
                          }
                          onChange={(e) =>
                            handleServiceChange(service.service, e.target.value)
                          }
                          className="ml-4 border rounded-md p-1"
                          placeholder="Final Fee"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </fieldset>
          </div>
        ) : (
          <div>{`No enrolments available to add for ${formData?.enrolmentMonth}`}</div>
        )}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate("/students/enrolments/enrolments")}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!canSave || isEnrolmentLoading}
            className={`flex items-center px-4 py-2 text-white rounded-md ${
              canSave ? "bg-blue-600" : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            <FontAwesomeIcon icon={faSave} className="mr-2" />
            Save
          </button>
        </div>
        {/* Error message display */}
        {isEnrolmentError && (
          <div className="mt-4 text-red-600">
            <p>
              {enrolmentError?.data?.message ||
                "Failed to save the enrolment. Please try again."}
            </p>
          </div>
        )}
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

export default NewEnrolmentForm;
