import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { useGetStudentByIdQuery } from "./studentsApiSlice";
import { selectStudentById } from "./studentsSlice";
import LoadingStateIcon from '../../../../Components/LoadingStateIcon'
import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
  selectAllAcademicYears,
} from "../../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import { useGetStudentDocumentsByYearByIdQuery } from "../../../AppSettings/StudentsSet/StudentDocumentsLists/studentDocumentsListsApiSlice";
import Students from "../../Students";
import useFetchPhoto from "../../../../hooks/useFetchPhoto";
import useAuth from "../../../../hooks/useAuth";
const StudentDetails = () => {

  const {canEdit}=useAuth()
  const { id } = useParams();
  const navigate = useNavigate();
  const [photoId, setPhotoId] = useState(null);
  const [student, setStudent] = useState(null);

  const studentFromSelector = useSelector((state) =>
    selectStudentById(state, id)
  );
  const {
    data: studentOrg,
    isLoading: studentOrgIsLoading,
    isSuccess: studentOrgIsSuccess,
    isError: studentOrgIsError,
  } = useGetStudentByIdQuery(
    { id: id, endpointName: "StudentDetails" },
    {
      pollingInterval: 60000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );
  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  const academicYears = useSelector(selectAllAcademicYears);

//   const [studentDocumentYear, setStudentDocumentYear] = useState(
//     selectedAcademicYear.title || ""
//   );

  const {
    data: studentDocumentsListing,
    isLoading: listIsLoading,
    isSuccess: listIsSuccess,
  } = useGetStudentDocumentsByYearByIdQuery(
    {
      studentId: id,
      year: selectedAcademicYear?.title,
      endpointName: "StudentDetails",
    },
    {
      pollingInterval: 60000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  // Use effect to set student data
  useEffect(() => {
    if (studentFromSelector) {
      setStudent(studentFromSelector);
    } else if (studentOrgIsSuccess && studentOrg) {
      const { entities } = studentOrg;
      //console.log(studentOrg, 'studentOrg');
      //console.log(entities[id], 'importedStudent');
      setStudent(entities[id]);
    }
  }, [studentFromSelector, studentOrgIsSuccess, studentOrg]);

  useEffect(() => {
    if (!listIsLoading && studentDocumentsListing) {
      //console.log(studentDocumentsListing, "studentDocumentsListing");
      const findStudentPhotoId = (documents) => {
        const studentPhotoDocument = documents.find(
          (doc) => doc.documentTitle === "Student Photo"
        );
        return studentPhotoDocument
          ? studentPhotoDocument.studentDocumentId
          : null;
      };

      const photoId = findStudentPhotoId(studentDocumentsListing);
      setPhotoId(photoId);
    }
  }, [listIsSuccess, studentDocumentsListing]);

  const { photoUrl } = useFetchPhoto(photoId);

//if academic year changed while inthe page, check if studetn years correspond
const isYearFound = student?.studentYears?.some(
	(year) => year.academicYear === selectedAcademicYear.title
  );
  

  
  let content;
  console.log(studentOrg,'studentOrg')
  console.log(student,'student')
  
  if(!isYearFound) return <p>Student not registered for that Year</p> 

  if (studentOrgIsLoading || !listIsSuccess || !studentDocumentsListing) {
    content = <LoadingStateIcon/>
  } else if (
    studentOrgIsSuccess &&
    student &&
    listIsSuccess &&
    studentDocumentsListing
  ) {
    content = (
      <>
        <Students />
        <div className="container mx-auto p-6 bg-white rounded-sm border border-gray-200">
          <h2 className="text-2xl font-bold mb-6 text-center">
            {/* First Line: Student Name */}
            {`Student Profile: ${student?.studentName?.firstName} 
				${student?.studentName?.middleName} 
				${student?.studentName?.lastName}`}
            <br />
            {/* Second Line: Academic Year */}
            {`for ${selectedAcademicYear.title} Academic Year`}
          </h2>
          {photoUrl && (
            <div className="flex justify-center mb-6">
              <img
                src={photoUrl}
                alt="Student"
                className="w-32 h-32 object-cover rounded-full border border-gray-300"
              />
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Personal Information */}
            <div className="bg-gray-50 p-4 rounded shadow-sm">
              <h3 className="text-lg font-semibold mb-2">
                Personal Information
              </h3>
              <p>
                <strong>Name:</strong> {student?.studentName?.firstName}{" "}
                {student?.studentName?.middleName}{" "}
                {student?.studentName?.lastName}
              </p>
              <p>
                <strong>Date of Birth:</strong>{" "}
                {new Date(student?.studentDob).toLocaleDateString()}
              </p>
              <p>
                <strong>Sex:</strong> {student?.studentSex}
              </p>
              <p>
                <strong>Active:</strong>{" "}
                {student?.studentIsActive ? "Yes" : "No"}
              </p>
            </div>

            {/* Admissions */}
            <div className="bg-gray-50 p-4 rounded shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Admissions</h3>
              {student?.studentAdmissions?.length > 0 ? (
                student.studentAdmissions.map((admission, index) => (
                  <div
                    key={index}
                    className="mb-2 border-b border-gray-300 pb-2"
                  >
                    <p>
                      <strong>Year:</strong> {admission?.admissionYear}
                    </p>
                    <p>
                      <strong>Admission:</strong> {admission?.admission}
                    </p>
                  </div>
                ))
              ) : (
                <p>No admissions available.</p>
              )}
            </div>

            {/* Academic Years */}
            <div className="bg-gray-50 p-4 rounded shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Academic Years</h3>
              {student?.studentYears?.length > 0 ? (
                student.studentYears.map((year, index) => (
                  <div
                    key={index}
                    className="mb-2 border-b border-gray-300 pb-2"
                  >
                    <p>
                      <strong>Year:</strong> {year?.academicYear}
                    </p>
                  </div>
                ))
              ) : (
                <p>No academic years available.</p>
              )}
            </div>

            {/* Education */}
            <div className="bg-gray-50 p-4 rounded shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Education</h3>
              {student?.studentEducation?.length > 0 ? (
                student.studentEducation.map((education, index) => (
                  <div
                    key={index}
                    className="mb-2 border-b border-gray-300 pb-2"
                  >
                    <p>
                      <strong>School Year:</strong> {education?.schoolYear}
                    </p>
                    <p>
                      <strong>Attended School:</strong>{" "}
                      {education?.attendedSchool.schoolName}
                    </p>
                    <p>
                      <strong>Note:</strong> {education?.attendedSchool?.note}
                    </p>
                  </div>
                ))
              ) : (
                <p>No education records available.</p>
              )}
            </div>

            {/* Guardians */}
            <div className="bg-gray-50 p-4 rounded shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Guardians</h3>
              {student?.studentGardien?.length > 0 ? (
                student.studentGardien.map((gardien, index) => (
                  <div
                    key={index}
                    className="mb-2 border-b border-gray-300 pb-2"
                  >
                    <p>
                      <strong>Year:</strong> {gardien?.gardienYear}
                    </p>
                    <p>
                      <strong>Name:</strong> {gardien?.gardienFirstName}{" "}
                      {gardien?.gardienMiddleName} {gardien?.gardienLastName}
                    </p>
                    <p>
                      <strong>Relation:</strong> {gardien?.gardienRelation}
                    </p>
                    <p>
                      <strong>Phone:</strong> {gardien?.gardienPhone}
                    </p>
                  </div>
                ))
              ) : (
                <p>No guardians available.</p>
              )}
            </div>
          </div>

          <div className="flex justify-end items-center space-x-4 mt-6">
            <button
              onClick={() => navigate(`/students/studentsParents/students`)}
              className="cancel-button"
            >
              Back to List
            </button>
            <button
              onClick={() =>
                navigate(`/students/studentsParents/editStudent/${id}`)
              }
              className="edit-button"
              hidden={!canEdit}
            >
              Edit Student
            </button>
          </div>
        </div>
      </>
    );
  }

  return content;
};

export default StudentDetails;
