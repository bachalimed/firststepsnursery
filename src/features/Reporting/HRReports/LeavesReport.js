import React, { useState, useEffect } from "react";
import html2pdf from "html2pdf.js";
import { useGetEmployeesByYearQuery } from "../../HR/Employees/employeesApiSlice";
import { useGetLeavesByYearQuery } from "../../HR/Leaves/leavesApiSlice";
import LoadingStateIcon from "../../../Components/LoadingStateIcon";
import { useSelector } from "react-redux";
import smallfirststeps from "../../../Data/smallfirststeps.png";
import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
} from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import HRReports from "../HRReports";
import { MONTHS } from "../../../config/Months";
const LeavesReport = () => {
  useEffect(() => {
    document.title = "Leaves Report";
  }, []);

  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId);
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  );
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [isReportGenerated, setIsReportGenerated] = useState(false);

  const {
    data: employees,
    isLoading: isEmployeesLoading,
    isSuccess: isEmployeesSuccess,
  } = useGetEmployeesByYearQuery(
    {
      selectedYear: selectedAcademicYear?.title,
      endpointName: "employeesList",
    },
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  const {
    data: leaves,
    isLoading: isLeavesLoading,
    isSuccess: isLeavesSuccess,
  } = useGetLeavesByYearQuery(
    {
      selectedYear: selectedAcademicYear?.title,
      endpointName: "leavesList",
    },
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  useEffect(() => {
    if (isLeavesSuccess) {
      const leavesList = Object.values(leaves.entities);

      const filtered = leavesList.filter((leave) => {
        const matchesEmployee = selectedEmployee
          ? leave?.leaveEmployee?._id === selectedEmployee
          : true; // If no employee is selected, allow all

        const matchesMonth = selectedMonth
          ? leave.leaveMonth === selectedMonth
          : true; // If no month is selected, allow all

        return matchesEmployee && matchesMonth; // Match both if selected
      });

      // Sort filtered leaves by leaveStartDate
      filtered.sort(
        (a, b) => new Date(a.leaveStartDate) - new Date(b.leaveStartDate)
      );

      setFilteredLeaves(filtered);
      setIsReportGenerated(filtered.length > 0);
    }
  }, [leaves, selectedEmployee, selectedMonth]);

  const totalLeaveDays = filteredLeaves.reduce((total, leave) => {
    const leaveStartDate = new Date(leave.leaveStartDate);
    const leaveEndDate = new Date(leave.leaveEndDate);
  
    let leaveDurationInDays = 0;
    let leaveDurationInHours = 0;
  
    if (leave.leaveIsPartDay) {
      // Calculate part day duration in hours
      leaveDurationInHours =
        Math.abs(leaveEndDate.getTime() - leaveStartDate.getTime()) / (1000 * 60 * 60); // Convert milliseconds to hours
  
      // Round down to whole hours
      leaveDurationInDays = Math.floor(leaveDurationInHours / 8); // Convert hours to full days (if needed)
      leaveDurationInHours = leaveDurationInHours % 8; // Remaining hours after full days
    } else {
      // For full days, calculate the duration in days (assuming 1 day = 8 hours)
      leaveDurationInDays = calculateLeaveDuration(leave.leaveStartDate, leave.leaveEndDate);
    }
  
    // Add the calculated duration in days and hours to the total
    return {
      days: total.days + leaveDurationInDays,
      hours: total.hours + leaveDurationInHours,
    };
  }, { days: 0, hours: 0 });
  
  // Convert total leave to full days and remaining hours
  const fullDays = totalLeaveDays.days + Math.floor(totalLeaveDays.hours / 8);
  const remainingHours = totalLeaveDays.hours % 8;
  
  function calculateLeaveDuration(start, end) {
    const startDay = new Date(start).setHours(0, 0, 0, 0); // Set to start of the day
    const endDay = new Date(end).setHours(0, 0, 0, 0); // Set to start of the day

    const diffTime = endDay - startDay; // Difference in milliseconds
    const diffDays = diffTime / (1000 * 3600 * 24); // Convert to days

    return diffDays + 1; // Add 1 to include both start and end days
  }

  const handleDownloadPDF = () => {
    const element = document.getElementById("leaves-report-content");
    const opt = {
      margin: 1,
      filename: `leaves_report_${selectedEmployee}.pdf`,
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().from(element).set(opt).save();
  };

  const handleCancelFilters = () => {
    setSelectedEmployee("");
    setSelectedMonth("");
    setFilteredLeaves([]);
    setIsReportGenerated(false);
  };

  const employeesList = isEmployeesSuccess
    ? Object.values(employees.entities)
    : [];

  return (
    <>
      <HRReports />
      <div className="form-container">
        <h2 className="formTitle print-container">Leaves Report</h2>
        {isLeavesLoading && <LoadingStateIcon />}

        {/* Filters Section */}
        <div className="formSectionContainer no-print">
          <div className="formLineDiv">
            <label htmlFor="employee" className="formInputLabel">
              Select Employee:
              <select
                id="employee"
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="formInputText"
              >
                <option value="">All Employees</option>
                {employeesList.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {`${employee.userFullName?.userFirstName} ${
                      employee.userFullName?.userMiddleName || ""
                    } ${employee.userFullName?.userLastName}`}
                  </option>
                ))}
              </select>
            </label>

            <label htmlFor="month" className="formInputLabel">
              Select Month:
              <select
                id="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="formInputText"
              >
                <option value="">All Months</option>
                {MONTHS.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex justify-center space-x-4 mt-4">
            <button
              type="button"
              className="cancel-button no-print"
              onClick={handleCancelFilters}
            >
              Cancel
            </button>
            <button onClick={handleDownloadPDF} className="add-button no-print">
              Download as PDF
            </button>
            <button
              onClick={() => window.print()}
              className="save-button no-print"
            >
              Print
            </button>
          </div>
        </div>

        {/* Report Content */}
        {isReportGenerated && (
          <div
            id="leaves-report-content"
            className="border p-4 rounded-lg mt-4 print-container"
          >
            <div className="flex justify-between mb-4 no-print">
              <img src={smallfirststeps} alt="Logo" className="h-12 w-auto" />
              <p className="text-sm text-gray-500">
                Report Date: {new Date().toLocaleDateString()}
              </p>
            </div>
            <h3 className="text-lg font-bold mb-2 text-center print-container">
              {`Leaves Report  ${
                employeesList.find((emp) => emp.id === selectedEmployee)
                  ? `${
                      employeesList.find((emp) => emp.id === selectedEmployee)
                        ?.userFullName?.userFirstName || ""
                    } 
       ${
         employeesList.find((emp) => emp.id === selectedEmployee)?.userFullName
           ?.userMiddleName || ""
       } 
       ${
         employeesList.find((emp) => emp.id === selectedEmployee)?.userFullName
           ?.userLastName || ""
       }`
                  : ""
              }`}

              <br />
              {`${selectedMonth} Academic Year: ${selectedAcademicYear?.title}`}
            </h3>

            <table className="w-full border-collapse border mt-4 text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-2 py-1">#</th>
                  {!selectedEmployee && <th>Employee</th>}{" "}
                  {/* Show Employee column if no employee is selected */}
                  <th className="border px-2 py-1">Start Date</th>
                  <th className="border px-2 py-1">End Date</th>
                  <th className="border px-2 py-1">Duration</th>
                  <th className="border px-2 py-1">Given</th>
                  <th className="border px-2 py-1">Paid</th>
                  <th className="border px-2 py-1">Sickday</th>
                  <th className="border px-2 py-1">Comment</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeaves.map((leave, index) => (
                  <tr key={leave._id}>
                    <td className="border px-2 py-1 text-center">
                      {index + 1}
                    </td>
                    {!selectedEmployee && (
                      <td>
                        {
                          employeesList.find(
                            (emp) => emp.id === leave?.leaveEmployee?._id
                          )?.userFullName?.userFirstName
                        }{" "}
                        {
                          employeesList.find(
                            (emp) => emp.id === leave?.leaveEmployee?._id
                          )?.userFullName?.userMiddleName
                        }{" "}
                        {
                          employeesList.find(
                            (emp) => emp.id === leave?.leaveEmployee?._id
                          )?.userFullName?.userLastName
                        }
                      </td>
                    )}{" "}
                    {/* Show Employee name when no filter is applied */}
                    <td className="border px-2 py-1">
                      {new Date(leave.leaveStartDate).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "short",
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        }
                      )}
                      {leave.leaveIsPartDay && (
                        <>
                          <br />
                          <span>
                            {new Date(leave.leaveStartDate).toLocaleTimeString(
                              "en-US"
                            )}
                          </span>
                        </>
                      )}
                    </td>
                    <td className="border px-2 py-1">
                      {new Date(leave.leaveEndDate).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "short",
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        }
                      )}
                      {leave.leaveIsPartDay && (
                        <>
                          <br />
                          <span>
                            {new Date(leave.leaveEndDate).toLocaleTimeString(
                              "en-US"
                            )}
                          </span>
                        </>
                      )}
                    </td>
                    <td className="border px-2 py-1">
                      {leave.leaveIsPartDay
                        ? `${Math.abs(
                            new Date(leave.leaveEndDate).getHours() -
                              new Date(leave.leaveStartDate).getHours()
                          )} hour(s)`
                        : `${calculateLeaveDuration(
                            leave.leaveStartDate,
                            leave.leaveEndDate
                          )} day(s)`}
                    </td>
                    <td className="border px-2 py-1 text-center">
                      {leave.leaveIsGiven ? "Yes" : "No"}
                    </td>
                    <td className="border px-2 py-1 text-center">
                      {leave.leaveIsPaidLeave ? "Yes" : "No"}
                    </td>
                    <td className="border px-2 py-1 text-center">
                      {leave.leaveIsSickLeave ? "Yes" : "No"}
                    </td>
                    <td className="border px-2 py-1 text-center">
                      {leave.leaveComment || ""}
                    </td>
                  </tr>
                ))}
                {/* Total Row */}
                <tr className="bg-gray-100 font-bold">
                  <td colSpan="3" className="border px-2 py-1 text-right">
                    Total Leave Days:
                  </td>
                  <td colSpan="6" className="border px-2 py-1 text-center">
                  {`${fullDays} day(s) and ${remainingHours} hour(s)`}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default LeavesReport;
