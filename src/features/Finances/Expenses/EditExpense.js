import { useParams } from "react-router-dom"; //because we will get the userId from the url
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import {
  selectExpenseById,
  useGetExpenseByIdQuery,
} from "./expensesApiSlice"; //we will pull the user  data from the state and not use query
import EditExpenseForm from "./EditExpenseForm";
import useAuth from "../../../hooks/useAuth";
import LoadingStateIcons from "../../../Components/LoadingStateIcon";
//import { currentExpensesList } from "./expensesSlice";
import Expenses from "../Expenses";
const EditExpense = () => {
  const { id } = useParams(); //pull the id from use params from the url
  //console.log(id,'id')
  const [assignment, setAssignment] = useState("");
  const {
    data: assignmentToEdit, //the data is renamed families
    isLoading: isAssignmentLoading, //monitor several situations
    isSuccess: isAssignmentSuccess,
    isError: isAssignmentError,
    error: assignmentError,
  } = useGetExpenseByIdQuery({ id: id, endpointName: "EditExpense" } || {}, {
    // "dry" will not ppoulate children fully
    //this inside the brackets is using the listeners in store.js to update the data we use on multiple access devices
    //pollingInterval: 60000,//will refetch data every 60seconds
    refetchOnFocus: true, //when we focus on another window then come back to the window ti will refetch data
    refetchOnMountOrArgChange: true, //refetch when we remount the component
  });
  console.log('hiiiiiiiiiiii')
  // useEffect(() => {
  //   if (isAssignmentSuccess) {
       console.log('helllllow',assignmentToEdit, 'mystu')
  //     //const assignmentInit = Object.values(assignmentToEdit.entities)
  //     // setAssignment(assignmentToEdit); // Set assignment state to the first object
  //     //console.log('helllllow',assignment, 'mystu')
  //   }
  // // }, [isAssignmentSuccess, assignmentToEdit]);
  // let assignmentTE = isAssignmentSuccess
  // ? Object.values(assignmentToEdit.entities)
  // : null;
  let content;

  content = assignmentToEdit ? (
    <>
     
      <EditExpenseForm expense={assignmentToEdit} />
    </>
  ) : (
    <>
      <Expenses />
      <LoadingStateIcons />
    </>
  );

  //}
  //if(isError){<h1>is error</h1>}
  return content;
};
export default EditExpense;
