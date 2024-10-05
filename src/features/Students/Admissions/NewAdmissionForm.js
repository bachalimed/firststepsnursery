import React, { useState, useEffect } from "react";

import { useSelector } from "react-redux"; // Assuming you're using Redux for state management
import { useNavigate } from "react-router-dom";
import Admissions from "../Admissions";
import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
} from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import {
  useGetStudentsQuery,
  useGetStudentsByYearQuery,
} from "../../Students/StudentsAndParents/Students/studentsApiSlice";
import { useGetServicesByYearQuery } from "../../AppSettings/StudentsSet/NurseryServices/servicesApiSlice";
import { useAddNewAdmissionMutation } from "./admissionsApiSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { ROLES } from "../../../config/UserRoles";
import { ACTIONS } from "../../../config/UserActions";
import useAuth from "../../../hooks/useAuth";
import LoadingStateIcon from "../../../Components/LoadingStateIcon";
import { useGetAcademicYearsQuery } from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsApiSlice";
import { selectAllAcademicYears } from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
//constrains on inputs when creating new user
const USER_REGEX = /^[A-z]{6,20}$/;
const COMMENT_REGEX = /^[A-z0-9]{0,150}$/;
const PWD_REGEX = /^[A-z0-9!@#-_$%]{8,20}$/;
const OBJECTID_REGEX = /^[A-z 0-9]{24}$/;
const PHONE_REGEX = /^[0-9]{6,15}$/;
const DOB_REGEX = /^[0-9/-]{4,10}$/;
const EMAIL_REGEX = /^[A-z0-9.@-_]{6,20}$/;
const FEE_REGEX = /^(0|[1-9][0-9]{0,3})(\.[0-9]{1,3})?$/;

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
    data: students, //the data is renamed students
    isLoading: isStudentsLoading, //monitor several situations is loading...
    isSuccess: isStudentsSuccess,
    isError: isStudentsError,
    error: studentsError,
  } = useGetStudentsByYearQuery(
    {
      //selectedYear: selectedAcademicYear?.title,
      selectedYear: "1000",
      endpointName: "studentsList",
    } || {},
    {
      //this param will be passed in req.params to select only students for taht year
      //this inside the brackets is using the listeners in store.js to update the data we use on multiple access devices
      // pollingInterval: 60000,//will refetch data every 60seconds
      refetchOnFocus: true, //when we focus on another window then come back to the window ti will refetch data
      refetchOnMountOrArgChange: true, //refetch when we remount the component
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
      endpointName: "servicesList",
    } || {},
    {
      //this param will be passed in req.params to select only services for taht year
      //this inside the brackets is using the listeners in store.js to update the data we use on multiple access devices
      //pollingInterval: 60000,//will refetch data every 60seconds
      refetchOnFocus: true, //when we focus on another window then come back to the window ti will refetch data
      refetchOnMountOrArgChange: true, //refetch when we remount the component
    }
  );
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
    setNoAdmissionStudents(
      studentsList.filter((student) =>
        student.studentYears.some(
          (year) => !("admission" in year) || year.admission === ""
        )
      )
    );
    //console.log(noAdmissionStudents,'noAdmissionStudents')
  }, [isStudentsSuccess]);

  const servicesList = isServicesSuccess
    ? Object.values(services.entities)
    : [];

 // Set default admission service
 useEffect(() => {
  if (isServicesSuccess && formData.agreedServices[0].service === "") {
    const admissionService = servicesList.find(service => service.serviceType === "Admission");
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


  const [admissionValidity, setAdmissionValidity] = useState({
    validStudent: false,
    validAdmissionYear: false,
    validAdmissionDate: false,
    validService: false,
    validFeeValue: false,
    validFeePeriod: false,
    validFeeStartDate: false,
    validComment: false,
  });
 
  // Validate form inputs
  useEffect(() => {
    const validStudent = OBJECTID_REGEX.test(formData.student);
    const validAdmissionYear = formData.admissionYear !== "";
    const validAdmissionDate = DOB_REGEX.test(formData.admissionDate);
    const validService = OBJECTID_REGEX.test(formData.agreedServices[0].service);
    const validFeePeriod = formData.agreedServices[0].feePeriod !== "";
    const validFeeValue = FEE_REGEX.test(formData.agreedServices[0].feeValue);
    const validFeeStartDate = DOB_REGEX.test(formData.agreedServices[0].feeStartDate);
    const validComment = COMMENT_REGEX.test(formData.agreedServices[0].comment);

    setAdmissionValidity({
      validStudent,
      validAdmissionYear,
      validAdmissionDate,
      validService,
      validFeePeriod,
      validFeeValue,
      validFeeStartDate,
      validComment,
    });
  }, [formData]);

  // State to track selected services
  const [selectedServices, setSelectedServices] = useState(["Admission"]);

  
  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle agreed services change
  const handleAgreedServicesChange = (index, e) => {
    const { name, value } = e.target;
    const updatedServices = [...formData.agreedServices];
    updatedServices[index][name] = value;
    setFormData((prevData) => ({ ...prevData, agreedServices: updatedServices }));
  };

  //Add another agreed service
  const addAgreedService = () => {
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
          comment: "",
        },
      ],
    }));
  };
  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addNewAdmission(formData).unwrap();
      // navigate("/students/admissions/admissions");
    } catch (error) {
      console.error("Error submitting form", error);
    }
  };

  
  useEffect(() => {
    if (isAdmissionSuccess) {
      //if the add of new user using the mutation is success, empty all the individual states and navigate back to the users list
      setFormData ({
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
            isFlagged: false,
            //authorisedBy:"", it will generate error in mongo if ""
            comment: "",
          },
        ],
        admissionCreator: "", // Set to the logged-in user id
        admissionOperator: "", // Set to the operator id
      })
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

        // If the agreedFee is less than the serviceAnchor value, set isFlagged to true
        if (
          parseFloat(formData?.agreedServices[index]?.feeValue) <
          parseFloat(serviceAnchorValue)
        ) {
          setFormData((prevData) => ({
            ...prevData,
            agreedServices: prevData.agreedServices.map((serv, idx) =>
              idx === index // Set isFlagged for the current index
                ? { ...serv, isFlagged: true }
                : serv
            ),
          }));
        } else {
          // Reset the flag if the agreedFee is not less
          setFormData((prevData) => ({
            ...prevData,
            agreedServices: prevData.agreedServices.map((serv, idx) =>
              idx === index ? { ...serv, isFlagged: false } : serv
            ),
          }));
        }
      }
    }
  };

  // Call handleAgreedServicesCheck whenever agreedServices or service selection changes
  useEffect(() => {
    // Iterate through agreedServices and check feeValue
    formData.agreedServices.forEach((service, index) => {
      if (service.feeValue) {
        // Check if feeValue exists
        handleAgreedServicesCheck(index);
      }
    });
  }, [formData.agreedServices]);

  const canSave =
    Object.values(admissionValidity).every(Boolean) && !isAdmissionLoading;
  console.log(formData, "formData");
  const content = (
    <>
      <Admissions />
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 shadow rounded-md"
      >
        <h2 className="text-xl font-bold">New Admission</h2>
        <div>
          <label
            htmlFor="student"
            className="block text-sm font-medium text-gray-700"
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
            {isStudentsSuccess &&
              noAdmissionStudents.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.studentName?.firstName}{" "}
                  {student.studentName?.middleName}{" "}
                  {student.studentName?.lastName}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="admissionYear"
            className="block text-sm font-medium text-gray-700"
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
            {/* {academicYears.map((year) => (
              <option key={year._id} value={year.title}>
                {year.title}
              </option>
            ))} */}
          </select>
        </div>

        {/* Admission Date Input */}
        <div>
          <label
            htmlFor="admissionDate"
            className="block text-sm font-medium text-gray-700"
          >
            Admission Starting Date
          </label>
          <input
            type="date"
            id="admissionDate"
            name="admissionDate"
            value={formData.admissionDate}
            onChange={handleInputChange}
            placeholder="YYYY-MM-DD"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Agreed Services Section */}

        {formData.agreedServices.map((service, index) => (
           <div className="border border-gray-200 p-4 rounded-md shadow-sm space-y-2">
          <div key={index} className="space-y-4">
            <label
              htmlFor={`service-${index}`}
              className="block text-sm font-medium text-gray-700"
            >
              Service {index === 0 && "(Default: Admission)"}
            </label>
            <select
              id={`service-${index}`}
              name="service"
              value={service.id}
              onChange={(e) => handleAgreedServicesChange(index, e)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              disabled={index === 0} // Disable the first service since it's "Admission"
              required
            >
              {index === 0 ? (
                <option value="Admission">Admission</option>
              ) : (
                <>
                  <option value="">Select Service</option>
                  {(getAvailableServices(index)).map((serviceOption) => (
                    <option key={serviceOption.id} value={serviceOption.id}>
                      {serviceOption.serviceType}
                    </option>
                  ))}
                </>
              )}
            </select>

            <div>
              <label
                htmlFor={`feePeriod-${index}`}
                className="block text-sm font-medium text-gray-700"
              >
                Fee Period
              </label>
              <select
                id={`feePeriod-${index}`}
                name="feePeriod"
                value={service.feePeriod}
                onChange={(e) => handleAgreedServicesChange(index, e)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Select Period</option>
                {/* Ensure the correct serviceAnchor object is passed */}
                {servicesList.find(
                  (service) =>
                    service.id === formData?.agreedServices[index]?.service
                )?.serviceAnchor &&
                  Object.entries(
                    servicesList.find(
                      (service) =>
                        service.id === formData?.agreedServices[index]?.service
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

            <div>
              <label
                htmlFor={`feeValue-${index}`}
                className="block text-sm font-medium text-gray-700"
              >
                Fee Value
              </label>
              <input
                type="number"
                id={`feeValue-${index}`}
                name="feeValue"
                value={service.feeValue}
                onChange={(e) => handleAgreedServicesChange(index, e)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label
                htmlFor={`feeStartDate-${index}`}
                className="block text-sm font-medium text-gray-700"
              >
                Fee Start Date
              </label>
              <input
                type="date"
                id={`feeStartDate-${index}`}
                name="feeStartDate"
                value={service.feeStartDate}
                onChange={(e) => handleAgreedServicesChange(index, e)}
                placeholder="YYYY-MM-DD"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            {(index!==0)&&<div>
              <label
                htmlFor={`feeEndDate-${index}`}
                className="block text-sm font-medium text-gray-700"
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
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                
              />
            </div>}

            <div>
              {service.isFlagged && (
                <div className="text-red-500">
                  The agreed fee value is below the minimum required fee for
                  this service, please add comment for management authorisation
                  processing.
                </div>
              )}
              <label
                htmlFor={`comment-${index}`}
                className="block text-sm font-medium text-gray-700"
              >
                Comment
              </label>
              <input
                type="text"
                id={`comment-${index}`}
                name="comment"
                value={service.comment}
                onChange={(e) => handleAgreedServicesChange(index, e)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                maxLength="150"
              />
            </div>
          </div>
          </div>
        ))}
        {/* we should only add the number of services availble */}
        {(formData.agreedServices.length <= servicesList.length)&&<button
          type="button"
          onClick={addAgreedService}
          className="mt-2 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none"
        >
          Add Another Service
        </button>}

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            disabled={!canSave}
            className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              canSave
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            <FontAwesomeIcon icon={faSave} className="mr-2" />
            {isAdmissionLoading ? "Saving..." : "Save Admission"}
          </button>
        </div>
      </form>
    </>
  );

  if (noAdmissionStudents.length === 0) return <LoadingStateIcon />;
  if (noAdmissionStudents.length) return content;
  return content;
};

export default NewAdmissionForm;
