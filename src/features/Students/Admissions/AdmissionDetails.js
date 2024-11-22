import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { useGetAdmissionByIdQuery } from "./admissionsApiSlice";
import { selectAdmissionById } from "./admissionsSlice";
import LoadingStateIcon from '../../../../Components/LoadingStateIcon'
import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
  selectAllAcademicYears,
} from "../../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import { useGetAdmissionDocumentsByYearByIdQuery } from "../../../AppSettings/AdmissionsSet/AdmissionDocumentsLists/admissionDocumentsListsApiSlice";
import Students from "../../Students";
import useFetchPhoto from "../../../../hooks/useFetchPhoto";

const AdmissionDetails = () => {//to be edited
  const { id } = useParams();
  const navigate = useNavigate();
  const [photoId, setPhotoId] = useState(null);
  const [admission, setAdmission] = useState(null);

  const admissionFromSelector = useSelector((state) =>
    selectAdmissionById(state, id)
  );
  const {
    data: admissionOrg,
    isLoading: admissionOrgIsLoading,
    isSuccess: admissionOrgIsSuccess,
    isError: admissionOrgIsError,
  } = useGetAdmissionByIdQuery(
    { id: id, endpointName: "admissionById" },
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

//   const [admissionDocumentYear, setAdmissionDocumentYear] = useState(
//     selectedAcademicYear.title || ""
//   );

  const {
    data: admissionDocumentsListing,
    isLoading: listIsLoading,
    isSuccess: listIsSuccess,
  } = useGetAdmissionDocumentsByYearByIdQuery(
    {
      admissionId: id,
      year: selectedAcademicYear.title,
      endpointName: "admissionsDocumentsList",
    },
    {
      pollingInterval: 60000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  // Use effect to set admission data
  useEffect(() => {
    if (admissionFromSelector) {
      setAdmission(admissionFromSelector);
    } else if (admissionOrgIsSuccess && admissionOrg) {
      const { entities } = admissionOrg;
      //console.log(admissionOrg, 'admissionOrg');
      //console.log(entities[id], 'importedAdmission');
      setAdmission(entities[id]);
    }
  }, [admissionFromSelector, admissionOrgIsSuccess, admissionOrg]);

  useEffect(() => {
    if (!listIsLoading && admissionDocumentsListing) {
      //console.log(admissionDocumentsListing, "admissionDocumentsListing");
      const findAdmissionPhotoId = (documents) => {
        const admissionPhotoDocument = documents.find(
          (doc) => doc.documentTitle === "Admission Photo"
        );
        return admissionPhotoDocument
          ? admissionPhotoDocument.admissionDocumentId
          : null;
      };

      const photoId = findAdmissionPhotoId(admissionDocumentsListing);
      setPhotoId(photoId);
    }
  }, [listIsSuccess, admissionDocumentsListing]);

  const { photoUrl } = useFetchPhoto(photoId);

//if academic year changed while inthe page, check if studetn years correspond
const isYearFound = admission?.admissionYears?.some(
	(year) => year.academicYear === selectedAcademicYear.title
  );
  

  
  let content;
  
  
  if(!isYearFound) return <p>Admission not registered for that Year</p> 

  if (admissionOrgIsLoading || !listIsSuccess || !admissionDocumentsListing) {
    content = <LoadingStateIcon/>
  } else if (
    admissionOrgIsSuccess &&
    admission &&
    listIsSuccess &&
    admissionDocumentsListing
  ) {
    content = (
      <>
        <AdmissionsParents />
        <div className="container mx-auto p-6 bg-white rounded-sm border border-gray-200">
          <h2 className="text-2xl font-bold mb-6 text-center">
            {/* First Line: Admission Name */}
            {`Admission Profile: ${admission?.admissionName?.firstName} 
				${admission?.admissionName?.middleName} 
				${admission?.admissionName?.lastName}`}
            <br />
            {/* Second Line: Academic Year */}
            {`for ${selectedAcademicYear.title} Academic Year`}
          </h2>
          {photoUrl && (
            <div className="flex justify-center mb-6">
              <img
                src={photoUrl}
                alt="Admission"
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
                <strong>Name:</strong> {admission?.admissionName?.firstName}{" "}
                {admission?.admissionName?.middleName}{" "}
                {admission?.admissionName?.lastName}
              </p>
              <p>
                <strong>Date of Birth:</strong>{" "}
                {new Date(admission?.admissionDob).toLocaleDateString()}
              </p>
              <p>
                <strong>Sex:</strong> {admission?.admissionSex}
              </p>
              <p>
                <strong>Active:</strong>{" "}
                {admission?.admissionIsActive ? "Yes" : "No"}
              </p>
            </div>

            {/* Admissions */}
            <div className="bg-gray-50 p-4 rounded shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Admissions</h3>
              {admission?.admissionAdmissions?.length > 0 ? (
                admission.admissionAdmissions.map((admission, index) => (
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
              {admission?.admissionYears?.length > 0 ? (
                admission.admissionYears.map((year, index) => (
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
              {admission?.admissionEducation?.length > 0 ? (
                admission.admissionEducation.map((education, index) => (
                  <div
                    key={index}
                    className="mb-2 border-b border-gray-300 pb-2"
                  >
                    <p>
                      <strong>School Year:</strong> {education?.schoolYear}
                    </p>
                    <p>
                      <strong>Attended School:</strong>{" "}
                      {education?.attendedSchool}
                    </p>
                    <p>
                      <strong>Note:</strong> {education?.note}
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
              {admission?.admissionGardien?.length > 0 ? (
                admission.admissionGardien.map((gardien, index) => (
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
              onClick={() => navigate(`/admissions/admissionsParents/admissions`)}
              className="cancel-button"
            >
              Back to List
            </button>
            <button
              onClick={() =>
                navigate(`/admissions/admissionsParents/editAdmission/${id}`)
              }
              className="px-4 py-2 bg-yellow-400 text-white rounded"
            >
              Edit Admission
            </button>
          </div>
        </div>
      </>
    );
  }

  return content;
};

export default AdmissionDetails;
