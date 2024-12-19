import { useParams } from "react-router-dom"; //because we will get the userId from the url
import { useSelector } from "react-redux";
import EditEmployeeDocumentsListForm from "./EditEmployeeDocumentsListForm";
import { useGetEmployeeDocumentsListByIdQuery } from "./employeeDocumentsListsApiSlice";
import useAuth from "../../../../hooks/useAuth";
import { Puff } from "react-loading-icons";
import LoadingStateIcon from "../../../../Components/LoadingStateIcon";
import HRSet from "../../HRSet";
const EditEmployeeDocumentsList = () => {
  //pull the id from use params from the url
  const { id } = useParams();
  //console.log(id,'idddd')
  //RTK query the employeeDocumentsList and not from the state to reduce cache data
  

  const {
      data: employeeDocumentsListToEdit,
      isLoading,
      isSuccess,
      isError,
      error,
    } = useGetEmployeeDocumentsListByIdQuery(
      {
        id: id,
        endpointName: "EditEmployeeDocumentsList",
      },
      {
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
      }
    ) || {};

    
    const employeeDocumentsList = isSuccess ? employeeDocumentsListToEdit : [];
  // const employeeDocumentsListToEdit = useSelector(state=> state.employeeDocumentsList?.entities[id])
  //console.log('helllllow',employeeDocumentsList, 'list id')
  
  let content;

  content = (employeeDocumentsList!={}) ? (
    <><EditEmployeeDocumentsListForm listToEdit={employeeDocumentsList} /></>
  ) : (
    <><HRSet/><LoadingStateIcon /></>
  );

  return content;
};
export default EditEmployeeDocumentsList;
