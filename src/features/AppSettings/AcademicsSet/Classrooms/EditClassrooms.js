import { useParams } from "react-router-dom"; //because we will get the userId from the url
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import {
  selectClassroomById,
  useGetClassroomByIdQuery,
} from "./classroomsApiSlice"; //we will pull the user  data from the state and not use query
import EditClassroomForm from "./EditClassroomsForm";
import useAuth from "../../../../hooks/useAuth";
import LoadingStateIcons from "../../../../Components/LoadingStateIcon";
import { currentClassroomsList } from "./classroomsSlice";

const EditClassroom = () => {
  const { id } = useParams(); //pull the id from use params from the url
  //console.log(id,'id')
  const [school, setSchool] = useState("");
  const {
    data: schoolToEdit, //the data is renamed families
    isLoading: isSchoolLoading, //monitor several situations
    isSuccess: isSchoolSuccess,
    isError: isSchoolError,
    error: schoolError,
  } = useGetClassroomByIdQuery({ id: id, endpointName: "school" } || {}, {
    // "dry" will not ppoulate children fully
    //this inside the brackets is using the listeners in store.js to update the data we use on multiple access devices
    //pollingInterval: 60000,//will refetch data every 60seconds
    refetchOnFocus: true, //when we focus on another window then come back to the window ti will refetch data
    refetchOnMountOrArgChange: true, //refetch when we remount the component
  });
  //console.log('hiiiiiiiiiiii')
  useEffect(() => {
    if (isSchoolSuccess) {
      //console.log('helllllow',schoolToEdit, 'mystu')
      //const schoolInit = Object.values(entities)
      setSchool(schoolToEdit); // Set school state to the first object
      //console.log('helllllow',school, 'mystu')
    }
  }, [isSchoolSuccess, schoolToEdit]);

  let content;

  content = schoolToEdit ? (
    <EditClassroomForm classroom={schoolToEdit} />
  ) : (
    <LoadingStateIcons />
  );

  //}
  //if(isError){<h1>is error</h1>}
  return content;
};
export default EditClassroom;
