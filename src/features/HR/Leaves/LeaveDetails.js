import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { selectLeaveById } from "./leavesApiSlice";
import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
  selectAllAcademicYears,
} from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import { useGetLeaveByIdQuery } from "./leavesApiSlice";
import useFetchUserPhoto from "../../../hooks/useFetchUserPhoto";

import {useState, useEffect} from "react"
import HR from "../HR";

import useAuth from "../../../hooks/useAuth";

const LeaveDetails = () => {
  const { id } = useParams();


  const {canEdit}=useAuth()
  //const leave = useSelector((state) => state.leave?.entities[id]);
  const navigate = useNavigate();
  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  const academicYears = useSelector(selectAllAcademicYears);
  const {
    data: leave, //the data is renamed leaves
    isLoading: isLeaveLoading, 
    isSuccess: isLeaveSuccess,
    isError: isLeaveError,
    error: leaveError,
  } = useGetLeaveByIdQuery(
    {
      id: id,
      endpointName: "LeaveDetails",
    } || {},
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );
  const [photoId, setPhotoId] = useState(null);
  console.log(leave, "leave");





  const { photoUrl } = useFetchUserPhoto(photoId);
  // const leaveToview = isLeaveSuccess ? leave : [];
  let content;
  // console.log(leaveToview);
  content = 
   (  content = isLeaveSuccess 
     ) ? (
    <>
      <HR />
      <div className="max-w-4xl mx-auto mt-8 bg-white p-8 shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Leave Details
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <p className="text-sm font-medium text-gray-700">Full Name</p>
            <p className="text-lg text-gray-900">
              {leave?.userFullName?.userFirstName}{" "}
              {leave?.userFullName?.userMiddleName}{" "}
              {leave?.userFullName?.userLastName || ""}
            </p>
          </div>
          {photoUrl && (
            <div className="flex justify-center mb-6">
              <img
                src={photoUrl}
                alt="Leave"
                className="w-32 h-32 object-cover rounded-full border border-gray-300"
              />
            </div>
          )}

          {/* Date of Birth */}
          <div>
            <p className="text-sm font-medium text-gray-700">Date of Birth</p>
            <p className="text-lg text-gray-900">
              {leave?.userDob ? leave.userDob.split("T")[0] : "N/A"}
            </p>
          </div>

          {/* Sex */}
          <div>
            <p className="text-sm font-medium text-gray-700">Sex</p>
            <p className="text-lg text-gray-900">
              {leave?.userSex || "N/A"}
            </p>
          </div>

          {/* Address */}
          <div>
            <p className="text-sm font-medium text-gray-700">Address</p>
            <p className="text-lg text-gray-900">
              {leave?.userAddress?.house} {leave?.userAddress?.street}
            </p>
            <p className="text-lg text-gray-900">
              {leave?.userAddress?.area}
            </p>
            <p className="text-lg text-gray-900">
              {leave?.userAddress?.postCode}
            </p>
            <p className="text-lg text-gray-900">
              {leave?.userAddress?.city}
            </p>
          </div>

          {/* Contact */}
          <div>
            <p className="text-sm font-medium text-gray-700">Contact</p>
            <p className="text-lg text-gray-900">
              {leave?.userContact?.primaryPhone || "N/A"}
            </p>
            <p className="text-lg text-gray-900">
              {leave?.userContact?.secondaryPhone || "N/A"}
            </p>
            <p className="text-lg text-gray-900">
              {leave?.userContact?.email || "N/A"}
            </p>
          </div>

          {/* Roles */}
          <div>
            <p className="text-sm font-medium text-gray-700">Roles</p>
            <p className="text-lg text-gray-900">
              {leave?.userRoles?.length > 0
                ? leave.userRoles.join(", ")
                : "N/A"}
            </p>
          </div>

          {/* Active Status */}
          <div>
            <p className="text-sm font-medium text-gray-700">Active Status</p>
            <div>
            User:
            <span
              className={`text-lg font-semibold ${
                leave?.userIsActive ? "text-green-600" : "text-red-600"
              }`}
            >
              {" "}
              {leave?.userIsActive ? "Active" : "Inactive"}
            </span></div>
            <div>
            Leave:
            <span
              className={`text-lg font-semibold ${
                leave?.leaveId?.leaveIsActive
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {" "}
              {leave?.leaveId?.leaveIsActive ? "Active" : "Inactive"}
            </span>
            </div>
          </div>

          {/* Academic Years */}
          <div>
            <p className="text-sm font-medium text-gray-700">Academic Years</p>
            <ul className="list-disc list-inside text-lg text-gray-900">
              {leave?.leaveId?.leaveYears?.length > 0 ? (
                leave.leaveId.leaveYears.map((year, idx) => (
                  <li key={idx}>{year.academicYear}</li>
                ))
              ) : (
                <li>N/A</li>
              )}
            </ul>
          </div>

          {/* Current Employment */}
          <div>
            <p className="text-sm font-medium text-gray-700">
              Current Employment
            </p>
            <p className="text-lg text-gray-900">
              {leave?.leaveId?.leaveCurrentEmployment?.position
                ? `${
                    leave?.leaveId?.leaveCurrentEmployment?.position
                  }, Joined on: ${
                    leave?.leaveId?.leaveCurrentEmployment?.joinDate.split(
                      "T"
                    )[0]
                  }`
                : "N/A"}
            </p>
          </div>

          {/* Work History */}
          <div>
            <p className="text-sm font-medium text-gray-700">Work History</p>
            <ul className="list-disc list-inside text-lg text-gray-900">
              {leave?.leaveId?.leaveWorkHistory?.length > 0 ? (
                leave.leaveId.leaveWorkHistory.map(
                  (history, idx) => (
                    <li key={idx}>
                      {history.position} at {history.company} (
                      {history.startDate} - {history.endDate || "Present"})
                    </li>
                  )
                )
              ) : (
                <li>N/A</li>
              )}
            </ul>
          </div>
        </div>

        <div className="flex justify-end items-center space-x-4 mt-6">
          <button
            onClick={() => navigate(`/hr/leaves/leavesList/`)}
            className="cancel-button"
          >
            Back to List
          </button>
          <button
            onClick={() => navigate(`/hr/leaves/editLeave/${id}`)}
            className="edit-button"
               hidden={!canEdit}
          >
            Edit Leave
          </button>
        </div>
      </div>
    </>
  ) : null;
  return content;
};

export default LeaveDetails;
