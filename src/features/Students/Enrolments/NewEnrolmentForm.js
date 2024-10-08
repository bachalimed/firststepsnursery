import React, { useState, useEffect } from "react";

import { useSelector } from "react-redux"; // Assuming you're using Redux for state management
import { useNavigate } from "react-router-dom";
import Enrolments from "../Enrolments";
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
} from "../../../Components/lib/Utils/REGEX";
import { SERVICETYPES } from "../../../config/ServiceTypes";
import { MONTHS } from "../../../config/Months";
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
      //validEnrolmentDuration: formData?.enrolmentDuration !== "",
      //validEnrolmentStartDate: DATE_REGEX.test(formData?.enrolmentStartDate),
      //validEnrolmentEndDate: DATE_REGEX.test(formData?.enrolmentEndDate),
      validEnrolmentOperator: OBJECTID_REGEX.test(formData?.enrolmentOperator),
      validEnrolmentCreator: OBJECTID_REGEX.test(formData?.enrolmentCreator),
    });
  }, [formData]);

  // Reset form on success and redirect
  useEffect(() => {
    if (isEnrolmentSuccess) {
      setFormData({
        student: "",
        admission: "",
        enrolmentYear: "",
        enrolmentMonth: "",
        enrolmentCreator: "",
        enrolmentOperator: "",
        enrolments: [],
      });
      navigate("/students/enrolments/enrolments");
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
      console.log(studentServicesList, "studentServicesList");
      setFormData((prevData) => ({
        ...prevData,
        enrolments: services.map((service) => ({
          service: service.service,
          serviceType: service.serviceType,
          servicePeriod: service.servicePeriod,
          serviceAuthorisedFee: service.serviceAuthorisedFee,
          serviceFinalFee: service.serviceFinalFee,
        })),
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
    if (!checked) {
      setFormData((prevData) => ({
        ...prevData,
        enrolments: prevData.enrolments.filter(
          (enrolment) => enrolment.service !== serviceId
        ),
      }));
    } else {
      const selectedService = studentServicesList.find(
        (service) => service.service === serviceId
      );
      setFormData((prevData) => ({
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
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (canSave) {
      try {
        await addNewEnrolment(formData);
      } catch (err) {
        console.error("Failed to save the enrolment", err);
      }
    }
  };

  console.log(formData, "formData");

  const content = (
    <>
      <Enrolments />
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 shadow rounded-md"
      >
        <h2 className="text-xl font-bold">New Enrolment</h2>

        {/* Student Selection */}
        <div>
          <label
            htmlFor="student"
            className="block text-sm font-medium text-gray-700"
          >
            Student{" "}
            {!validity.validStudent && <span className="text-red-500">*</span>}
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
              <span className="text-red-500">*</span>
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
              <span className="text-red-500">*</span>
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
        {/* Enrolment Services */}
        <div>
          <h3 className="text-lg font-semibold">Services</h3>
          <div className="space-y-4 mt-4">
            {studentServicesList.map((service) => (
              <div key={service.service}>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      handleServiceToggle(service.service, e.target.checked)
                    }
                  />
                  <span className="ml-2">{service.serviceType}</span>
                  <span className="ml-2 text-gray-500">
                    ({service.servicePeriod})
                  </span>
                </label>
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Authorised Fee
                  </label>
                  <input
                    type="text"
                    value={service.serviceAuthorisedFee}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    disabled
                  />
                </div>
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Final Fee
                  </label>
                  <input
                    type="text"
                    value={
                      formData.enrolments.find(
                        (enrolment) => enrolment.service === service.service
                      )?.serviceFinalFee || ""
                    }
                    onChange={(e) =>
                      handleServiceChange(service.service, e.target.value)
                    }
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            disabled={!canSave}
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
          <div className="mt-4 text-red-500">
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
