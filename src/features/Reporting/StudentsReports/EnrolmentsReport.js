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
  }, []);

  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId);
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  );
  const academicYears = useSelector(selectAllAcademicYears);

  // Filters
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedServiceType, setSelectedServiceType] = useState("");

  // Data for display
  const [filteredEnrolments, setFilteredEnrolments] = useState([]);
  const [isReportGenerated, setIsReportGenerated] = useState(false);

  // Query
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

  // Generate / Filter
  const handleGenerateReport = () => {
    setFilteredEnrolments([]);
    setIsReportGenerated(false);

    if (isEnrolmentsSuccess) {
      const enrolmentsList = Object.values(enrolments.entities);

      const filtered = enrolmentsList.filter((enrolment) => {
        const matchesMonth = selectedMonth
          ? enrolment.enrolmentMonth === selectedMonth
          : true;

        const matchesServiceType = selectedServiceType
          ? enrolment.serviceType === selectedServiceType
          : true;

        // Also ensure the student was enrolled in the current academic year
        const inSelectedYear = enrolment.student.studentYears.some(
          (yearObj) => yearObj.academicYear === selectedAcademicYear?.title
        );

        return matchesMonth && matchesServiceType && inSelectedYear;
      });

      setFilteredEnrolments(filtered);
      setIsReportGenerated(true);
    }
  };

  // PDF
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

  // Reset
  const handleCancelFilters = () => {
    setSelectedMonth("");
    setSelectedServiceType("");
    setFilteredEnrolments([]);
    setIsReportGenerated(false);
  };

  // Dynamic service types
  const serviceTypes =
    isEnrolmentsSuccess &&
    [...new Set(Object.values(enrolments.entities).map((e) => e.serviceType))];

  // Group enrolments by service type for display
  const groupedEnrolments = filteredEnrolments.reduce((acc, enrolment) => {
    acc[enrolment.serviceType] = acc[enrolment.serviceType] || [];
    acc[enrolment.serviceType].push(enrolment);
    return acc;
  }, {});

  // Calculate total of all authorized fees
  const totalAuthorizedFee = filteredEnrolments.reduce((sum, enrolment) => {
    return sum + (Number(enrolment.serviceAuthorisedFee) || 0);
  }, 0);

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
                  setSelectedServiceType(e.target.value);
                  setFilteredEnrolments([]);
                  setIsReportGenerated(false);
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
                  <th className="border px-2 py-1">
                    Fees (Authorized / Final)
                  </th>
                  <th className="border px-2 py-1">Enrolment Note</th>
                  <th className="border px-2 py-1">Enrolment Date</th>
                </tr>
              </thead>
              <tbody>
                {
                  // We need to accumulate rows across all groups but also keep a global row index
                  Object.entries(groupedEnrolments).reduce(
                    (acc, [serviceType, enrolments], groupIndex) => {
                      const { globalRowIndex, rows } = acc;

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

                              {/* Fees (Authorized / Final) */}
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
                        globalRowIndex: globalRowIndex + enrolments.length,
                        rows: [...rows, ...serviceRows],
                      };
                    },
                    { globalRowIndex: 0, rows: [] }
                  ).rows
                }

                {/* --- Final Row: Total Authorized Fee --- */}
                <tr className="bg-gray-100 font-bold">
                  {/* We have 8 columns total. 
                      We'll span from col 1 to 5, 
                      place the total in col 6, 
                      then fill remaining 2 columns. */}
                  <td colSpan="5" className="border px-2 py-1 text-right">
                    Total Authorized Fee:
                  </td>
                  <td className="border px-2 py-1 text-center">
                    {totalAuthorizedFee.toFixed(2)} {CurrencySymbol}
                  </td>
                  <td colSpan="2" className="border px-2 py-1" />
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Bottom Buttons */}
      <div className="mt-4 flex justify-center space-x-4">
        <button onClick={handleCancelFilters} className="cancel-button">
          Cancel
        </button>
        <button onClick={handleDownloadPDF} className="add-button">
          Download as PDF
        </button>
        <button onClick={() => window.print()} className="save-button">
          Print
        </button>
      </div>
    </>
  );
};

export default EnrolmentsReport;
