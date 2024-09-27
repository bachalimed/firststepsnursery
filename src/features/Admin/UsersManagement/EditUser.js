//a page that will prepare params for the edit form by passing the id of the user to be edited

import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUserById } from "./usersApiSlice"; //we will pull the user  data from the state and not use query
import EditUserForm from "./EditUserForm";

const EditUser = () => {
  //get the userId from the url
  const { id } = useParams();
  //get the user details from the state using a memoised selctor
  const user = useSelector((state) => selectUserById(state, id)); //selectUserById is a memoized selector created in the user API
  //call the edit user form and pass the user details
  const content = user ? <EditUserForm user={user} /> : <p>Loading...</p>;

  return content;
};
export default EditUser;
