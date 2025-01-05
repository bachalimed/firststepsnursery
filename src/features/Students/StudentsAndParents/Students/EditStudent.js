import { useParams } from "react-router-dom"; //because we will get the userId from the url
import React, { useState, useEffect } from "react";
import EditStudentForm from "./EditStudentForm";
import LoadingStateIcon from "../../../../Components/LoadingStateIcon";
import Students from "../../Students";
import { useGetStudentByIdQuery } from "./studentsApiSlice";

const EditStudent = () => {

    const [student, setStudent] = useState(null);
  
  useEffect(() => {
    document.title = "Edit Student";
  });
  const { id } = useParams(); //pull the id from use params from the url



  const {
      data: studentOrg,
      isLoading: studentOrgIsLoading,
      isSuccess: studentOrgIsSuccess,
      // isError: studentOrgIsError,
    } = useGetStudentByIdQuery(
      { id: id, endpointName: "StudentDetails" },
      {
        pollingInterval: 60000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
      }
    );
  //will get hte student from the state
  //const studentToEdit = useSelector((state) => state.student?.entities[id]);
  //console.log('helllllow',studentToEdit, 'mystu')

  // Use effect to set student data
  useEffect(() => {
    if (studentOrgIsSuccess && studentOrg) {
      const { entities } = studentOrg;
      //console.log(studentOrg, 'studentOrg');
      //console.log(entities[id], 'importedStudent');
      setStudent(entities[id]);
    }
  }, [studentOrgIsSuccess, studentOrg]);



  let content;

  content = student ? (
    <>
     
      
      <EditStudentForm student={student} />
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
