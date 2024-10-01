import { useParams } from "react-router-dom"; //because we will get the userId from the url
import { useSelector } from "react-redux";
import { selectAdmissionById, useGetAdmissionByIdQuery } from "./admissionsApiSlice"; //we will pull the user  data from the state and not use query
import EditAdmissionForm from "./EditAdmissionForm";
import useAuth from "../../../hooks/useAuth";
import { currentAdmissionsList } from "./admissionsSlice";

const EditAdmission = () => {
  const { id } = useParams(); //pull the id from use params from the url

  //will get hte admission from the state
  const admissionToEdit = useSelector((state) => state.admission?.entities[id]);
  //console.log('helllllow',admissionToEdit, 'mystu')

  let content;

  content = admissionToEdit ? (
    <EditAdmissionForm admission={admissionToEdit} />
  ) : (
    <p>Loading...</p>
  );

  //}
  //if(isError){<h1>is error</h1>}
  return content;
};
export default EditAdmission;
