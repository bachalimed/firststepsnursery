import { useParams, useNavigate } from "react-router-dom";
import { useGetAdmissionByIdQuery } from "./admissionsApiSlice";
import LoadingStateIcon from "../../../Components/LoadingStateIcon";
import useAuth from "../../../hooks/useAuth";
import Students from "../Students";

const AdmissionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { canEdit } = useAuth();
  const {
    data: admissionOrg,
    isLoading: isAdmissionLoading,
    isSuccess: isAdmissionSuccess,
    isError: admissionError,
  } = useGetAdmissionByIdQuery(
    { id: id, endpointName: "admissionDetails" },
    {
      pollingInterval: 60000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  const admissionToView = isAdmissionSuccess
    ? Object.values(admissionOrg.entities)[0]
    : [];
  // console.log(admissionToView, "admissionToView");
  let content;

  if (isAdmissionLoading) {
    content = (
      <>
        <Students />
        <LoadingStateIcon />
      </>
    );
  }
  if (isAdmissionSuccess && admissionToView?.length === 1) {
    const admission = admissionToView[0];
    content = (
      <>
        <Students />
        <div className="container mx-auto p-6 bg-white rounded-sm border border-gray-200">
          {/* Admission Header */}
          <h1 className="text-2xl font-bold mb-4">Admission Details</h1>
          {/* Student Details */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Student Information</h2>
            <p>
              <strong>Name:</strong>{" "}
              {`${admission?.student?.studentName?.firstName} ${admission?.student?.studentName?.middleName} ${admission?.student?.studentName?.lastName}`}
            </p>
            <p>
              <strong>ID:</strong> {admission?.student?._id}
            </p>
          </div>
          {/* Admission Information */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Admission Information</h2>
            <p>
              <strong>Admission Year:</strong> {admission?.admissionYear}
            </p>
            <p>
              <strong>Admission Date:</strong>{" "}
              {new Date(admission?.admissionDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Creator:</strong> {admission?.admissionCreator}
            </p>
            <p>
              <strong>Operator:</strong> {admission?.admissionOperator}
            </p>
          </div>
          {/* Agreed Services */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Agreed Services</h2>
            <ul className="space-y-4">
              {admission?.agreedServices.map((service, index) => (
                <li
                  key={index}
                  className="p-4 border border-gray-300 rounded bg-gray-50"
                >
                  <p>
                    <strong>Service Type:</strong>{" "}
                    {service?.service?.serviceType}
                  </p>
                  <p>
                    <strong>Fee Value:</strong> ${service?.feeValue}
                  </p>
                  <p>
                    <strong>Fee start date:</strong>{" "}
                    {new Date(service?.feeStartDate).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Fee Period:</strong> {service?.feePeriod}
                  </p>
                  <p>
                    <strong>Fee Months:</strong> {service?.feeMonths.join(", ")}
                  </p>
                  <p>
                    <strong>Flagged:</strong>{" "}
                    {service?.isFlagged ? "Yes" : "No"}
                  </p>
                  <p>
                    <strong>Authorized:</strong>{" "}
                    {service?.isAuthorised ? "Yes" : "No"}
                  </p>
                  {service?.comment && (
                    <p>
                      <strong>Comment:</strong> {service?.comment}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
          {/* Metadata */}
          <div className="text-sm text-gray-500">
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(admission?.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Updated At:</strong>{" "}
              {new Date(admission?.updatedAt).toLocaleString()}
            </p>
          </div>
          {/* Action Buttons */}
          <div className="cancelSavebuttonsDiv">
            <button
              onClick={() => navigate(`/students/admissions/admissions/`)}
              className="cancel-button"
            >
              Back to List
            </button>
            <button
              onClick={() =>
                navigate(`/students/admissions/editAdmission/${id}`)
              }
              className="edit-button"
              hidden={!canEdit}
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
