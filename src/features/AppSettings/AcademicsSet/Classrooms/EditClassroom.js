import { useParams } from "react-router-dom"; //because we will get the userId from the url
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import {
  selectClassroomById,
  useGetClassroomByIdQuery,
} from "./classroomsApiSlice"; //we will pull the user  data from the state and not use query
import EditClassroomForm from "./EditClassroomsForm";
import useAuth from "../../../../hooks/useAuth";
import LoadingStateIcon from "../../../../Components/LoadingStateIcon";
import { currentClassroomsList } from "./classroomsSlice";
import AcademicsSet from "../../AcademicsSet";
const EditClassroom = () => {
  const { id } = useParams(); //pull the id from use params from the url
  //console.log(id,'id')
  const [classroom, setClassroom] = useState("");
  const {
    data: classroomToEdit, //the data is renamed families
    isLoading: isClassroomLoading, //monitor several situations
    isSuccess: isClassroomSuccess,
    isError: isClassroomError,
    error: classroomError,
  } = useGetClassroomByIdQuery(
    { id: id, endpointName: "EditClassroom" } || {},
    {
 
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );
  //console.log('hiiiiiiiiiiii')
  useEffect(() => {
    if (isClassroomSuccess) {
      //console.log('helllllow',classroomToEdit, 'mystu')
      //const classroomInit = Object.values(entities)
      setClassroom(classroomToEdit); // Set classroom state to the first object
      //console.log('helllllow',classroom, 'mystu')
    }
  }, [isClassroomSuccess, classroomToEdit]);

  let content;

  content = classroomToEdit ? (
    <>
      <EditClassroomForm classroom={classroomToEdit} />
    </>
  ) : (
    <>
      <AcademicsSet />
      <LoadingStateIcon />
    </>
  );

  //}
  //if(isError){<h1>is error</h1>}
  return content;
};
export default EditClassroom;
