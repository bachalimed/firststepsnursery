import { useParams } from "react-router-dom"; //because we will get the userId from the url
import { useSelector } from "react-redux";
import LoadingStateIcon from "../../../../Components/LoadingStateIcon";
import EmployeeDocumentsList from "./EmployeeDocumentsList";
import useAuth from "../../../../hooks/useAuth";
import { currentEmployeesList } from "../employeesSlice";
import HR from "../../HR";
import { useGetUserByIdQuery } from "../../../Admin/UsersManagement/usersApiSlice";
const EmployeeDocuments = () => {
  const { id } = useParams(); //pull the id from use params from the url
  //console.log(id,'in the parent before form')
  //will get hte employee from the state
  //const employeeToEdit = useSelector((state) => state.employee?.entities[id]);
  //)

  const {
    data: user, //the data is renamed employees
    isLoading: isUserLoading, //monitor several situations is loading...
    isSuccess: isUserSuccess,
    isError: isUserError,
    error: userError,
  } = useGetUserByIdQuery(
    {
      id: id,

      endpointName: "EmployeeDocuments",
    } || {},
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );
  //let employeeToEdit=[]

  const userToEdit = isUserSuccess
  ? (Object.values(user.entities))[0]
  : [];
 

//   if (isUserSuccess){
//     employeeToEdit= user.entities
//   }
  let content;

  content = userToEdit ? (
    <>
      <EmployeeDocumentsList user={userToEdit} />
    </>
  ) : (
    <>
      <HR />
      <LoadingStateIcon />
    </>
  );

  //}
  //if(isError){<h1>is error</h1>}
  return content;
};
export default EmployeeDocuments;
