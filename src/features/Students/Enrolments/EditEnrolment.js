import { useParams } from "react-router-dom"; //because we will get the userId from the url
import { useSelector } from "react-redux";
import {
  selectEnrolmentById,
  useGetEnrolmentByIdQuery,
} from "./enrolmentsApiSlice"; //we will pull the user  data from the state and not use query
import EditEnrolmentForm from "./EditEnrolmentForm";
import useAuth from "../../../hooks/useAuth";
import { currentEnrolmentsList } from "./enrolmentsSlice";
import LoadingStateIcon from "../../../Components/LoadingStateIcon";
import { GiConsoleController } from "react-icons/gi";
import Enrolments from '../Enrolments'
const EditEnrolment = () => {
  const { id } = useParams(); //pull the id from use params from the url
  console.log(id, "idddddddd");
  const {
    data: admToEdit, //the data is renamed families
    isLoading: isEnrolmentLoading, //monitor several situations
    isSuccess: isEnrolmentSuccess,
    isError: isEnrolmentError,
    error: enrolmentError,
  } = useGetEnrolmentByIdQuery(
    { id: id, endpointName: "editEnrolment" }, ////in the backend we populate studetn to get his name
    {
      // "dry" will not ppoulate children fully
      //this inside the brackets is using the listeners in store.js to update the data we use on multiple access devices
      //pollingInterval: 60000,//will refetch data every 60seconds
      refetchOnFocus: true, //when we focus on another window then come back to the window ti will refetch data
      refetchOnMountOrArgChange: true, //refetch when we remount the component
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
        <Enrolments />
        <LoadingStateIcon />
      </>
    );
  }

  //}
  //if(isError){<h1>is error</h1>}
  return content;
};
export default EditEnrolment;
