import { useState, useEffect } from "react";
import { useAddNewPayslipMutation } from "./payslipsApiSlice";
import { useNavigate } from "react-router-dom";
import { CurrencySymbol } from "../../../config/Currency";
import { useGetLeavesByYearQuery } from "../Leaves/leavesApiSlice";
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
  YEAR_REGEX,
  OBJECTID_REGEX,
  COMMENT_REGEX,
  FEE_REGEX,
} from "../../../config/REGEX";
import useAuth from "../../../hooks/useAuth";
import { MONTHS } from "../../../config/Months";
import ConfirmationModal from "../../../Components/Shared/Modals/ConfirmationModal";
import { useOutletContext } from "react-router-dom";
import LoadingStateIcon from "../../../Components/LoadingStateIcon";

const NewPayslipForm = () => {
  useEffect(() => {
    document.title = "New Payslip";
  });
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
    ///in this case employeeslist.id is the user id and not employee id, employeeId is here
    data: employees, //the data is renamed employees
    isLoading: isEmployeesLoading,
    isSuccess: isEmployeesSuccess,
    // isError: isEmployeesError,
    // error: employeesError,
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
    // isError: isLeavesError,
    // error: leavesError,
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
  const { triggerBanner } = useOutletContext(); // Access banner trigger

  const leavesList = isLeavesSuccess ? Object.values(leaves.entities) : [];
  //confirmation Modal states
  const [showConfirmation, setShowConfirmation] = useState(false);
  // Consolidated form state
  const [formData, setFormData] = useState({
    payslipYear: selectedAcademicYear?.title,
    payslipMonth: "",

    payslipWorkdays: [],
    payslipNote: "",
    payslipEmployee: "",
    payslipEmployeeName: "",
    payslipIsApproved: false,
    payslipPaymentDate: "",
    payslipLeaveDays: [],
    payslipSalaryComponents: {
      basic: "",
      payableBasic: "",
      allowance: "",
      totalAmount: "",
    },

    payslipCreator: userId,
  });

  const [validity, setValidity] = useState({
    validPayslipYear: false,
    validPayslipMonth: false,
    validPayslipNote: false,
    validPayslipEmployee: false,
    //validPayslipPaymentDate: false,
    validPayslipLeaveDays: false,
    validPayslipSalaryComponents: false,
  });

  // Validate inputs using regex patterns
  useEffect(() => {
    setValidity((prev) => ({
      ...prev,
      validPayslipYear: YEAR_REGEX.test(formData?.payslipYear),
      validPayslipMonth: NAME_REGEX.test(formData?.payslipMonth),
      validPayslipNote: COMMENT_REGEX.test(formData?.payslipNote),
      validPayslipEmployee: OBJECTID_REGEX.test(formData?.payslipEmployee),
      //validPayslipPaymentDate: DATE_REGEX.test(formData?.payslipPaymentDate),
      validPayslipLeaveDays: formData?.payslipLeaveDays?.length > 0,
      validPayslipSalaryComponents:
        formData?.payslipSalaryComponents?.totalAmount != 0 &&
        FEE_REGEX.test(formData?.payslipSalaryComponents?.totalAmount),
    }));
  }, [formData]);

  useEffect(() => {
    if (isAddSuccess) {
      setFormData({});
      navigate("/hr/payslips/payslipsList");
    }
  }, [isAddSuccess, navigate]);

  // const employeesList = isEmployeesSuccess
  //   ? Object.values(employees.entities)
  //   : [];

  let employeesList=[]
if (isEmployeesSuccess){
const employeesRaw= Object.values(employees.entities)
employeesList = employeesRaw.filter(
  (employee) => employee?.employeeData?.employeeIsActive === true
)
}



  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  //get the moonth in number from string

  function getMonthDetails(yearRange, month) {
    // Split the year range into start and end years
    const [startYear, endYear] = yearRange.split("/").map(Number);

    // Define months falling into each financial year
    const monthsInFirstYear = [
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const monthsInSecondYear = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
    ];

    // Determine the year associated with the given month
    let year;
    if (monthsInFirstYear.includes(month)) {
      year = startYear; // Months from July to December count for the first year
    } else if (monthsInSecondYear.includes(month)) {
      year = endYear; // Months from January to June count for the second year
    } else {
      throw new Error("Invalid month provided.");
    }

    // Convert month name to zero-based index
    const monthIndex = MONTHS.indexOf(month);
    if (monthIndex === -1) throw new Error("Invalid month name.");

    // Get the number of days in the month
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

    return {
      days: daysInMonth,
      monthNumber: monthIndex + 1, // Convert to 1-based index
      year,
    };
  }

  // Utility function to format a date as YYYY-MM-DD without time zone interference
  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Add leading zero for single-digit months
    const day = String(date.getDate()).padStart(2, "0"); // Add leading zero for single-digit days
    return `${year}-${month}-${day}`;
  }
  useEffect(() => {
    if (
      formData?.payslipEmployee !== "" &&
      formData?.payslipMonth !== "" &&
      isLeavesSuccess &&
      isEmployeesSuccess
    ) {
      const {
        days: daysInMonth,
        monthNumber: month,
        year,
      } = getMonthDetails(selectedAcademicYear?.title, formData?.payslipMonth);

      if (!year || !month || !daysInMonth) return;

      // Utility function to check if a date is a Sunday
      function isSunday(date) {
        return date.getDay() === 0; // 0 represents Sunday
      }

      // Generate an array for all days in the specified month
      const payslipDays = Array.from({ length: daysInMonth }, (_, index) => {
        const dayDate = new Date(year, month - 1, index + 1); // Correctly calculate the day for the given month
        const formattedDay = formatDate(dayDate); // Use the utility function to format the day

        // Check if the day is a Sunday
        const isWeekend = isSunday(dayDate);

        // Find if there's a leave for this day
        const leave = leavesList.find(
          (day) =>
            day?.leaveEmployee._id === formData?.payslipEmployee &&
            day?.leaveMonth === formData?.payslipMonth &&
            formatDate(new Date(day?.leaveStartDate)) === formattedDay // Use the same formatDate function
        );

        // Generate the object for each day
        // Generate the object for each day
        return {
          day: formattedDay,
          isWeekend: isWeekend, // True for weekends
          isSickLeave: leave?.leaveIsSickLeave && !isWeekend, // Sick leave if it's not a weekend
          isPaid: leave?.leaveIsPaidLeave !== false, // Paid leave indicator only if the value is explicitly fasle
          isGiven: leave?.leaveIsGiven, //
          isPartDay: leave?.leaveIsPartDay,
          partdayDuration:
            (new Date(leave?.leaveEndDate) - new Date(leave?.leaveStartDate)) /
            (1000 * 60 * 60),
          dayType: (() => {
            // Determine the type of day
            if (isWeekend) {
              return "weekend"; // If it's a weekend (Saturday or Sunday)
            }

            if (leave?.leaveIsSickLeave) {
              return "sick-leave"; // If it's sick leave and not a weekend
            }
            if (leave?.leaveIsGiven) {
              return "Given day"; // If it's sick leave and not a weekend
            }

            if (
              !leave?.leaveStartDate ||
              (leave?.leaveStartDate !== "" && leave?.leaveIsPartDay)
            ) {
              return "Work day"; // Off-day if leaveStartDate is empty or if it's a partial day
            }

            return "off-day"; // Otherwise, it's a workday
          })(),
        };
      });

      // console.log(payslipDays, "payslipDays1111111111");

      // Calculate totals
      const totalOpenDays = payslipDays.filter((day) => !day.isWeekend).length;
      const totalPaidDays = payslipDays.filter(
        (day) => day.isPaid && !day?.isWeekend
      ).length;
      const totalWorkDays = payslipDays.filter(
        (day) => day?.dayType === "Work day" || day?.dayType === "Given day"
      ).length;
      //console.log(totalPaidDays, "totalPaidDays");
      //console.log(totalOpenDays, "totalOpenDays");
      //console.log(totalWorkDays, "totalWorkDays");
      // Fetch basic salary for the selected employee
      const basicSalary =
        employeesList.find(
          (employee) => employee.employeeId === formData?.payslipEmployee
        )?.employeeData?.employeeCurrentEmployment?.salaryPackage?.basic || 0;
      const allowance =
        employeesList.find(
          (employee) => employee.employeeId === formData?.payslipEmployee
        )?.employeeData?.employeeCurrentEmployment?.salaryPackage?.allowance ||
        0;

      // Calculate payable basic salary
      const payableBasic =
        totalOpenDays > 0 ? (basicSalary * totalPaidDays) / totalOpenDays : 0;
      // Calculate total amount (payable basic + allowance)
      const totalAmount = (Number(payableBasic) + Number(allowance)).toFixed(2);
      // Update formData with calculated values
      // console.log(payslipDays, "payslipDays22222222222");
      // console.log(totalAmount, "totalAmount");
      setFormData((prev) => ({
        ...prev,
        payslipWorkdays: payslipDays, // Assign the array of day objects
        payslipSalaryComponents: {
          ...prev.payslipSalaryComponents,
          basic: Number(basicSalary).toFixed(2), // Assign the calculated payable basic
          payableBasic: Number(payableBasic).toFixed(2), // Assign the calculated payable basic
          allowance: Number(allowance).toFixed(2), // Assign the calculated payable basic
          totalAmount: totalAmount,
        },
      }));
    }
  }, [
    formData?.payslipEmployee,
    formData?.payslipMonth,

    isLeavesSuccess,
    isEmployeesSuccess,
  ]);
  //console.log(leavesList, "leavesList");

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
      const response = await addNewPayslip(formData);
      if (response?.message) {
        // Success response
        triggerBanner(response?.message, "success");
      } else if (response?.data?.message) {
        // Success response
        triggerBanner(response?.data?.message, "success");
      } else if (response?.error?.data?.message) {
        // Error response
        triggerBanner(response?.error?.data?.message, "error");
      } else if (isAddError) {
        // In case of unexpected response format
        triggerBanner(addError?.data?.message, "error");
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
  // console.log(validity, "validity");
  // console.log(formData, "formData");
  let content;
  if (isEmployeesLoading || isLeavesLoading) {
    content = (
      <>
        {" "}
        <HR />
        <LoadingStateIcon />
      </>
    );
  }
  if (isEmployeesSuccess && isLeavesSuccess) {
    content = (
      <>
        <HR />

        <form onSubmit={onSavePayslipClicked} className="form-container">
          <h2 className="formTitle ">
            New Payslip {formData?.payslipMonth} {selectedAcademicYear?.title}
          </h2>
          <div className="formSectionContainer">
            <h3 className="formSectionTitle">Payslip details</h3>
            <div className="formSection">
              <div className="formLineDiv">
                <label htmlFor="payslipMonth" className="formInputLabel">
                  Month{" "}
                  {!validity.validPayslipMonth && (
                    <span className="text-red-600">*</span>
                  )}
                  <select
                    id="payslipMonth"
                    name="payslipMonth"
                    value={formData.payslipMonth}
                    onChange={(e) =>
                      setFormData({ ...formData, payslipMonth: e.target.value })
                    }
                    className="formInputText"
                    required
                  >
                    <option value="">Select Month</option>
                    {MONTHS.map((month, index) => (
                      <option key={index} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>{" "}
                </label>

                <label htmlFor="payslipEmployee" className="formInputLabel">
                  Employee{" "}
                  {!validity.validPayslipEmployee && (
                    <span className="text-red-600">*</span>
                  )}
                  <select
                    id="payslipEmployee"
                    name="payslipEmployee"
                    value={formData.payslipEmployee}
                    onChange={(e) => {
                      const selectedEmployeeId = e.target.value;
                      // Find the employee whose ID matches the selectedEmployeeId
                      const selectedEmployee = employeesList?.find(
                        (employee) =>
                          employee?.employeeId === selectedEmployeeId
                      );
                      // Extract the leave days of the selected employee
                      const employeeLeaveDays = leavesList
                        .filter(
                          (leave) =>
                            leave?.leaveEmployee?._id === selectedEmployeeId
                        )
                        .map((leave) => leave?.id); // Extract only the leave IDs
                      // Extract the full name from the selected employee
                      const employeeFullName = selectedEmployee
                        ? `${selectedEmployee?.userFullName?.userFirstName} ${selectedEmployee?.userFullName?.userMiddleName} ${selectedEmployee?.userFullName?.userLastName}`
                        : "";
                      // Update formData with selected employee and their leave days
                      setFormData({
                        ...formData,
                        payslipEmployee: selectedEmployeeId,
                        payslipLeaveDays: employeeLeaveDays,
                        payslipEmployeeName: employeeFullName,
                      });
                    }}
                    className="formInputText"
                    required
                  >
                    <option value="">Select Employee</option>
                    {employeesList?.map((employee) => (
                      <option
                        key={employee?.employeeId}
                        value={employee?.employeeId}
                      >
                        {employee?.userFullName?.userFirstName}{" "}
                        {employee?.userFullName?.userMiddleName}{" "}
                        {employee?.userFullName?.userLastName}
                      </option>
                    ))}
                  </select>{" "}
                </label>

               

              
              </div>
            </div>
            {/* Payslip Leave Days */}

            <h3 className="formSectionTitle">Summary of days</h3>
            <div className="formSection">
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="px-4 py-2 text-left">Day</th>
                      <th className="px-4 py-2 text-left">Paid</th>
                      <th className="px-4 py-2 text-left">Type</th>
                      <th className="px-4 py-2 text-left">Leave Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData?.payslipWorkdays.map((dayObj, index) => (
                      <tr
                        key={index}
                        className={`border-t ${
                          dayObj.isWeekend ? "bg-yellow-200" : "bg-white"
                        }`}
                      >
                        <td className="px-4  text-sm">{dayObj.day}</td>
                        <td className="px-4 ">
                         
                          {!dayObj?.isWeekend && (
                            <div className="text-xs text-gray-600">
                              {dayObj.isPaid ? "Paid" : "Unpaid"}
                            </div>
                          )}
                        </td>
                        <td className="px-4  text-xs text-gray-600">
                          {dayObj.dayType}
                        </td>
                        <td className="px-4 py-1">
                          {dayObj?.isPartDay && (
                            <span className="text-xs text-red-600">
                              {dayObj?.partdayDuration} Hours leave
                            </span>
                          )}
                          {dayObj?.dayType === "off-day" && (
                            <span className="text-xs text-red-600">
                              1 day leave
                            </span>
                          )}
                          {dayObj?.dayType === "Given day" && (
                            <span className="text-xs text-red-600">
                              1 day leave
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Totals Section */}
                <div className="mt-4 p-4 bg-gray-100 rounded-md">
                  <p className="text-lg font-semibold">Summary</p>
                  <div className="flex justify-between text-sm mt-2">
                    <p className="font-medium">Total Open Days:</p>
                    <p>
                      {
                        formData?.payslipWorkdays.filter(
                          (day) => !day.isWeekend
                        ).length
                      }
                    </p>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <p className="font-medium">Total Work Days:</p>
                    <p>
                      {
                        formData?.payslipWorkdays.filter(
                          (day) =>
                            day?.dayType === "Work day" ||
                            day?.dayType === "Given day"
                        ).length
                      }
                    </p>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <p className="font-medium">Total Paid Days:</p>
                    <p>
                      {
                        formData?.payslipWorkdays.filter(
                          (day) => day?.isPaid && !day?.isWeekend
                        ).length
                      }
                    </p>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <p className="font-medium">Total Sick Leave:</p>
                    <p>
                      {
                        formData?.payslipWorkdays.filter(
                          (day) => day.isSickLeave
                        ).length
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <h3 className="formSectionTitle">Salary details</h3>
<div className="formSection">
  {/* Payable Basic Salary */}
  <div className="flex justify-between items-center mb-3">
    <span className="formInputLabel">Basic Salary:</span>
    <span className="text-gray-800">
      {formData?.payslipSalaryComponents?.basic || 0} {CurrencySymbol}
    </span>
  </div>

  {/* Payable Basic Salary */}
  <div className="flex justify-between items-center mb-3">
    <span className="formInputLabel">Payable Basic Salary:</span>
    <span className="text-gray-800">
      {formData?.payslipSalaryComponents?.payableBasic || 0} {CurrencySymbol}
    </span>
  </div>

  {/* Allowance Input */}
  <div className="flex justify-between items-center mb-3">
    <label htmlFor="allowance" className="formInputLabel">
      Allowance:
    </label>
    <input
      id="allowance"
      type="number"
      value={formData?.payslipSalaryComponents?.allowance || ""}
      onChange={(e) => {
        const allowanceValue = Number(e.target.value) || 0;
        // Update formData with allowance and total salary
        setFormData((prev) => ({
          ...prev,
          payslipSalaryComponents: {
            ...prev.payslipSalaryComponents,
            allowance: allowanceValue,
            totalAmount:
              Number(prev.payslipSalaryComponents?.payableBasic || 0) +
              allowanceValue,
          },
        }));
      }}
      className="border rounded-md px-2 py-1 w-28 text-right"
    />
  </div>

  {/* Total Salary */}
  <div className="flex justify-between items-center">
    <span className="formInputLabel">Total Salary:</span>
    <span className="font-bold text-gray-900">
      {formData?.payslipSalaryComponents?.totalAmount || 0} {CurrencySymbol}
    </span>
  </div>
</div>


            <label htmlFor={`payslipNote`} className="formInputLabel">
              Note
              {!validity?.validPayslipNote && (
                <span className="text-red-600"> check your input</span>
              )}
              <textarea
                aria-invalid={!validity?.validPayslipNote}
                type="text"
                id={`payslipNote`}
                name="comment"
                placeholder="[1-150 characters]"
                value={formData.payslipNote}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    payslipNote: e.target.value,
                  })
                }
                className={`formInputText text-wrap`}
                maxLength="150"
              ></textarea>
            </label>
          </div>
          {/* Payslip Salary Components */}

          {/* Submit Button */}
          <div className="cancelSavebuttonsDiv">
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
              className="save-button"
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
    );
  }

  return content;
};

export default NewPayslipForm;
