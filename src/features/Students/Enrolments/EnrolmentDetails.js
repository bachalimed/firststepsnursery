import { useParams, useNavigate } from "react-router-dom";
import { useGetEnrolmentByIdQuery } from "./enrolmentsApiSlice";
import LoadingStateIcon from "../../../Components/LoadingStateIcon";
import useAuth from "../../../hooks/useAuth";

import Students from "../Students";

const EnrolmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { canEdit } = useAuth();

  const {
    data: enrolmentOrg,
    isLoading: isEnrolmentLoading,
    isSuccess: isEnrolmentSuccess,
    isError: enrolmentError,
  } = useGetEnrolmentByIdQuery(
    { id: id, endpointName: "enrolmentDetails" },
    {
      pollingInterval: 60000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  const enrolmentToView = isEnrolmentSuccess
    ? Object.values(enrolmentOrg.entities)[0]
    : [];
  console.log(enrolmentToView, "enrolmentToView");
  let content;

  if (isEnrolmentLoading) {
    content = (
      <>
        <Students />
        <LoadingStateIcon />
      </>
    );
  }
  if (isEnrolmentSuccess && enrolmentToView?.length === 1) {
    const enrolment = enrolmentToView[0];
    content = (
      <>
        <Students />
        <div className="container mx-auto p-6 bg-white rounded-sm border border-gray-200">
          <h1 className="text-xl font-bold mb-4">Enrolment Details</h1>

          {/* Student Information */}
          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Student Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p>
                  <strong>Name:</strong>{" "}
                  {`${enrolment.student.studentName.firstName} ${
                    enrolment.student.studentName.middleName || ""
                  } ${enrolment.student.studentName.lastName}`.trim()}
                </p>
                <p>
                  <strong>Date of Birth:</strong>{" "}
                  {new Date(enrolment.student.studentDob).toLocaleDateString()}
                </p>
                <p>
                  <strong>Sex:</strong> {enrolment.student.studentSex}
                </p>
              </div>
              <div>
                <p>
                  <strong>Active Status:</strong>{" "}
                  {enrolment.student.studentIsActive ? "Active" : "Inactive"}
                </p>
                <p>
                  <strong>Grade (Year):</strong>{" "}
                  {enrolment.student.studentYears[0]?.grade || "N/A"} (
                  {enrolment.student.studentYears[0]?.academicYear || "N/A"})
                </p>
                <p>
                  <strong>Attended School:</strong>{" "}
                  {enrolment.student.studentEducation[0]?.attendedSchool ||
                    "N/A"}
                </p>
              </div>
            </div>
          </section>

          {/* Enrolment Information */}
          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-2">
              Enrolment Information
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p>
                  <strong>Enrolment Year:</strong> {enrolment.enrolmentYear}
                </p>
                <p>
                  <strong>Enrolment Month:</strong> {enrolment.enrolmentMonth}
                </p>
                <p>
                  <strong>Service Type:</strong> {enrolment.serviceType}
                </p>
              </div>
              <div>
                <p>
                  <strong>Service Period:</strong> {enrolment.servicePeriod}
                </p>
                <p>
                  <strong>Authorised Fee:</strong> $
                  {enrolment.serviceAuthorisedFee}
                </p>
                <p>
                  <strong>Final Fee:</strong> ${enrolment.serviceFinalFee}
                </p>
              </div>
            </div>
          </section>

          {/* Additional Details */}
          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Additional Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p>
                  <strong>Note:</strong> {enrolment.enrolmentNote || "None"}
                </p>
                <p>
                  <strong>Enrolment Invoice:</strong>{" "}
                  {enrolment.enrolmentInvoice || "N/A"}
                </p>
              </div>
              <div>
                <p>
                  <strong>Enrolment Created By:</strong>{" "}
                  {enrolment.enrolmentCreator}
                </p>
                <p>
                  <strong>Enrolment Updated By:</strong>{" "}
                  {enrolment.enrolmentOperator}
                </p>
              </div>
            </div>
          </section>

          {/* Metadata */}

          <div className="text-sm text-gray-500">
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(enrolment.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Updated At:</strong>{" "}
              {new Date(enrolment.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="cancelSavebuttonsDiv">
          <button
            onClick={() => navigate(`/students/enrolments/enrolments/`)}
            className="cancel-button"
          >
            Back to List
          </button>
          <button
            onClick={() => navigate(`/enrolments/editEnrolment/${id}`)}
            className="edit-button"
            hidden={!canEdit}
          >
            Edit Enrolment
          </button>
        </div>
      </>
    );
  }

  return content;
};

export default EnrolmentDetails;
