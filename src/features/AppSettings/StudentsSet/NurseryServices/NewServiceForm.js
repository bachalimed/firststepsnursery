import { useState, useEffect } from "react";
import { useAddNewServiceMutation } from "./servicesApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { ROLES } from "../../../../config/UserRoles";
import { ACTIONS } from "../../../../config/UserActions";
import { SERVICETYPES } from "../../../../config/SchedulerConsts";
import StudentsSet from "../../StudentsSet";
import useAuth from "../../../../hooks/useAuth";
import { useOutletContext } from "react-router-dom";
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
  const { isAdmin, userId } = useAuth();
  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  const academicYears = useSelector(selectAllAcademicYears);
  //console.log(selectedAcademicYear?.title, "selectedAcademicYear");
  const [addNewService, { isLoading, isSuccess, isError, error }] =
    useAddNewServiceMutation();

  // Consolidated form state
  const [formData, setFormData] = useState({
    serviceType: "",
    serviceYear: "",
    serviceAnchor: {
      monthly: 0,
      weekly: 0,
      oneTimeOff: 0,
    },
    serviceCreator: userId,
    serviceOperator: userId,
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
    setValidity((prev) => ({
      ...prev,
      validServiceType: formData.serviceType !== "",
      validServiceYear: formData.serviceYear !== "",
      validMonthlyAnchor: FEE_REGEX.test(formData.serviceAnchor.monthly),
      validWeeklyAnchor: FEE_REGEX.test(formData.serviceAnchor.weekly),
      validOneTimeOffAnchor: FEE_REGEX.test(formData.serviceAnchor.oneTimeOff),
    }));
  }, [formData]);

  // If the service is added successfully, reset the form and navigate
  useEffect(() => {
    if (isSuccess) {
      setFormData({
        serviceType: "",
        serviceYear: "",
        serviceAnchor: {
          monthly: 0,
          weekly: 0,
          oneTimeOff: 0,
        },
        serviceCreator: "",
        serviceOperator: "",
      });
      navigate("/settings/studentsSet/services");
    }
  }, [isSuccess, navigate]);

  const { triggerBanner } = useOutletContext(); // Access banner trigger
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
  //console.log(formData, "formData");
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
      const response = await addNewService(formData);
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
      triggerBanner("Failed to update service. Please try again.", "error");

      console.error("Error updating service:", error);
    }
  };
  // Close the modal without saving
  const handleCloseModal = () => {
    setShowConfirmation(false);
  };
  //console.log(formData)
  return (
    <>
      <StudentsSet />

      <form onSubmit={onSaveServiceClicked} className="form-container">
        <h2  className="formTitle ">
          Add New Service:{" "}
          {`${formData.servicePeriodicity} ${formData.serviceType} ${formData.serviceYear}`}
        </h2>
        {/* Service Type */}
        <div>
          <label htmlFor=""  className="formInputLabel">
            Service Type{" "}
            {validity.validServiceType ? (
              ""
            ) : (
              <span className="text-red-600">*</span>
            )}
            <select
              aria-label="service Type"
              aria-invalid={!validity.validServiceType}
              name="serviceType"
              value={formData.serviceType}
              onChange={handleInputChange}
              className={`mt-1 block w-full border ${
                validity.validServiceType ? "border-gray-300" : "border-red-600"
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
          </label>
        </div>

        {/* Service Year */}
        <div>
          <label htmlFor=""  className="formInputLabel">
            Service Year{" "}
            {validity.validServiceYear ? (
              ""
            ) : (
              <span className="text-red-600">*</span>
            )}
            <select
              aria-label="service year"
              aria-invalid={!validity.validServiceYear}
              name="serviceYear"
              value={formData.serviceYear}
              onChange={handleInputChange}
              className={`mt-1 block w-full border ${
                validity.validServiceYear ? "border-gray-300" : "border-red-600"
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
          </label>
        </div>

        {/* Monthly Service anchor */}
        <div>
          <label htmlFor=""  className="formInputLabel">
            Monthly Service Anchor{" "}
            {validity.validMonthlyAnchor ? (
              ""
            ) : (
              <span className="text-red-600">*</span>
            )}
            <input
              aria-label="monthly anchor"
              aria-invalid={!validity.validMonthlyAnchor}
              type="number"
              name="monthlyAnchor"
              value={formData.monthlyAnchor}
              onChange={handleInputChange}
              className={`mt-1 block w-full border ${
                validity.validMonthlyAnchor
                  ? "border-gray-300"
                  : "border-red-600"
              } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
              placeholder="Enter Monthly Service Anchor"
            />
          </label>
        </div>

        {/* Weekly Service anchor */}
        <div>
          <label htmlFor=""  className="formInputLabel">
            Weekly Service Anchor{" "}
            {validity.validWeeklyAnchor ? (
              ""
            ) : (
              <span className="text-red-600">*</span>
            )}
            <input
              aria-label="weekly anchor"
              aria-invalid={!validity.validWeeklyAnchor}
              type="number"
              name="weeklyAnchor"
              value={formData.weekly}
              onChange={handleInputChange}
              className={`mt-1 block w-full border ${
                validity.validWeeklyAnchor
                  ? "border-gray-300"
                  : "border-red-600"
              } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
              placeholder="Enter Weekly Service Anchor"
            />
          </label>
        </div>
        {/* Weekly Service anchor */}
        <div>
          <label htmlFor=""  className="formInputLabel">
            One-time Off Service Anchor{" "}
            {validity.validOneTimeOffAnchor ? (
              ""
            ) : (
              <span className="text-red-600">*</span>
            )}
            <input
              aria-label="one time off anchor"
              aria-invalid={!validity.validOneTimeOffAnchor}
              type="number"
              name="oneTimeOffAnchor"
              value={formData.oneTimeOffAnchor}
              onChange={handleInputChange}
              className={`mt-1 block w-full border ${
                validity.validOneTimeOffAnchor
                  ? "border-gray-300"
                  : "border-red-600"
              } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
              placeholder="Enter One-time off  Service Anchor"
            />
          </label>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <button
            aria-label="cancel new service"
            type="button"
            onClick={() => navigate("/settings/studentsSet/services")}
            className="cancel-button"
          >
            Cancel
          </button>
          <button
            aria-label="submit new service"
            type="submit"
            disabled={!canSave || isLoading}
            className={`save-button `}
          >
            Save
          </button>
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
};

export default NewServiceForm;
