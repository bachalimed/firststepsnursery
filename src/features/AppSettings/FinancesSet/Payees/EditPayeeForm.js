import { useState, useEffect } from "react";
import { useUpdatePayeeMutation } from "./payeesApiSlice";
import { useNavigate, useOutletContext } from "react-router-dom";
import FinancesSet from "../../FinancesSet";
import useAuth from "../../../../hooks/useAuth";
import { useSelector } from "react-redux";
import {
  selectAllAcademicYears,
  selectCurrentAcademicYearId,
  selectAcademicYearById,
} from "../../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import {
  COMMENT_REGEX,
  NAME_REGEX,
  PHONE_REGEX,
} from "../../../../config/REGEX";
import ConfirmationModal from "../../../../Components/Shared/Modals/ConfirmationModal";

const EditPayeeForm = ({ payee }) => {
  useEffect(()=>{document.title="Edit Payee"})

  const navigate = useNavigate();
  const { userId,isAdmin } = useAuth();
  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  const academicYears = useSelector(selectAllAcademicYears);

  const [updatePayee, { isLoading:isUpdateLoading, isSuccess:isUpdateSuccess, isError:isUpdateError, error:updateError }] =
    useUpdatePayeeMutation();

  //confirmation Modal states
  const [showConfirmation, setShowConfirmation] = useState(false);
  // Consolidated form state
  const [formData, setFormData] = useState({
    id: payee?._id,
    payeeLabel: payee?.payeeLabel,
    payeePhone: payee?.payeePhone,
    payeeAddress: payee?.payeeAddress,
    payeeNotes: payee?.payeeNotes,
    payeeIsActive: payee?.payeeIsActive,
    payeeYears: payee?.payeeYears,
    //payeeCategories: payee?.payeeCategories,
    payeeOperator: userId,
  });

  const [validity, setValidity] = useState({
    validPayeeLabel: false,
    validPayeePhone: false,
    validPayeeAddress: false,
    validPayeeNotes: false,
    validPayeeYears: false,
    //validPayeeCategories: false,
  });

  // Validate inputs using regex patterns
  useEffect(() => {
    setValidity((prev) => ({
      ...prev,

      validPayeeLabel: NAME_REGEX.test(formData.payeeLabel),
      validPayeePhone:
        PHONE_REGEX.test(formData.payeePhone) || formData?.payeePhone === "",
      validPayeeAddress:
        COMMENT_REGEX.test(formData.payeeAddress) ||
        formData?.payeeAddress === "",
      validPayeeNotes: COMMENT_REGEX.test(formData.payeeNotes),
      validPayeeYears: formData?.payeeYears?.length > 0,
      //validPayeeCategories: formData?.payeeCategories?.length > 0,
    }));
  }, [formData]);

  useEffect(() => {
    if (isUpdateSuccess) {
      setFormData({});
      navigate("/settings/financesSet/payeesList/");
    }
  }, [isUpdateSuccess, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleYearChange = (year) => {
    setFormData((prev) => {
      // Check if the year is already selected
      const isSelected = prev.payeeYears.includes(year);
  
      // If the year is selected and the user is not an admin, prevent removal
      if (isSelected && !isAdmin) {
        return prev; // Return the unchanged state
      }
  
      // Proceed with adding or removing the year
      const updatedYears = isSelected
        ? prev.payeeYears.filter((yr) => yr !== year) // Remove the year (allowed for admins only)
        : [...prev.payeeYears, year]; // Add the year
  
      return { ...prev, payeeYears: updatedYears };
    });
  };

  // const handleCategoryChange = (category) => {
  //   setFormData((prev) => {
  //     const updatedCategories = prev.payeeCategories.includes(category)
  //       ? prev.payeeCategories.filter((cat) => cat !== category)
  //       : [...prev.payeeCategories, category];
  //     return { ...prev, payeeCategories: updatedCategories };
  //   });
  // };

  const canSave = Object.values(validity).every(Boolean) && !isUpdateLoading;
  const { triggerBanner } = useOutletContext(); // Access banner trigger
  const onSavePayeeClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      setShowConfirmation(true);
    }
  };
  // This function handles the confirmed save action
  const handleConfirmSave = async () => {
    // Close the confirmation modal
    setShowConfirmation(false);

    try {
      const response = await updatePayee(formData);
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
  // console.log(validity, "valisty");

  // console.log(formData, "formData");
  const content = (
    <>
      <FinancesSet />
      <form onSubmit={onSavePayeeClicked} className="form-container">
        <h2 className="formTitle ">New Payee: {`${formData?.payeeLabel} `}</h2>
        <div className="formSectionContainer">
          <h3 className="formSectionTitle">Payee details</h3>
          <div className="formSection">
            <div className="formLineDiv">
              {/* Payee Active Status */}
              <label className="formInputLabel">
                Payee Active:
                <div className="formCheckboxItemsDiv">
                  <label htmlFor="payeeIsActive" className="formCheckboxChoice">
                    <input
                      aria-label="payee is active"
                      type="checkbox"
                      id="payeeIsActive"
                      name="payeeIsActive"
                      checked={formData.payeeIsActive}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          payeeIsActive: e.target.checked,
                        }))
                      }
                      className={`formCheckbox`}
                    />
                    Payee Is Active
                  </label>
                </div>
              </label>
              {/* Payee Label */}

              <label htmlFor="payeeLabel" className="formInputLabel">
                Payee Label{" "}
                {!validity.validPayeeLabel && (
                  <span className="text-red-600">*</span>
                )}
                <input
                  aria-label="payee label"
                  aria-invalid={!validity.validPayeeLabel}
                  placeholder="[3-25 characters]"
                  type="text"
                  id="payeeLabel"
                  name="payeeLabel"
                  value={formData.payeeLabel}
                  onChange={handleInputChange}
                  className={`formInputText`}
                  required
                />
              </label>
            </div>

            {/* Payee Years Selection - Using Checkboxes */}
            <h3 className="formSectionTitle">Payee years</h3>
            <div className="formSection">
              <div className="formInputLabel">
                Select year(s){" "}
                {!validity.validPayeeYears && (
                  <span className="text-red-600">*</span>
                )}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2 mt-1 max-h-80 overflow-y-auto">
                  {academicYears
                    .filter((year) => year?.title !== "1000")
                    .map((year, index) => {
                      const isSelected = formData.payeeYears.includes(
                        year.title
                      );
                      return (
                        <button
                          aria-label="selectYears"
                          key={index}
                          type="button"
                          onClick={() => handleYearChange(year?.title)} // Use onClick instead of onChange
                          className={`px-3 py-2 text-left rounded-md ${
                            isSelected
                              ? "bg-sky-700 text-white hover:bg-sky-600"
                              : "bg-gray-200 text-gray-700 hover:bg-sky-600 hover:text-white"
                          }`}
                        >
                          <div className="font-semibold">{year?.title}</div>
                        </button>
                      );
                    })}
                </div>
              </div>
            </div>
            <div className="formLineDiv">
              {/* Contact Information */}

              <label htmlFor="payeePhone" className="formInputLabel">
                Payee Phone{" "}
                {!validity.validPayeePhone && (
                  <span className="text-red-600">*</span>
                )}
                <input
                  aria-label="payee phone"
                  aria-invalid={!validity.validPayeePhone}
                  placeholder="[6-15 digits]"
                  type="text"
                  id="payeePhone"
                  name="payeePhone"
                  value={formData.payeePhone}
                  onChange={handleInputChange}
                  className={`formInputText`}
                />
              </label>

              <label htmlFor="payeeAddress" className="formInputLabel">
                Payee Address{" "}
                {!validity.validPayeeAddress && (
                  <span className="text-red-600">*</span>
                )}
                <input
                  aria-label="payee address"
                  aria-invalid={!validity.validPayeeAddress}
                  placeholder=" [3-25 characters]"
                  type="text"
                  id="payeeAddress"
                  name="payeeAddress"
                  value={formData.payeeAddress}
                  onChange={handleInputChange}
                  className={`formInputText`}
                />{" "}
              </label>
            </div>

            {/* Payee Notes */}

            <label htmlFor="payeeNotes" className="formInputLabel">
              Payee Notes{" "}
              {!validity.validPayeeNotes && (
                <span className="text-red-600">*</span>
              )}
              <textarea
                aria-label="payee notes"
                aria-invalid={!validity.validPayeeNotes}
                placeholder=" [1-150 characters]"
                id="payeeNotes"
                name="payeeNotes"
                value={formData.payeeNotes}
                onChange={handleInputChange}
                className={`formInputText`}
              ></textarea>
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="cancelSavebuttonsDiv">
          <button
            aria-label="cancel edit payee"
            type="button"
            className="cancel-button"
            onClick={() => navigate("/settings/financesSet/payeesList/")}
          >
            Cancel
          </button>
          <button
            aria-label="submit payee"
            type="submit"
            className="save-button"
            disabled={!canSave || isUpdateLoading}
          >
            <span className="ml-2">Save Payee</span>
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

  return content;
};

export default EditPayeeForm;
