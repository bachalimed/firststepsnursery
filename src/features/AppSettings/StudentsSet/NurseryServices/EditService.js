import { useParams } from "react-router-dom"; //because we will get the userId from the url
import { useEffect } from "react";
import EditServiceForm from "./EditServiceForm";
import {
  useGetServicesByIdQuery,

} from "./servicesApiSlice";
import LoadingStateIcon from "react-loading-icons";
const EditService = () => {
  useEffect(()=>{document.title="Edit Service"})

  const { id } = useParams(); //pull the id from use params from the url
  //console.log("id", id)

  const {
    data: service, //the data is renamed services
    // isLoading: isServiceLoading, 
    isSuccess: isServiceSuccess,
    // isError: isServiceError,
    // error: serviceError,
  } = useGetServicesByIdQuery(
    {
      id: id,
      endpointName: "EditService",
    } ,
  );
  let serviceToEdit
  if (isServiceSuccess) {
   
    serviceToEdit = service[0];
  }
  // console.log('helllllow',serviceToEdit, 'mystu', id)

  let content;


//   if (isServiceLoading) {
//     content = 
//     <>
//        <StudentsSet />
//        <LoadingStateIcon />
//      </>
  
// } 
  if (isServiceSuccess) {
    content = 
    <>
      <EditServiceForm service={serviceToEdit} />
    </>
  
} 



  // content = serviceToEdit ? (
  //   <>
      
  //     <EditServiceForm service={serviceToEdit} />
  //   </>
  // ) : (
  //   <>
  //     <StudentsSet />
  //     <LoadingStateIcon />
  //   </>
  // );

 
  
  return content;
};
export default EditService;
