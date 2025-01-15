import React, { useState, useEffect } from "react";
import html2pdf from "html2pdf.js";
import { useGetEnrolmentsByYearQuery } from "../../Students/Enrolments/enrolmentsApiSlice";
import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
  selectAllAcademicYears,
} from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import StudentsReports from "../StudentsReports";
import LoadingStateIcon from "../../../Components/LoadingStateIcon";
import { useSelector } from "react-redux";
import { MONTHS } from "../../../config/Months";
import smallfirststeps from "../../../Data/smallfirststeps.png";
import { CurrencySymbol } from "../../../config/Currency";
const EnrolmentsReport = () => {
  useEffect(() => {
    document.title = "Enrolments Report";
  });

  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Current academic year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Current academic year object
  const academicYears = useSelector(selectAllAcademicYears);

  const [selectedMonth, setSelectedMonth] = useState(""); // Selected month filter
  const [selectedServiceType, setSelectedServiceType] = useState(""); // Selected service type filter
  const [filteredEnrolments, setFilteredEnrolments] = useState([]);
  const [isReportGenerated, setIsReportGenerated] = useState(false);

  const {
    data: enrolments,
    isLoading: isEnrolmentsLoading,
    isSuccess: isEnrolmentsSuccess,
  } = useGetEnrolmentsByYearQuery(
    {
      selectedMonth,
      selectedYear: selectedAcademicYear?.title,
      endpointName: "EnrolmentsReport",
    },
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );
  const handleGenerateReport = () => {
    if (!selectedMonth && !selectedServiceType) return;

    if (isEnrolmentsSuccess) {
      const enrolmentsList = Object.values(enrolments.entities);

      // Reset filtered enrolments before applying filters
      const filtered = enrolmentsList.filter(
        (enrolment) =>
          (selectedMonth ? enrolment.enrolmentMonth === selectedMonth : true) &&
          (selectedServiceType
            ? enrolment.serviceType === selectedServiceType
            : true) &&
          enrolment.student.studentYears.some(
            (yearObj) => yearObj.academicYear === selectedAcademicYear?.title
          )
      );

      // Update the filtered enrolments and mark the report as generated
      setFilteredEnrolments(filtered);
      setIsReportGenerated(true);
    } else {
      // Clear the table if no results match
      setFilteredEnrolments([]);
      setIsReportGenerated(false);
    }
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById("enrolments-report-content");
    const opt = {
      margin: 1,
      filename: `enrolments_report_${selectedMonth}.pdf`,
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().from(element).set(opt).save();
  };

  const handleCancelFilters = () => {
    setSelectedMonth("");
    setSelectedServiceType("");
    setFilteredEnrolments([]);
    setIsReportGenerated(false);
  };

  // Extract service types dynamically for the dropdown
  const serviceTypes = isEnrolmentsSuccess && [
    ...new Set(Object.values(enrolments.entities).map((e) => e.serviceType)),
  ];

  // Group enrolments by service type for display
  const groupedEnrolments = filteredEnrolments.reduce((acc, enrolment) => {
    acc[enrolment.serviceType] = acc[enrolment.serviceType] || [];
    acc[enrolment.serviceType].push(enrolment);
    return acc;
  }, {});

  return (
    <>
      <StudentsReports />
      <div className="form-container">
        <h2 className="formTitle">Enrolments Report</h2>
        {isEnrolmentsLoading && <LoadingStateIcon />}

        {/* Filters Section */}
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

            <label htmlFor="serviceType" className="formInputLabel">
              Service Type:
              <select
                id="serviceType"
                value={selectedServiceType}
                onChange={(e) => {
                  setSelectedServiceType(e.target.value); // Update service type
                  setFilteredEnrolments([]); // Reset table data
                  setIsReportGenerated(false); // Ensure report is regenerated
                }}
                className="formInputText"
              >
                <option value="">All service types</option>
                {serviceTypes &&
                  serviceTypes.map((serviceType, index) => (
                    <option key={index} value={serviceType}>
                      {serviceType}
                    </option>
                  ))}
              </select>
            </label>
          </div>

          <div className="cancelSavebuttonsDiv">
            <button
              type="button"
              className="cancel-button"
              onClick={handleCancelFilters}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleGenerateReport}
              className="add-button"
            >
              Generate Report
            </button>
          </div>
        </div>

        {/* Report Content */}
        {isReportGenerated && (
          <div id="enrolments-report-content" className="border p-4 rounded-lg">
            <div className="flex justify-between mb-4">
              <img
                src={smallfirststeps}
                alt="Nursery Logo"
                className="h-12 w-auto"
              />
              <p className="text-sm text-gray-500">
                Report Date: {new Date().toLocaleDateString()}
              </p>
            </div>
            <h3 className="text-lg font-bold mb-2 text-center">
              Enrolments Report: {selectedMonth || "All Months"}{" "}
              {selectedServiceType
                ? `, Service: ${selectedServiceType}`
                : ", All Services"}
              <br />
              {selectedMonth
                ? MONTHS.slice(MONTHS.indexOf("September")).includes(
                    selectedMonth
                  )
                  ? selectedAcademicYear?.title.split("/")[0]
                  : selectedAcademicYear?.title.split("/")[1]
                : selectedAcademicYear?.title}
            </h3>

            <table className="w-full border-collapse border mt-4 text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-2 py-1">#</th>
                  <th className="border px-2 py-1">service #</th>
                  <th className="border px-2 py-1">Student Name</th>
                  <th className="border px-2 py-1">Grade</th>
                  <th className="border px-2 py-1">Admission Services</th>
                  <th className="border px-2 py-1">Fees (Authorized/Final)</th>
                  <th className="border px-2 py-1">Enrolment Note</th>
                  <th className="border px-2 py-1">Enrolment Date</th>
                </tr>
              </thead>
              <tbody>
                {
                  Object.entries(groupedEnrolments).reduce(
                    (acc, [serviceType, enrolments], groupIndex) => {
                      // Extract the current global index and table rows accumulator
                      const { globalRowIndex, rows } = acc;

                      // Map enrolments for the current service type
                      const serviceRows = enrolments.map(
                        (enrolment, enrolmentIndex) => {
                          const studentYears =
                            enrolment.student?.studentYears?.find(
                              (year) =>
                                year.academicYear ===
                                selectedAcademicYear?.title
                            );

                          return (
                            <tr key={`${serviceType}-${enrolment._id}`}>
                              {/* Global row number */}
                              <td className="border px-2 py-1 text-center">
                                {globalRowIndex + enrolmentIndex + 1}
                              </td>

                              {/* Group-specific row number */}
                              <td className="border px-2 py-1 text-center">
                                {enrolmentIndex + 1}
                              </td>

                              {/* Student Name */}
                              <td className="border px-2 py-1">
                                {`${enrolment.student?.studentName?.firstName} ${enrolment.student?.studentName?.lastName}`}
                              </td>

                              {/* Grade */}
                              <td className="border px-2 py-1 text-center">
                                {studentYears?.grade || "N/A"}
                              </td>

                              {/* Admission Services */}
                              <td className="border px-2 py-1">
                                {enrolment.admission?.agreedServices?.service
                                  ?.serviceType || "N/A"}
                              </td>

                              {/* Fees */}
                              <td className="border px-2 py-1 text-center">
                                {`${enrolment.serviceAuthorisedFee} / ${enrolment.serviceFinalFee}`}
                              </td>

                              {/* Enrolment Note */}
                              <td className="border px-2 py-1">
                                {enrolment.enrolmentNote || "N/A"}
                              </td>

                              {/* Enrolment Date */}
                              <td className="border px-2 py-1 text-center">
                                {new Date(
                                  enrolment.createdAt
                                ).toLocaleDateString()}
                              </td>
                            </tr>
                          );
                        }
                      );

                      return {
                        // Update the global index to continue counting
                        globalRowIndex: globalRowIndex + enrolments.length,
                        // Accumulate rows for the table
                        rows: [...rows, ...serviceRows],
                      };
                    },
                    { globalRowIndex: 0, rows: [] } // Initialize global index and rows accumulator
                  ).rows
                }
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="mt-4 flex justify-center space-x-4">
        {" "}
        {/* Cancel Button */}
        <button
          onClick={handleCancelFilters} // Reset filters and table
          className="cancel-button"
        >
          Cancel
        </button>
        {/* Download as PDF Button */}
        <button
          onClick={handleDownloadPDF} // Function for PDF download
          className="add-button"
        >
          Download as PDF
        </button>
        {/* Print Button */}
        <button
          onClick={() => window.print()} // Print the current view
          className="save-button"
        >
          Print
        </button>
      </div>
    </>
  );
};

export default EnrolmentsReport;
