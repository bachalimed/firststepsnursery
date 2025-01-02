import React, { useState, useEffect } from "react";

import { useSelector } from "react-redux"; // Assuming you're using Redux for state management
import { useNavigate } from "react-router-dom";
import Students from "../Students";
import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
} from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import {
  useGetStudentsByYearQuery,
} from "../../Students/StudentsAndParents/Students/studentsApiSlice";
import { useGetServicesByYearQuery } from "../../AppSettings/StudentsSet/NurseryServices/servicesApiSlice";
import { useAddNewAdmissionMutation } from "./admissionsApiSlice";
import useAuth from "../../../hooks/useAuth";
import { selectAllAcademicYears } from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import {
  OBJECTID_REGEX,
  DATE_REGEX,
  FEE_REGEX,
  COMMENT_REGEX,
} from "../../../Components/lib/Utils/REGEX";
//constrains on inputs when creating new user

const NewAdmissionForm = () => {
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

  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  const academicYears = useSelector(selectAllAcademicYears);
  // Local state for form data
  const [formData, setFormData] = useState({
    student: "",
    admissionYear: "",
    admissionDate: "",
    agreedServices: [
      {
        service: "",
        feeValue: null,
        feePeriod: "",
        feeStartDate: "",

        isFlagged: false,
        //authorisedBy:"", it will generate error in mongo if ""
        comment: "",
      },
    ],
    admissionCreator: userId, // Set to the logged-in user id
    admissionOperator: userId, // Set to the operator id
  });
  const {
    data: students, //the data is renamed students
    isLoading: isStudentsLoading,
    isSuccess: isStudentsSuccess,
    isError: isStudentsError,
    error: studentsError,
  } = useGetStudentsByYearQuery(
    {
      selectedYear: selectedAcademicYear?.title,
      endpointName: "NewAdmissionForm",
    } || {},
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

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

  // Convert data into array format for dropdowns
  const studentsList = isStudentsSuccess
    ? Object.values(students.entities)
    : [];
  const servicesList = isServicesSuccess
    ? Object.values(services.entities)
    : [];

  const [validity, setValidity] = useState({
    validStudent: false,
    validAdmissionYear: false,
    validAdmissionDate: false,
    validService: false,
    validFeeValue: false,
    validFeePeriod: false,
    validFeeStartDate: false,
    validComment: false,
  });
  // Validate form inputs on every state change
  useEffect(() => {
    setValidity({
      validStudent: OBJECTID_REGEX.test(formData.student),
      validAdmissionYear: formData.serviceYear !== "",
      validAdmissionDate: DATE_REGEX.test(formData.admissionDate),
      validService: OBJECTID_REGEX.test(formData.agreedServices[0].service),
      validFeePeriod: formData.agreedServices[0].feePeriod !== "",
      validFeeValue: FEE_REGEX.test(formData.agreedServices[0].feeValue),
      validFeeStartDate: DATE_REGEX.test(
        formData.agreedServices[0].feeStartDate
      ),
      validComment: COMMENT_REGEX.test(formData.agreedServices[0].comment),
    });
  }, [formData]);

  console.log(
    validity.validStudent,
    validity.validAdmissionYear,
    validity.validAdmissionDate,
    validity.validService,
    "feevalue:",
    validity.validFeeValue,
    validity.validFeePeriod,
    "feestart:",
    validity.validFeeStartDate
  );

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Function to handle agreed fees check and set ISFlag if necessary
  const handleAgreedServicesCheck = () => {
    // Find the selected service from servicesList
    const selectedService = servicesList.find(
      (service) => service.id === formData?.agreedServices[0]?.service
    );

    //console.log(selectedService, 'selected service');

    if (selectedService?.serviceAnchor) {
      //const agreedFee = formData?.agreedServices[0]?.feeValue; // Get agreed fee value
      //const agreedServicePeriod = formData?.agreedServices[0]?.feePeriod; // Get agreed service period

      //console.log(agreedFee, 'agreed fee');
      //console.log(agreedServicePeriod, 'agreed service period');

      // Check if the agreed service period exists in serviceAnchor
      if (
        formData?.agreedServices[0]?.feePeriod &&
        selectedService.serviceAnchor.oneTimeOff
      ) {
        const serviceAnchorValue = selectedService.serviceAnchor.oneTimeOff; // Get the corresponding serviceAnchor value
        //console.log(serviceAnchorValue, 'service anchor value');

        // If the agreedFee is less than the serviceAnchor value, set isFlagged to true
        if (
          parseFloat(formData?.agreedServices[0]?.feeValue) <
          parseFloat(serviceAnchorValue)
        ) {
          setFormData((prevData) => ({
            ...prevData,
            agreedServices: prevData.agreedServices.map((fee, index) =>
              index === 0 // If there's only one agreedFee entry
                ? { ...fee, isFlagged: true }
                : fee
            ),
          }));
        } else {
          // Optionally, reset the flag if the agreedFee is not less
          setFormData((prevData) => ({
            ...prevData,
            agreedServices: prevData.agreedServices.map((fee, index) =>
              index === 0 ? { ...fee, isFlagged: false } : fee
            ),
          }));
        }
      }
    }
  };

  // Call handleAgreedServicesCheck whenever agreedServices or service selection changes
  useEffect(() => {
    handleAgreedServicesCheck();
  }, [formData.agreedServices[0]?.feeValue]);

  // Handle changes for agreed fees array
  const handleAgreedServicesChange = (index, e) => {
    const { name, value } = e.target;
    const updatedFees = [...formData.agreedServices];
    updatedFees[index][name] = value;

    setFormData((prevData) => ({
      ...prevData,
      agreedServices: updatedFees,
    }));
  };
  // Add new agreed fee
  const addAgreedFee = () => {
    setFormData((prevData) => ({
      ...prevData,
      agreedServices: [
        ...prevData.agreedServices,
        {
          service: "",
          feeValue: 0,
          feePeriod: "",
          feeStartDate: "",
          feeEndDate: "",
          isFlagged: false,
          //authorisedBy:"", it will generate error in mongo if ""
          comment: "",
        },
      ],
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addNewAdmission(formData).unwrap();
      //alert("Admission created successfully!");
      navigate("/students/admissions/admissions"); // Navigate to admissions list or another page
    } catch (error) {
      console.error("Error submitting form", error);
    }
  };

  // Find service by ID and return the serviceAnchor keys
  const getServiceAnchorKeys = (serviceId) => {
    const selectedService = servicesList.find(
      (service) => service.id === serviceId
    );
    // console.log(servicesList,'servicesList servicesList')
    // console.log(serviceId,'serviceId serviceId')
    // console.log(selectedService,'selected service')
    return selectedService ? Object.keys(selectedService.serviceAnchor) : [];
  };
  const canSave = Object.values(validity).every(Boolean) && !isAdmissionLoading;
  console.log(formData, "formdata");
  return (
    <>
      <Students />
      <form onSubmit={handleSubmit} className="form-container">
        <h2 className="text-xl font-bold">New Admission</h2>

        {/* Student Dropdown */}
        <div>
          <label
            htmlFor="student"
             className="formInputLabel"
          >
            Student
          </label>
          <select
            id="student"
            name="student"
            value={formData.student}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select Student</option>
            {studentsList.map((student) => (
              <option key={student.id} value={student.id}>
                {student.studentName?.firstName}{" "}
                {student.studentName?.middleName}{" "}
                {student.studentName?.lastName}
              </option>
            ))}
          </select>
        </div>

        {/* Admission Year Dropdown */}
        <div>
          <label
            htmlFor="admissionYear"
             className="formInputLabel"
          >
            Admission Year
          </label>
          <select
            id="admissionYear"
            name="admissionYear"
            value={formData.admissionYear}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select Year</option>

            <option
              key={selectedAcademicYear?._id}
              value={selectedAcademicYear?.title}
            >
              {selectedAcademicYear?.title}
            </option>
          </select>
        </div>

        {/* Admission Date */}
        <div>
          <label
            htmlFor="admissionDate"
             className="formInputLabel"
          >
            Admission Date
          </label>
          <input
            type="date"
            id="admissionDate"
            name="admissionDate"
            value={formData.admissionDate}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Agreed Fees */}
        <div>
          <h3 className="text-lg font-semibold">Agreed Services</h3>
          {formData.agreedServices.map((fee, index) => (
            <div
              key={index}
              className="space-y-2 p-4 bg-gray-100 rounded-md mb-4"
            >
              {/* Service Dropdown */}

              <div>
                <label
                  htmlFor={`service-${index}`}
                   className="formInputLabel"
                >
                  Service
                </label>
                <select
                  id={`service-${index}`}
                  name="service"
                  value={fee.service}
                  onChange={(e) => handleAgreedServicesChange(index, e)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select Service</option>
                  {servicesList.map((service) => (
                    //  (service.serviceType==="Admission")&&
                    //(selectedServiceIds)&&
                    <option key={service.id} value={service.id}>
                      {service.serviceType}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fee Period */}
              <div>
                <label
                  htmlFor={`feePeriod-${index}`}
                   className="formInputLabel"
                >
                  Periodicity
                </label>

                <select
                  id={`feePeriod-${index}`}
                  name="feePeriod"
                  value={fee.feePeriod}
                  onChange={(e) => handleAgreedServicesChange(index, e)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select Period</option>
                  {/* Ensure the correct serviceAnchor object is passed */}
                  {servicesList.find(
                    (service) =>
                      service.id === formData?.agreedServices[0]?.service
                  )?.serviceAnchor &&
                    Object.entries(
                      servicesList.find(
                        (service) =>
                          service.id === formData?.agreedServices[0]?.service
                      )?.serviceAnchor
                    ).map(([periodKey, value]) => (
                      <option key={periodKey} value={periodKey}>
                        {`${
                          periodKey.charAt(0).toUpperCase() + periodKey.slice(1)
                        } (anchor: ${value})`}
                      </option>
                    ))}
                </select>
              </div>

              {/* Fee Value */}
              <div>
                <label
                  htmlFor={`feeValue-${index}`}
                   className="formInputLabel"
                >
                  Fee Value
                </label>
                <input
                  type="number"
                  id={`feeValue-${index}`}
                  name="feeValue"
                  value={fee.feeValue}
                  onChange={(e) => handleAgreedServicesChange(index, e)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              {/* Comment Input Field */}

              <div>
                <label
                  htmlFor={`comment-${index}`}
                   className="formInputLabel"
                >
                  Comment
                </label>
                <input
                  type="text"
                  id={`comment-${index}`}
                  name="comment"
                  value={fee.comment}
                  onChange={(e) => handleAgreedServicesChange(index, e)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              {/* Fee Start Date */}
              <div>
                <label
                  htmlFor={`feeStartDate-${index}`}
                   className="formInputLabel"
                >
                  Fee Start Date
                </label>
                <input
                  type="date"
                  id={`feeStartDate-${index}`}
                  name="feeStartDate"
                  value={fee.feeStartDate}
                  onChange={(e) => handleAgreedServicesChange(index, e)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              {/* Fee End Date */}
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
                  value={fee.feeEndDate}
                  onChange={(e) => handleAgreedServicesChange(index, e)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addAgreedFee}
            className="mt-2 inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
          >
            Add Agreed Service
          </button>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
              canSave
                ? "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
                : "bg-gray-400 cursor-not-allowed"
            } focus:outline-none focus:ring-2 focus:ring-offset-2`}
          >
            save Admission
          </button>
        </div>
      </form>
    </>
  );
};

export default NewAdmissionForm;
