import { useParams } from "react-router-dom"; //because we will get the userId from the url
import { useSelector } from "react-redux";
import EditStudentForm from "./EditStudentForm";
import LoadingStateIcon from "../../../../Components/LoadingStateIcon";
import Students from "../../Students";
import { useEffect } from "react";
const EditStudent = () => {
  useEffect(() => {
    document.title = "Edit Student";
  });
  const { id } = useParams(); //pull the id from use params from the url

  //will get hte student from the state
  const studentToEdit = useSelector((state) => state.student?.entities[id]);
  //console.log('helllllow',studentToEdit, 'mystu')

  let content;

  content = studentToEdit ? (
    <>
     
      
      <EditStudentForm student={studentToEdit} />
    </>
  ) : (
    <>
      <Students />
      <LoadingStateIcon />
    </>
  );

  //}
  //if(isError){<h1>is error</h1>}
  return content;
};
export default EditStudent;
