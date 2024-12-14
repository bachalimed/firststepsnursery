import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useUpdateAttendedSchoolMutation } from "./attendedSchoolsApiSlice";
import { attendedSchoolAdded } from "./attendedSchoolsSlice";
import AcademicsSet from "../../AcademicsSet";
import { NAME_REGEX } from "../../../../config/REGEX";
import ConfirmationModal from "../../../../Components/Shared/Modals/ConfirmationModal";
import { useOutletContext } from "react-router-dom";

const EditAttendedSchoolForm = ({ attendedSchool }) => {
  //confirmation Modal states
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState({
    schoolName: attendedSchool.schoolName,
    schoolCity: attendedSchool.schoolCity,
    schoolType: attendedSchool.schoolType,
    schoolColor: attendedSchool.schoolColor || "#FF5733", // Default color if none exists
    id: attendedSchool._id,
  });

  const [validity, setValidity] = useState({
    validSchoolName: false,
    validSchoolCity: false,
    validSchoolType: false,
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [
    updateAttendedSchool,
    { isLoading, isError, error: apiError, isSuccess },
  ] = useUpdateAttendedSchoolMutation();

  // Validate inputs using regex patterns
  useEffect(() => {
    setValidity({
      validSchoolName: NAME_REGEX.test(formData.schoolName),
      validSchoolCity: NAME_REGEX.test(formData.schoolCity),
      validSchoolType: !!formData.schoolType,
    });
  }, [formData]);

  // Redirect on success
  useEffect(() => {
    if (isSuccess) {
      navigate("/settings/academicsSet/attendedSchools/");
    }
  }, [isSuccess, navigate]);

  // Check if form is ready for submission
  const canSubmit = Object.values(validity).every(Boolean) && !isLoading;
  const { triggerBanner } = useOutletContext(); // Access banner trigger
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (canSubmit) {
      setShowConfirmation(true);
    }
  };

  const handleConfirmSave = async () => {
    // Close the confirmation modal
    setShowConfirmation(false);
    try {
      const response = await updateAttendedSchool(formData).unwrap();
      console.log(response, "response");
      if (response.data && response.data.message) {
        // Success response
        triggerBanner(response.data.message, "success");
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
      triggerBanner(
        "Failed to update attended school. Please try again.",
        "error"
      );

      console.error("Error saving:", error);
    }
  };

  // Close the modal without saving
  const handleCloseModal = () => {
    setShowConfirmation(false);
  };
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <AcademicsSet />
     

        <form onSubmit={handleSubmit} className="form-container">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Edit Attended School
        </h2>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
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
            <label className="block text-gray-700 font-bold mb-2">
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
            <label className="block text-gray-700 font-bold mb-2">
              School Type
              <select
                required
                name="schoolType"
                aria-label="school type"
                aria-invalid={!validity.validSchoolType}
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
              )}{" "}
            </label>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              School Color
              <div className="flex items-center">
                {/* Square displaying the selected color */}
                <div
                  className="w-8 h-8 mr-4 border"
                  style={{ backgroundColor: formData.schoolColor }}
                ></div>
                {/* Color input field */}
                <input
                  type="color"
                  name="schoolColor"
                  value={formData.schoolColor}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-700"
                />
              </div>
            </label>
          </div>

          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
          {isError && (
            <p className="text-red-600 text-sm mt-2">
              {apiError?.data?.message || "Error updating the school."}
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
              {isLoading ? "Updating..." : "Update School"}
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

export default EditAttendedSchoolForm;
