import { useState, useEffect } from "react";
import { useGetServicesByYearQuery } from "../../AppSettings/StudentsSet/NurseryServices/servicesApiSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  useAddNewExpenseMutation,
  useGetExpensesQuery,
} from "./expensesApiSlice"; // Redux API action
import { useGetExpenseCategoriesByYearQuery } from "../../AppSettings/FinancesSet/ExpenseCategories/expenseCategoriesApiSlice";
import { useGetPayeesByYearQuery } from "../../AppSettings/FinancesSet/Payees/payeesApiSlice";
import Finances from "../Finances";
import useAuth from "../../../hooks/useAuth";
import { useGetAttendedSchoolsQuery } from "../../AppSettings/AcademicsSet/attendedSchools/attendedSchoolsApiSlice";
import { useGetEmployeesByYearQuery } from "../../HR/Employees/employeesApiSlice";
import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
  selectAllAcademicYears,
} from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import {
  NAME_REGEX,
  YEAR_REGEX,
  DATE_REGEX,
  OBJECTID_REGEX,
  COMMENT_REGEX,
  FEE_REGEX,
} from "../../../config/REGEX";
import ConfirmationModal from "../../../Components/Shared/Modals/ConfirmationModal";
import { MONTHS } from "../../../config/Months";
import { CurrencySymbol } from "../../../config/Currency";
import { useOutletContext } from "react-router-dom";

