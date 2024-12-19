import ConfirmationModal from "../../../../Components/Shared/Modals/ConfirmationModal";
import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useAddNewClassroomMutation } from "./classroomsApiSlice"; // Redux API action

import AcademicsSet from "../../AcademicsSet";
import {
  NAME_REGEX,
  SMALLNUMBER_REGEX,
} from "../../../../config/REGEX";

const NewClassroomForm = () => {
  const [formData, setFormData] = useState({
    classroomNumber: "",
    classroomLabel: "",
    classroomCapacity: "",
    classroomMaxCapacity: "",
    classroomColor: "#FF5733", // Default color
  });

  const [validity, setValidity] = useState({
    validClassroomNumber: false,
    validClassroomLabel: false,
    validClassroomCapacity: false,
    validClassroomMaxCapacity: false,
  });

  const navigate = useNavigate();

  // Redux mutation for adding the attended classroom
  const [addNewClassroom, { isLoading, isError, error, isSuccess }] =
    useAddNewClassroomMutation();
  //confirmation Modal states
  const [showConfirmation, setShowConfirmation] = useState(false);
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

  // Clear form and errors on success
  useEffect(() => {
    if (isSuccess) {
      setFormData({
        classroomNumber: "",
        classroomLabel: "",
        classroomCapacity: "",
        classroomMaxCapacity: "",

        classroomColor: "#FF5733", // Reset to default color
      });

      navigate("/settings/academicsSet/classrooms/");
    }
  }, [isSuccess, navigate]);

  // Check if all fields are valid and enable the submit button
  const canSubmit = Object.values(validity).every(Boolean) && !isLoading;

  const { triggerBanner } = useOutletContext(); // Access banner trigger

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure all fields are valid
    if (canSubmit) {
      // Show the confirmation modal before saving
      setShowConfirmation(true);
    }
  };

  // This function handles the confirmed save action
  const handleConfirmSave = async () => {
    // Close the confirmation modal
    setShowConfirmation(false);

    try {
      const response = await addNewClassroom(formData); //.unwrap();
      //dispatch(classroomAdded(newClassroom)); // Optionally update Redux state
      console.log(response, "response");
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
      triggerBanner("Failed to create classroom. Please try again.", "error");

      console.error("Error creating classroom:", error);
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
        <h2 className="formTitle">New Classroom</h2>
        <div className="formSectionContainer">
          <h3 className="formSectionTitle">Classroom details</h3>
          <div className="formSection">
            <div className="formLineDiv">
              <label htmlFor="classroomNumber" className="formInputLabel">
                Classroom Number{" "}
                {!validity.validClassroomNumber && (
                  <span className="text-red-600 text-sm">*</span>
                )}
                <input
                  aria-label="classroom number"
                  aria-invalid={!validity.validClassroomNumber}
                  placeholder="[1-4 digits]"
                  type="text"
                  id="classroomNumber"
                  name="classroomNumber"
                  value={formData.classroomNumber}
                  onChange={handleChange}
                  required
                  className={`formInputText`}
                  
                />
              </label>

              <label htmlFor="classroomLabel" className="formInputLabel">
                Classroom Label{" "}
                {!validity.validClassroomLabel && (
                  <span className="text-red-600 text-sm">*</span>
                )}
                <input
                  aria-label="classroom label"
                  aria-invalid={!validity.validClassroomLabel}
                  placeholder="[3-20 letters]"
                  type="text"
                  id="classroomLabel"
                  name="classroomLabel"
                  value={formData.classroomLabel}
                  onChange={handleChange}
                  required
                  className={`formInputText`}
                />
              </label>

              <label htmlFor="classroomCapacity" className="formInputLabel">
                Classroom Capacity{" "}
                {!validity.validClassroomCapacity && (
                  <span className="text-red-600 text-sm">*</span>
                )}
                <input
                  aria-label="classroom capacity"
                  aria-invalid={!validity.validClassroomCapacity}
                  placeholder="[1-2 digits]"
                  type="text"
                  id="classroomCapacity"
                  name="classroomCapacity"
                  value={formData.classroomCapacity}
                  onChange={handleChange}
                  required
                  className={`formInputText`}
                />
              </label>

              <label htmlFor="classroomMaxCapacity" className="formInputLabel">
                Classroom Max Capacity{" "}
                {!validity.validClassroomMaxCapacity && (
                  <span className="text-red-600 text-sm">*</span>
                )}
                <input
                  aria-label="classroom max capacity"
                  aria-invalid={!validity.validClassroomMaxCapacity}
                  placeholder="[1-2 digits]"
                  type="text"
                  id="classroomMaxCapacity"
                  name="classroomMaxCapacity"
                  value={formData.classroomMaxCapacity}
                  onChange={handleChange}
                  required
                  className={`formInputText`}
                />
              </label>
            </div>

            <label htmlFor="" className="formInputLabel">
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

          <div className="cancelSavebuttonsDiv">
            <button
              aria-label="cancel new classroom"
              type="button"
              onClick={() => navigate("/settings/academicsSet/classrooms/")}
              className="cancel-button"
            >
              Cancel
            </button>
            <button
              aria-label="submit classroom"
              type="submit"
              disabled={!canSubmit || isLoading}
              className="save-button"
            >
              {isLoading ? "Adding..." : "Add Classroom"}
            </button>
          </div>
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

export default NewClassroomForm;
