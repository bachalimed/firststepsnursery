import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { selectServiceById } from "./servicesApiSlice";

const ServiceDetails = () => {
  const { id } = useParams();
  const service = useSelector((state) => state.service?.entities[id]);
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/hr/services/");
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 bg-white p-8 shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Service Details
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div>
          <p className="text-sm font-medium text-gray-700">Full Name</p>
          <p className="text-lg text-gray-900">
            {service?.userFullName?.userFirstName}{" "}
            {service?.userFullName?.userMiddleName}{" "}
            {service?.userFullName?.userLastName || ""}
          </p>
        </div>

        {/* Date of Birth */}
        <div>
          <p className="text-sm font-medium text-gray-700">Date of Birth</p>
          <p className="text-lg text-gray-900">
            {service?.userDob ? service.userDob.split("T")[0] : "N/A"}
          </p>
        </div>

        {/* Sex */}
        <div>
          <p className="text-sm font-medium text-gray-700">Sex</p>
          <p className="text-lg text-gray-900">{service?.userSex || "N/A"}</p>
        </div>

        {/* Address */}
        <div>
          <p className="text-sm font-medium text-gray-700">Address</p>
          <p className="text-lg text-gray-900">
            {service?.userAddress?.house} {service?.userAddress?.street}
          </p>
          <p className="text-lg text-gray-900">{service?.userAddress?.area}</p>
          <p className="text-lg text-gray-900">
            {service?.userAddress?.postCode}
          </p>
          <p className="text-lg text-gray-900">{service?.userAddress?.city}</p>
        </div>

        {/* Contact */}
        <div>
          <p className="text-sm font-medium text-gray-700">Contact</p>
          <p className="text-lg text-gray-900">
            {service?.userContact?.primaryPhone || "N/A"}
          </p>
          <p className="text-lg text-gray-900">
            {service?.userContact?.secondaryPhone || "N/A"}
          </p>
          <p className="text-lg text-gray-900">
            {service?.userContact?.email || "N/A"}
          </p>
        </div>

        {/* Roles */}
        <div>
          <p className="text-sm font-medium text-gray-700">Roles</p>
          <p className="text-lg text-gray-900">
            {service?.userRoles?.length > 0
              ? service.userRoles.join(", ")
              : "N/A"}
          </p>
        </div>

        {/* Active Status */}
        <div>
          <p className="text-sm font-medium text-gray-700">Active Status</p>
          <p
            className={`text-lg font-semibold ${
              service?.serviceIsActive ? "text-green-600" : "text-red-600"
            }`}
          >
            {service?.serviceIsActive ? "Active" : "Inactive"}
          </p>
        </div>

        {/* Academic Years */}
        <div>
          <p className="text-sm font-medium text-gray-700">Academic Years</p>
          <ul className="list-disc list-inside text-lg text-gray-900">
            {service?.serviceData?.serviceYears?.length > 0 ? (
              service.serviceData.serviceYears.map((year, idx) => (
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
            {service?.serviceData?.serviceCurrentEmployment?.position
              ? `${
                  service?.serviceData?.serviceCurrentEmployment?.position
                }, Joined on: ${
                  service?.serviceData?.serviceCurrentEmployment?.joinDate.split(
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
            {service?.serviceData?.serviceWorkHistory?.length > 0 ? (
              service.serviceData.serviceWorkHistory.map((history, idx) => (
                <li key={idx}>
                  {history.position} at {history.company} ({history.startDate} -{" "}
                  {history.endDate || "Present"})
                </li>
              ))
            ) : (
              <li>N/A</li>
            )}
          </ul>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          onClick={() => navigate(`/hr/services/services/`)}
         className="cancel-button"
        >
          Back to List
        </button>
        <button
          onClick={() => navigate(`/hr/services/editService/${id}`)}
          className="edit-button"
          hidden={!canEdit}
        >
          Edit Service
        </button>
      </div>
    </div>
  );
};

export default ServiceDetails;
