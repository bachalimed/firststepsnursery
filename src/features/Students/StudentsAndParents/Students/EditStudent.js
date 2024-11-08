import { useParams } from "react-router-dom"; //because we will get the userId from the url
import { useSelector } from "react-redux";
import { selectStudentById, useGetStudentByIdQuery } from "./studentsApiSlice"; //we will pull the user  data from the state and not use query
import EditStudentForm from "./EditStudentForm";
import useAuth from "../../../../hooks/useAuth";
import LoadingStateIcon from "../../../../Components/LoadingStateIcon";
import { currentStudentsList } from "./studentsSlice";
import StudentsParents from "../../StudentsParents";
const EditStudent = () => {
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
      <StudentsParents />
      <LoadingStateIcon />
    </>
  );

  //}
  //if(isError){<h1>is error</h1>}
  return content;
};
export default EditStudent;
