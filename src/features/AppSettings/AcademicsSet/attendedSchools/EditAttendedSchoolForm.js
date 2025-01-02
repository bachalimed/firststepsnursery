import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useUpdateAttendedSchoolMutation } from "./attendedSchoolsApiSlice";
import AcademicsSet from "../../AcademicsSet";
import { NAME_REGEX } from "../../../../config/REGEX";
import ConfirmationModal from "../../../../Components/Shared/Modals/ConfirmationModal";
import { SchoolTypeOptions } from "../../../../config/Constants";
const EditAttendedSchoolForm = ({ attendedSchool }) => {
  useEffect(()=>{document.title="Edit Attended School"})

  //confirmation Modal states
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState({
    schoolName: attendedSchool?.schoolName,
    schoolCity: attendedSchool?.schoolCity,
    schoolType: attendedSchool?.schoolType,
    schoolColor: attendedSchool?.schoolColor || "#FF5733", // Default color if none exists
    id: attendedSchool._id,
  });

  const [validity, setValidity] = useState({
    validSchoolName: false,
    validSchoolCity: false,
    validSchoolType: false,
  });
  // console.log(attendedSchool,'attendedSchool')
  // console.log(validity,'validity')
  // console.log(formData,'formdata')
  
  const navigate = useNavigate();

  const [
    updateAttendedSchool,
    { isLoading:isUpdateLoading, isError:isUpdateError, error:updateError, isSuccess:isUpdateSuccess },
  ] = useUpdateAttendedSchoolMutation();

  // Validate inputs using regex patterns
  useEffect(() => {
    setValidity({
      validSchoolName: NAME_REGEX.test(formData.schoolName),
      validSchoolCity: NAME_REGEX.test(formData.schoolCity),
      validSchoolType: NAME_REGEX.test(formData.schoolType),
    });
  }, [formData]);

  // Redirect on success
  useEffect(() => {
    if (isUpdateSuccess) {
      setFormData({})
      navigate("/settings/academicsSet/attendedSchools/");
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
      const response = await updateAttendedSchool(formData).unwrap();
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

  return (
    <>
      <AcademicsSet />

      <form onSubmit={handleSubmit} className="form-container">
        <h2 className="formTitle">Edit School</h2>
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
                  value={formData?.schoolName}
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
                  placeholder="[3-25 letters]"
                  type="text"
                  id="schoolCity"
                  name="schoolCity"
                  value={formData?.schoolCity}
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
                  value={formData?.schoolType}
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
          <button type="submit" disabled={!canSubmit||isUpdateLoading} className="save-button">
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

export default EditAttendedSchoolForm;
