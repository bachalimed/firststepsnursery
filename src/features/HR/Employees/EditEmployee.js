import { useParams } from "react-router-dom"; //because we will get the userId from the url
import { useGetEmployeeByIdQuery } from "./employeesApiSlice"; //we will pull the user  data from the state and not use query
import EditEmployeeForm from "./EditEmployeeForm";
import LoadingStateIcon from "react-loading-icons";
import {useEffect} from "react";
const EditEmployee = () => {
  useEffect(() => {
    document.title = "Edit Employee";
  });
  const { id } = useParams(); //pull the id from use params from the url
  //will get hte student from the state
  //const employeeToEdit = useSelector((state) => state.employee?.entities[id]);
  // console.log("helllllow employeeToEdit", "mystu", id);
  // console.log(id, "id");
  const {
    data: employee, //the data is renamed employees
    // isLoading: isEmployeeLoading,
    isSuccess: isEmployeeSuccess,
    // isError: isEmployeeError,
    // error: employeeError,
  } = useGetEmployeeByIdQuery(
    {
      id: id,
      endpointName: "EditEmployee",
    } || {},
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  let employeeToEdit;
  if (isEmployeeSuccess) {
    // console.log(employee, "employe");
    employeeToEdit = employee;
  }
 
  // console.log(employeeToEdit, "employeToedit");

  let content;
  if (isEmployeeSuccess) {
    content = (
      <>
        <EditEmployeeForm employee={employeeToEdit} />
      </>
    );
  }
  // else {
  //   content =
  //     <>
  //       <HR />
  //       <LoadingStateIcon />
  //     </>

  // }

  //}
  //if(isError){<h1>is error</h1>}
  return content;
};
export default EditEmployee;
