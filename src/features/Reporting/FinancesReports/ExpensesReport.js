import React, { useState, useEffect } from "react";
import html2pdf from "html2pdf.js";
import { useGetExpensesByYearQuery } from "../../Finances/Expenses/expensesApiSlice";
import LoadingStateIcon from "../../../Components/LoadingStateIcon";
import { useSelector } from "react-redux";
import FinancesReports from "../FinancesReports";
import smallfirststeps from "../../../Data/smallfirststeps.png";
import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
  selectAllAcademicYears,
} from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import { CurrencySymbol } from "../../../config/Currency";

const ExpensesReport = () => {
  useEffect(() => {
    document.title = "Expenses Report";
  });

  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  const academicYears = useSelector(selectAllAcademicYears);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [isReportGenerated, setIsReportGenerated] = useState(false);

  const {
    data: expenses,
    isLoading: isExpensesLoading,
    isSuccess: isExpensesSuccess,
  } = useGetExpensesByYearQuery(
    {
      selectedYear: selectedAcademicYear?.title,
      endpointName: "ExpensesReport",
    },
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  useEffect(() => {
    if (isExpensesSuccess && fromDate && toDate) {
      const expensesList = Object.values(expenses.entities);

      const filtered = expensesList.filter((expense) => {
        const paymentDate = new Date(
          expense.expensePaymentDate || expense.expenseDate
        );
        const matchesDateRange =
          paymentDate >= new Date(fromDate) && paymentDate <= new Date(toDate);
        const matchesCategory = selectedCategory
          ? expense.expenseCategory?.expenseCategoryLabel === selectedCategory
          : true;
        const matchesService = selectedService
          ? expense.expenseService?.serviceType === selectedService
          : true;

        return matchesDateRange && matchesCategory && matchesService;
      });

      setFilteredExpenses(filtered);
      setIsReportGenerated(true);
    }
  }, [expenses, fromDate, toDate, selectedCategory, selectedService]);

  const handleDownloadPDF = () => {
    const element = document.getElementById("expenses-report-content");
    const opt = {
      margin: 1,
      filename: `expenses_report_${fromDate}_to_${toDate}.pdf`,
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().from(element).set(opt).save();
  };

  const handleCancelFilters = () => {
    setFromDate("");
    setToDate("");
    setSelectedCategory("");
    setSelectedService("");
    setFilteredExpenses([]);
    setIsReportGenerated(false);
  };

  // Extract categories and services dynamically for the dropdowns
  const categories = isExpensesSuccess && [
    ...new Set(
      Object.values(expenses.entities).map(
        (e) => e.expenseCategory?.expenseCategoryLabel
      )
    ),
  ];
  const services = isExpensesSuccess && [
    ...new Set(
      Object.values(expenses.entities).map((e) => e.expenseService?.serviceType)
    ),
  ];

  // Calculate the total expense amount
  const totalAmount = filteredExpenses.reduce(
    (sum, expense) => sum + parseFloat(expense.expenseAmount || 0),
    0
  );

  return (
    <>
      <FinancesReports />
      <div className="form-container">
        <h2 className="formTitle">Expenses Report</h2>
        {isExpensesLoading && <LoadingStateIcon />}

        {/* Filters Section */}
        <div className="formSectionContainer">
          <div className="formLineDiv">
            <label htmlFor="fromDate" className="formInputLabel">
              From Date:
              <input
                type="date"
                id="fromDate"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="formInputText"
              />
            </label>

            <label htmlFor="toDate" className="formInputLabel">
              To Date:
              <input
                type="date"
                id="toDate"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                min={fromDate} // Prevent selecting dates earlier than fromDate
                className="formInputText"
              />
            </label>

            <label htmlFor="expenseCategory" className="formInputLabel">
              Expense Category:
              <select
                id="expenseCategory"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="formInputText"
              >
                <option value="">All Categories</option>
                {categories &&
                  categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
              </select>
            </label>

            <label htmlFor="expenseService" className="formInputLabel">
              Expense Service:
              <select
                id="expenseService"
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="formInputText"
              >
                <option value="">All Services</option>
                {services &&
                  services.map((service, index) => (
                    <option key={index} value={service}>
                      {service}
                    </option>
                  ))}
              </select>
            </label>
          </div>

          <div className="flex justify-center ">
            <button
              type="button"
              className="cancel-button"
              onClick={handleCancelFilters}
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Report Content */}
        {isReportGenerated && (
          <div id="expenses-report-content" className="border p-4 rounded-lg">
            <div className="flex justify-between mb-4">
              <img src={smallfirststeps} alt="Logo" className="h-12 w-auto" />
              <p className="text-sm text-gray-500">
                Report Date: {new Date().toLocaleDateString()}
              </p>
            </div>
            <h3 className="text-lg font-bold mb-2 text-center">
              Expenses Report: {fromDate} - {toDate}
              <br />
              {selectedCategory
                ? `Category: ${selectedCategory}`
                : "All Categories"}
              {selectedService
                ? `, Service: ${selectedService}`
                : ", All Services"}
            </h3>

            <table className="w-full border-collapse border mt-4 text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-2 py-1">#</th>
                  <th className="border px-2 py-1">Payee</th>
                  <th className="border px-2 py-1">Category</th>
                  <th className="border px-2 py-1">Service</th>
                  <th className="border px-2 py-1">Amount</th>
                  <th className="border px-2 py-1">Payment Date</th>
                  <th className="border px-2 py-1">Notes</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((expense, index) => (
                  <tr key={expense._id}>
                    <td className="border px-2 py-1 text-center">
                      {index + 1}
                    </td>
                    <td className="border px-2 py-1">
                      {expense.expensePayee?.payeeLabel || "N/A"}
                    </td>
                    <td className="border px-2 py-1">
                      {expense.expenseCategory?.expenseCategoryLabel || "N/A"}
                    </td>
                    <td className="border px-2 py-1">
                      {expense.expenseService?.serviceType || "N/A"}
                    </td>
                    <td className="border px-2 py-1">
                      {`${expense?.expenseAmount} ${CurrencySymbol}`}
                    </td>
                    <td className="border px-2 py-1 text-center">
                      {new Date(
                        expense?.expensePaymentDate || expense.expenseDate
                      ).toLocaleDateString()}
                    </td>
                    <td className="border px-2 py-1">
                      {expense.expenseNote || "N/A"}
                    </td>
                  </tr>
                ))}
                {/* Total Row */}
                <tr className="bg-gray-100 font-bold">
                  <td
                    colSpan="4"
                    className="border px-2 py-1 text-right text-gray-700"
                  >
                    Total:
                  </td>
                  <td className="border px-2 py-1 text-center">
                    {`${totalAmount.toFixed(2)} ${CurrencySymbol}`}
                  </td>
                  <td colSpan="2" className="border px-2 py-1"></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        <div className="formLineDiv">
          <button onClick={handleDownloadPDF} className="add-button">
            Download as PDF
          </button>
          <button onClick={() => window.print()} className="save-button">
            Print
          </button>
        </div>
      </div>
    </>
  );
};

export default ExpensesReport;
