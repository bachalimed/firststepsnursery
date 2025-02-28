//a page that will prepare params for the edit form by passing the id of the user to be edited
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import EditUserForm from "./EditUserForm";
import LoadingStateIcon from "../../../Components/LoadingStateIcon";
import UsersManagement from "../UsersManagement";
import { useGetUserByIdQuery } from "./usersApiSlice";
const EditUser = () => {
  useEffect(()=>{document.title="Edit User"})

  //get the userId from the url
  const { id } = useParams();
  //console.log(id, 'idddddddd')
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
    criteria:"userDetails",
    endpointName: "EditUser",
  }, {
 
  //pollingInterval: 60000, //will refetch data every 60seconds
  refetchOnFocus: true, 
  refetchOnMountOrArgChange: true, //refetch when we remount the component
});

const user = isUserSuccess
? Object.values(userToEdit.entities)[0]
: [];
  //call the edit user form and pass the user details
  const content = userToEdit ? (
    <>
      
     
      <EditUserForm user={user} />
    </>
  ) : (
    <>
      <UsersManagement />
      <LoadingStateIcon />
    </>
  );

  return content;
};
export default EditUser;
