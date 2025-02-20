import { useParams } from "react-router-dom"; //because we will get the userId from the url
import {
  useGetAdmissionByIdQuery,
} from "./admissionsApiSlice"; //we will pull the user  data from the state and not use query
import EditAdmissionForm from "./EditAdmissionForm";
import LoadingStateIcon from "../../../Components/LoadingStateIcon";
import Students from'../Students'
import { useEffect } from "react";

const EditAdmission = () => {
  useEffect(() => {
    document.title = "Edit Admission";
  });
  const { id } = useParams(); //pull the id from use params from the url
  // console.log(id, "idddddddd");
  const {
    data: admToEdit, //the data is renamed families
    // isLoading: isAdmissionLoading, //monitor several situations
    isSuccess: isAdmissionSuccess,
    // isError: isAdmissionError,
    // error: admissionError,
  } = useGetAdmissionByIdQuery(
    { id: id, endpointName: "EditAdmission" },
    {
    
      refetchOnFocus: true, 
      refetchOnMountOrArgChange: true, 
    }
  );

  let content;
  const admissionToEdit = isAdmissionSuccess
    ? Object.values(admToEdit.entities)
    : [];

  if (admissionToEdit?.length === 1) {
    const admission = admissionToEdit[0][0];
    //console.log(admissionToEdit,'admissionToEdit first')
    //console.log(admission,'admission first')
    content = (
      <>
       
        <EditAdmissionForm admission={admission} />
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
export default EditAdmission;
