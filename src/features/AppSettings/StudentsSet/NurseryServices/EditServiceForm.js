import { useUpdateServiceMutation } from "./servicesApiSlice";
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { SERVICETYPES } from "../../../../config/SchedulerConsts";
import StudentsSet from "../../StudentsSet";
import useAuth from "../../../../hooks/useAuth";
import { useSelector } from "react-redux";
import {
  selectAllAcademicYears,
  selectCurrentAcademicYearId,
  selectAcademicYearById,
} from "../../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import { FEE_REGEX } from "../../../../config/REGEX";
import ConfirmationModal from "../../../../Components/Shared/Modals/ConfirmationModal";

const EditServiceForm = ({ service }) => {
  const navigate = useNavigate();

  const { isAdmin, isManager } = useAuth();
  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  const academicYears = useSelector(selectAllAcademicYears);
  // console.log(service,'service')

  const [
    updateService,
    {
      isLoading: isUpdateLoading,
      isSuccess: isUpdateSuccess,
      isError: isUpdateError,
      error: updateError,
    },
  ] = useUpdateServiceMutation();

  const { triggerBanner } = useOutletContext(); // Access banner trigger
  //confirmation Modal states
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Consolidated form state
  const [formData, setFormData] = useState({
    serviceId: service?._id,
    serviceType: service?.serviceType,
    serviceYear: service?.serviceYear,
    serviceAnchor: service?.serviceAnchor,

    serviceOperator: service?.serviceOperator,
  });

  const [validity, setValidity] = useState({
    validServiceType: false,
    validServiceYear: false,
    validMonthlyAnchor: false,
    validWeeklyAnchor: false,
    validOneTimeOffAnchor: false,
    noEmptyAnchor: false,
  });

  // Validate inputs using regex patterns
  useEffect(() => {
    setValidity((prev) => ({
      ...prev,
      validServiceType: formData.serviceType !== "",
      validServiceYear: formData.serviceYear !== "",
      validMonthlyAnchor: FEE_REGEX.test(formData.serviceAnchor.monthly),
      validWeeklyAnchor: FEE_REGEX.test(formData.serviceAnchor.weekly),
      validOneTimeOffAnchor: FEE_REGEX.test(formData.serviceAnchor.oneTimeOff),
      noEmptyAnchor:
        formData?.serviceAnchor?.monthly != "" || //we use != because we are ocmparing anumber in formdata and a string ""
        formData?.serviceAnchor?.weekly != "" ||
        formData?.serviceAnchor?.oneTimeOff != "",
    }));
  }, [formData]);

  // If the service is added successfully, reset the form and navigate
  useEffect(() => {
    if (isUpdateSuccess) {
      setFormData({
        serviceType: "",
        serviceYear: "",
        serviceAnchor: {
          monthly: 0,
          weekly: 0,
          oneTimeOff: 0,
        },

        serviceOperator: "",
      });
      navigate("/settings/studentsSet/services");
    }
  }, [isUpdateSuccess, navigate]);
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
  const canSave = Object.values(validity).every(Boolean) && !isUpdateLoading;
  // console.log(formData, "formData");
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
      const response = await updateService(formData);
      if ( response?.message) {
        // Success response
        triggerBanner(response?.message, "success");
      }
      else if (response?.data?.message ) {
        // Success response
        triggerBanner(response?.data?.message, "success");
      } else if (response?.error?.data?.message) {
        // Error response
        triggerBanner(response?.error?.data?.message, "error");
      } else if (isUpdateError) {
        // In case of unexpected response format
        triggerBanner(updateError?.data?.message, "error");
      } else {
        // In case of unexpected response format
        triggerBanner("Unexpected response from server.", "error");
      }
    } catch (error) {
      triggerBanner(error?.data?.message, "error");
    }
  };

  // Close the modal without saving
  const handleCloseModal = () => {
    setShowConfirmation(false);
  };

  return (
    <>
      <StudentsSet />

      <form onSubmit={onSaveServiceClicked} className="form-container">
        <h2 className="formTitle ">
          Edit Service: {formData?.servicePeriodicity} {formData?.serviceType}{" "}
          {formData?.serviceYear}
        </h2>
        <div className="formSectionContainer">
          <h3 className="formSectionTitle">Service selection</h3>
          <div className="formSection">
            <div className="formLineDiv">
              {/* Service Year */}

              <label htmlFor="serviceYear" className="formInputLabel">
                Service Year{" "}
                {!validity.validServiceYear && (
                  <span className="text-red-600">*</span>
                )}
                <select
                  aria-label="service year"
                  aria-invalid={!validity.validServiceYear}
                  id="serviceYear"
                  name="serviceYear"
                  value={formData.serviceYear}
                  onChange={handleInputChange}
                  className={`formInputText`}
                  required
                  disabled
                >
                  <option value="">Select Year</option>
                  {academicYears.map((year) => (
                    <option key={year.id} value={year.title}>
                      {year.title}
                    </option>
                  ))}
                </select>
              </label>
              {/* Service Type */}

              <label htmlFor="serviceType" className="formInputLabel">
                Service Type{" "}
                {!validity.validServiceType && (
                  <span className="text-red-600">*</span>
                )}
                <select
                  aria-label="service Type"
                  aria-invalid={!validity.validServiceType}
                  id="serviceType"
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleInputChange}
                  className={`formInputText`}
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
          </div>
          <h3 className="formSectionTitle">
            Service Fees{" "}
            {!validity?.noEmptyAnchor && (
              <span className="text-red-600">*</span>
            )}
          </h3>
          <div className="formSection">
            <div className="grid grid-cols-3 gap-4">
              {/* Monthly Service anchor */}

              <label htmlFor="monthlyAnchor" className="formInputLabel">
                Monthly Anchor{" "}
                {!validity.validMonthlyAnchor && (
                  <span className="text-red-600">*</span>
                )}
                <input
                  aria-label="monthly anchor"
                  aria-invalid={!validity.validMonthlyAnchor}
                  type="number"
                  id="monthlyAnchor"
                  name="monthlyAnchor"
                  value={formData.serviceAnchor.monthly}
                  onChange={handleInputChange}
                  className={`formInputText`}
                  placeholder="[$$$.$$]"
                />
              </label>

              {/* onetime off Service anchor */}

              <label htmlFor="oneTimeOffAnchor" className="formInputLabel">
                One-time Off Anchor{" "}
                {!validity.validOneTimeOffAnchor && (
                  <span className="text-red-600">*</span>
                )}
                <input
                  aria-label="one time off anchor"
                  aria-invalid={!validity.validOneTimeOffAnchor}
                  type="number"
                  id="oneTimeOffAnchor"
                  name="oneTimeOffAnchor"
                  value={formData.oneTimeOffAnchor}
                  onChange={handleInputChange}
                  className={`formInputText`}
                  placeholder="[$$$.$$]"
                />
              </label>
              {/* Weekly Service anchor */}

              <label htmlFor="weeklyAnchor" className="formInputLabel">
                Weekly Anchor{" "}
                {!validity.validWeeklyAnchor && (
                  <span className="text-red-600">*</span>
                )}
                <input
                  aria-label="weekly anchor"
                  aria-invalid={!validity.validWeeklyAnchor}
                  type="number"
                  id="weeklyAnchor"
                  name="weeklyAnchor"
                  value={formData.weekly}
                  onChange={handleInputChange}
                  className={`formInputText`}
                  placeholder="[$$$.$$]"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="cancelSavebuttonsDiv">
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
            disabled={!canSave || isUpdateLoading}
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

export default EditServiceForm;
