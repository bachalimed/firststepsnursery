//a page that will prepare params for the edit form by passing the id of the user to be edited

import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUserById } from "./usersApiSlice"; //we will pull the user  data from the state and not use query
import EditUserForm from "./EditUserForm";
import LoadingStateIcon from "../../../Components/LoadingStateIcon";
import UsersManagement from "../UsersManagement";

const EditUser = () => {
  //get the userId from the url
  const { id } = useParams();
  //console.log(id, 'idddddddd')
  //get the user details from the state using a memoised selctor
  const userToEdit = useSelector((state) => state.user?.entities[id]);
  //const user = useSelector((state) => selectUserById(state, id)); //selectUserById is a memoized selector created in the user API
  //console.log(userToEdit, 'userrrrrr')
  //call the edit user form and pass the user details
  const content = userToEdit ? (
    <>
      
     
      <EditUserForm user={userToEdit} />
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
