import { useParams, useNavigate } from "react-router-dom";
import { useGetUserByIdQuery } from "../../Admin/UsersManagement/usersApiSlice";
import useAuth from "../../../hooks/useAuth";
import MyProfile from "../MyProfile";

const MyDetails = () => {
  const { id } = useParams();
  //const user = useSelector((state) => state.user?.entities[id]);

  const navigate = useNavigate();
  const { isAdmin, canEdit } = useAuth();

  //import users using RTK query
  const {
    data: userToEdit, //deconstructing data into users
    // isLoading: isUserLoading,
    isSuccess: isUserSuccess,
    // isError: isUserError,
    // error: userError,
  } = useGetUserByIdQuery(
    {
      id: id,
      criteria: "userDetails",
      endpointName: "UserDetails",
    },
    {
      //pollingInterval: 60000, //will refetch data every 60seconds
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true, //refetch when we remount the component
    }
  );

  const user = isUserSuccess ? Object.values(userToEdit.entities)[0] : [];

  console.log(user, "user");

  return (
    <>
      {" "}
      <MyProfile />
      <div className="max-w-4xl mx-auto mt-8 bg-white p-8 shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">User Details</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <p className="text-sm font-medium text-gray-700">Full Name</p>
            <p className="text-lg text-gray-900">
              {user?.userFullName?.userFirstName}{" "}
              {user?.userFullName?.userMiddleName}{" "}
              {user?.userFullName?.userLastName || ""}
            </p>
          </div>

          {/* Date of Birth */}
          <div>
            <p className="text-sm font-medium text-gray-700">Date of Birth</p>
            <p className="text-lg text-gray-900">
              {user?.userDob
                ? new Date(user.userDob).toLocaleDateString("en-GB")
                : "N/A"}
            </p>
          </div>

          {/* Sex */}
          <div>
            <p className="text-sm font-medium text-gray-700">Sex</p>
            <p className="text-lg text-gray-900">{user?.userSex || "N/A"}</p>
          </div>

          {/* Address */}
          <div>
            <p className="text-sm font-medium text-gray-700">Address</p>
            <p className="text-lg text-gray-900">
              {user?.userAddress?.house} {user?.userAddress?.street}
            </p>
            <p className="text-lg text-gray-900">{user?.userAddress?.area}</p>
            <p className="text-lg text-gray-900">
              {user?.userAddress?.postCode}
            </p>
            <p className="text-lg text-gray-900">{user?.userAddress?.city}</p>
          </div>

          {/* Contact */}
          <div>
            <p className="text-sm font-medium text-gray-700">Contact</p>
            <p className="text-lg text-gray-900">
              {user?.userContact?.primaryPhone || "N/A"}
            </p>
            <p className="text-lg text-gray-900">
              {user?.userContact?.secondaryPhone || "N/A"}
            </p>
            <p className="text-lg text-gray-900">
              {user?.userContact?.email || "N/A"}
            </p>
          </div>

          {/* Roles */}
          {/* <div>
          <p className="text-sm font-medium text-gray-700">Roles</p>
          <p className="text-lg text-gray-900">
            {user?.userRoles?.length > 0 ? user.userRoles.join(", ") : "N/A"}
          </p>
        </div> */}
          {/* Actionis */}
          {/* <div>
          <p className="text-sm font-medium text-gray-700">Allowed Actions</p>
          <p className="text-lg text-gray-900">
            {user?.userAllowedActions?.length > 0 ? user.userAllowedActions.join(", ") : "N/A"}
          </p>
        </div> */}

          {/* Active Status */}
          <div>
            <p className="text-sm font-medium text-gray-700">Active Status</p>
            <p
              className={`text-lg font-semibold ${
                user?.userIsActive ? "text-green-800" : "text-red-600"
              }`}
            >
              {user?.userIsActive ? "Active" : "Inactive"}
            </p>
          </div>
        </div>

        <div className="cancelSavebuttonsDiv mt-6">
          <button
            aria-label="dashboard page"
            onClick={() => navigate("/dashboard/")}
            className="cancel-button"
          >
            Dashboard
          </button>
          {isAdmin && (
            <button
              aria-label="edit profile"
              onClick={() => navigate(`/MyProfile/editMyProfile/${id}/`)}
              className="edit-button"
              hidden={!canEdit}
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default MyDetails;
