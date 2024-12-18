import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectFamilyById } from "./familiesSlice";
import { useParams } from "react-router";
import axios from "axios";
import { useGetStudentDocumentsByYearByIdQuery } from "../../../AppSettings/StudentsSet/StudentDocumentsLists/studentDocumentsListsApiSlice";
import Students from "../../Students";
import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
  selectAllAcademicYears,
} from "../../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import { useNavigate } from "react-router";
const FamilyDetails = () => {
  const { id } = useParams();
  
  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  const academicYears = useSelector(selectAllAcademicYears);
  const family = useSelector((state) => selectFamilyById(state, id));
  const {
    father = {},
    mother = {},
    children = [],
    familySituation = "",
  } = family || {};

  const token = useSelector((state) => state.auth.token);

  const [studentDocumentYear, setStudentDocumentYear] = useState(
    selectedAcademicYear?.title || ""
  );
  const [fatherPhotoUrl, setFatherPhotoUrl] = useState(null);
  const [motherPhotoUrl, setMotherPhotoUrl] = useState(null);
  const [childrenPhotoUrls, setChildrenPhotoUrls] = useState([]);
  const navigate = useNavigate();
  const { data: studentDocumentsListing, isSuccess: listIsSuccess } =
    useGetStudentDocumentsByYearByIdQuery(
      {
        studentId: id,
        year: studentDocumentYear,
        endpointName: "FamilyDetails",
      },
      {
        pollingInterval: 60000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
      }
    );

  useEffect(() => {
    if (listIsSuccess && studentDocumentsListing) {
      const findPhoto = (title) => {
        const photoDocument = studentDocumentsListing.find(
          (doc) => doc.documentTitle === title
        );
        return photoDocument ? photoDocument.studentDocumentId : null;
      };

      const fatherPhotoId = findPhoto("Father Photo");
      const motherPhotoId = findPhoto("Mother Photo");
      const childrenPhotosIds = children.map((child) =>
        findPhoto(`${child.child.studentName.firstName} Photo`)
      );

      // Fetch photos
      const fetchPhotos = async (id, setUrl) => {
        if (!id) return;
        try {
          const response = await axios.get(
            `http://localhost:3500/students/studentsParents/studentDocuments/${id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
              responseType: "blob",
            }
          );
          const url = window.URL.createObjectURL(
            new Blob([response.data], {
              type: response.headers["content-type"],
            })
          );
          setUrl(url);
        } catch (error) {
          console.error(`Error fetching photo:`, error);
        }
      };

      fetchPhotos(fatherPhotoId, setFatherPhotoUrl);
      fetchPhotos(motherPhotoId, setMotherPhotoUrl);
      childrenPhotosIds.forEach((id) =>
        fetchPhotos(id, (url) => setChildrenPhotoUrls((prev) => [...prev, url]))
      );
    }
  }, [listIsSuccess, studentDocumentsListing, children, token]);

  const handleBack = () => {
    navigate("students/studentsParents/families/");
  };

  return (
    <>
      <Students />
      <div className="flex-1 bg-white px-6 py-4 rounded-sm border border-gray-200">
        <h2 className="text-xl font-bold mb-4">Family Details</h2>
        <div className="grid grid-cols-3 gap-6 mb-6">
          {fatherPhotoUrl && (
            <div className="flex flex-col items-center">
              <img
                src={fatherPhotoUrl}
                alt="Father Photo"
                className="w-32 h-32 object-cover rounded-full border border-gray-300"
              />
              <h3 className="mt-2 font-semibold">Father</h3>
            </div>
          )}
          {motherPhotoUrl && (
            <div className="flex flex-col items-center">
              <img
                src={motherPhotoUrl}
                alt="Mother Photo"
                className="w-32 h-32 object-cover rounded-full border border-gray-300"
              />
              <h3 className="mt-2 font-semibold">Mother</h3>
            </div>
          )}
          {childrenPhotoUrls.length > 0 &&
            childrenPhotoUrls.map((url, index) => (
              <div key={index} className="flex flex-col items-center">
                <img
                  src={url}
                  alt={`Child Photo ${index + 1}`}
                  className="w-32 h-32 object-cover rounded-full border border-gray-300"
                />
                <h3 className="mt-2 font-semibold">Child {index + 1}</h3>
              </div>
            ))}
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold">Father Personal Information</h3>
          <p>
            <strong>Name:</strong> {father?.userFullName?.userFirstName}{" "}
            {father?.userFullName?.userMiddleName}{" "}
            {father?.userFullName?.userLastName}
          </p>
          <p>
            <strong>Date of Birth:</strong>{" "}
            {new Date(father?.userDob).toLocaleDateString()}
          </p>

          <p>
            <strong>Address:</strong>{" "}
            {`${father?.userAddress?.house} ${father?.userAddress?.street}, ${father?.userAddress?.area} ${father?.userAddress?.postCode}, ${father?.userAddress?.city}`}
          </p>
          <p>
            <strong>Primary Phone:</strong>{" "}
            {`  ${father?.userContact?.primaryPhone} `}
          </p>
          {father?.userContact?.secondaryPhone&&<p>
            <strong>Secondary Phone:</strong>{" "}
            {`  ${father?.userContact?.secondaryPhone} `}
          </p>}
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold">Family Situation</h3>
          <p>{familySituation ? "Joint" : "Separated"}</p>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold">Mother Personal Information</h3>
          <p>
            <strong>Name:</strong> {mother?.userFullName?.userFirstName}{" "}
            {mother?.userFullName?.userMiddleName}{" "}
            {mother?.userFullName?.userLastName}
          </p>
          <p>
            <strong>Date of Birth:</strong>{" "}
            {new Date(mother?.userDob).toLocaleDateString()}
          </p>

          <p>
            <strong>Address:</strong>{" "}
            {`${mother?.userAddress?.house} ${mother?.userAddress?.street}, ${mother?.userAddress?.area} ${mother?.userAddress?.postCode}, ${mother?.userAddress?.city}`}
          </p>
          <p>
            <strong>Primary Phone:</strong>{" "}
            {`  ${mother?.userContact?.primaryPhone} `}
          </p>
          {mother?.userContact?.secondaryPhone&&<p>
            <strong>Secondary Phone:</strong>{" "}
            {`  ${mother?.userContact?.secondaryPhone} `}
          </p>}
        </div>

        {children && children.length > 0 ? (
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Children</h3>
            {children.map((child, index) => (
              <div key={index} className="mb-2">
                <p>
                  <strong>Child Name:</strong>{" "}
                  {child?.child?.studentName?.firstName}{" "}
                  {child?.child?.studentName?.middleName}{" "}
                  {child?.child?.studentName?.lastName}
                </p>
                <p>
                  <strong>Date of Birth:</strong>{" "}
                  {new Date(child?.child?.studentDob).toLocaleDateString()}
                </p>
                <p>
                  <strong>Sex:</strong> {child?.child?.studentSex}
                </p>
                <p>
                  <strong>Joint Family:</strong>{" "}
                  {child?.child?.studentJointFamily ? "Yes" : "No"}
                </p>
                
              </div>
            ))}
          </div>
        ) : (
          <p>No children profiles available.</p>
        )}
        <div className="cancelSavebuttonsDiv">
          <button
            onClick={() => navigate(`/students/studentsParents/familiesList`)}
            className="cancel-button"
          >
            Back to List
          </button>
          <button
            onClick={() =>
              navigate(`/students/studentsParents/editFamily/${id}`)
            }
            className="px-4 py-2 bg-amber-300 text-white rounded"
          >
            Edit Family{" "}
          </button>
        </div>
      </div>
    </>
  );
};

export default FamilyDetails;
