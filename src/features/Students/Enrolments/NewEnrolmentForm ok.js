import React, { useState, useEffect } from "react";

import { useSelector } from "react-redux"; // Assuming you're using Redux for state management
import { useNavigate } from "react-router-dom";
import Students from "../Students";
import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
} from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import {
  useGetStudentsQuery,
  useGetStudentsByYearQuery,
} from "../StudentsAndParents/Students/studentsApiSlice";
import { useGetServicesByYearQuery } from "../../AppSettings/StudentsSet/NurseryServices/servicesApiSlice";
import { useAddNewEnrolmentMutation } from "./enrolmentsApiSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { ROLES } from "../../../config/UserRoles";
import { ACTIONS } from "../../../config/UserActions";
import useAuth from "../../../hooks/useAuth";
import LoadingStateIcon from "../../../Components/LoadingStateIcon";
import { useGetAcademicYearsQuery } from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsApiSlice";
import { selectAllAcademicYears } from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";

import {
  FEE_REGEX,
  DATE_REGEX,
  COMMENT_REGEX,
  OBJECTID_REGEX,
} from "../../../config/REGEX";
import { SERVICETYPES } from "../../../config/SchedulerConsts";
import { MONTHS } from "../../../config/Months";
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

  const {
    data: students,
    isLoading: isStudentsLoading,
    isSuccess: isStudentsSuccess,
  } = useGetStudentsByYearQuery(
    {
      selectedYear: selectedAcademicYear?.title,
      criteria: "withAdmission",
      endpointName: "studentsList",
    },
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  // State for form data and validity
  const [formData, setFormData] = useState({
    student: "",
    admission: "",
    enrolmentYear: "",
    enrolmentMonth: "",
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
  console.log(
    isEnrolmentSuccess,
    "isEnrolmentSuccess Enrolment added successfully111"
  );
  useEffect(() => {
    if (isEnrolmentSuccess) {
      // Log or inspect the response here if needed
      console.log(
        isEnrolmentSuccess,
        "isEnrolmentSuccess Enrolment added successfully222"
      );

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

  // List for dropdowns
  const studentsList = isStudentsSuccess
    ? Object.values(students.entities)
    : [];

  console.log(studentsList, "studentsList");
  const canSave = Object.values(validity).every(Boolean) && !isEnrolmentLoading;

  // Function to get services for the selected student, filtered by feeMonth
  const getServicesFromList = () => {
    const student = studentsList.find(
      (student) => student.id === formData?.student
    );

    if (student?.admissionDetails?.agreedServices) {
      return student.admissionDetails?.agreedServices
        ?.filter((service) =>
          service?.feeMonths?.includes(formData.enrolmentMonth)
        )
        .map((service) => ({
          serviceType: service.serviceDetails.serviceType,
          service: service.serviceDetails._id,
          servicePeriod: service.feePeriod,
          serviceAuthorisedFee: service.feeValue,
          serviceFinalFee: service.feeValue,
        }));
    }
    return [];
  };

  const [studentServicesList, setStudentServicesList] = useState([]);

  // Populate services by default when enrolmentMonth or student changes
  useEffect(() => {
    const services = getServicesFromList();
    if (services.length) {
      setStudentServicesList(services);

      // Update formData with unique enrolments based on services
      const uniqueEnrolments = services.reduce((acc, service) => {
        const exists = acc.some(
          (enrolment) => enrolment.service === service.service
        );
        if (!exists) {
          acc.push({
            service: service.service,
            serviceType: service.serviceType,
            servicePeriod: service.servicePeriod,
            serviceAuthorisedFee: service.serviceAuthorisedFee,
            serviceFinalFee: service.serviceFinalFee,
          });
        }
        return acc;
      }, []);

      setFormData((prevData) => ({
        ...prevData,
        enrolments: uniqueEnrolments,
      }));
    }
  }, [formData.student, formData.enrolmentMonth]);

  // Function to handle service final fee changes
  const handleServiceChange = (serviceId, finalFee) => {
    setFormData((prevData) => {
      const updatedEnrolments = prevData.enrolments.map((enrolment) =>
        enrolment.service === serviceId
          ? { ...enrolment, serviceFinalFee: finalFee }
          : enrolment
      );
      return { ...prevData, enrolments: updatedEnrolments };
    });
  };

  // Function to toggle services
  const handleServiceToggle = (serviceId, checked) => {
    const selectedService = studentServicesList.find(
      (service) => service.service === serviceId
    );

    if (checked) {
      // Only add if it's not already in the formData
      setFormData((prevData) => {
        const exists = prevData.enrolments.some(
          (enrolment) => enrolment.service === selectedService.service
        );
        if (!exists) {
          return {
            ...prevData,
            enrolments: [
              ...prevData.enrolments,
              {
                service: selectedService.service,
                serviceType: selectedService.serviceType,
                servicePeriod: selectedService.servicePeriod,
                serviceAuthorisedFee: selectedService.serviceAuthorisedFee,
                serviceFinalFee: selectedService.serviceFinalFee,
              },
            ],
          };
        }
        return prevData; // Do nothing if it already exists
      });
    } else {
      // Remove the service from enrolments
      setFormData((prevData) => ({
        ...prevData,
        enrolments: prevData.enrolments.filter(
          (enrolment) => enrolment.service !== serviceId
        ),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (canSave) {
      try {
        await addNewEnrolment(formData);
        navigate("/students/enrolments/enrolments/");
      } catch (err) {
        console.error("Failed to save the enrolment", err);
      }
    }
  };

  console.log(formData, "formData");

  const content = (
    <>
      <Students />
      <form onSubmit={handleSubmit} className="form-container">
        <h2 className="text-xl font-bold">New Enrolment</h2>

        {/* Student Selection */}
        <div>
          <label
            htmlFor="student"
            className="block text-sm font-medium text-gray-700"
          >
            Student{" "}
            {!validity.validStudent && <span className="text-red-600">*</span>}
          </label>
          <select
            id="student"
            name="student"
            value={formData.student}
            onChange={(e) => {
              const selectedStudent = studentsList.find(
                (student) => student.id === e.target.value
              );
              setFormData({
                ...formData,
                student: e.target.value,
                admission: selectedStudent?.admission,
              });
            }}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select Student</option>
            {isStudentsSuccess &&
              studentsList.map((student) => (
                <option key={student.id} value={student.id}>
                  {`${student.studentName?.firstName} ${
                    student.studentName?.middleName || ""
                  } ${student.studentName?.lastName}`}
                </option>
              ))}
          </select>
        </div>

        {/* Enrolment Year */}
        <div>
          <label
            htmlFor="enrolmentYear"
            className="block text-sm font-medium text-gray-700"
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
            disabled={!formData?.student}
          >
            <option value="">Select Enrolment Year</option>
            <option
              value={
                studentsList.find((student) => student.id === formData.student)
                  ?.admissionDetails?.admissionYear
              }
            >
              {
                studentsList.find((student) => student.id === formData.student)
                  ?.admissionDetails?.admissionYear
              }
            </option>
          </select>
        </div>

        {/* Enrolment Month */}
        <div>
          <label
            htmlFor="enrolmentMonth"
            className="block text-sm font-medium text-gray-700"
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
            disabled={!formData?.student}
          >
            <option value="">Select Enrolment Month</option>
            {MONTHS.map((month, index) => (
              <option key={index} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
        {/* enrolment note */}
        <div>
          <label
            htmlFor="enrolmentNote"
            className="block text-sm font-medium text-gray-700"
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
          <legend className="block text-sm font-medium text-gray-700">
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
                  <label htmlFor={service.service}>{service.serviceType}</label>

                  {/* Display Authorized Fee and Service Period */}
                  <span className="ml-4">
                    Authorized Fee: ${service.serviceAuthorisedFee}
                  </span>
                  <span className="ml-4">Period: {service.servicePeriod}</span>

                  {/* Service final fee input */}
                  {isChecked && (
                    <input
                      type="number"
                      value={
                        formData.enrolments.find(
                          (enrolment) => enrolment.service === service.service
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

        <div className="flex justify-end mt-6">
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
    </>
  );

  return content;
};

export default NewEnrolmentForm;
