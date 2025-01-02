import { useParams } from "react-router-dom"; //because we will get the userId from the url
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import {
  selectAnimatorsAssignmentById,
  useGetAnimatorsAssignmentByIdQuery,
} from "./animatorsAssignmentsApiSlice"; //we will pull the user  data from the state and not use query
import EditAnimatorsAssignmentForm from "./EditAnimatorsAssignmentForm";
import useAuth from "../../../../hooks/useAuth";
import LoadingStateIcon from "../../../../Components/LoadingStateIcon";
//import { currentAnimatorsAssignmentsList } from "./animatorsAssignmentsSlice";
import Academics from "../../Academics";
const EditAnimatorsAssignment = () => {
  const { id } = useParams(); //pull the id from use params from the url
  //console.log(id,'id')
 
  const {
    data: assignmentToEdit, //the data is renamed families
    // isLoading: isAssignmentLoading, //monitor several situations
    // isSuccess: isAssignmentSuccess,
    // isError: isAssignmentError,
    // error: assignmentError,
  } = useGetAnimatorsAssignmentByIdQuery({ id: id, endpointName: "EditAnimatorsAssignment" } || {}, {
    // "dry" will not ppoulate children fully
    
    //pollingInterval: 60000,
    refetchOnFocus: true, 
    refetchOnMountOrArgChange: true, 
  });
 
  let content;

  content = assignmentToEdit ? (
    <>
     
      <EditAnimatorsAssignmentForm animatorsAssignment={assignmentToEdit} />
    </>
  ) : (
    <>
      <Academics />
      <LoadingStateIcon />
    </>
  );

  //}
  //if(isError){<h1>is error</h1>}
  return content;
};
export default EditAnimatorsAssignment;
