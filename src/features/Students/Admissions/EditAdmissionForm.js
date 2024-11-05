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
import { useUpdateAdmissionMutation } from "./admissionsApiSlice";
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
  console.log(admission, "admission");
  // initialising states
  const { isAdmin, userId } = useAuth();
  const navigate = useNavigate();
  const [
    updateAdmission,
    {
      isLoading: isAdmissionLoading,
      isSuccess: isAdmissionSuccess,
      isError: isAdmissionError,
      error: admissionError,
    },
  ] = useUpdateAdmissionMutation();
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
    admissionId:admission?.id,
    student: admission?.student._id,
    admissionYear: admission?.admissionYear,
    admissionDate: admission?.admissionDate? new Date(admission?.admissionDate).toISOString().split('T')[0]:"",
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

  console.log(admissionValidity, "admissionValidity2");
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

  console.log(primaryValidity, "primaryValidity");
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
    if (isAdmissionSuccess) {
      //if the add of new user using the mutation is success, empty all the individual states and navigate back to the users list
      setFormData({
        admissionId:"",
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
    admissionValidity.length > 0 
    &&admissionValidity.every(
      (validity) => validity && Object.values(validity).every(Boolean)
    )
    && Object.values(primaryValidity).every(Boolean) 
    && !isAdmissionLoading;

  // Submit the form

  if (canSave) {
    console.log("Form is ready to be saved");
   }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateAdmission(formData).unwrap();
      // navigate("/students/admissions/admissions");
    } catch (error) {
      console.error("Error submitting form", error);
    }
  };

  console.log(formData, "formData");
  const content = (
    <>
      <Admissions />
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 shadow rounded-md"
      >
        <h2 className="text-xl font-bold">Edit Admission</h2>
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
            
            
                <option key={admission.student._id} value={admission.student._id}>
                  {admission.student?.studentName?.firstName}{" "}
                  {admission.student.studentName?.middleName}{" "}
                  {admission.student.studentName?.lastName}
                </option>
              
          </select>
        </div>

        <div>
          <label
            htmlFor="admissionYear"
            className="block text-sm font-medium text-gray-700"
          >
            Admission Year{" "}
            {!primaryValidity.validAdmissionYear && (
              <span className="text-red-500">*</span>
            )}
          </label>
          <select
            id="admissionYear"
            name="admissionYear"
            value={formData.admissionYear}
            onChange={(e) =>
              setFormData((prevData) => ({
                ...prevData,
                admissionYear: e.target.value, // update formData with input value
              }))
            }
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
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
        </div>

        {/* Admission Date Input */}
        <div>
          <label
            htmlFor="admissionDate"
            className="block text-sm font-medium text-gray-700"
          >
            Admission Starting Date{" "}
            {!primaryValidity.validAdmissionDate && (
              <span className="text-red-500">*</span>
            )}
          </label>
          <input
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
                {!admissionValidity[index]?.validService && (
                  <span className="text-red-500">*</span>
                )}
                {index === 0 && "(Default: Admission)"}
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
                  {!admissionValidity[index]?.validFeePeriod && (
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
                  {!admissionValidity[index]?.validFeeValue && (
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
                  {!admissionValidity[index]?.validFeeStartDate && (
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
              <div
                key={index}
                className="border border-gray-200 p-4 rounded-md shadow-sm space-y-2"
              >
                <label
                  htmlFor={`feeMonths-${index}`}
                  className="block text-sm font-medium text-gray-700"
                >
                  Fee Months (Select multiple if needed)
                </label>
                <select
                  id={`feeMonths-${index}`}
                  name="feeMonths"
                  multiple
                  value={service.feeMonths}
                  onChange={(e) => handleAgreedServicesChange(index, e)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="September">September</option>
                  <option value="October">October</option>
                  <option value="November">November</option>
                  <option value="December">December</option>
                  <option value="January">January</option>
                  <option value="February">February</option>
                  <option value="March">March</option>
                  <option value="April">April</option>
                  <option value="May">May</option>
                  <option value="June">June</option>
                  <option value="July">July</option>
                  <option value="August">August</option>
                </select>
              </div>

           

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
            {isAdmissionLoading ? "Saving..." : "Save Admission"}
          </button>
        </div>
      </form>
    </>
  );

  // if (noAdmissionStudents.length === 0) return <LoadingStateIcon />;
  //if (noAdmissionStudents.length) return content;
  return content;
};

export default EditAdmissionForm;
