import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { useGetEnrolmentByIdQuery } from "./enrolmentsApiSlice";
import { selectEnrolmentById } from "./enrolmentsSlice";
import LoadingStateIcon from '../../../../Components/LoadingStateIcon'
import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
  selectAllAcademicYears,
} from "../../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import { useGetEnrolmentDocumentsByYearByIdQuery } from "../../../AppSettings/EnrolmentsSet/EnrolmentDocumentsLists/enrolmentDocumentsListsApiSlice";
import EnrolmentsParents from "../../EnrolmentsParents";
import useFetchPhoto from "../../../../hooks/useFetchPhoto";

const EnrolmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [photoId, setPhotoId] = useState(null);
  const [enrolment, setEnrolment] = useState(null);

  const enrolmentFromSelector = useSelector((state) =>
    selectEnrolmentById(state, id)
  );
  const {
    data: enrolmentOrg,
    isLoading: enrolmentOrgIsLoading,
    isSuccess: enrolmentOrgIsSuccess,
    isError: enrolmentOrgIsError,
  } = useGetEnrolmentByIdQuery(
    { id: id, endpointName: "enrolmentById" },
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

//   const [enrolmentDocumentYear, setEnrolmentDocumentYear] = useState(
//     selectedAcademicYear.title || ""
//   );

  const {
    data: enrolmentDocumentsListing,
    isLoading: listIsLoading,
    isSuccess: listIsSuccess,
  } = useGetEnrolmentDocumentsByYearByIdQuery(
    {
      enrolmentId: id,
      year: selectedAcademicYear.title,
      endpointName: "enrolmentsDocumentsList",
    },
    {
      pollingInterval: 60000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  // Use effect to set enrolment data
  useEffect(() => {
    if (enrolmentFromSelector) {
      setEnrolment(enrolmentFromSelector);
    } else if (enrolmentOrgIsSuccess && enrolmentOrg) {
      const { entities } = enrolmentOrg;
      //console.log(enrolmentOrg, 'enrolmentOrg');
      //console.log(entities[id], 'importedEnrolment');
      setEnrolment(entities[id]);
    }
  }, [enrolmentFromSelector, enrolmentOrgIsSuccess, enrolmentOrg]);

  useEffect(() => {
    if (!listIsLoading && enrolmentDocumentsListing) {
      //console.log(enrolmentDocumentsListing, "enrolmentDocumentsListing");
      const findEnrolmentPhotoId = (documents) => {
        const enrolmentPhotoDocument = documents.find(
          (doc) => doc.documentTitle === "Enrolment Photo"
        );
        return enrolmentPhotoDocument
          ? enrolmentPhotoDocument.enrolmentDocumentId
          : null;
      };

      const photoId = findEnrolmentPhotoId(enrolmentDocumentsListing);
      setPhotoId(photoId);
    }
  }, [listIsSuccess, enrolmentDocumentsListing]);

  const { photoUrl } = useFetchPhoto(photoId);

//if academic year changed while inthe page, check if studetn years correspond
const isYearFound = enrolment?.enrolmentYears?.some(
	(year) => year.academicYear === selectedAcademicYear.title
  );
  

  
  let content;
  
  
  if(!isYearFound) return <p>Enrolment not registered for that Year</p> 

  if (enrolmentOrgIsLoading || !listIsSuccess || !enrolmentDocumentsListing) {
    content = <><Students/><Students/><LoadingStateIcon/></>
  } else if (
    enrolmentOrgIsSuccess &&
    enrolment &&
    listIsSuccess &&
    enrolmentDocumentsListing
  ) {
    content = (
      <>
        <Students />
        <div className="container mx-auto p-6 bg-white rounded-sm border border-gray-200">
          <h2 className="text-2xl font-bold mb-6 text-center">
            {/* First Line: Enrolment Name */}
            {`Enrolment Profile: ${enrolment?.enrolmentName?.firstName} 
				${enrolment?.enrolmentName?.middleName} 
				${enrolment?.enrolmentName?.lastName}`}
            <br />
            {/* Second Line: Academic Year */}
            {`for ${selectedAcademicYear.title} Academic Year`}
          </h2>
          {photoUrl && (
            <div className="flex justify-center mb-6">
              <img
                src={photoUrl}
                alt="Enrolment"
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
                <strong>Name:</strong> {enrolment?.enrolmentName?.firstName}{" "}
                {enrolment?.enrolmentName?.middleName}{" "}
                {enrolment?.enrolmentName?.lastName}
              </p>
              <p>
                <strong>Date of Birth:</strong>{" "}
                {new Date(enrolment?.enrolmentDob).toLocaleDateString()}
              </p>
              <p>
                <strong>Sex:</strong> {enrolment?.enrolmentSex}
              </p>
              <p>
                <strong>Active:</strong>{" "}
                {enrolment?.enrolmentIsActive ? "Yes" : "No"}
              </p>
            </div>

            {/* Enrolments */}
            <div className="bg-gray-50 p-4 rounded shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Enrolments</h3>
              {enrolment?.enrolmentEnrolments?.length > 0 ? (
                enrolment.enrolmentEnrolments.map((enrolment, index) => (
                  <div
                    key={index}
                    className="mb-2 border-b border-gray-300 pb-2"
                  >
                    <p>
                      <strong>Year:</strong> {enrolment?.enrolmentYear}
                    </p>
                    <p>
                      <strong>Enrolment:</strong> {enrolment?.enrolment}
                    </p>
                  </div>
                ))
              ) : (
                <p>No enrolments available.</p>
              )}
            </div>

            {/* Academic Years */}
            <div className="bg-gray-50 p-4 rounded shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Academic Years</h3>
              {enrolment?.enrolmentYears?.length > 0 ? (
                enrolment.enrolmentYears.map((year, index) => (
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
              {enrolment?.enrolmentEducation?.length > 0 ? (
                enrolment.enrolmentEducation.map((education, index) => (
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
              {enrolment?.enrolmentGardien?.length > 0 ? (
                enrolment.enrolmentGardien.map((gardien, index) => (
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
              onClick={() => navigate(`/enrolments/enrolmentsParents/enrolments`)}
             className="cancel-button"
            >
              Back to List
            </button>
            <button
              onClick={() =>
                navigate(`/enrolments/enrolmentsParents/editEnrolment/${id}`)
              }
              className="edit-button"
              hidden={!canEdit}
            >
              Edit Enrolment
            </button>
          </div>
        </div>
      </>
    );
  }

  return content;
};

export default EnrolmentDetails;
