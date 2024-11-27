import { useState, useEffect } from "react";
import { useGetPayeesByYearQuery } from "../../AppSettings/FinancesSet/Payees/payeesApiSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  useUpdateExpenseMutation,
  useGetExpensesQuery,
} from "./expensesApiSlice"; // Redux API action
import { useGetServicesByYearQuery } from "../../AppSettings/StudentsSet/NurseryServices/servicesApiSlice";
import Finances from "../Finances";
import useAuth from "../../../hooks/useAuth";
import { useGetAttendedSchoolsQuery } from "../../AppSettings/AcademicsSet/attendedSchools/attendedSchoolsApiSlice";
import { useGetEmployeesByYearQuery } from "../../HR/Employees/employeesApiSlice";
import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
  selectAllAcademicYears,
} from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import { MONTHS } from "../../../config/Months";
import ConfirmationModal from "../../../Components/Shared/Modals/ConfirmationModal";
import {
  NAME_REGEX,
  YEAR_REGEX,
  DATE_REGEX,
  OBJECTID_REGEX,
  COMMENT_REGEX,
  FEE_REGEX,
} from "../../../config/REGEX";
import { CurrencySymbol } from "../../../config/Currency";
import { useGetExpenseCategoriesByYearQuery } from "../../AppSettings/FinancesSet/ExpenseCategories/expenseCategoriesApiSlice";
const EditExpenseForm = ({ expense }) => {
  const { userId } = useAuth();
  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  const academicYears = useSelector(selectAllAcademicYears);

  
  // Redux mutation for adding
  const [
    updateExpense,
    {
      isLoading: isUpdateLoading,
      isError: isUpdateError,
      error: updateError,
      isSuccess: isUpdateSuccess,
    },
  ] = useUpdateExpenseMutation();

  
  const {
    data: expenseCategories, //the data is renamed expenseCategories
    isLoading: isExpenseCategoriesLoading, //monitor several situations is loading...
    isSuccess: isExpenseCategoriesSuccess,
    isError: isExpenseCategoriesError,
    error: expenseCategoriesError,
  } = useGetExpenseCategoriesByYearQuery(
    {
      selectedYear: selectedAcademicYear?.title,
      endpointName: "EditExpenseForm",
    } || {},
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );
  const {
    data: payees, //the data is renamed payees
    isLoading: isPayeesLoading, //monitor several situations is loading...
    isSuccess: isPayeesSuccess,
    isError: isPayeesError,
    error: payeesError,
  } = useGetPayeesByYearQuery(
    {
      selectedYear: selectedAcademicYear?.title,
      endpointName: "EditExpenseForm",
    } || {},
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  const {
    data: services, //the data is renamed services
    isLoading: isServicesLoading, //monitor several situations is loading...
    isSuccess: isServicesSuccess,
    isError: isServicesError,
    error: servicesError,
  } = useGetServicesByYearQuery(
    {
      selectedYear: selectedAcademicYear?.title,
      endpointName: "EditExpenseForm",
    } || {},
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  

  let servicesList = isServicesSuccess ? Object.values(services.entities) : [];
  let payeesList = isPayeesSuccess ? Object.values(payees.entities) : [];
  let expenseCategoriesList = isExpenseCategoriesSuccess
    ? Object.values(expenseCategories.entities)
    : [];
console.log(selectedAcademicYear?.title,'selectedAcademicYear?.title')


  const [formData, setFormData] = useState({
    expenseYear: expense?.expenseYear,
    expenseMonth: expense?.expenseMonth,
    expenseAmount: expense?.expenseAmount,
    expenseNote: expense?.expenseNote,
    expenseItems: expense?.expenseItems,
    expensePayee: expense?.expensePayee,
    expenseService: expense?.expenseService,
    expenseDate: expense?.expenseDate?.split("T")[0],
    expensePaymentDate: expense?.expensePaymentDate?.split("T")[0],

    expenseMethod: expense?.expenseMethod,
    expenseOperator: userId,
    
  });
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryItems, setCategoryItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [usedCategories, setUsedCategories] = useState([]); // Track used categories
  const [usedItems, setUsedItems] = useState({}); // Track used items by category
  //confirmation Modal states
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [validity, setValidity] = useState({
    validExpenseYear: false,
    validExpenseMonth: false,
    validExpenseAmount: false,
    validExpenseNote: false,
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
      validExpensePaymentDate: DATE_REGEX.test(formData.expensePaymentDate)||formData.expensePaymentDate==="",

      validExpenseMethod: NAME_REGEX.test(formData.expenseMethod),
      validExpenseOperator: OBJECTID_REGEX.test(formData.expenseOperator),
      validExpenseCreator: OBJECTID_REGEX.test(formData.expenseCreator),
    }));
  }, [formData]);

  // Clear form and errors on success
  useEffect(() => {
    if (isUpdateSuccess) {
      setFormData({
        expenseYear: "",
        expenseMonth: "",
        expenseAmount: "",
        expenseNote: "",
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
  }, [isUpdateSuccess, navigate]);

  // Check if all fields are valid and enable the submit button
  const canSubmit = Object.values(validity).every(Boolean) && !isUpdateLoading;

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
      const newExpense = await updateExpense(formData).unwrap();
    } catch (err) {
      console.error("Error saving student:", err);
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

  // Handle category selection
  const handleCategoryChange = (event) => {
    const selectedCategoryId = event.target.value;
    setSelectedCategory(selectedCategoryId);

    // Fetch items based on the selected category
    const selectedCategoryObj = expenseCategoriesList.find(
      (categ) => categ.id === selectedCategoryId
    );

    if (selectedCategoryObj) {
      // Assuming the category object has an array of items
      setCategoryItems(selectedCategoryObj.expenseCategoryItems || []);
    }
  };

  // Handle item selection within a category
  const handleItemChange = (event) => {
    const selectedItem = event.target.value;
    if (selectedItem && !selectedItems.includes(selectedItem)) {
      setSelectedItems([...selectedItems, selectedItem]);
    }
  };

  // Save the selected category and its items
  const handleAddCategoryItems = () => {
    if (selectedCategory && selectedItems.length > 0) {
      const newExpenseItem = {
        expenseCategory: selectedCategory,
        expenseCategoryItems: selectedItems,
      };

      setFormData({
        ...formData,
        expenseItems: [...formData.expenseItems, newExpenseItem],
      });

      // Track used categories
      setUsedCategories([...usedCategories, selectedCategory]);

      // Track used items per category
      setUsedItems({
        ...usedItems,
        [selectedCategory]: selectedItems,
      });

      // Reset the selections
      setSelectedCategory("");
      setCategoryItems([]);
      setSelectedItems([]);
    }
  };

  // Handle removing an entire category and its items
  const handleRemoveCategory = (categoryId) => {
    setFormData({
      ...formData,
      expenseItems: formData.expenseItems.filter(
        (item) => item.expenseCategory !== categoryId
      ),
    });

    // Remove the category from the used list
    setUsedCategories(usedCategories.filter((id) => id !== categoryId));

    // Remove the items associated with the category
    const updatedUsedItems = { ...usedItems };
    delete updatedUsedItems[categoryId];
    setUsedItems(updatedUsedItems);
  };

  // Handle removing individual items from a category
  const handleRemoveItem = (categoryId, itemToRemove) => {
    setFormData({
      ...formData,
      expenseItems: formData.expenseItems.map((item) =>
        item.expenseCategory === categoryId
          ? {
              ...item,
              expenseCategoryItems: item.expenseCategoryItems.filter(
                (selectedItem) => selectedItem !== itemToRemove
              ),
            }
          : item
      ),
    });

    // Remove the item from the used items tracking
    const updatedUsedItems = { ...usedItems };
    updatedUsedItems[categoryId] = updatedUsedItems[categoryId].filter(
      (item) => item !== itemToRemove
    );
    setUsedItems(updatedUsedItems);
  };

  // Filter out used categories from the dropdown
  const availableCategories = expenseCategoriesList.filter(
    (categ) => !usedCategories.includes(categ.id)
  );

  // Filter out used items for the currently selected category
  const availableItems = categoryItems.filter(
    (item) =>
      !(usedItems[selectedCategory] || []).includes(item)
  );

  console.log(formData, "formdata");
  console.log(validity, "validity");

  return (
    <>
      <Finances />
      <div className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Add New Expense {selectedAcademicYear?.title}</h2>

        <form onSubmit={handleSubmit}>
          {/* <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Expense Year{" "}
              {!validity.validExpenseYear && (
                <span className="text-red-500">*</span>
              )}
            </label>
            <select
              type="text"
              name="expenseYear"
              value={formData.expenseYear}
              // onChange={handleChange}
              placeholder="Enter Year"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <span className="text-red-500">*</span>
              )}
            </label>
            <select
              id="expenseMonth"
              value={formData.expenseMonth || ""}
              onChange={(e) =>
                setFormData({ ...formData, expenseMonth: e.target.value })
              }
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a month</option>
              {MONTHS.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          {/* Expense Service */}
          <div style={{ marginBottom: "16px" }}>
            <label
              htmlFor="expenseService"
              className="block text-gray-700 font-bold mb-2"
            >
              Expense Service{" "}
              {!validity.validExpenseService && (
                <span className="text-red-500">*</span>
              )}
            </label>
            <select
              id="expenseService"
              value={formData?.expenseService}
              onChange={(e) =>
                setFormData({ ...formData, expenseService: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a service</option>
              {servicesList.map((serv) => (
                <option key={serv?.id} value={serv?.id}>
                  {serv?.serviceType}
                </option>
              ))}
            </select>
          </div>

          {/* Expense Payee */}
          <div style={{ marginBottom: "16px" }}>
            <label
              htmlFor="expensePayee"
              className="block text-gray-700 font-bold mb-2"
            >
              Expense Payee{" "}
              {!validity.validExpensePayee && (
                <span className="text-red-500">*</span>
              )}
            </label>
            <select
              id="expensePayee"
              value={formData?.expensePayee}
              onChange={(e) =>
                setFormData({ ...formData, expensePayee: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a payee</option>
              {payeesList.map((payee) => (
                <option key={payee?.id} value={payee?.id}>
                  {payee?.payeeLabel}
                </option>
              ))}
            </select>
          </div>





          <div className="mb-4">
      <label
        htmlFor="expenseCategory"
        className="block text-gray-700 font-bold mb-2"
      >
        Expense Category{" "}
              {!validity?.validExpenseItems && (
                <span className="text-red-500">*</span>
              )}
      </label>
      <select
        id="expenseCategory"
        value={selectedCategory}
        onChange={handleCategoryChange}
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select a category</option>
        {availableCategories.map((categ) => (
          <option key={categ.id} value={categ.id}>
            {categ.expenseCategoryLabel}
          </option>
        ))}
      </select>

      {/* Show item dropdown when a category is selected */}
      {selectedCategory && (
        <div className="mt-4">
          <label
            htmlFor="expenseCategoryItems"
            className="block text-gray-700 font-bold mb-2"
          >
            Select Items
          </label>
          <select
            id="expenseCategoryItems"
            value=""
            onChange={handleItemChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select item to add</option>
            {availableItems.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>

          {/* Show selected items */}
          <div className="mt-2">
            {selectedItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-100 rounded-md mb-1"
              >
                <span>{item}</span>
                <button
                  type="button"
                  className="text-red-500"
                  onClick={() =>
                    setSelectedItems(
                      selectedItems.filter((selectedItem) => selectedItem !== item)
                    )
                  }
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Button to save selected items for the category */}
          <button
            type="button"
            onClick={handleAddCategoryItems}
            className="save-button"
          >
            Save Category & Items
          </button>
        </div>
      )}

      {/* Display saved expense items */}
      <div className="mt-6">
        <h3 className="text-lg font-bold mb-2">Selected Expense Items</h3>
        {formData.expenseItems.map((item) => (
          <div key={item.expenseCategory} className="mb-4">
            <div className="flex items-center justify-between bg-gray-200 p-2 rounded-md">
              <span className="font-semibold">
                Category:{" "}
                {
                  expenseCategoriesList.find(
                    (categ) => categ.id === item.expenseCategory
                  )?.expenseCategoryLabel
                }
              </span>
              <button
                type="button"
                className="text-red-500"
                onClick={() => handleRemoveCategory(item.expenseCategory)}
              >
                Remove Category
              </button>
            </div>
            <div className="mt-2">
              {item.expenseCategoryItems.map((expenseItem, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-100 rounded-md mb-1"
                >
                  <span>{expenseItem}</span>
                  <button
                    type="button"
                    className="text-red-500"
                    onClick={() =>
                      handleRemoveItem(item.expenseCategory, expenseItem)
                    }
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>





          {/* Expense Amount */}
          <div style={{ marginBottom: "16px" }}>
            <label
              htmlFor="expenseAmount"
              className="block text-gray-700 font-bold mb-2"
            >
              Expense Amount{" "}
              {!validity.validExpenseAmount && (
                <span className="text-red-500">*</span>
              )} ({CurrencySymbol})
            </label>
            <input
              type="number"
              id="expenseAmount"
              value={formData.expenseAmount || ""}
              onChange={(e) =>
                setFormData({ ...formData, expenseAmount: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {/* Expense Method */}
          <div style={{ marginBottom: "16px" }}>
            <label
              htmlFor="paymentMethod"
              className="block text-gray-700 font-bold mb-2"
            >
              Payment Method {" "}
              {!validity.validExpenseMethod && (
                <span className="text-red-500">*</span>
              )}
            </label>
            <select
              id="expenseMethod"
              value={formData.expenseMethod || ""}
              onChange={(e) =>
                setFormData({ ...formData, expenseMethod: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            </select>
          </div>

          {/* Expense Date */}
          <div style={{ marginBottom: "16px" }}>
            <label
              htmlFor="expenseDate"
              className="block text-gray-700 font-bold mb-2"
            >
              Expense Date{" "}
              {!validity.validExpenseDate && (
                <span className="text-red-500">*</span>
              )}
            </label>
            <input
              type="date"
              id="expenseDate"
              value={formData.expenseDate || ""}
              onChange={(e) =>
                setFormData({ ...formData, expenseDate: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {/* Expense Payment Date */}
      {formData?.expenseMethod==="Credit" &&(<div style={{ marginBottom: "16px" }}>
            <label
              htmlFor="expensePaymentDate"
              className="block text-gray-700 font-bold mb-2"
            >
              Expense Payment Date
            </label>
            <input
              type="date"
              id="expensePaymentDate"
              value={formData.expensePaymentDate || ""}
              onChange={(e) =>
                setFormData({ ...formData, expensePaymentDate: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
           
            />
          </div>)}

          {/* Expense Note */}
          <div style={{ marginBottom: "16px" }}>
            <label
              htmlFor="expenseNote"
              className="block text-gray-700 font-bold mb-2"
            >
              Expense Note
            </label>
            <textarea
              id="expenseNote"
              value={formData.expenseNote || ""}
              onChange={(e) =>
                setFormData({ ...formData, expenseNote: e.target.value })
              }
              rows="4"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
             
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              //disabled={!canSubmit}
              className="cancel-button"
              onClick={() => navigate("/finances/expenses/expensesList/")}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmit || isUpdateLoading}
              className="save-button"
            >
              {isUpdateLoading ? "Adding..." : "Add Expense"}
            </button>
          </div>
        </form>
      </div>
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
export default EditExpenseForm;
