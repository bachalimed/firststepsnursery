import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
  selectAllAcademicYears,
} from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import { useGetEmployeeByIdQuery } from "./employeesApiSlice";
import useFetchUserPhoto from "../../../hooks/useFetchUserPhoto";
import { useGetEmployeeDocumentsByYearByIdQuery } from "../../AppSettings/HRSet/EmployeeDocumentsLists/employeeDocumentsListsApiSlice";
import { useState, useEffect } from "react";
import HR from "../HR";
import useAuth from "../../../hooks/useAuth";

const EmployeeDetails = () => {
  useEffect(() => {
    document.title = "Employee Details";
  });

  const { id } = useParams();
  const { canEdit } = useAuth();
  const navigate = useNavigate();

  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId);
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  );
  const academicYears = useSelector(selectAllAcademicYears);

  const { data: employee, isSuccess: isEmployeeSuccess } =
    useGetEmployeeByIdQuery(
      { id, endpointName: "EmployeeDetails" },
      { refetchOnFocus: true, refetchOnMountOrArgChange: true }
    );

  const [photoId, setPhotoId] = useState(null);

  const {
    data: employeeDocumentsListing,
    isLoading: listIsLoading,
    isSuccess: listIsSuccess,
  } = useGetEmployeeDocumentsByYearByIdQuery(
    {
      userId: id,
      year: selectedAcademicYear?.title,
      endpointName: "EmployeeDetails",
    },
    {
      pollingInterval: 60000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  useEffect(() => {
    if (!listIsLoading && employeeDocumentsListing) {
      const findEmployeePhotoId = (documents) => {
        const employeePhotoDocument = documents.find(
          (doc) => doc.documentTitle === "Employee Photo"
        );
        return employeePhotoDocument
          ? employeePhotoDocument.employeeDocumentId
          : null;
      };

      const photoId = findEmployeePhotoId(employeeDocumentsListing);
      setPhotoId(photoId);
    }
  }, [listIsSuccess, employeeDocumentsListing]);

  const { photoUrl } = useFetchUserPhoto(photoId);

  const content =
    isEmployeeSuccess || !listIsSuccess || !employeeDocumentsListing ? (
      <>
        <HR />
        <div className="max-w-4xl mx-auto mt-8 bg-white p-8 shadow-lg rounded-lg">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">
            Employee Details
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <p className="text-sm font-medium text-gray-700">Full Name</p>
              <p className="text-lg text-gray-900">
                {employee?.userFullName?.userFirstName}{" "}
                {employee?.userFullName?.userMiddleName}{" "}
                {employee?.userFullName?.userLastName || ""}
              </p>
            </div>
            {photoUrl && (
              <div className="flex justify-center mb-6">
                <img
                  src={photoUrl}
                  alt="Employee"
                  className="w-32 h-32 object-cover rounded-full border border-gray-300"
                />
              </div>
            )}

            {/* Date of Birth */}
            <div>
              <p className="text-sm font-medium text-gray-700">Date of Birth</p>
              <p className="text-lg text-gray-900">
                {employee?.userDob ? employee.userDob.split("T")[0] : "N/A"}
              </p>
            </div>

            {/* Sex */}
            <div>
              <p className="text-sm font-medium text-gray-700">Sex</p>
              <p className="text-lg text-gray-900">
                {employee?.userSex || "N/A"}
              </p>
            </div>

            {/* Address */}
            <div>
              <p className="text-sm font-medium text-gray-700">Address</p>
              <p className="text-lg text-gray-900">
                {employee?.userAddress?.house} {employee?.userAddress?.street}
              </p>
              <p className="text-lg text-gray-900">
                {employee?.userAddress?.area}
              </p>
              <p className="text-lg text-gray-900">
                {employee?.userAddress?.postCode}
              </p>
              <p className="text-lg text-gray-900">
                {employee?.userAddress?.city}
              </p>
            </div>

            {/* Contact */}
            <div>
              <p className="text-sm font-medium text-gray-700">Contact</p>
              <p className="text-lg text-gray-900">
                {employee?.userContact?.primaryPhone || "N/A"}
              </p>
              <p className="text-lg text-gray-900">
                {employee?.userContact?.secondaryPhone || "N/A"}
              </p>
              <p className="text-lg text-gray-900">
                {employee?.userContact?.email || "N/A"}
              </p>
            </div>

            {/* Roles */}
            <div>
              <p className="text-sm font-medium text-gray-700">Roles</p>
              <p className="text-lg text-gray-900">
                {employee?.userRoles?.length > 0
                  ? employee.userRoles.join(", ")
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
                    employee?.userIsActive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {" "}
                  {employee?.userIsActive ? "Active" : "Inactive"}
                </span>
              </div>
              <div>
                Employee:
                <span
                  className={`text-lg font-semibold ${
                    employee?.employeeId?.employeeIsActive
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {" "}
                  {employee?.employeeId?.employeeIsActive
                    ? "Active"
                    : "Inactive"}
                </span>
              </div>
            </div>

            {/* Academic Years */}
            <div>
              <p className="text-sm font-medium text-gray-700">
                Academic Years
              </p>
              <ul className="list-disc list-inside text-lg text-gray-900">
                {employee?.employeeId?.employeeYears?.length > 0 ? (
                  employee.employeeId.employeeYears.map((year, idx) => (
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
                {employee?.employeeId?.employeeCurrentEmployment?.position
                  ? `${
                      employee?.employeeId?.employeeCurrentEmployment?.position
                    }, Joined on: ${
                      employee?.employeeId?.employeeCurrentEmployment?.joinDate.split(
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
                {employee?.employeeId?.employeeWorkHistory?.length > 0 ? (
                  employee.employeeId.employeeWorkHistory.map(
                    (history, idx) => (
                      <li key={idx}>
                        {history.position} at {history.institution} (
                        {history.fromDate} - {history.toDate || "Present"})
                      </li>
                    )
                  )
                ) : (
                  <li>N/A</li>
                )}
              </ul>
            </div>

            {/* Salary Packages */}
            <div>
              <p className="text-sm font-medium text-gray-700">
                Salary Packages
              </p>
              {employee?.employeeId?.salaryPackage?.length > 0 ? (
                employee.employeeId.salaryPackage.map((pkg, idx) => (
                  <div
                    key={idx}
                    className="border p-4 rounded-md mb-4 bg-gray-50"
                  >
                    <h4 className="text-lg font-semibold text-gray-800">
                      Package {idx + 1}
                    </h4>
                    <p className="text-sm text-gray-600">
                      From: {pkg.salaryFrom.split("T")[0]}
                    </p>
                    <p className="text-sm text-gray-600">
                      To: {pkg.salaryTo?.split("T")[0] || "Present"}
                    </p>
                    <p className="text-sm text-gray-600">
                      Basic Salary: {pkg.basicSalary}
                    </p>
                    <h5 className="text-md font-medium text-gray-700 mt-2">
                      Allowances:
                    </h5>
                    <ul className="list-disc list-inside text-sm text-gray-700">
                      {pkg.allowances.map((allowance, allowanceIdx) => (
                        <li key={allowanceIdx}>
                          {allowance.allowanceLabel}:{" "}
                          {allowance.allowanceUnitValue} (
                          {allowance.allowancePeriodicity})
                        </li>
                      ))}
                    </ul>
                    <h5 className="text-md font-medium text-gray-700 mt-2">
                      Deduction:
                    </h5>
                    <ul className="list-disc list-inside text-sm text-gray-700">
                      <li key="">
                        {pkg?.deduction?.deductionLabel}:{" "}
                        {pkg?.deduction?.deductionAmount}
                      </li>
                    </ul>
                  </div>
                ))
              ) : (
                <p className="text-lg text-gray-900">
                  No Salary Packages Available
                </p>
              )}
            </div>
          </div>

          <div className="cancelSavebuttonsDiv mt-6">
            <button
              onClick={() => navigate(`/hr/employees/employeesList/`)}
              className="cancel-button"
            >
              Back to List
            </button>
            <button
              onClick={() => navigate(`/hr/employees/editEmployee/${id}`)}
              className="edit-button"
              hidden={!canEdit}
            >
              Edit Employee
            </button>
          </div>
        </div>
      </>
    ) : null;

  return content;
};

export default EmployeeDetails;
