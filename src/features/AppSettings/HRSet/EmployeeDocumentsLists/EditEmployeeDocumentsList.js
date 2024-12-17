import { useParams } from "react-router-dom"; //because we will get the userId from the url
import { useSelector } from "react-redux";
import EditEmployeeDocumentsListForm from "./EditEmployeeDocumentsListForm";
import { useGetEmployeeDocumentsListsQuery } from "./employeeDocumentsListsApiSlice";
import useAuth from "../../../../hooks/useAuth";
import { Puff } from "react-loading-icons";
import LoadingStateIcon from "../../../../Components/LoadingStateIcon";
import HRSet from "../../HRSet";
const EditEmployeeDocumentsList = () => {
  //pull the id from use params from the url
  const { id } = useParams();
  //console.log(id,'idddd')
  //RTK query the employeeDocumentsList and not from the state to reduce cache data
  const { employeeDocumentsList } = useGetEmployeeDocumentsListsQuery(
    "employeeDocumentsList",
    {
      selectFromResult: ({ data }) => ({
        employeeDocumentsList: data?.entities[id],
      }),
    }
  );

  // will not get from the state because not set to state already
  // const employeeDocumentsListToEdit = useSelector(state=> state.employeeDocumentsList?.entities[id])
  //console.log('helllllow',employeeDocumentsList, 'list id')
  
  let content;

  content = employeeDocumentsList ? (
    <><EditEmployeeDocumentsListForm listToEdit={employeeDocumentsList} /></>
  ) : (
    <><HRSet/><LoadingStateIcon /></>
  );

  return content;
};
export default EditEmployeeDocumentsList;
