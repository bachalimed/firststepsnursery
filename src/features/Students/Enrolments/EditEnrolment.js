import { useParams } from "react-router-dom"; //because we will get the userId from the url
import {
  useGetEnrolmentByIdQuery,
} from "./enrolmentsApiSlice"; //we will pull the user  data from the state and not use query
import EditEnrolmentForm from "./EditEnrolmentForm";
import LoadingStateIcon from "../../../Components/LoadingStateIcon";
import Students from '../Students'
import { useEffect } from "react";

const EditEnrolment = () => {
  useEffect(() => {
    document.title = "Edit Enrolment";
  });
  const { id } = useParams(); //pull the id from use params from the url
  // console.log(id, "idddddddd");
  const {
    data: admToEdit, //the data is renamed families
    // isLoading: isEnrolmentLoading, //monitor several situations
    isSuccess: isEnrolmentSuccess,
    // isError: isEnrolmentError,
    // error: enrolmentError,
  } = useGetEnrolmentByIdQuery(
    { id: id, endpointName: "EditEnrolment" }, 
    {
      
      refetchOnFocus: true, 
      refetchOnMountOrArgChange: true,
    }
  );

  
  let content;
  const enrolmentToEdit = isEnrolmentSuccess
    ? Object.values(admToEdit.entities)
    : [];

  if (enrolmentToEdit.length === 1) {
    const enrolment = enrolmentToEdit[0][0];
    //console.log(enrolmentToEdit,'enrolmentToEdit first')
    //console.log(enrolment,'enrolment first')
    content = (
      <>
      
        <EditEnrolmentForm enrolment={enrolment} />
      </>
    );
  } else {
    content = (
      <>
        <Students />
        <LoadingStateIcon />
      </>
    );
  }

  //}
  //if(isError){<h1>is error</h1>}
  return content;
};
export default EditEnrolment;
