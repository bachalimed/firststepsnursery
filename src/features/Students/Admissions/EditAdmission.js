import { useParams } from "react-router-dom"; //because we will get the userId from the url
import { useSelector } from "react-redux";
import {
  selectAdmissionById,
  useGetAdmissionByIdQuery,
} from "./admissionsApiSlice"; //we will pull the user  data from the state and not use query
import EditAdmissionForm from "./EditAdmissionForm";
import useAuth from "../../../hooks/useAuth";
import { currentAdmissionsList } from "./admissionsSlice";
import LoadingStateIcon from "../../../Components/LoadingStateIcon";
import { GiConsoleController } from "react-icons/gi";
import Admissions from'../Admissions'
const EditAdmission = () => {
  const { id } = useParams(); //pull the id from use params from the url
  console.log(id, "idddddddd");
  const {
    data: admToEdit, //the data is renamed families
    isLoading: isAdmissionLoading, //monitor several situations
    isSuccess: isAdmissionSuccess,
    isError: isAdmissionError,
    error: admissionError,
  } = useGetAdmissionByIdQuery(
    { id: id, endpointName: "editAdmission" }, ////in the backend we populate studetn to get his name
    {
      // "dry" will not ppoulate children fully
      //this inside the brackets is using the listeners in store.js to update the data we use on multiple access devices
      //pollingInterval: 60000,//will refetch data every 60seconds
      refetchOnFocus: true, //when we focus on another window then come back to the window ti will refetch data
      refetchOnMountOrArgChange: true, //refetch when we remount the component
    }
  );

  let content;
  const admissionToEdit = isAdmissionSuccess
    ? Object.values(admToEdit.entities)
    : [];

  if (admissionToEdit.length === 1) {
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
        <Admissions />
        <LoadingStateIcon />
      </>
    );
  }

  //}
  //if(isError){<h1>is error</h1>}
  return content;
};
export default EditAdmission;
