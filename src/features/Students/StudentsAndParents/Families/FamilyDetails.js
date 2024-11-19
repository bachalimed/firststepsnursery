import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectFamilyById } from "./familiesSlice";
import { useParams } from "react-router";
import { useGetEmployeeDocumentsByYearByIdQuery } from "../../../AppSettings/HRSet/EmployeeDocumentsLists/employeeDocumentsListsApiSlice";
import { useGetStudentDocumentsByYearByIdQuery } from "../../../AppSettings/StudentsSet/StudentDocumentsLists/studentDocumentsListsApiSlice";
import Students from "../../Students";
import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
  selectAllAcademicYears,
} from "../../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import { useNavigate } from "react-router";
import useFetchPhoto from "../../../../hooks/useFetchPhoto";
import LoadingStateIcon from "../../../../Components/LoadingStateIcon";
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
  //console.log(father,'father',mother,'mother', children,'children')
 // const token = useSelector((state) => state.auth.token);

  const [fatherPhotoId, setFatherPhotoId] = useState(null);
  const [motherPhotoId, setMotherPhotoId] = useState(null);
  const [child1PhotoId, setChild1PhotoId] = useState(null);
  const [child2PhotoId, setChild2PhotoId] = useState(null);
  const [child3PhotoId, setChild3PhotoId] = useState(null);
  const [childrenPhotoIds, setChildrenPhotoIds] = useState([]);
  const navigate = useNavigate();
  const {
    data: familyDocumentsListing,
    isSuccess: isFamilyDocsSuccess,
    isLoading: isFamilyDocsLoading,
  } = useGetStudentDocumentsByYearByIdQuery(
    //this will return an array of document id with family that arer th pphotos
    {
      familyId: id,
      criteria: "OnlyPhotos",
      //studentId: children[0]?.child?._id,
      year: selectedAcademicYear?.title,
      endpointName: "FamilyDetails",
    },
    {
      pollingInterval: 60000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );
  // const { data: studentDocumentsListing, isSuccess: listIsSuccess } =
  //   useGetStudentDocumentsByYearByIdQuery(
  //     {
  //       studentId: id,
  //       year: selectedAcademicYear.title,
  //       endpointName: "FamilyDetails",
  //     },
  //     {
  //       pollingInterval: 60000,
  //       refetchOnFocus: true,
  //       refetchOnMountOrArgChange: true,
  //     }
  //   );

 


  useEffect(() => {
    if (isFamilyDocsSuccess && familyDocumentsListing) {
      //console.log(familyDocumentsListing,'familyDocumentsListing')
      
      setFatherPhotoId(familyDocumentsListing?.fatherPhotoId)
      setMotherPhotoId(familyDocumentsListing?.motherPhotoId)
      setChild1PhotoId(familyDocumentsListing?.child1PhotoId)
      setChild2PhotoId(familyDocumentsListing?.child2PhotoId)
      setChild3PhotoId(familyDocumentsListing?.child3PhotoId)
console.log(child1PhotoId,'child1PhotoId',fatherPhotoId,'fatherPhotoId')
  //      const updateChildrenPhotoIds = () => {
  //   // Assuming `familyDocumentsListing.children` is an array of children objects
  //   const photoIds = familyDocumentsListing.children.map((child) => {
  //     // Return the documentReference of the student's photo if it exists
  //     return child.studentPhoto
  //   })

  //   // Update the state with the collected photo IDs
  //   setChildrenPhotoIds(photoIds);
  // };
  // if (isFamilyDocsSuccess && familyDocumentsListing) {
  // updateChildrenPhotoIds();
  // }
//   if(childrenPhotoIds){
//     childrenPhotosUrls =[child1PhotoUrl,child2PhotoUrl,child3PhotoUrl]
// }
     
    }
  }, [isFamilyDocsSuccess, familyDocumentsListing]);
  
  let childrenPhotosUrls=[]

  const {photoUrl: fatherPhotoUrl } = useFetchPhoto(fatherPhotoId);
  const { photoUrl:motherPhotoUrl } = useFetchPhoto(motherPhotoId);

   //due to error from calling fetchphoto inside a fucntion, lets assume we don not have more than 3 children per family
   const { photoUrl:child1PhotoUrl } = useFetchPhoto(child1PhotoId); 
   const { photoUrl:child2PhotoUrl } = useFetchPhoto(child2PhotoId); 
  const { photoUrl:child3PhotoUrl } = useFetchPhoto(child3PhotoId); 
 


  //console.log("fatherPhotoUrl", fatherPhotoUrl); // Log the URL to see if it's set correctly
  let content;

  if (isFamilyDocsLoading) {
    content = (
      <>
        <Students />
        <LoadingStateIcon />
      </>
    );
  }
  if (isFamilyDocsSuccess&&familyDocumentsListing&&family) {
    content = (
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
            {motherPhotoUrl&& (
              <div className="flex flex-col items-center">
                <img
                  src={motherPhotoUrl}
                  alt="Mother Photo"
                  className="w-32 h-32 object-cover rounded-full border border-gray-300"
                />
                <h3 className="mt-2 font-semibold">Mother</h3>
              </div>
            )}
            {child1PhotoUrl&& (
              <div className="flex flex-col items-center">
                <img
                  src={child1PhotoUrl}
                  alt="child1 Photo"
                  className="w-32 h-32 object-cover rounded-full border border-gray-300"
                />
                <h3 className="mt-2 font-semibold">Child 1</h3>
              </div>
            )}
            {child2PhotoUrl&& (
              <div className="flex flex-col items-center">
                <img
                  src={child2PhotoUrl}
                  alt="child2 Photo"
                  className="w-32 h-32 object-cover rounded-full border border-gray-300"
                />
                <h3 className="mt-2 font-semibold">Child 2</h3>
              </div>
            )}
            {child3PhotoUrl&& (
              <div className="flex flex-col items-center">
                <img
                  src={child3PhotoUrl}
                  alt="child2 Photo"
                  className="w-32 h-32 object-cover rounded-full border border-gray-300"
                />
                <h3 className="mt-2 font-semibold">Child 2</h3>
              </div>
            )}
            {/* {childrenPhotosUrls.length > 0 &&
              childrenPhotosUrls.map((url, index) => (
                <div key={index} className="flex flex-col items-center">
                  <img
                    src={url}
                    alt={`Child Photo ${index + 1}`}
                    className="w-32 h-32 object-cover rounded-full border border-gray-300"
                  />
                  <h3 className="mt-2 font-semibold">Child {index + 1}</h3>
                </div>
              ))} */}
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold">
              Father Personal Information
            </h3>
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
            {father?.userContact?.secondaryPhone && (
              <p>
                <strong>Secondary Phone:</strong>{" "}
                {`  ${father?.userContact?.secondaryPhone} `}
              </p>
            )}
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold">Family Situation</h3>
            <p>{familySituation ? "Joint" : "Separated"}</p>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold">
              Mother Personal Information
            </h3>
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
            {mother?.userContact?.secondaryPhone && (
              <p>
                <strong>Secondary Phone:</strong>{" "}
                {`  ${mother?.userContact?.secondaryPhone} `}
              </p>
            )}
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
          <div className="flex justify-end items-center space-x-4 mt-6">
            <button
              onClick={() => navigate(`/students/studentsParents/familiesList`)}
              className="px-4 py-2 bg-gray-500 text-white rounded"
            >
              Back to List
            </button>
            <button
              onClick={() =>
                navigate(`/students/studentsParents/editFamily/${id}`)
              }
              className="px-4 py-2 bg-yellow-400 text-white rounded"
            >
              Edit Family{" "}
            </button>
          </div>
        </div>
      </>
    );
  }
  return content;
};

export default FamilyDetails;
