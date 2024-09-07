import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import axios from 'axios';
import { useSelectedAcademicYear } from "../../../../hooks/useSelectedAcademicYears";
import { useGetStudentDocumentsByYearByIdQuery } from '../../../AppSettings/StudentsSet/StudentDocumentsLists/studentDocumentsListsApiSlice';
import StudentsParents from '../../StudentsParents';

const StudentDetails = () => {
  const { id } = useParams();
  const [photoId, setPhotoId] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const student = useSelector(state => state.student?.entities[id]);
  const token = useSelector(state => state.auth.token);
  const selectedAcademicYear = useSelectedAcademicYear();
  const [studentDocumentYear, setStudentDocumentYear] = useState(selectedAcademicYear.title || '');

  const {
    data: studentDocumentsListing,
    isLoading: listIsLoading,
    isSuccess: listIsSuccess,
    isError: listIsError,
    error: listError
  } = useGetStudentDocumentsByYearByIdQuery(
    { studentId: id, year: studentDocumentYear, endpointName: 'studentsDocumentsList' },
    {
      pollingInterval: 60000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true
    }
  );

  useEffect(() => {
    if (listIsSuccess && studentDocumentsListing) {
      const findStudentPhotoId = (documents) => {
        const studentPhotoDocument = documents.find(doc => doc.documentTitle === "Student Photo");
        return studentPhotoDocument ? studentPhotoDocument.studentDocumentId : null;
      };

      const photoId = findStudentPhotoId(studentDocumentsListing);
      setPhotoId(photoId);
      console.log('photo id', photoId)
    }
  }, [listIsSuccess, studentDocumentsListing]);

  useEffect(() => {
    const fetchPhoto = async () => {
      if (!photoId) return;

      try {
        const response = await axios.get(`http://localhost:3500/students/studentsParents/studentDocuments/${photoId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          responseType: 'blob',
        });

        const contentType = response.headers['content-type'];
        const blob = new Blob([response.data], { type: contentType });
        const url = window.URL.createObjectURL(blob);
        setPhotoUrl(url);
      } catch (error) {
        console.error('Error fetching student photo:', error);
      }
    };
console.log('now hereeee')
    fetchPhoto();
  }, [photoId, token]);

  return (<>
  <StudentsParents/>
    <div className="flex flex-col md:flex-row bg-white px-6 py-4 rounded-sm border border-gray-200">
    <div className="flex-1">
      <h2 className="text-xl font-bold mb-4">Student Profile</h2>
      
      {photoUrl && (
        <div className="mb-4 flex justify-end">
          <div className="flex-none">
            <h3 className="text-lg font-semibold mb-2">Student Photo</h3>
            <img src={photoUrl} alt="Student" className="w-24 h-24 object-cover rounded border border-gray-300" />
          </div>
        </div>
      )}
      
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Personal Information</h3>
        <p><strong>Name:</strong> {student.studentName.firstName} {student.studentName.middleName} {student.studentName.lastName}</p>
        <p><strong>Date of Birth:</strong> {new Date(student.studentDob).toLocaleDateString()}</p>
        <p><strong>Sex:</strong> {student.studentSex}</p>
        <p><strong>Active:</strong> {student.studentIsActive ? 'Yes' : 'No'}</p>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold">Guardians</h3>
        {student.studentGardien.length > 0 ? (
          student.studentGardien.map((gardien, index) => (
            <div key={index} className="mb-2 border-b border-gray-300 pb-2">
              <p><strong>Year:</strong> {gardien.gardienYear}</p>
              <p><strong>Name:</strong> {gardien.gardienFirstName} {gardien.gardienMiddleName} {gardien.gardienLastName}</p>
              <p><strong>Relation:</strong> {gardien.gardienRelation}</p>
              <p><strong>Phone:</strong> {gardien.gardienPhone}</p>
            </div>
          ))
        ) : (
          <p>No guardians available.</p>
        )}
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold">Admissions</h3>
        {student.studentAdmissions.length > 0 ? (
          student.studentAdmissions.map((admission, index) => (
            <div key={index} className="mb-2 border-b border-gray-300 pb-2">
              <p><strong>Year:</strong> {admission.admissionYear}</p>
              <p><strong>Admission:</strong> {admission.admission}</p>
            </div>
          ))
        ) : (
          <p>No admissions available.</p>
        )}
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold">Academic Years</h3>
        {student.studentYears.length > 0 ? (
          student.studentYears.map((year, index) => (
            <div key={index} className="mb-2 border-b border-gray-300 pb-2">
              <p><strong>Year:</strong> {year.academicYear}</p>
            </div>
          ))
        ) : (
          <p>No academic years available.</p>
        )}
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold">Education</h3>
        {student.studentEducation.length > 0 ? (
          student.studentEducation.map((education, index) => (
            <div key={index} className="mb-2 border-b border-gray-300 pb-2">
              <p><strong>School Year:</strong> {education.schoolYear}</p>
              <p><strong>Attended School:</strong> {education.attendedSchool}</p>
              <p><strong>Note:</strong> {education.note}</p>
            </div>
          ))
        ) : (
          <p>No education records available.</p>
        )}
      </div>

      <div className="flex justify-end items-center space-x-4">
        <button className="px-4 py-2 bg-green-500 text-white rounded">
          Edit Profile
        </button>
        <button className="px-4 py-2 bg-red-500 text-white rounded">
          Delete Profile
        </button>
      </div>
    </div>
  </div>
  </>
  );
};

export default StudentDetails