//this is to create an active subscription to the DB to use the data instaed of the data from the state values, so we will not  refresh loading after the 60seconds default

import { store } from "../../app/store";
import { academicYearsApiSlice } from "../AppSettings/AcademicsSet/AcademicYears/academicYearsApiSlice";
import { useEffect,  } from "react";
import { Outlet } from "react-router-dom";

const Prefetch = () => {
  // const [selectedYear, setSelectedYear]=useState('')

  // useEffect(() => {
  //     if (selectedAcademicYear?.title) {
  //       setSelectedYear(selectedAcademicYear?.title)
  //       //console.log('Selected year updated:', selectedAcademicYear?.title)
  //     }
  //   }, [selectedAcademicYear])

  useEffect(() => {
    //will run when the component mounts
    console.log("subscribing");
    //const users = store.dispatch(usersApiSlice.endpoints.getUsers.initiate())//manual subscription to each endpoint by querying to make them remain active while we are in the protected pages even after the 60second default
    //const studentDocumentsLists = store.dispatch(studentDocumentsListsApiSlice.endpoints.getStudentDocumentsLists.initiate())
    //const students = store.dispatch(studentsApiSlice.endpoints.getStudents.initiate())
    //const families = store.dispatch(familiesApiSlice.endpoints.getFamilies.initiate())
    //const employees = store.dispatch(employeesApiSlice.endpoints.getEmployees.initiate())
    //const tasks = store.dispatch(tasksApiSlice.endpoints.getTasks.initiate())
    const academicYears = store.dispatch(
      academicYearsApiSlice.endpoints.getAcademicYears.initiate()
    );

    return () => {
      console.log("unsubscribing");
      //users.unsubscribe()
      //studentDocumentsLists.unsubscribe()
      //students.unsubscribe()
      //families.unsubscribe()
      //employees.unsubscribe()
      //tasks.unsubscribe()
      academicYears.unsubscribe();
    };
  }, []); //only runs when the component mounts

  return <Outlet />;
};
export default Prefetch;
///!!!in dev we are using strict mode, it will mount, unmount and remount again so we will see three times
