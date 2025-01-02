import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUpdateClassroomMutation } from "./classroomsApiSlice";
import AcademicsSet from "../../AcademicsSet";
import { NAME_REGEX, SMALLNUMBER_REGEX } from "../../../../config/REGEX";
import ConfirmationModal from "../../../../Components/Shared/Modals/ConfirmationModal";
import { useOutletContext } from "react-router-dom";

const EditClassroomForm = ({ classroom }) => {
  useEffect(()=>{document.title="Edit Classroom"})

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

  const [updateClassroom, { isLoading:isUpdateLoading, isError:isUpdateError, error: updateError, isSuccess:isUpdateSuccess }] =
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
    if (isUpdateSuccess) {
      setFormData({});
      setError("");
      navigate("/settings/academicsSet/classrooms/");
    }
  }, [isUpdateSuccess, navigate]);

  // Check if form is ready for submission
  const canSubmit = Object.values(validity).every(Boolean) && !isUpdateLoading;

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
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // console.log(validity, "validity");
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
                  placeholder="[3-25 letters]"
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
              disabled={!canSubmit || isUpdateLoading}
              className="save-button"
            >
              {isUpdateLoading ? "Adding..." : "Add Classroom"}
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

export default EditClassroomForm;
