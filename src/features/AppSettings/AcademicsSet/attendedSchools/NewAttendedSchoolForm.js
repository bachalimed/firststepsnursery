import ConfirmationModal from "../../../../Components/Shared/Modals/ConfirmationModal";
import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useAddNewAttendedSchoolMutation } from "./attendedSchoolsApiSlice"; // Redux API action
//import { attendedSchoolAdded } from "./attendedSchoolsSlice"; // Redux action for state update
import AcademicsSet from "../../AcademicsSet";
import { NAME_REGEX } from "../../../../config/REGEX";

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
  const dispatch = useDispatch();

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
      const newAttendedSchool = await addNewAttendedSchool(formData).unwrap();
      //dispatch(attendedSchoolAdded(newAttendedSchool)); // Optionally update Redux state
      //console.log(newAttendedSchool,'newAttendedSchool')
      if (newAttendedSchool.data && newAttendedSchool.data.message) {
        // Success response
        triggerBanner(newAttendedSchool.data.message, "success");
      } else if (
        newAttendedSchool?.error &&
        newAttendedSchool?.error?.data &&
        newAttendedSchool?.error?.data?.message
      ) {
        // Error response
        triggerBanner(newAttendedSchool.error.data.message, "error");
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

  return (
    <>
      <AcademicsSet />
     

        <form onSubmit={handleSubmit} className="form-container">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Add New Attended School
        </h2>
          <div className="mb-4">
            <label htmlFor=""  className="formInputLabel">
              School Name
              <input
                aria-label="school name"
                aria-invalid={!validity.validSchoolName}
                placeholder="[6-20 letters]"
                type="text"
                name="schoolName"
                value={formData.schoolName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-700"
              />
              {!validity.validSchoolName && formData.schoolName && (
                <p className="text-red-600 text-sm">Invalid school name.</p>
              )}
            </label>
          </div>

          <div className="mb-4">
            <label htmlFor=""  className="formInputLabel">
              School City
              <input
                aria-label="school city"
                aria-invalid={!validity.validSchoolCity}
                placeholder="[3-20 letters]"
                type="text"
                name="schoolCity"
                value={formData.schoolCity}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-700"
              />
              {!validity.validSchoolCity && formData.schoolCity && (
                <p className="text-red-600 text-sm">Invalid school city.</p>
              )}
            </label>
          </div>

          <div className="mb-4">
            <label htmlFor=""  className="formInputLabel">
              School Type
              <select
                aria-label="school type"
                aria-invalid={!validity.validSchoolType}
                required
                name="schoolType"
                value={formData.schoolType}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-700"
              >
                <option value="">Select School Type</option>
                <option value="Public">Public</option>
                <option value="Private">Private</option>
                <option value="Charter">Charter</option>
                <option value="Other">Other</option>
              </select>
              {!validity.validSchoolType && formData.schoolType && (
                <p className="text-red-600 text-sm">
                  Please select a school type.
                </p>
              )}
            </label>
          </div>

          <div className="mb-4">
            <label htmlFor=""  className="formInputLabel">
              School Color
              <input
                type="color"
                name="schoolColor"
                value={formData.schoolColor}
                onChange={handleChange}
                className="w-full"
              />{" "}
            </label>
          </div>

          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
          {isError && (
            <p className="text-red-600 text-sm mt-2">
              {apiError?.data?.message || "Error adding the school."}
            </p>
          )}
          <div className="flex justify-end gap-4">
            <button
              aria-label="cancel new school"
              type="button"
              onClick={() =>
                navigate("/settings/academicsSet/attendedSchools/")
              }
              className="cancel-button"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full bg-sky-700 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
            >
              {isLoading ? "Adding..." : "Add School"}
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
