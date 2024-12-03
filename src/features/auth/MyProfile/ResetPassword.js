//a page that will prepare params for the edit form by passing the id of the user to be edited

import { useParams } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";

import ResetPasswordForm from "./ResetPasswordForm";
import LoadingStateIcon from "../../../Components/LoadingStateIcon";
import MyProfile from "../MyProfile";
import { useGetUserByIdQuery } from "../../Admin/UsersManagement/usersApiSlice"
const ResetPassword = () => {
  //get the userId from the url
  const {userId} = useAuth()
  console.log(userId, 'idddddddd')
  //get the user details from the state using a memoised selctor
  //const userToEdit = useSelector((state) => state.user?.entities[id]);
  //const user = useSelector((state) => selectUserById(state, id)); //selectUserById is a memoized selector created in the user API
  //import users using RTK query
 const {
  data: userToEdit, //deconstructing data into users
  isLoading: isUserLoading,
  isSuccess: isUserSuccess,
  isError: isUserError,
  error: userError,
} = useGetUserByIdQuery(
  {
    id: userId,
    criteria:"userDetails",
    endpointName: "ResetPassword",
  }, {
 
  //pollingInterval: 60000, //will refetch data every 60seconds
  refetchOnFocus: true, 
  refetchOnMountOrArgChange: true, //refetch when we remount the component
});
const user = isUserSuccess
? Object.values(userToEdit.entities)[0]
: [];
//console.log(user,'user')
  //call the edit user form and pass the user details
  const content = userToEdit ? (
    <>
      
     
      <ResetPasswordForm user={user} />
    </>
  ) : (
    <>
      <MyProfile />
      <LoadingStateIcon />
    </>
  );

  return content;
};
export default ResetPassword;
