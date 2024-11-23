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
  useGetServicesByYearQuery,
 
} from "../../StudentsSet/NurseryServices/servicesApiSlice";
import {  faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import {
  selectAllAcademicYears,
  selectCurrentAcademicYearId,
  selectAcademicYearById,
} from "../../AcademicsSet/AcademicYears/academicYearsSlice";
import {
  OBJECTID_REGEX,
  NAME_REGEX,
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

    const {
      data: services, //the data is renamed services
      isLoading: isServicesLoading, //monitor several situations is loading...
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

    let servicesList = isServicesSuccess
    ? Object.values(services.entities)
    : [];


  //confirmation Modal states
  const [showConfirmation, setShowConfirmation] = useState(false);
  // Consolidated form state
  const [formData, setFormData] = useState({
    id:expenseCategory?._id,
    expenseCategoryLabel: expenseCategory?.expenseCategoryLabel,
    expenseCategoryYears: expenseCategory?.expenseCategoryYears,
    expenseCategoryItems: expenseCategory?.expenseCategoryItems,
    expenseCategoryService:expenseCategory?.expenseCategoryService?._id,
    expenseCategoryIsActive:expenseCategory?.expenseCategoryIsActive,
    expenseCategoryOperator: userId,
   
  });

  const [validity, setValidity] = useState({
    validExpenseCategoryLabel: false,
    validExpenseCategoryYears: false,
    validExpenseCategoryItems: false,
    validExpenseCategoryService: false,
  });

  // Validate inputs using regex patterns
  useEffect(() => {
    setValidity((prev) => ({
      ...prev,
      validExpenseCategoryLabel: NAME_REGEX.test(formData.expenseCategoryLabel),
      validExpenseCategoryYears: formData?.expenseCategoryYears?.length > 0,
      validExpenseCategoryItems: formData?.expenseCategoryItems?.length > 0,
      validExpenseCategoryService: OBJECTID_REGEX.test(formData.expenseCategoryService)
    }));
  }, [formData]);

  useEffect(() => {
    if (isSuccess) {
      setFormData({
        expenseCategoryLabel: "",
        expenseCategoryYears: [],
        expenseCategoryItems: [],
        expenseCategoryIsActive:"",
        expenseCategoryService:"",
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
    setFormData((prev) => ({ ...prev, expenseCategoryService: selectedServiceId }));
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
                validity.validExpenseCategoryLabel
                  ? "border-gray-300"
                  : "border-red-500"
              } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
              placeholder="Enter ExpenseCategory Label"
              required
            />
          </div>

          {/* Service Selection Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Select Service Type{" "}
              {!validity.validExpenseCategoryService && (
                <span className="text-red-500">*</span>
              )}
            </label>
            <select
              name="expenseCategoryService"
              value={formData.expenseCategoryService}
              onChange={handleServiceChange}
              className={`mt-1 block w-full border ${
                validity.validExpenseCategoryService ? "border-gray-300" : "border-red-500"
              } rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
              required
            >
              <option value="">Select a Service Type</option>
              {servicesList.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.serviceType}
                </option>
              ))}
            </select>
          </div>

           {/* ExpenseCategory Active Status */}
           <div>
            <label className="block text-sm font-medium text-gray-700">
              Expense Category Is Active
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

          {/* ExpenseCategory Items Selection - Using Input to Add Items */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              ExpenseCategory Items{" "}
              {!validity.validExpenseCategoryItems && (
                <span className="text-red-500">*</span>
              )}
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                name="newItemInput"
                value={formData.newItemInput}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Enter new item"
              />
              <button
                type="button"
                onClick={handleAddItem}
                className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
              >
                <FontAwesomeIcon icon={faPlus} className="mr-1" />
                Add
              </button>
            </div>

            {/* Display Added Items with Remove Option */}
            <div className="mt-4 space-y-2">
              {formData.expenseCategoryItems.map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between border border-gray-300 p-2 rounded-md"
                >
                  <span>{item}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item)}
                    className="text-red-500 hover:text-red-700"
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
              type="button"
              className="cancel-button"
              onClick={() =>
                navigate("/settings/financesSet/expenseCategoriesList/")
              }
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
