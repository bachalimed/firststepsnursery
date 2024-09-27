import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { selectEmployeeById } from './employeesApiSlice';

const EmployeeDetails = () => {
  const { id } = useParams();
  const employee = useSelector((state) => state.employee?.entities[id]);
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/hr/employees/");
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 bg-white p-8 shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Employee Details</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div>
          <p className="text-sm font-medium text-gray-700">Full Name</p>
          <p className="text-lg text-gray-900">
            {employee?.userFullName?.userFirstName} {employee?.userFullName?.userMiddleName} {employee?.userFullName?.userLastName || ""}
          </p>
        </div>

        {/* Date of Birth */}
        <div>
          <p className="text-sm font-medium text-gray-700">Date of Birth</p>
          <p className="text-lg text-gray-900">{employee?.userDob ? employee.userDob.split("T")[0] : "N/A"}</p>
        </div>

        {/* Sex */}
        <div>
          <p className="text-sm font-medium text-gray-700">Sex</p>
          <p className="text-lg text-gray-900">{employee?.userSex || "N/A"}</p>
        </div>

        {/* Address */}
        <div>
          <p className="text-sm font-medium text-gray-700">Address</p>
          <p className="text-lg text-gray-900">
            {employee?.userAddress?.house} {employee?.userAddress?.street}
          </p>
          <p className="text-lg text-gray-900">{employee?.userAddress?.area}</p>
          <p className="text-lg text-gray-900">{employee?.userAddress?.postCode}</p>
          <p className="text-lg text-gray-900">{employee?.userAddress?.city}</p>
        </div>

        {/* Contact */}
        <div>
          <p className="text-sm font-medium text-gray-700">Contact</p>
          <p className="text-lg text-gray-900">{employee?.userContact?.primaryPhone || "N/A"}</p>
          <p className="text-lg text-gray-900">{employee?.userContact?.secondaryPhone || "N/A"}</p>
          <p className="text-lg text-gray-900">{employee?.userContact?.email || "N/A"}</p>
        </div>

        {/* Roles */}
        <div>
          <p className="text-sm font-medium text-gray-700">Roles</p>
          <p className="text-lg text-gray-900">
            {employee?.userRoles?.length > 0 ? employee.userRoles.join(", ") : "N/A"}
          </p>
        </div>

        {/* Active Status */}
        <div>
          <p className="text-sm font-medium text-gray-700">Active Status</p>
          <p className={`text-lg font-semibold ${employee?.employeeIsActive ? "text-green-600" : "text-red-600"}`}>
            {employee?.employeeIsActive ? "Active" : "Inactive"}
          </p>
        </div>

        {/* Academic Years */}
        <div>
          <p className="text-sm font-medium text-gray-700">Academic Years</p>
          <ul className="list-disc list-inside text-lg text-gray-900">
            {employee?.employeeData?.employeeYears?.length > 0 ? (
              employee.employeeData.employeeYears.map((year, idx) => <li key={idx}>{year.academicYear}</li>)
            ) : (
              <li>N/A</li>
            )}
          </ul>
        </div>

        {/* Current Employment */}
        <div>
          <p className="text-sm font-medium text-gray-700">Current Employment</p>
          <p className="text-lg text-gray-900">
            {employee?.employeeData?.employeeCurrentEmployment?.position
              ? `${employee?.employeeData?.employeeCurrentEmployment?.position}, Joined on: ${employee?.employeeData?.employeeCurrentEmployment?.joinDate.split("T")[0]}`
              : "N/A"}
          </p>
        </div>

        {/* Work History */}
        <div>
          <p className="text-sm font-medium text-gray-700">Work History</p>
          <ul className="list-disc list-inside text-lg text-gray-900">
            {employee?.employeeData?.employeeWorkHistory?.length > 0 ? (
              employee.employeeData.employeeWorkHistory.map((history, idx) => (
                <li key={idx}>
                  {history.position} at {history.company} ({history.startDate} - {history.endDate || "Present"})
                </li>
              ))
            ) : (
              <li>N/A</li>
            )}
          </ul>
        </div>
      </div>

      <div className="flex justify-end items-center space-x-4 mt-6">
        <button 
        onClick={() => navigate(`/hr/employees/employeesList`)}
        className="px-4 py-2 bg-gray-500 text-white rounded">
            Back to List
          </button>
          <button
            onClick={() => navigate(`/hr/employees/editEmployee/${id}`)}
            className="px-4 py-2 bg-yellow-400 text-white rounded"
          >
            Edit Employee
          </button>
        
        </div>
    </div>
  );
};

export default EmployeeDetails;
