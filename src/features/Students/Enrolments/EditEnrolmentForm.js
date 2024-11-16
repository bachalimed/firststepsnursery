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
import { useUpdateEnrolmentMutation } from "./enrolmentsApiSlice";
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
} from "../../../config/REGEX"

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

const EditEnrolmentForm = ({ enrolment }) => {
  console.log(enrolment, "enrolment");
  // initialising states
  const { isAdmin, userId } = useAuth();
  const navigate = useNavigate();
  const [
    updateEnrolment,
    {
      isLoading: isEnrolmentLoading,
      isSuccess: isEnrolmentSuccess,
      isError: isEnrolmentError,
      error: enrolmentError,
    },
  ] = useUpdateEnrolmentMutation();
  //academic years states
  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  const academicYears = useSelector(selectAllAcademicYears);

  

  const {
    data: services,
    isLoading: isServicesLoading,
    isSuccess: isServicesSuccess,
    isError: isServicesError,
    error: servicesError,
  } = useGetServicesByYearQuery(
    {
      selectedYear: selectedAcademicYear?.title,
      endpointName: "EditEnrolmentForm",
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
    enrolmentId:enrolment?.id,
    student: enrolment?.student._id,
    enrolmentYear: enrolment?.enrolmentYear,
    enrolmentDate: enrolment?.enrolmentDate? new Date(enrolment?.enrolmentDate).toISOString().split('T')[0]:"",
    agreedServices: enrolment?.agreedServices || [
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
    enrolmentOperator: userId, // Set to the operator id
  });

 

  const servicesList = isServicesSuccess
    ? Object.values(services.entities)
    : [];

  // Set default enrolment service
  useEffect(() => {
    if (isServicesSuccess && formData.agreedServices.length === 0) {
      const enrolmentService = servicesList.find(
        (service) => service.serviceType === "Enrolment"
      );
      if (enrolmentService) {
        setFormData((prevData) => ({
          ...prevData,
          agreedServices: [
            {
              service: enrolmentService.id,
              feeValue: "",
              feePeriod: "",
              feeStartDate: "",
              feeEndDate: "",
              isFlagged: false,
              comment: "",
            },
          ],
        }));
      }
    }
  }, [isServicesSuccess]);

  const [enrolmentValidity, setEnrolmentValidity] = useState([]);

  const handleInputChange = (index, fieldName, value) => {
    // Clone the agreedServices array deeply to avoid mutating read-only properties
    const updatedServices = [...formData.agreedServices];
    
    // Clone the specific service object at the given index
    const updatedService = { ...updatedServices[index] };
  
    // Update the field (e.g., feeValue, feeStartDate, etc.)
    updatedService[fieldName] = value;
  
    // Place the updated service back into the updatedServices array
    updatedServices[index] = updatedService;
  
    // Update the formData state
    setFormData((prevData) => ({
      ...prevData,
      agreedServices: updatedServices,
    }));
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
      const validFeeStartDate = DATE_REGEX.test(service.feeStartDate.split("T")[0]);
      const validComment = COMMENT_REGEX.test(service.comment);

      return {
        validService,
        validFeePeriod,
        validFeeValue,
        validFeeStartDate,
        validComment,
      };
    });

    if (JSON.stringify(updatedValidity) !== JSON.stringify(enrolmentValidity)) {
      setEnrolmentValidity(updatedValidity);
    }
  };

  // Validate services when debouncedFeeValue changes
  useEffect(() => {
    if (debouncedFeeValue) {
      const updatedServices = [...formData.agreedServices];
      validateService(updatedServices);
    }
  }, [debouncedFeeValue, formData.agreedServices]);

  console.log(enrolmentValidity, "enrolmentValidity2");
  const [primaryValidity, setPrimaryValidity] = useState({
    validStudent: OBJECTID_REGEX.test(formData.student),
    validEnrolmentYear: formData.enrolmentYear !== "",
    validEnrolmentDate: DATE_REGEX.test(formData.enrolmentDate),
  });

  useEffect(() => {
    setPrimaryValidity((prev) => ({
      ...prev,
      validStudent: OBJECTID_REGEX.test(formData.student),
      validEnrolmentYear: formData.enrolmentYear !== "",
      validEnrolmentDate: DATE_REGEX.test(formData.enrolmentDate),
    }));
  }, [formData.student, formData.enrolmentYear, formData.enrolmentDate]); // run whenever formData changes

  console.log(primaryValidity, "primaryValidity");
  // Modify handleAgreedServicesChange
  const handleAgreedServicesChange = (index, e) => {
    if (e && e.target) {
      const { name, value } = e.target;
  
      // Clone the agreedServices array deeply to avoid mutating read-only properties
      const updatedServices = [...formData.agreedServices];
      const updatedService = { ...updatedServices[index] }; // Clone the service object at the given index
  
      // Update the specific field of the service
      updatedService[name] = value;
  
      // Set the updated service back into the array
      updatedServices[index] = updatedService;
  
      // Update the formData with the modified agreedServices array
      setFormData((prevData) => ({
        ...prevData,
        agreedServices: updatedServices,
      }));
    } else {
      console.error("Event is not properly passed or malformed:", e);
    }
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
          feeEndDate: "",
          isFlagged: false,
          comment: "",
        },
      ],
    }));
  };

  useEffect(() => {
    if (isEnrolmentSuccess) {
      //if the add of new user using the mutation is success, empty all the individual states and navigate back to the users list
      setFormData({
        enrolmentId:"",
        student: "",
        enrolmentYear: "",
        enrolmentDate: "",
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
        enrolmentCreator: "", // Set to the logged-in user id
        enrolmentOperator: "", // Set to the operator id
      });
      navigate("/students/enrolments/enrolments"); //will navigate here after saving
    }
  }, [isEnrolmentSuccess, navigate]); //even if no success it will navigate and not show any warning if failed or success

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
    enrolmentValidity.length > 0 
    &&enrolmentValidity.every(
      (validity) => validity && Object.values(validity).every(Boolean)
    )
    && Object.values(primaryValidity).every(Boolean) 
    && !isEnrolmentLoading;

  // Submit the form

  if (canSave) {
    console.log("Form is ready to be saved");
   }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateEnrolment(formData).unwrap();
      // navigate("/students/enrolments/enrolments");
    } catch (error) {
      console.error("Error submitting form", error);
    }
  };

  console.log(formData, "formData");
  const content = (
    <>
      <Students />
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 shadow rounded-md"
      >
        <h2 className="text-xl font-bold">Edit Enrolment</h2>
        <div>
          <label
            htmlFor="student"
            className="block text-sm font-medium text-gray-700"
          >
            Student{" "}
            {!primaryValidity.validStudent && (
              <span className="text-red-500">*</span>
            )}
          </label>
          <select
            id="student"
            name="student"
            value={formData.student}
            onChange={(e) =>
              setFormData((prevData) => ({
                ...prevData,
                student: e.target.value, // update formData with input value
              }))
            }
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
            disabled
          >
            
            
                <option key={enrolment.student._id} value={enrolment.student._id}>
                  {enrolment.student?.studentName?.firstName}{" "}
                  {enrolment.student.studentName?.middleName}{" "}
                  {enrolment.student.studentName?.lastName}
                </option>
              
          </select>
        </div>

        <div>
          <label
            htmlFor="enrolmentYear"
            className="block text-sm font-medium text-gray-700"
          >
            Enrolment Year{" "}
            {!primaryValidity.validEnrolmentYear && (
              <span className="text-red-500">*</span>
            )}
          </label>
          <select
            id="enrolmentYear"
            name="enrolmentYear"
            value={formData.enrolmentYear}
            onChange={(e) =>
              setFormData((prevData) => ({
                ...prevData,
                enrolmentYear: e.target.value, // update formData with input value
              }))
            }
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
            disabled
          >
           
            <option
              key={formData.enrolmentYear}
              value={formData.enrolmentYear}
            >
              {formData.enrolmentYear}
            </option>
           
          </select>
        </div>

        {/* Enrolment Date Input */}
        <div>
          <label
            htmlFor="enrolmentDate"
            className="block text-sm font-medium text-gray-700"
          >
            Enrolment Starting Date{" "}
            {!primaryValidity.validEnrolmentDate && (
              <span className="text-red-500">*</span>
            )}
          </label>
          <input
            type="date"
            id="enrolmentDate"
            name="enrolmentDate"
            value={formData.enrolmentDate}
            onChange={(e) =>
              setFormData((prevData) => ({
                ...prevData,
                enrolmentDate: e.target.value, // update formData with input value
              }))
            }
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
                Service{" "}
                {!enrolmentValidity[index]?.validService && (
                  <span className="text-red-500">*</span>
                )}
                {index === 0 && "(Default: Enrolment)"}
              </label>
              <select
                id={`service-${index}`}
                name="service"
                value={service.id}
                onChange={(e) => handleAgreedServicesChange(index, e)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                disabled={index === 0} // Disable the first service since it's "Enrolment"
                required
              >
                {index === 0 ? (
                  <option value="Enrolment">Enrolment</option>
                ) : (
                  <>
                    
                    {getAvailableServices(index).map((serviceOption) => (
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
                  Fee Period{" "}
                  {!enrolmentValidity[index]?.validFeePeriod && (
                    <span className="text-red-500">*</span>
                  )}
                </label>
                <select
                  id={`feePeriod-${index}`}
                  name="feePeriod"
                  value={service?.feePeriod}
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
                          service.id ===
                          formData?.agreedServices[index]?.service
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
                  Fee Value{" "}
                  {!enrolmentValidity[index]?.validFeeValue && (
                    <span className="text-red-500">*</span>
                  )}
                </label>
                <input
                  type="number"
                  id={`feeValue-${index}`}
                  name="feeValue"
                  value={service.feeValue}
                  onChange={(e) => {
                    setFeeValue(e.target.value);
                    handleInputChange(index, "feeValue", e.target.value);
                  }}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor={`feeStartDate-${index}`}
                  className="block text-sm font-medium text-gray-700"
                >
                  Fee Start Date{" "}
                  {!enrolmentValidity[index]?.validFeeStartDate && (
                    <span className="text-red-500">*</span>
                  )}
                </label>
                <input
                  type="date"
                  id={`feeStartDate-${index}`}
                  name="feeStartDate"
                  value={service.feeStartDate?.split("T")[0]}
                  onChange={(e) => handleAgreedServicesChange(index, e)}
                  placeholder="YYYY-MM-DD"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              {index !== 0 && (
                <div>
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
                    value={service?.feeEndDate?.split("T")[0]}
                    onChange={(e) => handleAgreedServicesChange(index, e)}
                    placeholder="YYYY-MM-DD"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              )}

              <div>
                {service.isFlagged && (
                  <div className="text-red-500">
                    The agreed fee value is below the minimum required fee for
                    this service, please add comment for management
                    authorisation processing.
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
                  value={service?.comment}
                  onChange={(e) => handleAgreedServicesChange(index, e)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  maxLength="150"
                />
              </div>
            </div>
            {index !== 0 && (
              <button
                type="button"
                onClick={() => removeAgreedService(index)}
                className="ml-2 inline-flex items-center px-2 py-1 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 hover:bg-red-100 focus:outline-none"
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
            className="mt-2 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none"
          >
            Add Another Service
          </button>
        )}

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
            {isEnrolmentLoading ? "Saving..." : "Save Enrolment"}
          </button>
        </div>
      </form>
    </>
  );

  // if (noEnrolmentStudents.length === 0) return <LoadingStateIcon />;
  //if (noEnrolmentStudents.length) return content;
  return content;
};

export default EditEnrolmentForm;
