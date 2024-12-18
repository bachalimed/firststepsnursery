import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useUpdateClassroomMutation } from "./classroomsApiSlice";
import { classroomAdded } from "./classroomsSlice";
import AcademicsSet from "../../AcademicsSet";
import { NAME_REGEX, SMALLNUMBER_REGEX } from "../../../../config/REGEX";
import ConfirmationModal from "../../../../Components/Shared/Modals/ConfirmationModal";
import { useOutletContext } from "react-router-dom";

const EditClassroomForm = ({ classroom }) => {
  //confirmation Modal states
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [formData, setFormData] = useState({
    id: classroom._id,
    classroomNumber: classroom?.classroomNumber,
    classroomLabel: classroom?.classroomLabel,
    classroomCapacity: classroom?.classroomCapacity,
    classroomMaxCapacity: classroom?.classroomMaxCapacity,
    classroomColor: classroom?.classroomColor,
  });

  const [validity, setValidity] = useState({
    validClassroomNumber: false,
    validClassroomLabel: false,
    validClassroomCapacity: false,
    validClassroomMaxCapacity: false,
  });

  const [error, setError] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [updateClassroom, { isLoading, isError, error: apiError, isSuccess }] =
    useUpdateClassroomMutation();

  // Validate inputs using regex patterns
  useEffect(() => {
    setValidity((prev) => ({
      ...prev,
      validClassroomLabel: NAME_REGEX.test(formData.classroomLabel),
      validClassroomNumber: SMALLNUMBER_REGEX.test(formData.classroomNumber),

      validClassroomCapacity: SMALLNUMBER_REGEX.test(
        formData.classroomCapacity
      ),
      validClassroomMaxCapacity: SMALLNUMBER_REGEX.test(
        formData.classroomMaxCapacity
      ),
    }));
  }, [formData]);

  // Redirect on success
  useEffect(() => {
    if (isSuccess) {
      setFormData({
        classroomNumber: "",
        classroomLabel: "",
        classroomCapacity: "",
        classroomMaxCapacity: "",

        classroomColor: "#FF5733", // Reset to default color
      });
      setError("");
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
      const response = await updateClassroom(formData); //.unwrap();
 
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
      triggerBanner("Failed to update classroom. Please try again.", "error");

      console.error("Error updating classroom:", error);
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
  console.log(validity, "validity");
  return (
    <>
      <AcademicsSet />

      <form onSubmit={handleSubmit} className="form-container">
        <h2 className="text-2xl font-bold mb-6 text-center">Edit Classroom</h2>
        <div className="mb-4">
          <label htmlFor=""  className="formInputLabel">
            Classroom Number
            <input
              aria-label="classroom number"
              aria-invalid={!validity.validClassroomNumber}
              placeholder="[1-4 digits]"
              type="text"
              name="classroomNumber"
              value={formData.classroomNumber}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-700"
            />
            {!validity.validClassroomNumber && formData.classroomNumber && (
              <p className="text-red-600 text-sm">Invalid classroom number.</p>
            )}
          </label>
        </div>
        <div className="mb-4">
          <label htmlFor=""  className="formInputLabel">
            Classroom Label
            <input
              aria-label="classroom label"
              aria-invalid={!validity.validClassroomLabel}
              placeholder="[3-20 letters]"
              type="text"
              name="classroomLabel"
              value={formData.classroomLabel}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-700"
            />
            {!validity.validClassroomLabel && formData.classroomLabel && (
              <p className="text-red-600 text-sm">Invalid classroom label.</p>
            )}
          </label>
        </div>

        <div className="mb-4">
          <label htmlFor=""  className="formInputLabel">
            Classroom Capacity
            <input
              aria-label="classroom capacity"
              aria-invalid={!validity.validClassroomCapacity}
              placeholder="[1-2 digits]"
              type="text"
              name="classroomCapacity"
              value={formData.classroomCapacity}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-700"
            />
            {!validity.validClassroomCapacity && formData.classroomCapacity && (
              <p className="text-red-600 text-sm">
                Invalid classroom capacity.
              </p>
            )}
          </label>
        </div>
        <div className="mb-4">
          <label htmlFor=""  className="formInputLabel">
            Classroom Max Capacity
            <input
              aria-label="classroom max capacity"
              aria-invalid={!validity.validClassroomMaxCapacity}
              placeholder="[1-2 digits]"
              type="text"
              name="classroomMaxCapacity"
              value={formData.classroomMaxCapacity}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-700"
            />
            {!validity.validClassroomMaxCapacity &&
              formData.classroomMaxCapacity && (
                <p className="text-red-600 text-sm">
                  Invalid classroom max capacity.
                </p>
              )}
          </label>
        </div>

        <div className="mb-4">
          <label htmlFor=""  className="formInputLabel">
            Classroom Color
            <input
              type="color"
              name="classroomColor"
              value={formData.classroomColor}
              onChange={handleChange}
              className="w-full"
            />{" "}
          </label>
        </div>

        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        {isError && (
          <p className="text-red-600 text-sm mt-2">
            {apiError?.data?.message || "Error adding the classroom."}
          </p>
        )}
        <div className="flex justify-end gap-4">
          <button
            aria-label="cancel new classroom"
            type="button"
            onClick={() => navigate("/settings/academicsSet/classrooms/")}
            className="cancel-button"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full bg-sky-700 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
          >
            {isLoading ? "Adding..." : "Add Classroom"}
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

export default EditClassroomForm;
