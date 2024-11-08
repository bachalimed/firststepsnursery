import { useParams } from "react-router-dom"; //because we will get the userId from the url
import { useSelector } from "react-redux";
import { selectServiceById, useGetServiceByIdQuery } from "./servicesApiSlice"; //we will pull the user  data from the state and not use query
import EditServiceForm from "./EditServiceForm";
import useAuth from "../../../hooks/useAuth";
import { currentServicesList } from "./servicesSlice";
import LoadingStateIcons from "react-loading-icons";
import StudentsSet from "../../StudentsSet";
const EditService = () => {
  const { id } = useParams(); //pull the id from use params from the url

  //will get hte student from the state
  const serviceToEdit = useSelector((state) => state.service?.entities[id]);
  //console.log('helllllow',serviceToEdit.userFullName.userFirstName, 'mystu', id)

  let content;

  content = serviceToEdit ? (
    <>
      
      <EditServiceForm service={serviceToEdit} />
    </>
  ) : (
    <>
      <StudentsSet />
      <LoadingStateIcons />
    </>
  );

  //}
  //if(isError){<h1>is error</h1>}
  return content;
};
export default EditService;
