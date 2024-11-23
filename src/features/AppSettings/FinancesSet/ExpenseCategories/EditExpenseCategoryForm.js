import { useState, useEffect } from "react";
import { useUpdateExpenseCategoryMutation } from "./expenseCategoriesApiSlice";
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
} from "../../AcademicsSet/AcademicYears/academicYearsSlice";
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
const EditExpenseCategoryForm = ({expenseCategory}) => {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  const academicYears = useSelector(selectAllAcademicYears);

  const [updateExpenseCategory, { isLoading, isSuccess, isError, error }] =
    useUpdateExpenseCategoryMutation();

  //confirmation Modal states
  const [showConfirmation, setShowConfirmation] = useState(false);
  // Consolidated form state
  const [formData, setFormData] = useState({
    id:expenseCategory?._id,
    expenseCategoryLabel: expenseCategory?.expenseCategoryLabel,
    expenseCategoryPhone: expenseCategory?.expenseCategoryPhone,
    expenseCategoryAddress: expenseCategory?.expenseCategoryAddress,
    expenseCategoryNotes: expenseCategory?.expenseCategoryNotes,
    expenseCategoryIsActive: expenseCategory?.expenseCategoryIsActive,
    expenseCategoryYears: expenseCategory?.expenseCategoryYears,
    //expenseCategoryCategories: expenseCategory?.expenseCategoryCategories,
    expenseCategoryOperator: userId,
  });

  const [validity, setValidity] = useState({
    validExpenseCategoryLabel: false,
    validExpenseCategoryPhone: false,
    validExpenseCategoryAddress: false,
    validExpenseCategoryNotes: false,
    validExpenseCategoryYears: false,
    //validExpenseCategoryCategories: false,
  });

  // Validate inputs using regex patterns
  useEffect(() => {
    setValidity((prev) => ({
      ...prev,

      validExpenseCategoryLabel: NAME_REGEX.test(formData.expenseCategoryLabel),
      validExpenseCategoryPhone:
        PHONE_REGEX.test(formData.expenseCategoryPhone) || formData?.expenseCategoryPhone === "",
      validExpenseCategoryAddress:
        COMMENT_REGEX.test(formData.expenseCategoryAddress) ||
        formData?.expenseCategoryAddress === "",
      validExpenseCategoryNotes: COMMENT_REGEX.test(formData.expenseCategoryNotes),
      validExpenseCategoryYears: formData?.expenseCategoryYears?.length > 0,
      //validExpenseCategoryCategories: formData?.expenseCategoryCategories?.length > 0,
    }));
  }, [formData]);

  useEffect(() => {
    if (isSuccess) {
      setFormData({
        expenseCategoryLabel: "",
        expenseCategoryPhone: "",
        expenseCategoryAddress: "",
        expenseCategoryNotes: "",
        expenseCategoryIsActive: "",
        expenseCategoryYears: [],
        //expenseCategoryCategories: [],
        expenseCategoryOperator: "",

      });
      navigate("/settings/financesSet/expenseCategoriesList/");
    }
  }, [isSuccess, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleYearChange = (year) => {
    setFormData((prev) => {
      const updatedYears = prev.expenseCategoryYears.includes(year)
        ? prev.expenseCategoryYears.filter((yr) => yr !== year)
        : [...prev.expenseCategoryYears, year];
      return { ...prev, expenseCategoryYears: updatedYears };
    });
  };

  // const handleCategoryChange = (category) => {
  //   setFormData((prev) => {
  //     const updatedCategories = prev.expenseCategoryCategories.includes(category)
  //       ? prev.expenseCategoryCategories.filter((cat) => cat !== category)
  //       : [...prev.expenseCategoryCategories, category];
  //     return { ...prev, expenseCategoryCategories: updatedCategories };
  //   });
  // };

  const canSave = Object.values(validity).every(Boolean) && !isLoading;

  const onSaveExpenseCategoryClicked = async (e) => {
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
      await updateExpenseCategory(formData);
    } catch (err) {
      console.error("Failed to save the expenseCategory:", err);
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
          Add New ExpenseCategory: {`${formData?.expenseCategoryLabel} `}
        </h2>
        {isError && (
          <p className="text-red-500">Error: {error?.data?.message}</p>
        )}
        <form onSubmit={onSaveExpenseCategoryClicked} className="space-y-6">
          {/* ExpenseCategory Label */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              ExpenseCategory Label{" "}
              {!validity.validExpenseCategoryLabel && (
                <span className="text-red-500">*</span>
              )}
            </label>
            <input
              type="text"
              name="expenseCategoryLabel"
              value={formData.expenseCategoryLabel}
              onChange={handleInputChange}
              className={`mt-1 block w-full border ${
                validity.validExpenseCategoryLabel ? "border-gray-300" : "border-red-500"
              } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
              placeholder="Enter ExpenseCategory Label"
              required
            />
          </div>
          {/* ExpenseCategory Active Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              ExpenseCategory Is Active
            </label>
            <input
              type="checkbox"
              name="expenseCategoryIsActive"
              checked={formData.expenseCategoryIsActive}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  expenseCategoryIsActive: e.target.checked,
                }))
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>

          {/* ExpenseCategory Years Selection - Using Checkboxes */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              ExpenseCategory Years{" "}
              {!validity.validExpenseCategoryYears && (
                <span className="text-red-500">*</span>
              )}
            </label>
            <div className="space-y-2">
              {academicYears.map((year) => (
                <div key={year.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`year-${year.id}`}
                    checked={formData.expenseCategoryYears.includes(year.title)}
                    onChange={() => handleYearChange(year.title)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor={`year-${year.id}`}
                    className="ml-2 text-sm font-medium text-gray-700"
                  >
                    {year.title}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* ExpenseCategory Categories Selection */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700">
              ExpenseCategory Categories{" "}
              {!validity.validExpenseCategoryCategories && (
                <span className="text-red-500">*</span>
              )}
            </label>
            <div className="space-y-2">
              {Object.values(EXPENSE_CATEGORIES).map((category) => (
                <div key={category} className="flex items-center">
                  <input
                    type="checkbox"
                    id={category}
                    checked={formData.expenseCategoryCategories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
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
                ExpenseCategory Phone{" "}
                {!validity.validExpenseCategoryPhone && (
                  <span className="text-red-500">*</span>
                )}
              </label>
              <input
                type="text"
                name="expenseCategoryPhone"
                value={formData.expenseCategoryPhone}
                onChange={handleInputChange}
                className={`mt-1 block w-full border ${
                  validity.validExpenseCategoryPhone
                    ? "border-gray-300"
                    : "border-red-500"
                } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
                placeholder="Enter ExpenseCategory Phone"
                
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                ExpenseCategory Address{" "}
                {!validity.validExpenseCategoryAddress && (
                  <span className="text-red-500">*</span>
                )}
              </label>
              <input
                type="text"
                name="expenseCategoryAddress"
                value={formData.expenseCategoryAddress}
                onChange={handleInputChange}
                className={`mt-1 block w-full border ${
                  validity.validExpenseCategoryAddress
                    ? "border-gray-300"
                    : "border-red-500"
                } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
                placeholder="Enter ExpenseCategory Address"
           
              />
            </div>
          </div>

          {/* ExpenseCategory Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              ExpenseCategory Notes{" "}
              {!validity.validExpenseCategoryNotes && (
                <span className="text-red-500">*</span>
              )}
            </label>
            <textarea
              name="expenseCategoryNotes"
              value={formData.expenseCategoryNotes}
              onChange={handleInputChange}
              className={`mt-1 block w-full border ${
                validity.validExpenseCategoryNotes ? "border-gray-300" : "border-red-500"
              } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
              placeholder="Enter ExpenseCategory Notes"
           
            ></textarea>
          </div>

          {/* Save Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate("/settings/financesSet/expenseCategoriesList/")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="save-button"
              disabled={!canSave || isLoading}
            >
              <span className="ml-2">Save ExpenseCategory</span>
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

export default EditExpenseCategoryForm;
