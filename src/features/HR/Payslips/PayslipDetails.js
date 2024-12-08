import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { selectPayslipById } from "./payslipsApiSlice";
import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
  selectAllAcademicYears,
} from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import { useGetPayslipByIdQuery } from "./payslipsApiSlice";
import useFetchUserPhoto from "../../../hooks/useFetchUserPhoto";

import {useState, useEffect} from "react"
import HR from "../HR";

import useAuth from "../../../hooks/useAuth";

const PayslipDetails = () => {
  const { id } = useParams();


  const {canEdit}=useAuth()
  //const payslip = useSelector((state) => state.payslip?.entities[id]);
  const navigate = useNavigate();
  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  const academicYears = useSelector(selectAllAcademicYears);
  const {
    data: payslip, //the data is renamed payslips
    isLoading: isPayslipLoading, 
    isSuccess: isPayslipSuccess,
    isError: isPayslipError,
    error: payslipError,
  } = useGetPayslipByIdQuery(
    {
      id: id,
      endpointName: "PayslipDetails",
    } || {},
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );
  const [photoId, setPhotoId] = useState(null);
  console.log(payslip, "payslip");





  const { photoUrl } = useFetchUserPhoto(photoId);
  // const payslipToview = isPayslipSuccess ? payslip : [];
  let content;
  // console.log(payslipToview);
  content = 
   (  content = isPayslipSuccess 
     ) ? (
    <>
      <HR />
      <div className="max-w-4xl mx-auto mt-8 bg-white p-8 shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Payslip Details
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <p className="text-sm font-medium text-gray-700">Full Name</p>
            <p className="text-lg text-gray-900">
              {payslip?.userFullName?.userFirstName}{" "}
              {payslip?.userFullName?.userMiddleName}{" "}
              {payslip?.userFullName?.userLastName || ""}
            </p>
          </div>
          {photoUrl && (
            <div className="flex justify-center mb-6">
              <img
                src={photoUrl}
                alt="Payslip"
                className="w-32 h-32 object-cover rounded-full border border-gray-300"
              />
            </div>
          )}

          {/* Date of Birth */}
          <div>
            <p className="text-sm font-medium text-gray-700">Date of Birth</p>
            <p className="text-lg text-gray-900">
              {payslip?.userDob ? payslip.userDob.split("T")[0] : "N/A"}
            </p>
          </div>

          {/* Sex */}
          <div>
            <p className="text-sm font-medium text-gray-700">Sex</p>
            <p className="text-lg text-gray-900">
              {payslip?.userSex || "N/A"}
            </p>
          </div>

          {/* Address */}
          <div>
            <p className="text-sm font-medium text-gray-700">Address</p>
            <p className="text-lg text-gray-900">
              {payslip?.userAddress?.house} {payslip?.userAddress?.street}
            </p>
            <p className="text-lg text-gray-900">
              {payslip?.userAddress?.area}
            </p>
            <p className="text-lg text-gray-900">
              {payslip?.userAddress?.postCode}
            </p>
            <p className="text-lg text-gray-900">
              {payslip?.userAddress?.city}
            </p>
          </div>

          {/* Contact */}
          <div>
            <p className="text-sm font-medium text-gray-700">Contact</p>
            <p className="text-lg text-gray-900">
              {payslip?.userContact?.primaryPhone || "N/A"}
            </p>
            <p className="text-lg text-gray-900">
              {payslip?.userContact?.secondaryPhone || "N/A"}
            </p>
            <p className="text-lg text-gray-900">
              {payslip?.userContact?.email || "N/A"}
            </p>
          </div>

          {/* Roles */}
          <div>
            <p className="text-sm font-medium text-gray-700">Roles</p>
            <p className="text-lg text-gray-900">
              {payslip?.userRoles?.length > 0
                ? payslip.userRoles.join(", ")
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
                payslip?.userIsActive ? "text-green-600" : "text-red-600"
              }`}
            >
              {" "}
              {payslip?.userIsActive ? "Active" : "Inactive"}
            </span></div>
            <div>
            Payslip:
            <span
              className={`text-lg font-semibold ${
                payslip?.payslipId?.payslipIsActive
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {" "}
              {payslip?.payslipId?.payslipIsActive ? "Active" : "Inactive"}
            </span>
            </div>
          </div>

          {/* Academic Years */}
          <div>
            <p className="text-sm font-medium text-gray-700">Academic Years</p>
            <ul className="list-disc list-inside text-lg text-gray-900">
              {payslip?.payslipId?.payslipYears?.length > 0 ? (
                payslip.payslipId.payslipYears.map((year, idx) => (
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
              {payslip?.payslipId?.payslipCurrentEmployment?.position
                ? `${
                    payslip?.payslipId?.payslipCurrentEmployment?.position
                  }, Joined on: ${
                    payslip?.payslipId?.payslipCurrentEmployment?.joinDate.split(
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
              {payslip?.payslipId?.payslipWorkHistory?.length > 0 ? (
                payslip.payslipId.payslipWorkHistory.map(
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
            onClick={() => navigate(`/hr/payslips/payslipsList/`)}
            className="cancel-button"
          >
            Back to List
          </button>
          <button
            onClick={() => navigate(`/hr/payslips/editPayslip/${id}`)}
            className="edit-button"
               hidden={!canEdit}
          >
            Edit Payslip
          </button>
        </div>
      </div>
    </>
  ) : null;
  return content;
};

export default PayslipDetails;
