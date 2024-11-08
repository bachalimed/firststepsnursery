import { useParams } from "react-router-dom"; //because we will get the userId from the url
import { useSelector } from "react-redux";
import EditStudentDocumentsListForm from "./EditStudentDocumentsListForm";
import { useGetStudentDocumentsListsQuery } from "./studentDocumentsListsApiSlice";
import useAuth from "../../../../hooks/useAuth";
import { Puff } from "react-loading-icons";
import StudentsSet from "../../StudentsSet";
import LoadingStateIcons from "react-loading-icons";
const EditStudentDocumentsList = () => {
  //pull the id from use params from the url
  const { id } = useParams();
  //console.log(id,'idddd')
  //RTK query the studentDocumentsList and not from the state to reduce cache data
  const { studentDocumentsList } = useGetStudentDocumentsListsQuery(
    "studentDocumentsList",
    {
      selectFromResult: ({ data }) => ({
        studentDocumentsList: data?.entities[id],
      }),
    }
  );

  // will not get from the state because not set to state already
  // const studentDocumentsListToEdit = useSelector(state=> state.studentDocumentsList?.entities[id])
  //console.log('helllllow',studentDocumentsList, 'list id')
  
  let content;

  content = studentDocumentsList ? (
    <>
      <StudentsSet />
      <EditStudentDocumentsListForm listToEdit={studentDocumentsList} />
    </>
  ) : (
    <>
      <StudentsSet /><LoadingStateIcons /></>
  );

  return content;
};
export default EditStudentDocumentsList;
