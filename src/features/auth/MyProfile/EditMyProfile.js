//a page that will prepare params for the edit form by passing the id of the user to be edited

import { useParams } from "react-router-dom";
import { useEffect } from "react";
import EditUserForm from "./EditMyProfileForm";
// import LoadingStateIcon from "../../../Components/LoadingStateIcon";
// import MyProfile from "../MyProfile";
import { useGetUserByIdQuery } from "../../Admin/UsersManagement/usersApiSlice";
const EditMyProfile = () => {
  useEffect(()=>{document.title="Edit Profile"})

  //get the userId from the url
  const { id } = useParams();
  // console.log(id, "idddddddd");
  //get the user details from the state using a memoised selctor
  //const userToEdit = useSelector((state) => state.user?.entities[id]);
  //const user = useSelector((state) => selectUserById(state, id)); //selectUserById is a memoized selector created in the user API
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
      endpointName: "EditUser",
    },
    {
      //pollingInterval: 60000, //will refetch data every 60seconds
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true, //refetch when we remount the component
    }
  );
  let content;
  const user = isUserSuccess ? Object.values(userToEdit.entities)[0] : [];
  if (isUserSuccess) {
    content = (
      <>
        <EditUserForm user={user} />
      </>
    );
  }

  return content;
};
export default EditMyProfile;
