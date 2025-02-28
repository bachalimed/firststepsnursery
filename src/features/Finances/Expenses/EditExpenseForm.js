import { useState, useEffect } from "react";
import { useGetPayeesByYearQuery } from "../../AppSettings/FinancesSet/Payees/payeesApiSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useUpdateExpenseMutation } from "./expensesApiSlice"; // Redux API action
import { useGetServicesByYearQuery } from "../../AppSettings/StudentsSet/NurseryServices/servicesApiSlice";
import Finances from "../Finances";
import useAuth from "../../../hooks/useAuth";
import LoadingStateIcon from "../../../Components/LoadingStateIcon";
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
import { useOutletContext } from "react-router-dom";

const EditExpenseForm = ({ expense }) => {
  useEffect(() => {
    document.title = "Edit Expense";
  });
  const { userId } = useAuth();
  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  const academicYears = useSelector(selectAllAcademicYears);
  const getMonthFromDate = (dateInput) => {
    const date = new Date(dateInput); // Convert input to a Date object
    if (isNaN(date.getTime())) {
      // Check if the date is invalid
      throw new Error("Invalid date input");
    }
    return MONTHS[date.getMonth()]; // Get the month name
  };
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
    isLoading: isExpenseCategoriesLoading,
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
    isLoading: isPayeesLoading,
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
    isLoading: isServicesLoading,
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
  const { triggerBanner } = useOutletContext(); // Access banner trigger
  let servicesList = isServicesSuccess ? Object.values(services.entities) : [];
  let payeesList = isPayeesSuccess ? Object.values(payees.entities) : [];
  let expenseCategoriesList = isExpenseCategoriesSuccess
    ? Object.values(expenseCategories.entities)
    : [];
  //console.log(selectedAcademicYear?.title, "selectedAcademicYear?.title");

  const [formData, setFormData] = useState({
    id: expense?._id,
    expenseYear: expense?.expenseYear,
    expenseMonth: expense?.expenseMonth,
    expenseAmount: expense?.expenseAmount,
    expenseNote: expense?.expenseNote,
    expenseCategory: expense?.expenseCategory,
    expenseItems: expense?.expenseItems || [],
    expensePayee: expense?.expensePayee,
    expenseService: expense?.expenseService,
    expenseDate: expense?.expenseDate?.split("T")[0],
    expensePaymentDate: expense?.expensePaymentDate
      ? expense?.expensePaymentDate?.split("T")[0]
      : "",
    expenseMethod: expense?.expenseMethod,
    expenseOperator: userId,
  });
  const [selectedItems, setSelectedItems] = useState(expense?.expenseItems);

  //confirmation Modal states
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [validity, setValidity] = useState({
    validId: false,
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
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Validate inputs using regex patterns
  useEffect(() => {
    setValidity((prev) => ({
      ...prev,
      validId: OBJECTID_REGEX.test(formData.id),
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
    }));
  }, [formData]);

  // Clear form and errors on success
  useEffect(() => {
    if (isUpdateSuccess) {
      setFormData({});

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
      const response = await updateExpense(formData).unwrap();

      if (response?.message) {
        // Success response
        triggerBanner(response?.message, "success");
      } else if (response?.data?.message) {
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
  // Handle input change

  // Find the category that matches formData.expenseCategory
  const selectedCategory = expenseCategoriesList.find(
    (category) => category.id === formData?.expenseCategory
  );
  //sets expenseItems to [] when we change category, an issue when editing because it resets the items

  // useEffect(() => {
  //   if (formData.expenseCategory) {
  //     setSelectedItems([]);
  //     setFormData((prevFormData) => ({
  //       ...prevFormData,
  //       expenseItems: [], // Clear items for the new category
  //     }));
  //   }
  // }, [formData.expenseCategory]);

  //refactored version
  const [prevCategory, setPrevCategory] = useState(expense?.expenseCategory);

  useEffect(() => {
    if (formData.expenseCategory && formData.expenseCategory !== prevCategory) {
      setSelectedItems([]);
      setFormData((prevFormData) => ({
        ...prevFormData,
        expenseItems: [], // Clear items for the new category
      }));
      setPrevCategory(formData.expenseCategory); // Update the previous category
    }
  }, [formData.expenseCategory, prevCategory]);

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

  //console.log(formData, "formdata");
  //console.log(validity, "validity");
  let content;
  if (isExpenseCategoriesLoading || isPayeesLoading || isServicesLoading) {
    content = (
      <>
        <Finances />
        <LoadingStateIcon />
      </>
    );
  }
  if (
    isExpenseCategoriesSuccess &&
    isPayeesSuccess &&
    isExpenseCategoriesSuccess
  ) {
    content = (
      <>
        <Finances />

        <form onSubmit={handleSubmit} className="form-container">
          <h2 className="formTitle">
            Edit Expense {selectedAcademicYear?.title}
          </h2>
          <div className="formSectionContainer">
            <h3 className="formSectionTitle">Expense details</h3>
            <div className="formSection">
              <div className="">
                {/* <div className="mb-4">
            <label  className="formInputLabel">
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
               className={`formInputText`}
              required
             
            >
              <option value={selectedAcademicYear?.title}>
                {selectedAcademicYear?.title}
              </option>
            </select>
          </div> */}

                {/* Expense Month */}
                {/* <label htmlFor="expenseMonth" className="formInputLabel">
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
                    className={`formInputText`}
                  >
                    <option value="">Select a month</option>
                    {MONTHS.map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>{" "}
                </label> */}

                {/* Expense Service */}

                <label htmlFor="expenseService" className="formInputLabel">
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
                      setFormData({
                        ...formData,
                        expenseService: e.target.value,
                      })
                    }
                    className={`formInputText`}
                    required
                  >
                    <option value="">Select a service</option>
                    {servicesList.map((serv) => (
                      <option key={serv?.id} value={serv?.id}>
                        {serv?.serviceType}
                      </option>
                    ))}
                  </select>{" "}
                </label>
              </div>
              <div className="formLineDiv">
                {/* Expense Payee */}

                <label htmlFor="expensePayee" className="formInputLabel">
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
                    className={`formInputText`}
                    required
                  >
                    <option value="">Select a payee</option>
                    {payeesList.map((payee) => (
                      <option key={payee?.id} value={payee?.id}>
                        {payee?.payeeLabel}
                      </option>
                    ))}
                  </select>{" "}
                </label>

                {/* Expense Category */}

                <label htmlFor="expenseCategory" className="formInputLabel">
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
                      setFormData({
                        ...formData,
                        expenseCategory: e.target.value,
                      })
                    }
                    className={`formInputText`}
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
            </div>

            <h3 className="formSectionTitle">Expense items</h3>
            <div className="formSection">
              {/* Expense Category items*/}

              <h3 className="formSectionTitle">
                {selectedCategory?.expenseCategoryLabel || "Select items"}
              </h3>

              {selectedCategory?.expenseCategoryItems && (
                <div className="formInputLabel">
                  Items{" "}
                  {!selectedCategory?.expenseCategoryItems.length && (
                    <span className="text-red-600">*</span>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2 mt-1 max-h-80 overflow-y-auto">
                    {selectedCategory.expenseCategoryItems.map(
                      (item, index) => {
                        const isSelected = selectedItems.includes(item);
                        return (
                          <button
                            aria-label="selectItem"
                            key={index}
                            type="button"
                            onClick={() => handleItemClick(item)}
                            className={`px-3 py-2 text-left rounded-md ${
                              isSelected
                                ? "bg-sky-700 text-white hover:bg-sky-600"
                                : "bg-gray-200 text-gray-700 hover:bg-sky-600 hover:text-white"
                            }`}
                          >
                            <div className="font-semibold">{item}</div>
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>
              )}

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
            <h3 className="formSectionTitle">Expense amount</h3>
            <div className="formSection">
              <div className="formLineDiv">
                {/* Expense Amount */}

                <label htmlFor="expenseAmount" className="formInputLabel">
                  Expense Amount{" "}
                  {!validity.validExpenseAmount && (
                    <span className="text-red-600">*</span>
                  )}{" "}
                  ({CurrencySymbol})
                  <input
                    aria-label="expense amount"
                    aria-invalid={!validity.validExpenseAmount}
                    placeholder="[$$$.$$]"
                    type="number"
                    id="expenseAmount"
                    value={formData.expenseAmount || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        expenseAmount: e.target.value,
                      })
                    }
                    className={`formInputText`}
                    required
                  />{" "}
                </label>
                {/* Expense Date */}

                <label htmlFor="expenseDate" className="formInputLabel">
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
                      setFormData({
                        ...formData,
                        expenseDate: e.target.value,
                        expenseMonth: getMonthFromDate(e.target.value),
                      })
                    }
                    className={`formInputText`}
                    required
                  />
                </label>
              </div>
              <div className="formLineDiv">
                {/* Expense Method */}

                <label htmlFor="expenseMethod" className="formInputLabel">
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
                      setFormData({
                        ...formData,
                        expenseMethod: e.target.value,
                        //pppayment date will become empty id not credit
                        expensePaymentDate:
                          formData?.expenseMethod === "Credit"
                            ? ""
                            : formData?.expenseDate,
                      })
                    }
                    className={`formInputText`}
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

                {/* Expense Payment Date */}

                <label htmlFor="expensePaymentDate" className="formInputLabel">
                  Expense Payment Date{" "}
                  {!validity.validExpensePaymentDate && (
                    <span className="text-red-600">*</span>
                  )}
                  <input
                    aria-invalid={!validity.validExpensePaymentDate}
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
                    className={`formInputText`}
                  />
                </label>
              </div>

              {/* Expense Note */}

              <label htmlFor="expenseNote" className="formInputLabel">
                Expense Note{" "}
                {!validity.validExpenseNote && (
                  <span className="text-red-600">*</span>
                )}
                <textarea
                  aria-invalid={!validity.validExpenseNote}
                  aria-label="expense note"
                  id="expenseNote"
                  value={formData.expenseNote || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, expenseNote: e.target.value })
                  }
                  rows="4"
                  className={`formInputText`}
                />
              </label>
            </div>
          </div>

          <div className="cancelSavebuttonsDiv">
            <button
              aria-label="cancel expense"
              type="button"
              className="cancel-button"
              onClick={() => navigate("/finances/expenses/expensesList/")}
            >
              Cancel
            </button>
            <button
              aria-label="submit expense"
              type="submit"
              disabled={!canSubmit || isUpdateLoading}
              className="save-button"
            >
              save
              {/* {isUpdateLoading ? "Adding..." : "Save Expense"} */}
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
  }
  return content;
};
export default EditExpenseForm;
