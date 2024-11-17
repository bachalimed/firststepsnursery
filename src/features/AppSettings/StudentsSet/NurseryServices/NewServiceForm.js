import { useState, useEffect } from "react";
import { useAddNewServiceMutation } from "./servicesApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { ROLES } from "../../../../config/UserRoles";
import { ACTIONS } from "../../../../config/UserActions";
import { SERVICETYPES } from "../../../../config/SchedulerConsts";
import StudentsSet from '../../StudentsSet'
import useAuth from "../../../../hooks/useAuth";

import { useSelector } from "react-redux";
import {
  selectAllAcademicYears,
  selectCurrentAcademicYearId,
  selectAcademicYearById,
} from "../../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import { FEE_REGEX } from "../../../../config/REGEX";

import ConfirmationModal from "../../../../Components/Shared/Modals/ConfirmationModal";

const NewServiceForm = () => {
  const navigate = useNavigate();
const {isAdmin, userId} = useAuth()
  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  const academicYears = useSelector(selectAllAcademicYears);
console.log(selectedAcademicYear?.title,'selectedAcademicYear')
  const [addNewService, { isLoading, isSuccess, isError, error }] =
    useAddNewServiceMutation();

 
  // Consolidated form state
  const [formData, setFormData] = useState({
    serviceType: "",
    serviceYear: "",
    serviceAnchor: {
      monthly:0,
      weekly:0,
      oneTimeOff:0
    },
    
    serviceCreator:userId,
    serviceOperator:userId
  });

  const [validity, setValidity] = useState({
    validServiceType: false,
    validServiceYear: false,
    validMonthlyAnchor: false,
    validWeeklyAnchor: false,
    validOneTimeOffAnchor: false,
    
  });

  //confirmation Modal states
  const [showConfirmation, setShowConfirmation] = useState(false);
  // Validate form inputs on every state change
  useEffect(() => {
    setValidity({
      validServiceType: formData.serviceType !== "",
      validServiceYear: formData.serviceYear !== "",
      validMonthlyAnchor: FEE_REGEX.test(formData.serviceAnchor.monthly),
      validWeeklyAnchor: FEE_REGEX.test(formData.serviceAnchor.weekly),
      validOneTimeOffAnchor: FEE_REGEX.test(formData.serviceAnchor.oneTimeOff),
      
    });
  }, [formData]);

  
  // If the service is added successfully, reset the form and navigate
  useEffect(() => {
    if (isSuccess) {
      setFormData({
        serviceType: "",
        serviceYear: "",
        serviceAnchor: {
          monthly:0,
          weekly:0,
          oneTimeOff:0
        },
        serviceCreator:"",
        serviceOperator:""
      });
      navigate("/settings/studentsSet/services");
    }
  }, [isSuccess, navigate]);
 
 // Handle input changes
 const handleInputChange = (e) => {
   const { name, value } = e.target;

   // Check for service anchor fields and update nested object
   if (["monthlyAnchor", "weeklyAnchor", "oneTimeOffAnchor"].includes(name)) {
     setFormData((prev) => ({
       ...prev,
       serviceAnchor: {
         ...prev.serviceAnchor,
         [name.replace("Anchor", "")]: parseFloat(value) || 0, // Handle the numeric input properly
       },
     }));
   } else {
     setFormData((prev) => ({
       ...prev,
       [name]: value, // Handle other form fields
     }));
   }
 };

  // Check if the form can be submitted
  const canSave = Object.values(validity).every(Boolean) && !isLoading;
console.log(formData,'formData')
  // Handle form submission
  const onSaveServiceClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
// Show the confirmation modal before saving
setShowConfirmation(true);
}
};
// This function handles the confirmed save action
const handleConfirmSave = async () => {
  // Close the confirmation modal
  setShowConfirmation(false);

      try {
        await addNewService(formData);
      } catch (err) {
        console.error("Failed to save the service:", err);
      }
    }
 
  // Close the modal without saving
  const handleCloseModal = () => {
    setShowConfirmation(false);
  };

  return (
    <>
      <StudentsSet />
      <section className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">
          Add New Service: {`${formData.servicePeriodicity} ${formData.serviceType} ${formData.serviceYear}`}
        </h2>
        {isError && <p className="text-red-500">Error: {error?.data?.message}</p>}
        
        <form onSubmit={onSaveServiceClicked} className="space-y-6">
          {/* Service Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Service Type {validity.validServiceType ? "" : <span className="text-red-500">*</span>}
            </label>
            <select
              name="serviceType"
              value={formData.serviceType}
              onChange={handleInputChange}
              className={`mt-1 block w-full border ${
                validity.validServiceType ? "border-gray-300" : "border-red-500"
              } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
              required
            >
              <option value="">Select Service Type</option>
              {Object.values(SERVICETYPES).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          
          {/* Service Year */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Service Year {validity.validServiceYear ? "" : <span className="text-red-500">*</span>}
            </label>
            <select
              name="serviceYear"
              value={formData.serviceYear}
              onChange={handleInputChange}
              className={`mt-1 block w-full border ${
                validity.validServiceYear ? "border-gray-300" : "border-red-500"
              } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
              required
            >
              <option value="">Select Year</option>
              {academicYears.map((year) => (
                <option key={year.id} value={year.title}>
                  {year.title}
                </option>
              ))}
            </select>
          </div>

         

          {/* Monthly Service anchor */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Monthly Service Anchor {validity.validMonthlyAnchor ? "" : <span className="text-red-500">*</span>}
            </label>
            <input
              type="number"
              name="monthlyAnchor"
              value={formData.monthlyAnchor}
              onChange={handleInputChange}
              className={`mt-1 block w-full border ${
                validity.validMonthlyAnchor ? "border-gray-300" : "border-red-500"
              } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
              placeholder="Enter Monthly Service Anchor"
              
            />
          </div>

          {/* Weekly Service anchor */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Weekly Service Anchor {validity.validWeeklyAnchor ? "" : <span className="text-red-500">*</span>}
            </label>
            <input
              type="number"
              name="monthlyAnchor"
              value={formData.weeklyAnchor}
              onChange={handleInputChange}
              className={`mt-1 block w-full border ${
                validity.validWeeklyAnchor ? "border-gray-300" : "border-red-500"
              } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
              placeholder="Enter Weekly Service Anchor"
              
            />
          </div>
          {/* Weekly Service anchor */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              One-time Off Service Anchor {validity.validOneTimeOffAnchor ? "" : <span className="text-red-500">*</span>}
            </label>
            <input
              type="number"
              name="oneTimeOffAnchor"
              value={formData.oneTimeOffAnchor}
              onChange={handleInputChange}
              className={`mt-1 block w-full border ${
                validity.validOneTimeOffAnchor ? "border-gray-300" : "border-red-500"
              } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
              placeholder="Enter One-time off  Service Anchor"
              
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={()=> navigate("/settings/studentsSet/services")}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSave}
              className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                canSave
                  ? "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
                  : "bg-gray-400 cursor-not-allowed"
              } focus:outline-none focus:ring-2 focus:ring-offset-2`}
            >
              Save
            </button>
          </div>
        </form>
      </section>
      {/* Confirmation Modal */}
      <ConfirmationModal
        show={showConfirmation}
        onClose={handleCloseModal}
        onConfirm={handleConfirmSave}
        title="Confirm Save"
        message="Are you sure you want to save this student?"
      />
    </>
  );
};

export default NewServiceForm;