const NewExpenseForm = () => {
  const { userId } = useAuth();
  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  const academicYears = useSelector(selectAllAcademicYears);

  const {
    data: expenseCategories, //the data is renamed expenseCategories
    isLoading: isExpenseCategoriesLoading,
    isSuccess: isExpenseCategoriesSuccess,
    isError: isExpenseCategoriesError,
    error: expenseCategoriesError,
  } = useGetExpenseCategoriesByYearQuery(
    {
      selectedYear: selectedAcademicYear?.title,
      endpointName: "NewExpenseForm",
    } || {},
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );
  const {
    data: payees, //the data is renamed payees
    isLoading: isPayeesLoading,
    isSuccess: isPayeesSuccess,
    isError: isPayeesError,
    error: payeesError,
  } = useGetPayeesByYearQuery(
    {
      selectedYear: selectedAcademicYear?.title,
      endpointName: "NewExpenseForm",
    } || {},
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  const {
    data: services, //the data is renamed services
    isLoading: isServicesLoading,
    isSuccess: isServicesSuccess,
    isError: isServicesError,
    error: servicesError,
  } = useGetServicesByYearQuery(
    {
      selectedYear: selectedAcademicYear?.title,
      endpointName: "NewExpenseForm",
    } || {},
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  // Redux mutation for adding the attended school
  const [
    addNewExpense,
    {
      isLoading: isAddLoading,
      isError: isAddError,
      error: addError,
      isSuccess: isAddSuccess,
    },
  ] = useAddNewExpenseMutation();

  const { triggerBanner } = useOutletContext(); // Access banner trigger
  let servicesList = isServicesSuccess ? Object.values(services.entities) : [];
  let payeesList = isPayeesSuccess ? Object.values(payees.entities) : [];
  let expenseCategoriesList = isExpenseCategoriesSuccess
    ? Object.values(expenseCategories.entities)
    : [];
  //console.log(selectedAcademicYear?.title, "selectedAcademicYear?.title");

  const [formData, setFormData] = useState({
    expenseYear: selectedAcademicYear?.title,
    expenseMonth: "",
    expenseAmount: "",
    expenseNote: "",
    expenseCategory: "",
    expenseItems: [],
    expensePayee: "",
    expenseService: "",
    expenseDate: "",
    expensePaymentDate: "",

    expenseMethod: "",
    expenseOperator: userId,
    expenseCreator: userId,
  });

  const [selectedItems, setSelectedItems] = useState([]);

  //confirmation Modal states
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [validity, setValidity] = useState({
    validExpenseYear: false,
    validExpenseMonth: false,
    validExpenseAmount: false,
    validExpenseNote: false,
    validExpenseCategory: false,
    validExpenseItems: false,
    validExpensePayee: false,
    validExpenseService: false,
    validExpenseDate: false,
    validExpensePaymentDate: false,
    validExpenseMethod: false,
    validExpenseOperator: false,
    validExpenseCreator: false,
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Validate inputs using regex patterns
  useEffect(() => {
    setValidity((prev) => ({
      ...prev,
      validExpenseYear: YEAR_REGEX.test(formData.expenseYear),
      validExpenseCategory: OBJECTID_REGEX.test(formData.expenseCategory),
      validExpenseItems:
        formData.expenseItems.length > 0 &&
        formData.expenseItems.every((item) => item !== ""),
      validItem: NAME_REGEX.test(formData.item),
      validExpenseMonth: NAME_REGEX.test(formData.expenseMonth),
      validExpenseAmount: FEE_REGEX.test(formData.expenseAmount),
      validExpenseNote: COMMENT_REGEX.test(formData.expenseNote),
      validExpenseService: OBJECTID_REGEX.test(formData.expenseService),
      validExpensePayee: OBJECTID_REGEX.test(formData.expensePayee),
      validExpenseDate: DATE_REGEX.test(formData.expenseDate),
      validExpensePaymentDate:
        DATE_REGEX.test(formData.expensePaymentDate) ||
        formData.expensePaymentDate === "",

      validExpenseMethod: NAME_REGEX.test(formData.expenseMethod),
      validExpenseOperator: OBJECTID_REGEX.test(formData.expenseOperator),
      validExpenseCreator: OBJECTID_REGEX.test(formData.expenseCreator),
    }));
  }, [formData]);

  // Clear form and errors on success
  useEffect(() => {
    if (isAddSuccess) {
      setFormData({
        expenseYear: "",
        expenseMonth: "",
        expenseAmount: "",
        expenseNote: "",
        expenseCategory: "",
        expenseItems: [],
        expensePayee: "",
        expenseDate: "",
        expensePaymentDate: "",

        expenseMethod: "",
        expenseOperator: "",
        expenseCreator: "",
      });

      navigate("/finances/expenses/expensesList/");
    }
  }, [isAddSuccess, navigate]);

  // Check if all fields are valid and enable the submit button
  const canSubmit = Object.values(validity).every(Boolean) && !isAddLoading;

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
      const response = await addNewExpense(formData).unwrap();
      if (response.data && response.data.message) {
        // Success response
        triggerBanner(response.data.message, "success");
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

      console.error("Error saving:", error);
    }
  };
  // Close the modal without saving
  const handleCloseModal = () => {
    setShowConfirmation(false);
  };
  // Handle input change

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Find the category that matches formData.expenseCategory
  const selectedCategory = expenseCategoriesList.find(
    (category) => category.id === formData?.expenseCategory
  );
  // Reset selected items when the category changes
  useEffect(() => {
    setSelectedItems([]);
    setFormData((prevFormData) => ({
      ...prevFormData,
      expenseItems: [], // Clear items for the new category
    }));
  }, [formData.expenseCategory, setFormData]);

  const handleItemClick = (item) => {
    setSelectedItems((prevSelected) => {
      const updatedSelection = prevSelected.includes(item)
        ? prevSelected.filter((selectedItem) => selectedItem !== item) // Remove if already selected
        : [...prevSelected, item]; // Add if not selected

      // Update formData with the new selection
      setFormData((prevFormData) => ({
        ...prevFormData,
        expenseItems: updatedSelection,
      }));

      return updatedSelection;
    });
  };

  console.log(formData, "formdata");
  console.log(validity, "validity");

  return (
    <>
      <Finances />

      <form onSubmit={handleSubmit} className="form-container">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Add New Expense {selectedAcademicYear?.title}
        </h2>
        {/* <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Expense Year{" "}
              {!validity.validExpenseYear && (
                <span className="text-red-600">*</span>
              )}
            </label>
            <select
              type="text"
              name="expenseYear"
              value={formData.expenseYear}
              // onChange={handleChange}
              placeholder="Enter Year"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-700"
              required
             
            >
              <option value={selectedAcademicYear?.title}>
                {selectedAcademicYear?.title}
              </option>
            </select>
          </div> */}

        {/* Expense Month */}
        <div className="mb-4">
          <label
            htmlFor="expenseMonth"
            className="block text-gray-700 font-bold mb-2"
          >
            Expense Month{" "}
            {!validity.validExpenseMonth && (
              <span className="text-red-600">*</span>
            )}
            <select
              aria-label="expense month"
              aria-invalid={!validity.validExpenseMonth}
              id="expenseMonth"
              value={formData.expenseMonth || ""}
              onChange={(e) =>
                setFormData({ ...formData, expenseMonth: e.target.value })
              }
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-700"
            >
              <option value="">Select a month</option>
              {MONTHS.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>{" "}
          </label>
        </div>

        {/* Expense Service */}
        <div style={{ marginBottom: "16px" }}>
          <label
            htmlFor="expenseService"
            className="block text-gray-700 font-bold mb-2"
          >
            Expense Service{" "}
            {!validity.validExpenseService && (
              <span className="text-red-600">*</span>
            )}
            <select
              aria-label="expense service"
              aria-invalid={!validity.validExpenseService}
              id="expenseService"
              value={formData?.expenseService}
              onChange={(e) =>
                setFormData({ ...formData, expenseService: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-700"
              required
            >
              <option value="">Select a service</option>
              {servicesList.map((serv) => (
                <option key={serv?.id} value={serv?.id}>
                  {serv?.serviceType}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Expense Payee */}
        <div style={{ marginBottom: "16px" }}>
          <label
            htmlFor="expensePayee"
            className="block text-gray-700 font-bold mb-2"
          >
            Expense Payee{" "}
            {!validity.validExpensePayee && (
              <span className="text-red-600">*</span>
            )}
            <select
              aria-label="expense payee"
              aria-invalid={!validity.validExpensePayee}
              id="expensePayee"
              value={formData?.expensePayee}
              onChange={(e) =>
                setFormData({ ...formData, expensePayee: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-700"
              required
            >
              <option value="">Select a payee</option>
              {payeesList.map((payee) => (
                <option key={payee?.id} value={payee?.id}>
                  {payee?.payeeLabel}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Expense Category */}
        <div style={{ marginBottom: "16px" }}>
          <label
            htmlFor="expenseCategory"
            className="block text-gray-700 font-bold mb-2"
          >
            Expense Categroy{" "}
            {!validity.validExpenseCategory && (
              <span className="text-red-600">*</span>
            )}
            <select
              aria-label="expense category"
              aria-invalid={!validity.validExpenseCategory}
              id="expenseCategory"
              value={formData?.expenseCategory}
              onChange={(e) =>
                setFormData({ ...formData, expenseCategory: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-700"
              required
            >
              <option value="">Select a Category</option>
              {expenseCategoriesList.map((cat) => (
                <option key={cat?.id} value={cat?.id}>
                  {cat?.expenseCategoryLabel}
                </option>
              ))}
            </select>{" "}
          </label>
        </div>
        {/* Expense Category items*/}

        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
          <h3>{selectedCategory?.categoryName || "Select items"}</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {selectedCategory?.expenseCategoryItems?.map((item, index) => (
              <button
                aria-label="select items"
                key={index}
                onClick={() => handleItemClick(item)}
                style={{
                  padding: "10px 15px",
                  border: "1px solid #007bff",
                  borderRadius: "5px",
                  backgroundColor: selectedItems.includes(item)
                    ? "#007bff"
                    : "#ffffff",
                  color: selectedItems.includes(item) ? "#ffffff" : "#007bff",
                  cursor: "pointer",
                }}
              >
                {item}
              </button>
            ))}
          </div>
          {/* <div style={{ marginTop: "20px" }}>
              <h4>Selected Items:</h4>
              {selectedItems.length > 0 ? (
                <ul>
                  {selectedItems.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>No items selected</p>
              )}
            </div> */}
        </div>

        {/* Expense Amount */}
        <div style={{ marginBottom: "16px" }}>
          <label
            htmlFor="expenseAmount"
            className="block text-gray-700 font-bold mb-2"
          >
            Expense Amount{" "}
            {!validity.validExpenseAmount && (
              <span className="text-red-600">*</span>
            )}{" "}
            ({CurrencySymbol})
            <input
              aria-label="expense amount"
              aria-invalid={!validity.validExpenseAmount}
              placeholder="[999.99]"
              type="number"
              id="expenseAmount"
              value={formData.expenseAmount || ""}
              onChange={(e) =>
                setFormData({ ...formData, expenseAmount: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-700"
              required
            />
          </label>
        </div>
        {/* Expense Method */}
        <div style={{ marginBottom: "16px" }}>
          <label
            htmlFor="paymentMethod"
            className="block text-gray-700 font-bold mb-2"
          >
            Payment Method{" "}
            {!validity.validExpenseMethod && (
              <span className="text-red-600">*</span>
            )}
            <select
              aria-label="expense method"
              aria-invalid={!validity.validExpenseMethod}
              id="expenseMethod"
              value={formData.expenseMethod || ""}
              onChange={(e) =>
                setFormData({ ...formData, expenseMethod: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-700"
              required
            >
              <option value="">Select a method</option>
              {[
                "Cash",
                "Credit Card",
                "Bank Transfer",
                "Online Payment",
                "Credit",
              ].map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>{" "}
          </label>
        </div>

        {/* Expense Date */}
        <div style={{ marginBottom: "16px" }}>
          <label
            htmlFor="expenseDate"
            className="block text-gray-700 font-bold mb-2"
          >
            Expense Date{" "}
            {!validity.validExpenseDate && (
              <span className="text-red-600">*</span>
            )}
            <input
              aria-label="expense date"
              aria-invalid={!validity.validExpenseDate}
              type="date"
              id="expenseDate"
              value={formData.expenseDate || ""}
              onChange={(e) =>
                setFormData({ ...formData, expenseDate: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-700"
              required
            />{" "}
          </label>
        </div>
        {/* Expense Payment Date */}
        {formData?.expenseMethod === "Credit" && (
          <div style={{ marginBottom: "16px" }}>
            <label
              htmlFor="expensePaymentDate"
              className="block text-gray-700 font-bold mb-2"
            >
              Expense Payment Date
              <input
                aria-label="expense payment date"
                type="date"
                id="expensePaymentDate"
                value={formData.expensePaymentDate || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    expensePaymentDate: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-700"
              />{" "}
            </label>
          </div>
        )}

        {/* Expense Note */}
        <div style={{ marginBottom: "16px" }}>
          <label
            htmlFor="expenseNote"
            className="block text-gray-700 font-bold mb-2"
          >
            Expense Note
            <textarea
              aria-label="expense note"
              id="expenseNote"
              value={formData.expenseNote || ""}
              onChange={(e) =>
                setFormData({ ...formData, expenseNote: e.target.value })
              }
              rows="4"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-700"
            />{" "}
          </label>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            aria-label="cancel expense"
            type="button"
            //disabled={!canSubmit}
            className="cancel-button"
            onClick={() => navigate("/finances/expenses/expensesList/")}
          >
            Cancel
          </button>
          <button
            aria-label="submit expense"
            type="submit"
            disabled={!canSubmit || isAddLoading}
            className="save-button"
          >
            {isAddLoading ? "Adding..." : "Add Expense"}
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

export default NewExpenseForm;
