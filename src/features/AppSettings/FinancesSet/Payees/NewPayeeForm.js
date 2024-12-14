import { useState, useEffect } from "react";
import { useAddNewPayeeMutation } from "./payeesApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { ROLES } from "../../../../config/UserRoles";
import { ACTIONS } from "../../../../config/UserActions";
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
  NUMBER_REGEX,
  USER_REGEX,
  PHONE_REGEX,
  DATE_REGEX,
  YEAR_REGEX,
} from "../../../../config/REGEX";
import ConfirmationModal from "../../../../Components/Shared/Modals/ConfirmationModal";
import { EXPENSE_CATEGORIES } from "../../../../config/ExpenseCategories";
import { useOutletContext } from "react-router-dom";

const NewPayeeForm = () => {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  const academicYears = useSelector(selectAllAcademicYears);

  const [addNewPayee, { isLoading, isSuccess, isError, error }] =
    useAddNewPayeeMutation();

  //confirmation Modal states
  const [showConfirmation, setShowConfirmation] = useState(false);
  // Consolidated form state
  const [formData, setFormData] = useState({
    payeeLabel: "",
    payeePhone: "",
    payeeAddress: "",
    payeeNotes: "",
    payeeIsActive: true,
    payeeYears: [],
    //payeeCategories: [],
    payeeOperator: userId,
    payeeCreator: userId,
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
    if (isSuccess) {
      setFormData({
        payeeLabel: "",
        payeePhone: "",
        payeeAddress: "",
        payeeNotes: "",
        payeeIsActive: false,
        payeeYears: [],
        //payeeCategories: [],
        payeeOperator: "",
        payeeCreator: "",
      });
      navigate("/settings/financesSet/payeesList/");
    }
  }, [isSuccess, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleYearChange = (year) => {
    setFormData((prev) => {
      const updatedYears = prev.payeeYears.includes(year)
        ? prev.payeeYears.filter((yr) => yr !== year)
        : [...prev.payeeYears, year];
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

  const canSave = Object.values(validity).every(Boolean) && !isLoading;
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
      const response =await addNewPayee(formData);
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
      triggerBanner("Failed to add payee. Please try again.", "error");

      console.error("Error saving:", error);
    }
  };

  // Close the modal without saving
  const handleCloseModal = () => {
    setShowConfirmation(false);
  };
  console.log(validity, "valisty");

  console.log(formData, "formData");
  const content = (
    <>
      <FinancesSet />
      <section className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">
          Add New Payee: {`${formData?.payeeLabel} `}
        </h2>
        {isError && (
          <p className="text-red-600">Error: {error?.data?.message}</p>
        )}
        <form onSubmit={onSavePayeeClicked} className="space-y-6">
          {/* Payee Label */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Payee Label{" "}
              {!validity.validPayeeLabel && (
                <span className="text-red-600">*</span>
              )}
            
            <input
             aria-label="payee label"
             aria-invalid={!validity.validPayeeLabel}
             placeholder="[3-20 characters]"
              type="text"
              name="payeeLabel"
              value={formData.payeeLabel}
              onChange={handleInputChange}
              className={`mt-1 block w-full border ${
                validity.validPayeeLabel ? "border-gray-300" : "border-red-600"
              } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
              
              required
            /></label>
          </div>
          {/* Payee Active Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Payee Is Active
            
            <input
             aria-label="payee is active"
             
              type="checkbox"
              name="payeeIsActive"
              checked={formData.payeeIsActive}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  payeeIsActive: e.target.checked,
                }))
              }
              className="h-4 w-4 text-blue-600 focus:ring-sky-700 border-gray-300 rounded"
            /></label>
          </div>

          {/* Payee Years Selection - Using Checkboxes */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Payee Years{" "}
              {!validity.validPayeeYears && (
                <span className="text-red-600">*</span>
              )}
            
            <div className="space-y-2">
              {academicYears.map((year) => (
                <div key={year.id} className="flex items-center">
                  <input
                   aria-label="payee year"
                    type="checkbox"
                    id={`year-${year.id}`}
                    checked={formData.payeeYears.includes(year.title)}
                    onChange={() => handleYearChange(year.title)}
                    className="h-4 w-4 text-blue-600 focus:ring-sky-700 border-gray-300 rounded"
                  />
                  <label
                    htmlFor={`year-${year.id}`}
                    className="ml-2 text-sm font-medium text-gray-700"
                  >
                    {year.title}
                  </label>
                </div>
              ))}
            </div></label>
          </div>

          {/* Payee Categories Selection */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700">
              Payee Categories{" "}
              {!validity.validPayeeCategories && (
                <span className="text-red-600">*</span>
              )}
            </label>
            <div className="space-y-2">
              {Object.values(EXPENSE_CATEGORIES).map((category) => (
                <div key={category} className="flex items-center">
                  <input
                    type="checkbox"
                    id={category}
                    checked={formData.payeeCategories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                    className="h-4 w-4 text-blue-600 focus:ring-sky-700 border-gray-300 rounded"
                  />
                  <label
                    htmlFor={category}
                    className="ml-2 text-sm font-medium text-gray-700"
                  >
                    {category}
                  </label>
                </div>
              ))}
            </div>
          </div> */}

          {/* Contact Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Payee Phone{" "}
                {!validity.validPayeePhone && (
                  <span className="text-red-600">*</span>
                )}
              
              <input
               aria-label="payee phone"
               aria-invalid={!validity.validPayeePhone}
               placeholder="[6-15 digits]"
                type="text"
                name="payeePhone"
                value={formData.payeePhone}
                onChange={handleInputChange}
                className={`mt-1 block w-full border ${
                  validity.validPayeePhone
                    ? "border-gray-300"
                    : "border-red-600"
                } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
               
                
              /></label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Payee Address{" "}
                {!validity.validPayeeAddress && (
                  <span className="text-red-600">*</span>
                )}
             
              <input
               aria-label="payee address"
               aria-invalid={!validity.validPayeeAddress}
               placeholder=" [3-20 characters]"
                type="text"
                name="payeeAddress"
                value={formData.payeeAddress}
                onChange={handleInputChange}
                className={`mt-1 block w-full border ${
                  validity.validPayeeAddress
                    ? "border-gray-300"
                    : "border-red-600"
                } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
                
           
              /> </label>
            </div>
          </div>

          {/* Payee Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Payee Notes{" "}
              {!validity.validPayeeNotes && (
                <span className="text-red-600">*</span>
              )}
            
            <textarea
            aria-label="payee notes"
            aria-invalid={!validity.validPayeeNotes}
            placeholder=" [1-150 characters]"
              name="payeeNotes"
              value={formData.payeeNotes}
              onChange={handleInputChange}
              className={`mt-1 block w-full border ${
                validity.validPayeeNotes ? "border-gray-300" : "border-red-600"
              } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
              
           
            ></textarea></label>
          </div>

          {/* Save Button */}
          <div className="flex justify-end space-x-4">
            <button
             aria-label="cancel add payee"
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
              disabled={!canSave || isLoading}
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
      </section>
    </>
  );

  return content;
};

export default NewPayeeForm;
