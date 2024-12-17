import { useParams } from "react-router-dom"; //because we will get the userId from the url
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import {
  selectAttendedSchoolById,
  useGetAttendedSchoolByIdQuery,
} from "./attendedSchoolsApiSlice"; //we will pull the user  data from the state and not use query
import EditAttendedSchoolForm from "./EditAttendedSchoolForm";
import useAuth from "../../../../hooks/useAuth";
import LoadingStateIcon from "../../../../Components/LoadingStateIcon";
import { currentAttendedSchoolsList } from "./attendedSchoolsSlice";
import AcademicsSet from "../../AcademicsSet";
const EditAttendedSchool = () => {
  const { id } = useParams(); //pull the id from use params from the url
  //console.log(id,'id')
  const [school, setSchool] = useState("");
  const {
    data: schoolToEdit, //the data is renamed families
    isLoading: isSchoolLoading, //monitor several situations
    isSuccess: isSchoolSuccess,
    isError: isSchoolError,
    error: schoolError,
  } = useGetAttendedSchoolByIdQuery({ id: id, endpointName: "EditAttendedSchool" } || {}, {
    
    //pollingInterval: 60000,
    refetchOnFocus: true, 
    refetchOnMountOrArgChange: true, 
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
    <>
     
      <EditAttendedSchoolForm attendedSchool={schoolToEdit} />
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
export default EditAttendedSchool;
