import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { selectEmployeeById } from "./employeesApiSlice";
import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
  selectAllAcademicYears,
} from "../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import { useGetEmployeeByIdQuery } from "./employeesApiSlice";
import useFetchUserPhoto from "../../../hooks/useFetchUserPhoto";
import { useGetEmployeeDocumentsByYearByIdQuery } from "../../AppSettings/HRSet/EmployeeDocumentsLists/employeeDocumentsListsApiSlice"
import {useState, useEffect} from "react"
import HR from "../HR";

import useAuth from "../../../hooks/useAuth";

const EmployeeDetails = () => {
  const { id } = useParams();


  const {canEdit}=useAuth()
  //const employee = useSelector((state) => state.employee?.entities[id]);
  const navigate = useNavigate();
  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object
  const academicYears = useSelector(selectAllAcademicYears);
  const {
    data: employee, //the data is renamed employees
    isLoading: isEmployeeLoading, 
    isSuccess: isEmployeeSuccess,
    isError: isEmployeeError,
    error: employeeError,
  } = useGetEmployeeByIdQuery(
    {
      id: id,
      endpointName: "EmployeeDetails",
    } || {},
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );
  const [photoId, setPhotoId] = useState(null);
  console.log(employee, "employee");

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
      //console.log(employeeDocumentsListing, "employeeDocumentsListing");
      const findEmployeePhotoId = (documents) => {
        const employeePhotoDocument = documents.find(
          (doc) => doc.documentTitle === "Employee Photo"/////////////////////////////////
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
  // const employeeToview = isEmployeeSuccess ? employee : [];
  let content;
  // console.log(employeeToview);
  content = 
   (  content = isEmployeeSuccess 
    || !listIsSuccess || !employeeDocumentsListing) ? (
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
            </span></div>
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
              {employee?.employeeId?.employeeIsActive ? "Active" : "Inactive"}
            </span>
            </div>
          </div>

          {/* Academic Years */}
          <div>
            <p className="text-sm font-medium text-gray-700">Academic Years</p>
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
