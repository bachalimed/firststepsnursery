import { useState, useEffect } from "react";
import { useAddNewExpenseCategoryMutation } from "./expenseCategoriesApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { ROLES } from "../../../../config/UserRoles";
import { ACTIONS } from "../../../../config/UserActions";
import FinancesSet from "../../FinancesSet";
import useAuth from "../../../../hooks/useAuth";
import { useSelector } from "react-redux";
import { useGetServicesByYearQuery } from "../../StudentsSet/NurseryServices/servicesApiSlice";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { RiAddLargeLine } from "react-icons/ri";

import {
  selectAllAcademicYears,
  selectCurrentAcademicYearId,
  selectAcademicYearById,
} from "../../AcademicsSet/AcademicYears/academicYearsSlice";
import { useOutletContext } from "react-router-dom";
import { OBJECTID_REGEX, NAME_REGEX } from "../../../../config/REGEX";
import ConfirmationModal from "../../../../Components/Shared/Modals/ConfirmationModal";
import { EXPENSE_CATEGORIES } from "../../../../config/ExpenseCategories";
const NewExpenseCategoryForm = () => {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  const academicYears = useSelector(selectAllAcademicYears);
  const [addNewExpenseCategory, { isLoading, isSuccess, isError, error }] =
    useAddNewExpenseCategoryMutation();

  const {
    data: services, //the data is renamed services
    isLoading: isServicesLoading,
    isSuccess: isServicesSuccess,
    isError: isServicesError,
    error: servicesError,
  } = useGetServicesByYearQuery(
    {
      selectedYear: selectedAcademicYear?.title,
      endpointName: "NewExpenseCategoryForm",
    } || {},
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  let servicesList = isServicesSuccess ? Object.values(services.entities) : [];

  //confirmation Modal states
  const [showConfirmation, setShowConfirmation] = useState(false);
  // Consolidated form state
  const [formData, setFormData] = useState({
    expenseCategoryLabel: "",
    expenseCategoryYears: [],
    expenseCategoryItems: [],
    // expenseCategoryService:"",
    expenseCategoryIsActive: true,
    expenseCategoryOperator: userId,
    expenseCategoryCreator: userId,
  });

  const [validity, setValidity] = useState({
    validExpenseCategoryLabel: false,
    validExpenseCategoryYears: false,
    validExpenseCategoryItems: false,
    // validExpenseCategoryService: false,
  });

  // Validate inputs using regex patterns
  useEffect(() => {
    setValidity((prev) => ({
      ...prev,
      validExpenseCategoryLabel: NAME_REGEX.test(formData.expenseCategoryLabel),
      validExpenseCategoryYears: formData?.expenseCategoryYears?.length > 0,
      validExpenseCategoryItems: formData?.expenseCategoryItems?.length > 0,
      // validExpenseCategoryService: OBJECTID_REGEX.test(formData.expenseCategoryService)
    }));
  }, [formData]);

  useEffect(() => {
    if (isSuccess) {
      setFormData({
        expenseCategoryLabel: "",
        expenseCategoryYears: [],
        expenseCategoryItems: [],
        expenseCategoryIsActive: "",
        //  expenseCategoryService:"",
        expenseCategoryOperator: "",
        expenseCategoryCreator: "",
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

  const handleAddItem = () => {
    const newItem = formData.newItemInput.trim();
    if (newItem && !formData.expenseCategoryItems.includes(newItem)) {
      setFormData((prev) => ({
        ...prev,
        expenseCategoryItems: [...prev.expenseCategoryItems, newItem],
        newItemInput: "", // Reset the input field after adding
      }));
    }
  };
  const handleServiceChange = (e) => {
    const selectedServiceId = e.target.value;
    setFormData((prev) => ({
      ...prev,
      expenseCategoryService: selectedServiceId,
    }));
  };

  const handleRemoveItem = (itemToRemove) => {
    setFormData((prev) => ({
      ...prev,
      expenseCategoryItems: prev.expenseCategoryItems.filter(
        (item) => item !== itemToRemove
      ),
    }));
  };

  const canSave = Object.values(validity).every(Boolean) && !isLoading;
  const { triggerBanner } = useOutletContext(); // Access banner trigger
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
      const response = await addNewExpenseCategory(formData);
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
      triggerBanner("Failed to add expense. Please try again.", "error");

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

      <form onSubmit={onSaveExpenseCategoryClicked} className="form-container">
        <h2  className="formTitle ">
          Add New ExpenseCategory: {`${formData?.expenseCategoryLabel} `}
        </h2>
        {/* ExpenseCategory Label */}
        <div>
          <label htmlFor=""  className="formInputLabel">
            ExpenseCategory Label{" "}
            {!validity.validExpenseCategoryLabel && (
              <span className="text-red-600">*</span>
            )}
            <input
              aria-label="expense category"
              aria-invalid={!validity.validExpenseCategoryLabel}
              placeholder="[3 - 20 letters]"
              type="text"
              name="expenseCategoryLabel"
              value={formData.expenseCategoryLabel}
              onChange={handleInputChange}
              className={`mt-1 block w-full h-10 border ${
                validity.validExpenseCategoryLabel
                  ? "border-gray-300"
                  : "border-red-600"
              } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 `}
              required
            />{" "}
          </label>
        </div>

        {/* Service Selection Dropdown */}
        {/* <div>
            <label htmlFor=""  className="formInputLabel">
              Select Service Type{" "}
              {!validity.validExpenseCategoryService && (
                <span className="text-red-600">*</span>
              )}
            </label>
            <select
              name="expenseCategoryService"
              value={formData.expenseCategoryService}
              onChange={handleServiceChange}
              className={`mt-1 block w-full h-10 border ${
                validity.validExpenseCategoryService ? "border-gray-300" : "border-red-600"
              } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 `}
              required
            >
              <option value="">Select a Service Type</option>
              {servicesList.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.serviceType}
                </option>
              ))}
            </select>
          </div> */}

        {/* ExpenseCategory Active Status */}
        <div>
          <label htmlFor=""  className="formInputLabel">
            <input
              aria-label="expense category active"
              type="checkbox"
              name="expenseCategoryIsActive"
              checked={formData.expenseCategoryIsActive}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  expenseCategoryIsActive: e.target.checked,
                }))
              }
              className="h-4 w-4 text-blue-600 focus:ring-sky-700 border-gray-300 rounded"
            />{" "}
            Expense Category Is Active
          </label>
        </div>

        {/* ExpenseCategory Years Selection - Using Checkboxes */}
        <div>
          <label htmlFor=""  className="formInputLabel">
            ExpenseCategory Years{" "}
            {!validity.validExpenseCategoryYears && (
              <span className="text-red-600">*</span>
            )}
            <div className="space-y-2">
              {academicYears.map((year) => (
                <div key={year.id} className="flex items-center">
                  <input
                    aria-label="expense category years"
                    type="checkbox"
                    id={`year-${year.id}`}
                    checked={formData.expenseCategoryYears.includes(year.title)}
                    onChange={() => handleYearChange(year.title)}
                    className="h-4 w-4 text-blue-600 focus:ring-sky-700 border-gray-300 rounded"
                  />
                  <label htmlFor=""
                    htmlFor={`year-${year.id}`}
                    className="ml-2 text-sm font-medium text-gray-700"
                  >
                    {year.title}
                  </label>
                </div>
              ))}
            </div>{" "}
          </label>
        </div>

        {/* ExpenseCategory Items Selection - Using Input to Add Items */}
        <div>
          <label htmlFor=""  className="formInputLabel">
            ExpenseCategory Items{" "}
            {!validity.validExpenseCategoryItems && (
              <span className="text-red-600">*</span>
            )}
            <div className="flex items-center space-x-2">
              <input
                aria-label="new expense item"
                type="text"
                name="newItemInput"
                value={formData.newItemInput}
                onChange={handleInputChange}
                className="mt-1 block w-full h-10 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 "
                placeholder="Enter new item"
              />
              <button
                aria-label="new expense item"
                type="button"
                onClick={handleAddItem}
                className="add-button"
              >
                <RiAddLargeLine className="h-6 w-4" />
              </button>
            </div>{" "}
          </label>

          {/* Display Added Items with Remove Option */}
          <div className="mt-4 space-y-2">
            {formData.expenseCategoryItems.map((item) => (
              <div className="flex items-center space-x-2">
                <div
                  key={item}
                  className="flex flex-1 items-center justify-between border border-gray-300 p-2 rounded-md"
                >
                  <span>{item}</span>
                </div>
                <button
                  aria-label="remove expense item"
                  type="button"
                  onClick={() => handleRemoveItem(item)}
                  className="delete-button"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            ))}
          </div>
        </div>
        {/* Save Button */}
        <div className="flex justify-end space-x-4">
          <button
            aria-label="cancel new expense category"
            type="button"
            className="cancel-button"
            onClick={() =>
              navigate("/settings/financesSet/expenseCategoriesList/")
            }
          >
            Cancel
          </button>
          <button
            aria-label="submit expense category"
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
    </>
  );

  return content;
};

export default NewExpenseCategoryForm;
