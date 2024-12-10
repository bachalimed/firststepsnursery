import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useUpdateClassroomMutation } from "./classroomsApiSlice";
import { classroomAdded } from "./classroomsSlice";
import AcademicsSet from "../../AcademicsSet";
import { NAME_REGEX } from "../../../../config/REGEX";
import ConfirmationModal from "../../../../Components/Shared/Modals/ConfirmationModal";
import { useOutletContext } from "react-router-dom";


const EditClassroomForm = ({ classroom }) => {
 
  //confirmation Modal states
const [showConfirmation, setShowConfirmation] = useState(false);

  const [formData, setFormData] = useState({
    schoolName: classroom.schoolName ,
    schoolCity: classroom.schoolCity ,
    schoolType: classroom.schoolType ,
    id:classroom._id
  });

  const [validity, setValidity] = useState({
    validSchoolName: false,
    validSchoolCity: false,
    validSchoolType: false,
  });

  const [error, setError] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [updateClassroom, { isLoading, isError, error: apiError, isSuccess }] =
  useUpdateClassroomMutation();

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
      navigate("/settings/academicsSet/classrooms/");
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
      const response = await updateClassroom(formData).unwrap();
      console.log(response,'response')
      if (response.data && response.data.message) {
        // Success response
        triggerBanner(response.data.message, "success");

      } else if (response?.error && response?.error?.data && response?.error?.data?.message) {
        // Error response
        triggerBanner(response.error.data.message, "error");
      } else {
        // In case of unexpected response format
        triggerBanner("Unexpected response from server.", "error");
      }
    } catch (error) {
      triggerBanner("Failed to update classroom. Please try again.", "error");

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
      <div className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Edit Attended School
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">School Name</label>
            <input
              type="text"
              name="schoolName"
              value={formData.schoolName}
              onChange={handleChange}
              placeholder="Enter school name"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-700"
            />
            {!validity.validSchoolName && formData.schoolName && (
              <p className="text-red-600 text-sm">Invalid school name.</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">School City</label>
            <input
              type="text"
              name="schoolCity"
              value={formData.schoolCity}
              onChange={handleChange}
              placeholder="Enter school city"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-700"
            />
            {!validity.validSchoolCity && formData.schoolCity && (
              <p className="text-red-600 text-sm">Invalid school city.</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">School Type</label>
            <select
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
              <p className="text-red-600 text-sm">Please select a school type.</p>
            )}
          </div>

          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
          {isError && (
            <p className="text-red-600 text-sm mt-2">
              {apiError?.data?.message || "Error adding the school."}
            </p>
          )}

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full bg-sky-700 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
          >
            {isLoading ? "Adding..." : "Add School"}
          </button>
        </form>
      </div>
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

export default EditClassroomForm;
