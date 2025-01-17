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

  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedServiceType, setSelectedServiceType] = useState("");
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [isReportGenerated, setIsReportGenerated] = useState(false);

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

  useEffect(() => {
    if (isPaymentsSuccess && fromDate && toDate) {
      const paymentsList = Object.values(payments.entities);

      const filtered = paymentsList.filter((payment) => {
        const paymentDate = new Date(payment.paymentDate);
        const matchesDateRange =
          paymentDate >= new Date(fromDate) && paymentDate <= new Date(toDate);
          const matchesMonth =
          selectedMonth === "" ||
          payment.paymentInvoices?.some((invoice) => invoice.invoiceMonth === selectedMonth);
        
        const matchesServiceType =
          selectedServiceType === "" ||
          payment?.paymentInvoices?.some((invoice) => invoice?.invoiceEnrolment?.serviceType === selectedServiceType)

        return matchesDateRange && matchesMonth && matchesServiceType;
      });

      // Sorting the filtered payments by student name
      const sorted = filtered.sort((a, b) => {
        const nameA = `${a.paymentStudent?.studentName?.firstName || ""} ${
          a.paymentStudent?.studentName?.middleName || ""
        } ${a.paymentStudent?.studentName?.lastName || ""}`.toLowerCase();
        const nameB = `${b.paymentStudent?.studentName?.firstName || ""} ${
          b.paymentStudent?.studentName?.middleName || ""
        } ${b.paymentStudent?.studentName?.lastName || ""}`.toLowerCase();

        return nameA.localeCompare(nameB);
      });

      setFilteredPayments(sorted); // Set the sorted array
      setIsReportGenerated(true);
    }
  }, [payments, fromDate, toDate, selectedMonth, selectedServiceType]);

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

  const handleCancelFilters = () => {
    setFromDate("");
    setToDate("");
    setSelectedMonth("");
    setSelectedServiceType("");
    setFilteredPayments([]);
    setIsReportGenerated(false);
  };

  // Extract months and service types dynamically for the dropdowns
  const months = MONTHS;
  const serviceTypes = isPaymentsSuccess && [
    ...new Set(
      Object.values(payments.entities).map(
        (payment) => payment.paymentService?.serviceType
      )
    ),
  ];

  // Calculate the total payment amount
  const totalAmount = filteredPayments.reduce(
    (sum, payment) => sum + parseFloat(payment.paymentAmount || 0),
    0
  );

  return (
    <>
      {" "}
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
                {servicesList &&
                  servicesList.map((service, index) => (
                    <option key={index} value={service?.serviceType}>
                      {service?.serviceType}
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

            <table className="w-full border-collapse border mt-4 text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-2 py-1">#</th>
                  <th className="border px-2 py-1">Student</th>
                  <th className="border px-2 py-1">Service</th>
                  <th className="border px-2 py-1">Inv/ Auth</th>
                  <th className="border px-2 py-1">{`Paid `}</th>
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
                      <div>
                        {payment.paymentInvoices?.map((invoice, index) => (
                          <div key={index}>
                            {invoice.invoiceEnrolment?.serviceType || ""}{" "}
                            {invoice.invoiceMonth?.slice(0, 3) || ""}
                          </div>
                        ))}
                      </div>
                    </td>

                    <td className="border px-2 py-1 text-center">
                      <div>
                        {" "}
                        {payment?.paymentInvoices.map((invoice, index) => (
                          <div key={index}>
                            {invoice?.invoiceAmount || ""}/
                            {invoice?.invoiceAuthorisedAmount || ""}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="border px-2 py-1 text-center">
                      {`${payment.paymentAmount} `}
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
          </div>
        )}
      </div>
    </>
  );
};

export default PaymentsReport;
