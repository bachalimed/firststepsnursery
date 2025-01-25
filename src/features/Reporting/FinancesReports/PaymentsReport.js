import React, { useState, useEffect } from "react";
import html2pdf from "html2pdf.js";
import { useGetPaymentsByYearQuery } from "../../Finances/Payments/paymentsApiSlice";
import LoadingStateIcon from "../../../Components/LoadingStateIcon";
import { useSelector } from "react-redux";
import smallfirststeps from "../../../Data/smallfirststeps.png";
import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
} from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import { MONTHS } from "../../../config/Months";
import { CurrencySymbol } from "../../../config/Currency";
import { useGetServicesByYearQuery } from "../../AppSettings/StudentsSet/NurseryServices/servicesApiSlice";
import FinancesReports from "../FinancesReports";

const PaymentsReport = () => {
  useEffect(() => {
    document.title = "Payments Report";
  }, []);

  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId);
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  );

  // State for filters
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedServiceType, setSelectedServiceType] = useState("");

  // State for our final data
  const [filteredPayments, setFilteredPayments] = useState([]); // Entire payment objects
  const [filteredInvoices, setFilteredInvoices] = useState([]); // Individual invoice lines
  const [isReportGenerated, setIsReportGenerated] = useState(false);

  // Derive the default from/to dates based on the selected academic year
  useEffect(() => {
    if (selectedAcademicYear?.title) {
      const [startYear, endYear] = selectedAcademicYear.title
        .split("/")
        .map((year) => parseInt(year, 10));
      // Example defaults: 1st Sept of the startYear, 31st Aug of the endYear
      setFromDate(`${startYear}-09-01`);
      setToDate(`${endYear}-08-31`);
    }
  }, [selectedAcademicYear]);

  // Fetch all payments & services for this academic year
  const {
    data: payments,
    isLoading: isPaymentsLoading,
    isSuccess: isPaymentsSuccess,
  } = useGetPaymentsByYearQuery(
    {
      selectedYear: selectedAcademicYear?.title,
      endpointName: "PaymentsReport",
    },
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  const {
    data: services,
    isLoading: isServicesLoading,
    isSuccess: isServicesSuccess,
  } = useGetServicesByYearQuery(
    {
      selectedYear: selectedAcademicYear?.title,
      endpointName: "PaymentsReport",
    },
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  const servicesList = isServicesSuccess
    ? Object.values(services.entities)
    : [];

  /**
   *  Main filter logic:
   *  1. Filter by date range (paymentDate between fromDate & toDate).
   *  2. If no service is selected => “old” approach:
   *     - Keep entire payments, but still filter by month if chosen.
   *  3. If a service is selected => “new” approach:
   *     - Flatten out matching invoice lines only.
   */
  useEffect(() => {
    if (!isPaymentsSuccess || !fromDate || !toDate) return;

    const paymentsList = Object.values(payments.entities);

    // STEP 1: Filter payments by date range
    const validPayments = paymentsList.filter((payment) => {
      const paymentDate = new Date(payment.paymentDate);
      return (
        paymentDate >= new Date(fromDate) && paymentDate <= new Date(toDate)
      );
    });

    if (!selectedServiceType) {
      // === NO SERVICE TYPE SELECTED: keep entire payments ===
      const filtered = validPayments.filter((payment) => {
        // if a month is chosen, ensure at least one invoiceMonth matches
        const matchesMonth =
          selectedMonth === "" ||
          payment.paymentInvoices?.some(
            (invoice) => invoice.invoiceMonth === selectedMonth
          );
        return matchesMonth;
      });

      setFilteredPayments(filtered);
      setFilteredInvoices([]); // Not used in this mode
    } else {
      // === SERVICE TYPE SELECTED: flatten out *only* matching invoice lines ===
      let invoiceLines = [];

      validPayments.forEach((payment) => {
        // We still respect the "month" filter on each invoice
        payment.paymentInvoices?.forEach((inv) => {
          const matchesMonth =
            selectedMonth === "" || inv.invoiceMonth === selectedMonth;
          const matchesService =
            inv?.invoiceEnrolment?.serviceType === selectedServiceType;

          if (matchesMonth && matchesService) {
            invoiceLines.push({
              // We can store any data needed for the table:
              invoiceId: inv._id,
              paymentId: payment._id,
              studentName: payment.paymentStudent?.studentName,
              invoiceAmount: inv.invoiceAmount,
              invoiceAuthorisedAmount: inv.invoiceAuthorisedAmount,
              invoiceMonth: inv.invoiceMonth,
              serviceType: inv.invoiceEnrolment?.serviceType,
              paymentDate: payment.paymentDate,
              paymentNote: payment.paymentNote,
            });
          }
        });
      });

      setFilteredInvoices(invoiceLines);
      setFilteredPayments([]); // Not used in this mode
    }

    setIsReportGenerated(true);
  }, [payments, isPaymentsSuccess, fromDate, toDate, selectedMonth, selectedServiceType]);

  // PDF download
  const handleDownloadPDF = () => {
    const element = document.getElementById("payments-report-content");
    const opt = {
      margin: 1,
      filename: `payments_report_${fromDate}_to_${toDate}.pdf`,
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().from(element).set(opt).save();
  };

  // Reset all filters
  const handleCancelFilters = () => {
    setFromDate("");
    setToDate("");
    setSelectedMonth("");
    setSelectedServiceType("");
    setFilteredPayments([]);
    setFilteredInvoices([]);
    setIsReportGenerated(false);
  };

  // For the dropdowns
  const months = MONTHS;
  // Distinct serviceTypes from the services endpoint
  // (or you could derive from the payments too if needed)
  const serviceTypes = servicesList.map((s) => s?.serviceType);

  /**
   * Calculate total:
   * - If NO service filter => sum of entire payment amounts
   * - If service filter => sum of invoiceAmount across displayed invoice lines
   */
  const totalAmount = selectedServiceType
    ? // Summation of invoiceAmount in filteredInvoices
      filteredInvoices.reduce(
        (sum, line) => sum + parseFloat(line.invoiceAmount || 0),
        0
      )
    : // Summation of paymentAmount in filteredPayments
      filteredPayments.reduce(
        (sum, payment) => sum + parseFloat(payment.paymentAmount || 0),
        0
      );

  return (
    <>
      <FinancesReports />
      <div className="form-container">
        <h2 className="formTitle">Payments Report</h2>
        {isPaymentsLoading && <LoadingStateIcon />}

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
                className="formInputText"
              />
            </label>

            <label htmlFor="paymentMonth" className="formInputLabel">
              Payment Month:
              <select
                id="paymentMonth"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="formInputText"
              >
                <option value="">All Months</option>
                {months.map((month, index) => (
                  <option key={index} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </label>

            <label htmlFor="paymentServiceType" className="formInputLabel">
              Service Type:
              <select
                id="paymentServiceType"
                value={selectedServiceType}
                onChange={(e) => setSelectedServiceType(e.target.value)}
                className="formInputText"
              >
                <option value="">All Services</option>
                {serviceTypes &&
                  [...new Set(serviceTypes)].map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
              </select>
            </label>
          </div>

          <div className="flex justify-center space-x-4 mt-4">
            <button
              type="button"
              className="cancel-button"
              onClick={handleCancelFilters}
            >
              Cancel
            </button>
            <button onClick={handleDownloadPDF} className="add-button">
              Download as PDF
            </button>
            <button onClick={() => window.print()} className="save-button">
              Print
            </button>
          </div>
        </div>

        {/* Report Content */}
        {isReportGenerated && (
          <div
            id="payments-report-content"
            className="border p-4 rounded-lg mt-4"
          >
            <div className="flex justify-between mb-4">
              <img src={smallfirststeps} alt="Logo" className="h-12 w-auto" />
              <p className="text-sm text-gray-500">
                Report Date: {new Date().toLocaleDateString()}
              </p>
            </div>
            <h3 className="text-lg font-bold mb-2 text-center">
              Payments Report: {fromDate} - {toDate}
              <br />
              {selectedMonth ? `Month: ${selectedMonth}` : "All Months"}
              {selectedServiceType
                ? `, Service: ${selectedServiceType}`
                : ", All Services"}
            </h3>

            {/** =========================
             **  IF NO SERVICE SELECTED
             ** ========================= */}
            {!selectedServiceType && (
              <table className="w-full border-collapse border mt-4 text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-2 py-1">#</th>
                    <th className="border px-2 py-1">Student</th>
                    <th className="border px-2 py-1">Service</th>
                    <th className="border px-2 py-1">Inv/Auth</th>
                    <th className="border px-2 py-1">Paid</th>
                    <th className="border px-2 py-1">Payment Date</th>
                    <th className="border px-2 py-1">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment, index) => (
                    <tr key={payment._id}>
                      <td className="border px-2 py-1 text-center">
                        {index + 1}
                      </td>
                      <td className="border px-2 py-1">
                        {payment.paymentStudent?.studentName?.firstName || "N/A"}{" "}
                        {payment.paymentStudent?.studentName?.middleName || ""}{" "}
                        {payment.paymentStudent?.studentName?.lastName || ""}
                      </td>
                      <td className="border px-2 py-1">
                        {payment.paymentInvoices?.map((invoice, idx) => (
                          <div key={idx}>
                            {invoice.invoiceEnrolment?.serviceType || ""}{" "}
                            {invoice.invoiceMonth?.slice(0, 3) || ""}
                          </div>
                        ))}
                      </td>
                      <td className="border px-2 py-1 text-center">
                        {payment?.paymentInvoices?.map((invoice, idx) => (
                          <div key={idx}>
                            {invoice?.invoiceAmount || ""}/
                            {invoice?.invoiceAuthorisedAmount || ""}
                          </div>
                        ))}
                      </td>
                      <td className="border px-2 py-1 text-center">
                        {payment.paymentAmount}
                      </td>
                      <td className="border px-2 py-1 text-center">
                        {new Date(payment.paymentDate).toLocaleDateString()}
                      </td>
                      <td className="border px-2 py-1">
                        {payment.paymentNote || ""}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-100 font-bold">
                    <td colSpan="4" className="border px-2 py-1 text-right">
                      Total:
                    </td>
                    <td className="border px-2 py-1 text-center">
                      {`${totalAmount.toFixed(2)} ${CurrencySymbol}`}
                    </td>
                    <td colSpan="2" className="border px-2 py-1"></td>
                  </tr>
                </tbody>
              </table>
            )}

            {/** =========================
             **  IF SERVICE IS SELECTED
             ** ========================= */}
            {selectedServiceType && (
              <table className="w-full border-collapse border mt-4 text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-2 py-1">#</th>
                    <th className="border px-2 py-1">Student</th>
                    <th className="border px-2 py-1">Service</th>
                    <th className="border px-2 py-1">Month</th>
                    <th className="border px-2 py-1">Invoiced</th>
                    <th className="border px-2 py-1">Payment Date</th>
                    <th className="border px-2 py-1">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((item, index) => (
                    <tr key={item.invoiceId}>
                      <td className="border px-2 py-1 text-center">
                        {index + 1}
                      </td>
                      <td className="border px-2 py-1">
                        {item.studentName?.firstName || "N/A"}{" "}
                        {item.studentName?.middleName || ""}{" "}
                        {item.studentName?.lastName || ""}
                      </td>
                      <td className="border px-2 py-1">{item.serviceType}</td>
                      <td className="border px-2 py-1 text-center">
                        {item.invoiceMonth?.slice(0, 3) || ""}
                      </td>
                      <td className="border px-2 py-1 text-center">
                        {item.invoiceAmount}
                      </td>
                      <td className="border px-2 py-1 text-center">
                        {new Date(item.paymentDate).toLocaleDateString()}
                      </td>
                      <td className="border px-2 py-1">
                        {item.paymentNote || ""}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-100 font-bold">
                    <td colSpan="4" className="border px-2 py-1 text-right">
                      Total:
                    </td>
                    <td className="border px-2 py-1 text-center">
                      {`${totalAmount.toFixed(2)} ${CurrencySymbol}`}
                    </td>
                    <td colSpan="2" className="border px-2 py-1"></td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default PaymentsReport;
