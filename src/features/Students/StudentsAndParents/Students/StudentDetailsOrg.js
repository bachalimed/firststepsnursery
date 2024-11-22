import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { selectStudentById } from "./studentsSlice";

import { useGetStudentDocumentsByYearByIdQuery } from "../../../AppSettings/StudentsSet/StudentDocumentsLists/studentDocumentsListsApiSlice";
import Students from "../../Students";
import useFetchPhoto from "../../../../hooks/useFetchPhoto";
const StudentDetails = () => {
  const { id } = useParams();
  const Navigate = useNavigate();
  const [photoId, setPhotoId] = useState(null);
  const student = useSelector((state) => selectStudentById(state, id));
  //const token = useSelector((state) => state.auth.token);

  const [studentDocumentYear, setStudentDocumentYear] = useState(
    selectedAcademicYear.title || ""
  );

  const {
    data: studentDocumentsListing,
    isLoading: listIsLoading,
    isSuccess: listIsSuccess,
    isError: listIsError,
    error: listError,
  } = useGetStudentDocumentsByYearByIdQuery(
    {
      studentId: id,
      year: studentDocumentYear,
      endpointName: "studentsDocumentsList",
    },
    {
      pollingInterval: 60000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  useEffect(() => {
    if (listIsSuccess && studentDocumentsListing) {
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

  // Use the custom hook to fetch the student photo URL
  const { photoUrl, error: photoError } = useFetchPhoto(photoId);

  return (
    <>
      <Students />
      <div className="container mx-auto p-6 bg-white rounded-sm border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-center">Student Profile</h2>
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
          <div className="bg-gray-50 p-4 rounded shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
            <p>
              <strong>Name:</strong> {student.studentName.firstName}{" "}
              {student.studentName.middleName} {student.studentName.lastName}
            </p>
            <p>
              <strong>Date of Birth:</strong>{" "}
              {new Date(student.studentDob).toLocaleDateString()}
            </p>
            <p>
              <strong>Sex:</strong> {student.studentSex}
            </p>
            <p>
              <strong>Active:</strong> {student.studentIsActive ? "Yes" : "No"}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Admissions</h3>
            {student.studentAdmissions.length > 0 ? (
              student.studentAdmissions.map((admission, index) => (
                <div key={index} className="mb-2 border-b border-gray-300 pb-2">
                  <p>
                    <strong>Year:</strong> {admission.admissionYear}
                  </p>
                  <p>
                    <strong>Admission:</strong> {admission.admission}
                  </p>
                </div>
              ))
            ) : (
              <p>No admissions available.</p>
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Academic Years</h3>
            {student.studentYears.length > 0 ? (
              student.studentYears.map((year, index) => (
                <div key={index} className="mb-2 border-b border-gray-300 pb-2">
                  <p>
                    <strong>Year:</strong> {year.academicYear}
                  </p>
                </div>
              ))
            ) : (
              <p>No academic years available.</p>
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Education</h3>
            {student.studentEducation.length > 0 ? (
              student.studentEducation.map((education, index) => (
                <div key={index} className="mb-2 border-b border-gray-300 pb-2">
                  <p>
                    <strong>School Year:</strong> {education.schoolYear}
                  </p>
                  <p>
                    <strong>Attended School:</strong> {education.attendedSchool}
                  </p>
                  <p>
                    <strong>Note:</strong> {education.note}
                  </p>
                </div>
              ))
            ) : (
              <p>No education records available.</p>
            )}
          </div>
          <div className="bg-gray-50 p-4 rounded shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Guardians</h3>
            {student.studentGardien.length > 0 ? (
              student.studentGardien.map((gardien, index) => (
                <div key={index} className="mb-2 border-b border-gray-300 pb-2">
                  <p>
                    <strong>Year:</strong> {gardien.gardienYear}
                  </p>
                  <p>
                    <strong>Name:</strong> {gardien.gardienFirstName}{" "}
                    {gardien.gardienMiddleName} {gardien.gardienLastName}
                  </p>
                  <p>
                    <strong>Relation:</strong> {gardien.gardienRelation}
                  </p>
                  <p>
                    <strong>Phone:</strong> {gardien.gardienPhone}
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
            onClick={() => Navigate(`/students/studentsParents/students`)}
            className="cancel-button"
          >
            Back to List
          </button>
          <button
            onClick={() =>
              Navigate(`/students/studentsParents/editStudent/${id}`)
            }
            className="px-4 py-2 bg-yellow-400 text-white rounded"
          >
            Edit Student
          </button>
        </div>
      </div>
    </>
  );
};

export default StudentDetails;
