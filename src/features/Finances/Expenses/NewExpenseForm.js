import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  useAddNewExpenseMutation,
  useGetExpensesQuery,
} from "./expensesApiSlice"; // Redux API action

import Finances from "../Finances";
import useAuth from "../../../hooks/useAuth";
import { useGetAttendedSchoolsQuery } from "../../AppSettings/AcademicsSet/attendedSchools/attendedSchoolsApiSlice";
import { useGetEmployeesByYearQuery } from "../../HR/Employees/employeesApiSlice";
import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
  selectAllAcademicYears,
} from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import { NAME_REGEX, DATE_REGEX } from "../../../config/REGEX"
import ConfirmationModal from "../../../Components/Shared/Modals/ConfirmationModal";
const NewExpenseForm = () => {
  const { userId } = useAuth();
  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  const academicYears = useSelector(selectAllAcademicYears);

  const {
    data: employees, //the data is renamed employees
    isLoading: isEmployeesLoading, //monitor several situations is loading...
    isSuccess: isEmployeesSuccess,
    isError: isEmployeesError,
    error: employeesError,
  } = useGetEmployeesByYearQuery(
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
    data: schools,
    isLoading: isSchoolLoading,
    isSuccess: isSchoolSuccess,
    isError: isSchoolError,
    error: schoolError,
  } = useGetAttendedSchoolsQuery({
    endpointName: "NewExpenseForm",
  }) || {}; //this should match the endpoint defined in your API slice.!! what does it mean?

  const {
    data: expenses,
    isLoading: isExpensesLoading,
    isSuccess: isExpensesSuccess,
    isError: isExpensesError,
    error: expensesError,
  } = useGetExpensesQuery({
    endpointName: "NewExpenseForm",
  }) || {}; //this should match the endpoint defined in your API slice.!! what does it mean?
  const [formData, setFormData] = useState({
    expenseYear: selectedAcademicYear?.title || "",
    expenses: [
      {
        animator: "",
        schools: [],
      },
    ],
    assignedFrom: "",
    assignedTo: "",
    creator: userId,
    operator: userId,
  });
  let schoolsList = isSchoolSuccess ? Object.values(schools.entities) : [];
  // let employeesList = isEmployeesSuccess
  //   ? Object.values(employees.entities)
  //   : [];
 //confirmation Modal states
 const [showConfirmation, setShowConfirmation] = useState(false);
  let employeesList = [];
  let activeEmployeesList = [];

  if (isEmployeesSuccess) {
    const { entities } = employees;
    employeesList = Object.values(entities);
    activeEmployeesList = employeesList.filter(
      (employee) => employee.employeeData.employeeIsActive === true
    );
  }
  let expensesList = isExpensesSuccess
    ? Object.values(expenses.entities)
    : [];

  const [validity, setValidity] = useState({
    validExpenseYear: false,
    validExpenses: false,
    validAssignedFrom: false,
    validAssignedTo: false,
    noOverlap: true, // New validity check for date overlap
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

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
  // Check if any dates overlap with existing expenses
  const checkNoOverlap = (from, to) => {
    if(expensesList!=[]){
    return expensesList.every((expense) => {
     
      const existingFrom = new Date(expense.assignedFrom);
      const existingTo = new Date(expense.assignedTo);
      const newFrom = new Date(from);
      const newTo = new Date(to);

      return newTo < existingFrom || newFrom > existingTo; // Ensure no date overlap
    });
  }
  };
  // Validate inputs using regex patterns
  useEffect(() => {
    setValidity((prev) => ({
      ...prev,
      validExpenseYear: DATE_REGEX.test(formData.expenseYear),
      validExpenses:
        formData.expenses.length > 0 &&
        formData.expenses.every((animator) => animator !== ""),
      validAssignedFrom: DATE_REGEX.test(formData.assignedFrom), // Ensure schoolType is selected
      validAssignedTo:
        !!formData.assignedTo &&
        new Date(formData?.assignedFrom) < new Date(formData.assignedTo),
      noOverlap: checkNoOverlap(formData.assignedFrom, formData.assignedTo),
    }));
  }, [formData]);
  // console.log(
  //   validity.validExpenseYear,
  //   validity.validExpenses,
  //   validity.validAssignedFrom,
  //   validity.validAssignedTo
  // );
  // Clear form and errors on success
  useEffect(() => {
    if (isAddSuccess) {
      setFormData({
        expenses: [
          {
            animator: "",
            schools: [],
          },
        ],
        assignedFrom: "",
        assignedTo: "",
        creator: "",
        operator: "",
      });

      navigate("/academics/plannings/Expenses");
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
      const newExpense = await addNewExpense(
        formData
      ).unwrap();
    } catch (err) {
      console.error("Error saving student:", err);
    }
  };
 // Close the modal without saving
 const handleCloseModal = () => {
  setShowConfirmation(false);
};
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Filter available  by excluding already selected ones
  const getAvailable = (index) => {
    const selected = formData.expenses.map(
      (expense) => expense.animator
    );
    return activeEmployeesList.filter(
      (employee) =>
        !selected.includes(employee.id) ||
        selected[index] === employee.id
    );
  };

  // Get available schools for the current expense index
  const getAvailableSchools = (index) => {
    // Gather all selected schools from previous expenses
    const selectedSchools = formData.expenses
      .slice(0, index) // Only consider previous expenses to allow unique school selection per animator
      .flatMap((expense) => expense.schools);

    // Filter out schools already selected in previous expenses
    return schoolsList.filter(
      (school) =>
        !selectedSchools.includes(school.id) &&
        school.schoolName !== "First Steps"
    );
  };

  // Handle animator or school selection changes in each expense
  const handleExpenseChange = (index, field, value) => {
    const updatedExpenses = formData.expenses.map((expense, i) =>
      i === index ? { ...expense, [field]: value } : expense
    );
    setFormData((prev) => ({ ...prev, expenses: updatedExpenses }));
  };

  // Toggle school selection for multiple schools in each expense
  const toggleSchoolSelection = (index, schoolId) => {
    const updatedExpenses = formData.expenses.map((expense, i) => {
      if (i === index) {
        const schools = expense.schools.includes(schoolId)
          ? expense.schools.filter((id) => id !== schoolId) // Remove if already selected
          : [...expense.schools, schoolId]; // Add if not selected
        return { ...expense, schools };
      }
      return expense;
    });
    setFormData((prev) => ({ ...prev, expenses: updatedExpenses }));
  };

  // Add a new expense row for another animator
  const addExpense = () => {
    setFormData((prev) => ({
      ...prev,
      expenses: [...prev.expenses, { animator: "", schools: [] }],
    }));
  };

  console.log(formData, "formdata");

  return (
    <>
      <Finances />
      <div className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Add New Expense
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Expense Year{" "}
              {!validity.validExpenseYear && (
                <span className="text-red-500">*</span>
              )}
            </label>
            <input
              type="text"
              name="expenseYear"
              value={formData.expenseYear}
              onChange={handleChange}
              placeholder="Enter Year"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              From{" "}
              {(!validity.validAssignedFrom || !validity.noOverlap) && (
                <span className="text-red-500">*</span>
              )}
            </label>
            <input
              type="date"
              name="assignedFrom"
              value={formData.assignedFrom}
              onChange={handleChange}
              placeholder="Enter Date"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              To{" "}
              {(!validity.validAssignedTo ||! validity.noOverlap) && (
                <span className="text-red-500">*</span>
              )}
            </label>
            <input
              type="date"
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              placeholder="Enter Date"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <h3 className="text-xl font-bold mb-4">Expenses</h3>
          {formData.expenses.map((expense, index) => (
            <div key={index} className="mb-4 p-4 border rounded-md">
              <label className="block text-gray-700 font-bold mb-2">
                Animator
              </label>
              <select
                value={expense.animator}
                onChange={(e) =>
                  handleExpenseChange(index, "animator", e.target.value)
                }
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Animator</option>
                {getAvailable(index).map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.userFullName.userFirstName}{" "}
                    {employee.userFullName.userMiddleName}{" "}
                    {employee.userFullName.userLastName}
                  </option>
                ))}
              </select>

              <label className="block text-gray-700 font-bold mt-4 mb-2">
                Schools
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {getAvailableSchools(index).map((school) => (
                  <button
                    key={school.id}
                    type="button"
                    onClick={() => toggleSchoolSelection(index, school.id)}
                    className={`px-3 py-1 rounded-md ${
                      expense.schools.includes(school.id)
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {school.schoolName}
                  </button>
                ))}
              </div>

              <div className="mt-2 text-gray-600">
                Selected Schools:{" "}
                {expense.schools
                  .map(
                    (schoolId) =>
                      schoolsList.find((school) => school.id === schoolId)
                        ?.schoolName
                  )
                  .join(", ")}
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addExpense}
            className="w-full bg-blue-200 text-gray-700 py-2 px-4 rounded-md mt-2 hover:bg-blue-300 transition duration-200"
          >
            Add Another Expense
          </button>

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-200 mt-4"
          >
            {isAddLoading ? "Adding..." : "Add Expense"}
          </button>
          <button
            type="submit"
            //disabled={!canSubmit}
            className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-200 mt-4"
            onClick={() =>
              navigate("/academics/plannings/Expenses/")
            }
          >
            Cancel
          </button>
        </form>
      </div>
      {/* Confirmation Modal */}
      <ConfirmationModal
        show={showConfirmation}
        onClose={handleCloseModal}
        onConfirm={handleConfirmSave}
        title="Confirm Save"
        message="Are you sure you want to save this student?"
      />
    </>
  );
};

export default NewExpenseForm;
