import { useParams } from "react-router-dom"; //because we will get the userId from the url
import { useSelector } from "react-redux";

import StudentDocumentsList from "./StudentDocumentsList";
import useAuth from "../../../../hooks/useAuth";
import { currentStudentsList } from "./studentsSlice";

const StudentDocuments = () => {
  const { id } = useParams(); //pull the id from use params from the url
  //console.log(id,'in the parent before form')
  //will get hte student from the state
  const studentToEdit = useSelector((state) => state.student?.entities[id]);
  //)

  let content;

  content = studentToEdit ? (
    <StudentDocumentsList student={studentToEdit} />
  ) : (
    <p>Loading...</p>
  );

  //}
  //if(isError){<h1>is error</h1>}
  return content;
};
export default StudentDocuments;
