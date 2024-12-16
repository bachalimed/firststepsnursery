import { useState, useEffect } from "react";
import { useAddNewPayslipMutation } from "./payslipsApiSlice";
import { useNavigate } from "react-router-dom";
import { calculateSalary } from "../../../Components/lib/Utils/calculateSalary";
import {
  selectLeaveById,
  useGetLeavesByYearQuery,
} from "../Leaves/leavesApiSlice";

import { ACTIONS } from "../../../config/UserActions";
import HR from "../HR";
import { useGetEmployeesByYearQuery } from "../Employees/employeesApiSlice";
import { useSelector } from "react-redux";
import {
  selectAllAcademicYears,
  selectCurrentAcademicYearId,
  selectAcademicYearById,
} from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import {
  NAME_REGEX,
  NUMBER_REGEX,
  USER_REGEX,
  PHONE_REGEX,
  DATE_REGEX,
  YEAR_REGEX,
  OBJECTID_REGEX,
} from "../../../config/REGEX";
import useAuth from "../../../hooks/useAuth";
import { MONTHS } from "../../../config/Months";
import ConfirmationModal from "../../../Components/Shared/Modals/ConfirmationModal";
const NewPayslipForm = () => {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  const academicYears = useSelector(selectAllAcademicYears);
  //console.log(selectedAcademicYear?.title, "selectedAcademicYear");
  const [
    addNewPayslip,
    {
      isLoading: isAddLoading,
      isSuccess: isAddSuccess,
      isError: isAddError,
      error: addError,
    },
  ] = useAddNewPayslipMutation();

  const {
    data: employees, //the data is renamed employees
    isLoading: isEmployeesLoading,
    isSuccess: isEmployeesSuccess,
    isError: isEmployeesError,
    error: employeesError,
  } = useGetEmployeesByYearQuery(
    {
      selectedYear: selectedAcademicYear?.title,
      endpointName: "NewLeaveForm",
    } || {},
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  const {
    data: leaves, //the data is renamed leaves
    isLoading: isLeavesLoading,
    isSuccess: isLeavesSuccess,
    isError: isLeavesError,
    error: leavesError,
  } = useGetLeavesByYearQuery(
    {
      selectedYear: selectedAcademicYear?.title,
      endpointName: "NewPayslipForm",
    } || {},
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  const leavesList = isLeavesSuccess ? Object.values(leaves.entities) : [];
  //confirmation Modal states
  const [showConfirmation, setShowConfirmation] = useState(false);
  // Consolidated form state
  const [formData, setFormData] = useState({
    payslipYear: selectedAcademicYear?.title,
    payslipMonth: "",
    payslipEmployee: "",
    payslipIsApproved: false,
    payslipPaymentDate: "",
    payslipLeaveDays: [],
    payslipSalaryComponents: {
      component: "",
      amount: "",
      periodicity: "",
      reduction: "",
    },

    payslipOperator: userId,
    payslipCreator: userId,
  });

  const [validity, setValidity] = useState({
    validPayslipYear: selectedAcademicYear?.title,
    validPayslipMonth: false,
    validPayslipEmployee: false,
    validPayslipPaymentDate: false,
    validPayslipLeaveDays: false,
    validPayslipSalaryComponents: false,
    validPayslipOperator: userId,
    validPayslipCreator: userId,
  });

  // Validate inputs using regex patterns
  useEffect(() => {
    setValidity((prev) => ({
      ...prev,
      validPayslipYear: YEAR_REGEX.test(formData?.payslipYear),
      validPayslipMonth: NAME_REGEX.test(formData?.payslipMonth),
      validPayslipEmployee: OBJECTID_REGEX.test(formData?.payslipEmployee),
      validPayslipPaymentDate: DATE_REGEX.test(formData?.payslipPaymentDate),
      validPayslipLeaveDays: formData?.payslipLeaveDays?.length > 0,
      validPayslipSalaryComponents:
        formData?.payslipSalaryComponents?.length > 0,
    }));
  }, [formData]);

  useEffect(() => {
    if (isAddSuccess) {
      setFormData({
        payslipYear: "",
        payslipMonth: "",
        payslipEmployee: "",
        payslipIsApproved: "",
        payslipPaymentDate: "",
        payslipLeaveDays: [],
        payslipSalaryComponents: {},
        payslipOperator: "",
        payslipCreator: "",
      });
      navigate("/hr/payslips/payslipsList");
    }
  }, [isAddSuccess, navigate]);

  const employeesList = isEmployeesSuccess
    ? Object.values(employees.entities)
    : [];
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  //to retrive the leave days of teh employee selected
  useEffect(() => {
    if (
      formData?.payslipEmployee !== "" &&
      formData?.payslipMonth !== "" &&
      isLeavesSuccess
    ) {
      // Filter the leavesList for the specific employee and get only the 'id' values
      const leaveDays = leavesList
        .filter(
          (day) =>
            day?.leaveEmployee._id === formData?.payslipEmployee &&
            day?.leaveMonth === formData?.payslipMonth
        ) // Also filter by leaveMonth
        .map((day) => day?.id); // Extract only the ids of matching leave days

      // Update the formData with the filtered leave day ids
      setFormData((prev) => ({
        ...prev,
        payslipLeaveDays: leaveDays, // Directly assign the array of ids
      }));
    }
  }, [formData?.payslipEmployee, formData?.payslipMonth]);
  // to compute the salary of the emolyee selcted
  useEffect(() => {
    if (
      formData?.payslipEmployee !== "" &&
      formData?.payslipMonth !== "" &&
      isLeavesSuccess &&
      isEmployeesSuccess
    ) {
      // Helper function to generate an array of dates between two dates
      const getDateRange = (startDate, endDate) => {
        const dateArray = [];
        let currentDate = new Date(startDate);
        while (currentDate <= new Date(endDate)) {
          dateArray.push(new Date(currentDate)); // Add the current date
          currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
        }
        return dateArray;
      };

      // Filter leavesList for unpaid leave days matching the employee and month
      const unpaidLeaveDays = leavesList
        .filter(
          (day) =>
            day?.leaveEmployee._id === formData?.payslipEmployee &&
            day?.leaveMonth === formData?.payslipMonth &&
            day?.leaveIsPaidLeave === false
        )
        .flatMap((day) => getDateRange(day.leaveStartDate, day.leaveEndDate)); // Generate all dates in the leave range

      // Find the selected employee
      const selectedEmpl = employeesList?.find(
        (employee) => employee.employeeId === formData?.payslipEmployee
      );
      const result = calculateSalary(
        formData?.payslipYear,
        formData?.payslipMonth,
        unpaidLeaveDays,
        selectedEmpl?.employeeData?.employeeCurretnEmployment?.salaryPackage
          ?.basic
      );
      const employeePeriodicity =
        selectedEmpl?.employeeData?.employeeCurretnEmployment?.salaryPackage
          ?.payment;
      console.log(result, "result", employeePeriodicity, "employeePeriodicity");

      setFormData((prev) => ({
        ...prev,
        payslipSalaryComponents: {
          amount: result?.salary,
          periodicity: employeePeriodicity,
          basic:
            selectedEmpl?.employeeData?.employeeCurretnEmployment?.salaryPackage
              ?.basic,
        }, // Directly assign the array of ids
      }));
    }
  }, [formData?.payslipEmployee, formData?.payslipMonth]);

  const canSave =
    Object.values(validity).every(Boolean) &&
    // ((formData.payslipYears[0].academicYear)!=='') &&

    !isAddLoading;

  const onSavePayslipClicked = async (e) => {
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
      await addNewPayslip(formData);
    } catch (err) {
      console.error("Failed to save the payslip:", err);
    }
  };

  // Close the modal without saving
  const handleCloseModal = () => {
    setShowConfirmation(false);
  };
  console.log(formData, "formData");
  const content = isLeavesSuccess ? (
    <>
      <HR />

      <form onSubmit={onSavePayslipClicked} className="form-container">
        <h2  className="formTitle ">Add New Payslip: </h2>

        <div>
          <label
            htmlFor="payslipMonth"
             className="formInputLabel"
          >
            Month{" "}
            {!validity.validPayslipMonth && (
              <span className="text-red-600">*</span>
            )}
          </label>
          <select
            id="payslipMonth"
            name="payslipMonth"
            value={formData.payslipMonth}
            onChange={(e) =>
              setFormData({ ...formData, payslipMonth: e.target.value })
            }
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select Month</option>
            {MONTHS.map((month, index) => (
              <option key={index} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="payslipEmployee"
             className="formInputLabel"
          >
            Employee{" "}
            {!validity.validPayslipEmployee && (
              <span className="text-red-600">*</span>
            )}
          </label>
          <select
            id="payslipEmployee"
            name="payslipEmployee"
            value={formData.payslipEmployee}
            onChange={(e) =>
              setFormData({ ...formData, payslipEmployee: e.target.value })
            }
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select Employee</option>
            {employeesList?.map((employee) => (
              <option key={employee?.employeeId} value={employee?.employeeId}>
                {employee?.userFullName?.userFirstName}{" "}
                {employee?.userFullName?.userMiddleName}{" "}
                {employee?.userFullName?.userLastName}
              </option>
            ))}
          </select>
        </div>

        {/* payslip Is Approved  beeter only done inediting for the manger to approve after creation*/}
        <div>
          <label  className="formInputLabel">
            payslip is Approved ? (leave for edit form or to approve nin the
            list)
          </label>
          <input
            type="checkbox"
            name="payslipIsApproved"
            checked={formData.payslipIsApproved}
            onChange={handleInputChange}
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
        </div>

        {/* Payslip Payment Date */}
        <div>
          <label
            htmlFor="payslipPaymentDate"
             className="formInputLabel"
          >
            Payment Date{" "}
            {!validity.validPayslipPaymentDate && (
              <span className="text-red-600">*</span>
            )}
          </label>
          <input
            type="date"
            id="payslipPaymentDate"
            name="payslipPaymentDate"
            value={formData.payslipPaymentDate}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Payslip Leave Days */}
        {formData?.payslipLeaveDays?.length > 0 && (
          <div>
            <label
              htmlFor="payslipLeaveDays"
               className="formInputLabel"
            >
              Leave days
            </label>
            <select
              multiple
              id="payslipLeaveDays"
              name="payslipLeaveDays"
              value={formData.payslipLeaveDays}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  payslipLeaveDays: Array.from(
                    e.target.selectedOptions,
                    (option) => option.value
                  ),
                })
              }
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            >
              {leavesList.map(
                (leave) =>
                  leave?.leaveEmployee?._id === formData?.payslipEmployee &&
                  leave?.leaveMonth === formData?.payslipMonth && (
                    <option key={leave.id} value={leave.id}>
                      From: {leave?.leaveStartDate} to: {leave?.leaveEndDate}{" "}
                      {leave?.leaveIsPaidLeave ? "Paid" : "Unpaid"},{" "}
                      {leave?.leaveIsApproved ? "Approved" : "Not approved"},{" "}
                      {leave?.leaveIsSickLeave ? "Sick Leave" : "Sick Leave"}
                    </option>
                  )
              )}
            </select>
          </div>
        )}

        {/* Payslip Salary Components */}

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/hr/payslips/payslipsList/")}
            className="cancel-button"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!canSave || isAddLoading}
            className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
              canSave
                ? "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
                : "bg-gray-400 cursor-not-allowed"
            } focus:outline-none focus:ring-2 focus:ring-offset-2`}
          >
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
  ) : (
    <>
      <HR />
    </>
  );
  return content;
};

export default NewPayslipForm;
