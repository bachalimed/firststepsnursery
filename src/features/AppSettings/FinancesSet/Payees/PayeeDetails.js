import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { selectPayeeById } from "./payeesApiSlice";
import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
  selectAllAcademicYears,
} from "../../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import { useGetPayeeByIdQuery } from "./payeesApiSlice";


import {useState, useEffect} from "react"
import FinancesSet from "../../FinancesSet";

import useAuth from "../../../../hooks/useAuth";

const PayeeDetails = () => {
  const { id } = useParams();


  const {canEdit}=useAuth()
  //const payee = useSelector((state) => state.payee?.entities[id]);
  const navigate = useNavigate();
  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  const academicYears = useSelector(selectAllAcademicYears);
  const {
    data: payee, //the data is renamed payees
    isLoading: isPayeeLoading, 
    isSuccess: isPayeeSuccess,
    isError: isPayeeError,
    error: payeeError,
  } = useGetPayeeByIdQuery(
    {
      id: id,
      endpointName: "PayeeDetails",
    } || {},
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );
  const [photoId, setPhotoId] = useState(null);
  console.log(payee, "payee");

 


  // const payeeToview = isPayeeSuccess ? payee : [];
  let content;
  // console.log(payeeToview);
  content = 
   (  content = isPayeeSuccess 
     ) ? (
    <>
      <FinancesSet />
      <div className="max-w-4xl mx-auto mt-8 bg-white p-8 shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Payee Details
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <p className="text-sm font-medium text-gray-700">Full Name</p>
            <p className="text-lg text-gray-900">
              {payee?.userFullName?.userFirstName}{" "}
              {payee?.userFullName?.userMiddleName}{" "}
              {payee?.userFullName?.userLastName || ""}
            </p>
          </div>
          

          {/* Date of Birth */}
          <div>
            <p className="text-sm font-medium text-gray-700">Date of Birth</p>
            <p className="text-lg text-gray-900">
              {payee?.userDob ? payee.userDob.split("T")[0] : "N/A"}
            </p>
          </div>

          {/* Sex */}
          <div>
            <p className="text-sm font-medium text-gray-700">Sex</p>
            <p className="text-lg text-gray-900">
              {payee?.userSex || "N/A"}
            </p>
          </div>

          {/* Address */}
          <div>
            <p className="text-sm font-medium text-gray-700">Address</p>
            <p className="text-lg text-gray-900">
              {payee?.userAddress?.house} {payee?.userAddress?.street}
            </p>
            <p className="text-lg text-gray-900">
              {payee?.userAddress?.area}
            </p>
            <p className="text-lg text-gray-900">
              {payee?.userAddress?.postCode}
            </p>
            <p className="text-lg text-gray-900">
              {payee?.userAddress?.city}
            </p>
          </div>

          {/* Contact */}
          <div>
            <p className="text-sm font-medium text-gray-700">Contact</p>
            <p className="text-lg text-gray-900">
              {payee?.userContact?.primaryPhone || "N/A"}
            </p>
            <p className="text-lg text-gray-900">
              {payee?.userContact?.secondaryPhone || "N/A"}
            </p>
            <p className="text-lg text-gray-900">
              {payee?.userContact?.email || "N/A"}
            </p>
          </div>

          {/* Roles */}
          <div>
            <p className="text-sm font-medium text-gray-700">Roles</p>
            <p className="text-lg text-gray-900">
              {payee?.userRoles?.length > 0
                ? payee.userRoles.join(", ")
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
                payee?.userIsActive ? "text-green-600" : "text-red-600"
              }`}
            >
              {" "}
              {payee?.userIsActive ? "Active" : "Inactive"}
            </span></div>
            <div>
            Payee:
            <span
              className={`text-lg font-semibold ${
                payee?.payeeId?.payeeIsActive
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {" "}
              {payee?.payeeId?.payeeIsActive ? "Active" : "Inactive"}
            </span>
            </div>
          </div>

          {/* Academic Years */}
          <div>
            <p className="text-sm font-medium text-gray-700">Academic Years</p>
            <ul className="list-disc list-inside text-lg text-gray-900">
              {payee?.payeeId?.payeeYears?.length > 0 ? (
                payee.payeeId.payeeYears.map((year, idx) => (
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
              {payee?.payeeId?.payeeCurrentEmployment?.position
                ? `${
                    payee?.payeeId?.payeeCurrentEmployment?.position
                  }, Joined on: ${
                    payee?.payeeId?.payeeCurrentEmployment?.joinDate.split(
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
              {payee?.payeeId?.payeeWorkHistory?.length > 0 ? (
                payee.payeeId.payeeWorkHistory.map(
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
            onClick={() => navigate(`/hr/payees/payeesList/`)}
            className="cancel-button"
          >
            Back to List
          </button>
          <button
            onClick={() => navigate(`/hr/payees/editPayee/${id}`)}
            className="edit-button"
               hidden={!canEdit}
          >
            Edit Payee
          </button>
        </div>
      </div>
    </>
  ) : null;
  return content;
};

export default PayeeDetails;
