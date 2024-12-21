import { useParams, useNavigate } from "react-router-dom";
import { useGetLeaveByIdQuery } from "./leavesApiSlice";
import LoadingStateIcon from "../../../Components/LoadingStateIcon";
import useAuth from "../../../hooks/useAuth";
import HR from "../HR";

const LeaveDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { canEdit } = useAuth();
  const {
    data: leaveOrg,
    isLoading: isLeaveLoading,
    isSuccess: isLeaveSuccess,
    isError: leaveError,
  } = useGetLeaveByIdQuery(
    { id: id, endpointName: "leaveDetails" },
    {
      pollingInterval: 60000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  console.log(leaveOrg, "leaveOrg");
 
  let content;

  if (isLeaveLoading) {
    content = (
      <>
        <HR />
        <LoadingStateIcon />
      </>
    );
  }
  if (isLeaveSuccess && leaveOrg?.length === 1) {
    const leave = leaveOrg[0];
    content = (
      <>
        <HR />
        <div className="container mx-auto p-6 bg-white rounded-sm border border-gray-200">
          <h1 className="text-xl font-bold mb-4">Leave Details</h1>

          {/* Leave Information */}
          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Leave Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p>
                  <strong>Leave Year:</strong> {leave.leaveYear}
                </p>
                <p>
                  <strong>Leave Month:</strong> {leave.leaveMonth}
                </p>
                <p>
                  <strong>Start Date:</strong>{" "}
                  {new Date(leave.leaveStartDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p>
                  <strong>End Date:</strong>{" "}
                  {new Date(leave.leaveEndDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>Is Approved:</strong>{" "}
                  {leave.leaveIsApproved ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Is Paid Leave:</strong>{" "}
                  {leave.leaveIsPaidLeave ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </section>

          {/* Employee Information */}
          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Employee Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p>
                  <strong>Name:</strong>{" "}
                  {`${leave.leaveEmployeeName.userFirstName} ${
                    leave.leaveEmployeeName.userMiddleName || ""
                  } ${leave.leaveEmployeeName.userLastName}`.trim()}
                </p>
              </div>
            </div>
          </section>

          {/* Leave Type */}
          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Leave Type</h2>
            <div className="grid grid-cols-2 gap-4">
              <p>
                <strong>Is Sick Leave:</strong>{" "}
                {leave.leaveIsSickLeave ? "Yes" : "No"}
              </p>
              <p>
                <strong>Is Part-Day Leave:</strong>{" "}
                {leave.leaveIsPartDay ? "Yes" : "No"}
              </p>
            </div>
          </section>

          {/* Metadata */}
          <section>
            <div className="text-sm text-gray-500">
              <p>
                <strong>Operator:</strong> {leave.leaveOperator}
              </p>
              <p>
                <strong>Creator:</strong> {leave.leaveCreator}
              </p>
            </div>
          </section>
        </div>

        {/* Navigation Buttons */}
        <div className="cancelSavebuttonsDiv">
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
      </>
    );
  }

  return content;
};

export default LeaveDetails;
