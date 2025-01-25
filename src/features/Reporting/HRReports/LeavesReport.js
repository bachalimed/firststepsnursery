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

const LeavesReport = () => {
  useEffect(() => {
    document.title = "Leaves Report";
  }, []);

  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId);
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  );

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
    if (isLeavesSuccess && selectedEmployee) {
      const leavesList = Object.values(leaves.entities);
      const filtered = leavesList.filter(
        (leave) => leave?.leaveEmployee?._id === selectedEmployee
      );

      setFilteredLeaves(filtered);
      setIsReportGenerated(true);
    }
  }, [leaves, selectedEmployee]);

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
    setFilteredLeaves([]);
    setIsReportGenerated(false);
  };

  const employeesList = isEmployeesSuccess
    ? Object.values(employees.entities)
    : [];

  // Calculate total leave days
  const totalLeaveDays = filteredLeaves.reduce((total, leave) => {
    if (leave.leaveIsPartDay) {
      const hours =
        Math.abs(
          new Date(leave.leaveEndDate).getHours() -
            new Date(leave.leaveStartDate).getHours()
        ) || 8; // Default to 8 hours if hours are not defined
      return total + hours / 8; // Convert hours to days
    } else {
      const days = Math.max(
        Math.ceil(
          (new Date(leave.leaveEndDate).getTime() -
            new Date(leave.leaveStartDate).getTime()) /
            (1000 * 60 * 60 * 24)
        ),
        1 // At least 1 day
      );
      return total + days;
    }
  }, 0);

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
          <option value="">Select Employee</option>
          {employeesList.map((employee) => (
            <option key={employee.id} value={employee.id}>
              {`${employee.userFullName?.userFirstName} ${employee.userFullName?.userMiddleName || ""} ${employee.userFullName?.userLastName}`}
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
      <button
        onClick={handleDownloadPDF}
        className="add-button no-print"
      >
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
        Leaves Report for Selected Employee
        <br />
        Academic Year: {selectedAcademicYear?.title}
      </h3>

      <table className="w-full border-collapse border mt-4 text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">#</th>
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
              <td className="border px-2 py-1 text-center">{index + 1}</td>
              <td className="border px-2 py-1">
                {new Date(leave.leaveStartDate).toLocaleDateString("en-US", {
                  weekday: "short",
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}
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
                {new Date(leave.leaveEndDate).toLocaleDateString("en-US", {
                  weekday: "short",
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}
                {leave.leaveIsPartDay && (
                  <>
                    <br />
                    <span>
                      {new Date(leave.leaveEndDate).toLocaleTimeString("en-US")}
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
                  : `${Math.max(
                      Math.ceil(
                        (new Date(leave.leaveEndDate).getTime() -
                          new Date(leave.leaveStartDate).getTime()) /
                          (1000 * 60 * 60 * 24)
                      ),
                      1
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
              {Math.floor(totalLeaveDays)} day(s)
              {totalLeaveDays % 1 !== 0 &&
                ` ${Math.round((totalLeaveDays % 1) * 8)} hour(s)`}
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
