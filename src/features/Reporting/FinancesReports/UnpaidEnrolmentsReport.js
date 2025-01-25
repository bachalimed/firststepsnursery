import React, { useState, useEffect } from "react";
import html2pdf from "html2pdf.js";
import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
} from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import LoadingStateIcon from "../../../Components/LoadingStateIcon";
import FinancesReports from "../FinancesReports";
import { useSelector } from "react-redux";
import { useGetEnrolmentsByYearQuery } from "../../Students/Enrolments/enrolmentsApiSlice";
import smallfirststeps from "../../../Data/smallfirststeps.png";
import { MONTHS } from "../../../config/Months";

const UnpaidEnrolmentsReport = () => {
  useEffect(() => {
    document.title = "Unpaid Enrolments Report";
  }, []);

  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId);
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  );

  const [selectedMonth, setSelectedMonth] = useState("");
  const [filteredEnrolments, setFilteredEnrolments] = useState([]);
  const [isReportGenerated, setIsReportGenerated] = useState(false);

  const getCurrentMonth = () => {
    const currentMonthIndex = new Date().getMonth();
    return MONTHS[currentMonthIndex];
  };

  const {
    data: enrolments,
    isLoading: isEnrolmentsLoading,
    isSuccess: isEnrolmentsSuccess,
  } = useGetEnrolmentsByYearQuery(
    {
      selectedMonth: selectedMonth || getCurrentMonth(),
      selectedYear: selectedAcademicYear?.title,
      endpointName: "EnrolmentsList",
    },
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  useEffect(() => {
    if (isEnrolmentsSuccess && selectedMonth) {
      const enrolmentsList = Object.values(enrolments.entities);
  
      const filtered = enrolmentsList
        .filter((enrol) => {
          const isUnpaid = !enrol?.enrolmentInvoice?.invoiceIsFullyPaid;
          return isUnpaid && enrol.enrolmentMonth === selectedMonth;
        })
        .sort((a, b) => {
          const nameA = `${a?.student?.studentName?.firstName || ""} ${a?.student?.studentName?.middleName || ""} ${a?.student?.studentName?.lastName || ""}`.trim().toLowerCase();
          const nameB = `${b?.student?.studentName?.firstName || ""} ${b?.student?.studentName?.middleName || ""} ${b?.student?.studentName?.lastName || ""}`.trim().toLowerCase();
          return nameA.localeCompare(nameB); // Compare names alphabetically
        });
  
      setFilteredEnrolments(filtered);
      setIsReportGenerated(true);
    }
  }, [enrolments, selectedMonth]);
  

  const handleDownloadPDF = () => {
    const element = document.getElementById("unpaid-enrolments-report-content");
    const opt = {
      margin: 1,
      filename: `unpaid_enrolments_report_${selectedMonth}.pdf`,
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().from(element).set(opt).save();
  };

  const handleCancelFilters = () => {
    setSelectedMonth("");
    setFilteredEnrolments([]);
    setIsReportGenerated(false);
  };

  return (
    <>
      <FinancesReports />
      <div className="form-container">
        <h2 className="formTitle">Due enrolments Payment Report</h2>
        {isEnrolmentsLoading && <LoadingStateIcon />}

        <div className="formSectionContainer">
          <div className="formLineDiv">
            <label htmlFor="enrolmentMonth" className="formInputLabel">
              Enrolment Month:
              <select
                id="enrolmentMonth"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="formInputText"
              >
                <option value="">Select Month</option>
                {MONTHS.map((month, index) => (
                  <option key={index} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              className="cancel-button"
              onClick={handleCancelFilters}
            >
              Cancel
            </button>
          </div>
        </div>

        {isReportGenerated && (
          <div
            id="unpaid-enrolments-report-content"
            className="border p-4 rounded-lg"
          >
            <div className="flex justify-between mb-4">
              <img src={smallfirststeps} alt="Logo" className="h-12 w-auto" />
              <p className="text-sm text-gray-500">
                Report Date: {new Date().toLocaleDateString()}
              </p>
            </div>

            <h3 className="text-lg font-bold mb-2 text-center">
              Due Enrolments Payment Report for {selectedMonth}
              <br />
              Academic Year: {selectedAcademicYear?.title}
            </h3>

            <table className="w-full border-collapse border mt-4 text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-2 py-1">#</th>
                  <th className="border px-2 py-1">Student Name</th>
                  <th className="border px-2 py-1">Services</th>
                  <th className="border px-2 py-1">Final/Auth</th>
                  <th className="border px-2 py-1">Paid Amount</th>
                  <th className="border px-2 py-1">Paid Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredEnrolments.map((enrolment, index) => (
                  <tr key={enrolment._id}>
                    <td
                      className="border px-2 py-1 text-center"
                      style={{
                        whiteSpace: "normal",
                        wordWrap: "break-word",
                        overflowWrap: "break-word",
                        width: "50px",
                      }}
                    >
                      {index + 1}
                    </td>
                    <td
                      className="border px-2 py-1"
                      style={{
                        whiteSpace: "normal",
                        wordWrap: "break-word",
                        overflowWrap: "break-word",
                        width: "160px",
                      }}
                    >
                      {`${enrolment.student?.studentName?.firstName || ""} ${
                        enrolment.student?.studentName?.middleName || ""
                      } ${enrolment.student?.studentName?.lastName || ""}`}
                    </td>
                    <td
                      className="border px-2 py-1"
                      style={{
                        whiteSpace: "normal",
                        wordWrap: "break-word",
                        overflowWrap: "break-word",
                        width: "150px",
                      }}
                    >
                      <div>
                        <div>
                          {enrolment?.service?.serviceType} -{" "}
                          {enrolment?.enrolmentInvoice?.invoiceMonth.slice(
                            0,
                            4
                          )}
                        </div>
                        <div>
                          From:{" "}
                          {enrolment?.admission?.admissionDate
                            ? new Date(
                                enrolment.admission.admissionDate
                              ).toLocaleDateString()
                            : "N/A"}
                        </div>
                      </div>
                    </td>
                    <td
                      className="border px-2 py-1"
                      style={{
                        whiteSpace: "normal",
                        wordWrap: "break-word",
                        overflowWrap: "break-word",
                        width: "100px",
                      }}
                    >
                      {`${
                        enrolment.enrolmentInvoice?.invoiceAmount || "N/A"
                      } / ${
                        enrolment.enrolmentInvoice?.invoiceAuthorisedAmount ||
                        "N/A"
                      }`}
                    </td>
                    <td
                      className="border px-2 py-1"
                      style={{
                        whiteSpace: "normal",
                        wordWrap: "break-word",
                        overflowWrap: "break-word",
                        width: "160px",
                      }}
                    >
                      {""}
                    </td>
                    <td
                      className="border px-2 py-1"
                      style={{
                        whiteSpace: "normal",
                        wordWrap: "break-word",
                        overflowWrap: "break-word",
                        width: "160px",
                      }}
                    >
                      {""}
                    </td>
                  </tr>
                ))}
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

export default UnpaidEnrolmentsReport;
