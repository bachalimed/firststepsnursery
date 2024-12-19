import ConfirmationModal from "../../../../Components/Shared/Modals/ConfirmationModal";
import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useAddNewAttendedSchoolMutation } from "./attendedSchoolsApiSlice"; // Redux API action
//import { attendedSchoolAdded } from "./attendedSchoolsSlice"; // Redux action for state update
import AcademicsSet from "../../AcademicsSet";
import { NAME_REGEX } from "../../../../config/REGEX";
import { SchoolTypeOptions } from "../../../../config/Constants";

const NewAttendedSchoolForm = () => {
  const [formData, setFormData] = useState({
    schoolName: "",
    schoolCity: "",
    schoolType: "",
    schoolColor: "#FF5733", // Default color
  });

  const [error, setError] = useState("");
  const [validity, setValidity] = useState({
    validSchoolName: false,
    validSchoolCity: false,
    validSchoolType: false,
  });

  const navigate = useNavigate();

  // Redux mutation for adding the attended school
  const [
    addNewAttendedSchool,
    { isLoading, isError, error: apiError, isSuccess },
  ] = useAddNewAttendedSchoolMutation();
  //confirmation Modal states
  const [showConfirmation, setShowConfirmation] = useState(false);
  // Validate inputs using regex patterns
  useEffect(() => {
    setValidity((prev) => ({
      ...prev,
      validSchoolName: NAME_REGEX.test(formData.schoolName),
      validSchoolCity: NAME_REGEX.test(formData.schoolCity),
      validSchoolType: !!formData.schoolType, // Ensure schoolType is selected
    }));
  }, [formData]);

  // Clear form and errors on success
  useEffect(() => {
    if (isSuccess) {
      setFormData({
        schoolName: "",
        schoolCity: "",
        schoolType: "",
        schoolColor: "#FF5733", // Reset to default color
      });
      setError("");
      navigate("/settings/academicsSet/attendedSchools/");
    }
  }, [isSuccess, navigate]);

  // Check if all fields are valid and enable the submit button
  const canSubmit = Object.values(validity).every(Boolean) && !isLoading;

  const { triggerBanner } = useOutletContext(); // Access banner trigger

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure all fields are valid
    if (!canSubmit) {
      setError("Please fill in all fields correctly.");
      return;
    }
    // Show the confirmation modal before saving
    setShowConfirmation(true);
  };

  // This function handles the confirmed save action
  const handleConfirmSave = async () => {
    // Close the confirmation modal
    setShowConfirmation(false);

    try {
      const response = await addNewAttendedSchool(formData).unwrap();

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
      triggerBanner("Failed to create school. Please try again.", "error");

      console.error("Error creating school:", error);
    }
  };
  // Close the modal without saving
  const handleCloseModal = () => {
    setShowConfirmation(false);
  };
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  console.log(formData, "formdata");
  console.log(validity, "validity");

  return (
    <>
      <AcademicsSet />

      <form onSubmit={handleSubmit} className="form-container">
        <h2 className="formTitle ">New School</h2>
        <div className="formSectionContainer">
          <h3 className="formSectionTitle">School details</h3>
          <div className="formSection">
            <div className="formLineDiv">
              <label htmlFor="schoolName" className="formInputLabel">
                School Name{" "}
                {!validity.validSchoolName && (
                  <span className="text-red-600 text-sm">*</span>
                )}
                <input
                  aria-label="school name"
                  aria-invalid={!validity.validSchoolName}
                  placeholder="[6-20 letters]"
                  type="text"
                  id="schoolName"
                  name="schoolName"
                  value={formData.schoolName}
                  onChange={handleChange}
                  required
                  className={`formInputText`}
                />
              </label>

              <label htmlFor="schoolCity" className="formInputLabel">
                School City{" "}
                {!validity.validSchoolCity && (
                  <span className="text-red-600 text-sm">*</span>
                )}
                <input
                  aria-label="school city"
                  aria-invalid={!validity.validSchoolCity}
                  placeholder="[3-20 letters]"
                  type="text"
                  id="schoolCity"
                  name="schoolCity"
                  value={formData.schoolCity}
                  onChange={handleChange}
                  required
                  className={`formInputText`}
                />
              </label>

              <label htmlFor="schoolType" className="formInputLabel">
                School Type{" "}
                {!validity.validSchoolType && (
                  <span className="text-red-600">*</span>
                )}
                <select
                  aria-label="school type"
                  aria-invalid={!validity.validSchoolType}
                  required
                  id="schoolType"
                  name="schoolType"
                  value={formData.schoolType}
                  onChange={handleChange}
                  className={`formInputText`}
                >
                  <option value="">Select School Type</option>
                  {SchoolTypeOptions.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </label>

              <label htmlFor="schoolColor" className="formInputLabel">
                School Color
                <input
                  type="color"
                  id="schoolColor"
                  name="schoolColor"
                  value={formData.schoolColor}
                  onChange={handleChange}
                  className="block w-full rounded-md"
                />{" "}
              </label>
            </div>
          </div>
        </div>

        <div className="cancelSavebuttonsDiv">
          <button
            aria-label="cancel new school"
            type="button"
            onClick={() => navigate("/settings/academicsSet/attendedSchools/")}
            className="cancel-button"
          >
            Cancel
          </button>
          <button type="submit" disabled={!canSubmit} className="save-button">
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

export default NewAttendedSchoolForm;
