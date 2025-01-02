import { useParams } from "react-router-dom"; //because we will get the userId from the url
import { useEffect } from "react";
import EditStudentDocumentsListForm from "./EditStudentDocumentsListForm";
import { useGetStudentDocumentsListByIdQuery } from "./studentDocumentsListsApiSlice";
import StudentsSet from "../../StudentsSet";
import LoadingStateIcon from "react-loading-icons";
const EditStudentDocumentsList = () => {
  useEffect(()=>{document.title="Edit Student Documents"})

  //pull the id from use params from the url
  const { id } = useParams();
  //console.log(id,'idddd')

  // const { studentDocumentsList } = useGetStudentDocumentsListsQuery(
  //   "studentDocumentsList",
  //   {
  //     selectFromResult: ({ data }) => ({
  //       studentDocumentsList: data?.entities[id],
  //     }),
  //   }
  // );

  const {
    data: studentDocumentsListToEdit,
    // isLoading,
    isSuccess,
    // isError,
    // error,
  } = useGetStudentDocumentsListByIdQuery(
    {
      id: id,
      endpointName: "EditStudentDocumentsList",
    },
    {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  ) || {};

  //console.log('helllllow',studentDocumentsListToEdit, 'list id')
  const studentDocumentsList = isSuccess ? studentDocumentsListToEdit : [];

  // will not get from the state because not set to state already
  // const studentDocumentsListToEdit = useSelector(state=> state.studentDocumentsList?.entities[id])
  //console.log('helllllow',studentDocumentsList, 'studentDocumentsList')

  let content;

  // if (studentDocumentsList != [] &&isSuccess) {
  //   content = (
  //     <>
  //       <EditStudentDocumentsListForm listToEdit={studentDocumentsList} />
  //     </>
  //   );
  // } else {
  //   content = (
  //     <>
  //       <StudentsSet />
  //       <LoadingStateIcon />
  //     </>
  //   );
  // }

  content = (studentDocumentsList!={}) ? ( //sometimes isSuccess generates error
    <>
      <EditStudentDocumentsListForm listToEdit={studentDocumentsList} />
    </>
  ) : (
    <>
      <StudentsSet />
      <LoadingStateIcon />
    </>
  );

  return content;
};
export default EditStudentDocumentsList;
