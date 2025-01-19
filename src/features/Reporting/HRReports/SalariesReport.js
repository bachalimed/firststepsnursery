import React, { useState, useEffect } from "react";
import html2pdf from "html2pdf.js";
import { useGetEmployeesByYearQuery } from "../../HR/Employees/employeesApiSlice";
import { useGetPayslipsByYearQuery } from "../../HR/Payslips/payslipsApiSlice";
import LoadingStateIcon from "../../../Components/LoadingStateIcon";
import { useSelector } from "react-redux";
import smallfirststeps from "../../../Data/smallfirststeps.png";
import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
} from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import HRReports from "../HRReports";

const SalariesReport = () => {
  useEffect(() => {
    document.title = "Payslips Report";
  }, []);

  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId);
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  );

  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [filteredPayslips, setFilteredPayslips] = useState([]);
  const [isReportGenerated, setIsReportGenerated] = useState(false);
  const [fromMonth, setFromMonth] = useState("");
  const [toMonth, setToMonth] = useState("");
  const [error, setError] = useState("");

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
    data: payslips,
    isLoading: isPayslipsLoading,
    isSuccess: isPayslipsSuccess,
  } = useGetPayslipsByYearQuery(
    {
      selectedYear: selectedAcademicYear?.title,
      endpointName: "payslipsList",
    },
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  const generateMonthsList = (academicYear) => {
    const [startYear, endYear] = academicYear.split("/");
    const months = [
      "September", "October", "November", "December", // Months for the start year
      "January", "February", "March", "April", "May", "June", "July", "August", // Months for the end year
    ];
    return months.map((month, index) => {
      const year = index < 4 ? startYear : endYear; // Sep-Dec for start year, Jan-Aug for end year
      return `${month} ${year}`;
    });
  };

  const monthsList = selectedAcademicYear?.title
    ? generateMonthsList(selectedAcademicYear.title)
    : [];

  const getMonthIndex = (monthYear) => {
    const [month, year] = monthYear.split(" ");
    const allMonths = [
      "January", "February", "March", "April", "May", "June", "July", "August","September", "October", "November", "December",
     
    ];
    return allMonths.indexOf(month) + parseInt(year) * 12;
  };

  useEffect(() => {
    if (isPayslipsSuccess && selectedEmployee && fromMonth && toMonth) {
      const fromIndex = getMonthIndex(fromMonth);
      const toIndex = getMonthIndex(toMonth);

      if (fromIndex > toIndex) {
        setError("check month order");
        return;
      }

      const payslipsList = Object.values(payslips.entities);

      const filtered = payslipsList.filter((payslip) => {
        const payslipIndex = getMonthIndex(`${payslip.payslipMonth} ${payslip.payslipYear}`);
        return (
          payslip?.payslipEmployee?._id === selectedEmployee &&
          payslipIndex >= fromIndex &&
          payslipIndex <= toIndex
        );
      });

      setFilteredPayslips(filtered);
      setIsReportGenerated(true);
      setError("");
    }
  }, [payslips, selectedEmployee, fromMonth, toMonth]);

  const handleDownloadPDF = () => {
    const element = document.getElementById("payslips-report-content");
    const opt = {
      margin: 1,
      filename: `payslips_report_${selectedEmployee}.pdf`,
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().from(element).set(opt).save();
  };

  const handleCancelFilters = () => {
    setSelectedEmployee("");
    setFromMonth("");
    setToMonth("");
    setFilteredPayslips([]);
    setIsReportGenerated(false);
    setError("");
  };

  const employeesList = isEmployeesSuccess
    ? Object.values(employees.entities)
    : [];

  // Aggregate data for the selected employee
  const totalSalary = filteredPayslips.reduce(
    (sum, payslip) => sum + parseFloat(payslip.payslipTotalAmount || 0),
    0
  );
  const totalBasic = filteredPayslips.reduce(
    (sum, payslip) =>
      sum + parseFloat(payslip.payslipSalaryComponents?.payableBasic || 0),
    0
  );
  const totalAllowances = filteredPayslips.reduce((sum, payslip) => {
    const allowances = payslip.payslipSalaryComponents?.allowances || [];
    return (
      sum +
      allowances.reduce(
        (innerSum, allowance) =>
          innerSum + parseFloat(allowance.allowanceTotalValue || 0),
        0
      )
    );
  }, 0);
  const totalDeduction = filteredPayslips.reduce(
    (sum, payslip) =>
      sum +
      parseFloat(
        payslip.payslipSalaryComponents?.deduction?.deductionAmount || 0
      ),
    0
  );

  // Get the employee name
  const employeeName = employeesList.find(
    (emp) => emp.id === selectedEmployee
  )?.userFullName;

  return (
    <>
      <HRReports />
      <div className="form-container">
        <h2 className="formTitle print-container">Salaries Report</h2>
        {isPayslipsLoading && <LoadingStateIcon />}
        {error && <p className="text-red-500 text-center">{error}</p>}

        {/* Filters Section */}
        <div className="formSectionContainer no-print">
          <div className="grid grid-cols-3 gap-4">
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
                    {`${employee.userFullName?.userFirstName} ${
                      employee.userFullName?.userMiddleName || ""
                    } ${employee.userFullName?.userLastName}`}
                  </option>
                ))}
              </select>
            </label>

            <label htmlFor="fromMonth" className="formInputLabel">
              From :
              <select
                id="fromMonth"
                value={fromMonth}
                onChange={(e) => setFromMonth(e.target.value)}
                className="formInputText"
              >
                <option value="">Select Month</option>
                {monthsList.map((monthYear, index) => (
                  <option key={index} value={monthYear}>
                    {monthYear}
                  </option>
                ))}
              </select>
            </label>

            <label htmlFor="toMonth" className="formInputLabel">
              To :
              <select
                id="toMonth"
                value={toMonth}
                onChange={(e) => setToMonth(e.target.value)}
                className="formInputText"
              >
                <option value="">Select Month</option>
                {monthsList.map((monthYear, index) => (
                  <option key={index} value={monthYear}>
                    {monthYear}
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
            id="payslips-report-content"
            className="border p-4 rounded-lg mt-4 print-container"
          >
            <div className="flex justify-between mb-4">
              <img src={smallfirststeps} alt="Logo" className="h-12 w-auto" />
              <p className="text-sm text-gray-500">
                Report Date: {new Date().toLocaleDateString()}
              </p>
            </div>
            <h3 className="text-lg font-bold mb-2 text-center print-container">
              Payslips Report for {employeeName?.userFirstName || ""}{" "}
              {employeeName?.userMiddleName || ""}{" "}
              {employeeName?.userLastName || ""}
              <br />
              Academic Year: {selectedAcademicYear?.title}
            </h3>

            <table className="w-full border-collapse border mt-4 text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-2 py-1">#</th>
                  <th className="border px-2 py-1">Month</th>
                  <th className="border px-2 py-1">Payable Basic</th>
                  <th className="border px-2 py-1">Allowances</th>
                  <th className="border px-2 py-1">Deductions</th>
                  <th className="border px-2 py-1">Net Salary</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayslips.map((payslip, index) => (
                  <tr key={payslip._id}>
                    <td className="border px-2 py-1 text-center">
                      {index + 1}
                    </td>
                    <td className="border px-2 py-1 text-center">
                      {payslip.payslipMonth || "N/A"}
                    </td>
                    <td className="border px-2 py-1 text-center">
                      {payslip.payslipSalaryComponents?.payableBasic || "0.00"}
                    </td>
                    <td className="border px-2 py-1 text-center">
                      {payslip.payslipSalaryComponents?.allowances
                        ?.reduce(
                          (sum, allowance) =>
                            sum +
                            parseFloat(allowance.allowanceTotalValue || 0),
                          0
                        )
                        .toFixed(2)}
                    </td>
                    <td className="border px-2 py-1 text-center">
                      {payslip.payslipSalaryComponents?.deduction
                        ?.deductionAmount || "0.00"}
                    </td>
                    <td className="border px-2 py-1 text-center">
                      {payslip.payslipTotalAmount || "0.00"}
                    </td>
                  </tr>
                ))}
                {/* Totals Row */}
                <tr className="bg-gray-100 font-bold">
                  <td className="border px-2 py-1 text-right" colSpan="2">
                    Total:
                  </td>
                  <td className="border px-2 py-1 text-center">
                    {totalBasic.toFixed(2)}
                  </td>
                  <td className="border px-2 py-1 text-center">
                    {totalAllowances.toFixed(2)}
                  </td>
                  <td className="border px-2 py-1 text-center">
                    {totalDeduction.toFixed(2)}
                  </td>
                  <td className="border px-2 py-1 text-center">
                    {totalSalary.toFixed(2)}
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

export default SalariesReport;
