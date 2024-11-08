import { useParams } from "react-router-dom"; //because we will get the userId from the url
import { useSelector } from "react-redux";
import {
  selectEmployeeById,
  useGetEmployeeByIdQuery,
} from "./employeesApiSlice"; //we will pull the user  data from the state and not use query
import EditEmployeeForm from "./EditEmployeeForm";
import useAuth from "../../../hooks/useAuth";
import { currentEmployeesList } from "./employeesSlice";
import Employees from "../Employees";
import LoadingStateIcons from "react-loading-icons";
const EditEmployee = () => {
  const { id } = useParams(); //pull the id from use params from the url

  //will get hte student from the state
  const employeeToEdit = useSelector((state) => state.employee?.entities[id]);
  //console.log('helllllow',employeeToEdit.userFullName.userFirstName, 'mystu', id)

  let content;

  content = employeeToEdit ? (
    <>
      
      <EditEmployeeForm employee={employeeToEdit} />
    </>
  ) : (
    <>
      <Employees />
      <LoadingStateIcons />
    </>
  );

  //}
  //if(isError){<h1>is error</h1>}
  return content;
};
export default EditEmployee;
