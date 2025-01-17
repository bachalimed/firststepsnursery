import React, { useState, useEffect } from "react";
import html2pdf from "html2pdf.js";
import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
  selectAllAcademicYears,
} from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import StudentsReports from "../StudentsReports";
import { useGetStudentsByYearQuery } from "../../Students/StudentsAndParents/Students/studentsApiSlice";
import LoadingStateIcon from "../../../Components/LoadingStateIcon";
import { useSelector } from "react-redux";
import smallfirststeps from "../../../Data/smallfirststeps.png";
const AgeGroupsReport = () => {
  useEffect(() => {
    document.title = "New Employee";
  });
  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId);
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  );
  const academicYears = useSelector(selectAllAcademicYears);

  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [isReportGenerated, setIsReportGenerated] = useState(false);

  const {
    data: students,
    isLoading: isStudentsLoading,
    isSuccess: isStudentsSuccess,
  } = useGetStudentsByYearQuery(
    {
      selectedYear: selectedAcademicYear?.title,
      endpointName: "AgeGroupsReport",
    } || {},
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleGenerateReport = () => {
    if (!minAge || !maxAge) return;

    const studentsList = isStudentsSuccess
      ? Object.values(students.entities)
      : [];



      const filtered = studentsList.filter((student) => {
        const isActiveStudent = student.studentIsActive === true; 
        if (!isActiveStudent) return false; // Exclude inactive students
        const age = calculateAge(student.studentDob); 
        return age >= minAge && age <= maxAge; 
      });
      

    setFilteredStudents(filtered);
    setIsReportGenerated(true);
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById("age-report-content");
    const opt = {
      margin: 1,
      filename: `age_report_${minAge}_to_${maxAge}.pdf`,
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().from(element).set(opt).save();
  };
  const handleCancelFilters = () => {
    setMinAge("");
    setMaxAge("");
    setFilteredStudents([]);
    setIsReportGenerated(false);
  };

  return (
    <>
      <StudentsReports />
      <div className="form-container">
        <h2 className="formTitle">Age Group List</h2>
        {isStudentsLoading && <LoadingStateIcon />}

        <div className="formSectionContainer ">
          <div className="formLineDiv">
            <label htmlFor="minAge" className="formInputLabel">
              Min Age:
              <input
                type="number"
                id="minAge"
                value={minAge}
                onChange={(e) => setMinAge(e.target.value)}
                className="formInputText"
              />
            </label>

            <label htmlFor="maxAge" className="formInputLabel">
              Max Age:
              <input
                type="number"
                id="maxAge"
                value={maxAge}
                onChange={(e) => setMaxAge(e.target.value)}
                className="formInputText"
              />{" "}
            </label>
          </div>
          <div className="cancelSavebuttonsDiv">
            <button
              type="button"
              className="cancel-button"
              onClick={handleCancelFilters}
              aria-label="cancel editing"
            >
              Cancel
            </button>{" "}
            <button onClick={handleGenerateReport} className="add-button">
              Generate Report
            </button>
          </div>
        </div>

        {isReportGenerated && (
          <>
            <div
              id="age-report-content"
              className="border border-gray-300 p-4 rounded-lg"
            >
              {" "}
              <div className="flex justify-between  mb-4">
                {/* Logo on the left */}
                <img
                  src={smallfirststeps}
                  alt="Nursery Logo"
                  className="h-12 w-auto"
                />
                {/* Report Date on the right */}
                <p className="text-sm text-gray-500">
                  Report Date: {new Date().toLocaleDateString()}
                </p>
              </div>
              <h3 className="text-lg font-bold mb-2 text-center">
                Age Group List: From {minAge} To {maxAge} years old
              </h3>
              <p className="text-sm text-gray-500 text-center">
                Report Date: {new Date().toLocaleDateString()}
              </p>
              <table className="w-full border-collapse border border-gray-300 mt-4 text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-1 py-1 w-1/12">
                      #
                    </th>
                    <th className="border border-gray-300 px-1 py-1 w-4/12">
                      Student Name
                    </th>
                    <th className="border border-gray-300 px-1 py-1 w-2/12">
                      Age
                    </th>
                    <th className="border border-gray-300 px-1 py-1 w-5/12">
                      School Name
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student, index) => {
                    const schoolName =
                      student.studentEducation?.[0]?.attendedSchool
                        ?.schoolName || "N/A";

                    return (
                      <tr key={student.id}>
                        <td className="border border-gray-300 px-1 py-1 text-center">
                          {index + 1}
                        </td>
                        <td className="border border-gray-300 px-1 py-1">
                          {`${student.studentName.firstName} ${student.studentName.lastName}`}
                        </td>
                        <td className="border border-gray-300 px-1 py-1 text-center">
                          {calculateAge(student.studentDob)}
                        </td>
                        <td className="border border-gray-300 px-1 py-1">
                          {schoolName}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
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
        )}
      </div>
    </>
  );
};

export default AgeGroupsReport;
