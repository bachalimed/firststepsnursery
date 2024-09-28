import { useParams } from "react-router-dom"; //because we will get the userId from the url
import { useSelector } from "react-redux";
import { selectAcademicYearById, useGetAcademicYearByIdQuery } from "./academicYearsApiSlice"; //we will pull the user  data from the state and not use query
import EditAcademicYearForm from "./EditAcademicYearForm";
import useAuth from "../../../../hooks/useAuth";
import LoadingStateIcons from '../../../../Components/LoadingStateIcon'
import { currentAcademicYearsList } from "./academicYearsSlice";

const EditAcademicYear = () => {
  const { id } = useParams(); //pull the id from use params from the url

  //will get hte academicYear from the state
 
  const academicYearToEdit = useSelector((state) =>
    selectAcademicYearById(state, id))
  //console.log('helllllow',academicYearToEdit, 'mystu')

  let content;

  content = academicYearToEdit ? (
    <EditAcademicYearForm academicYear={academicYearToEdit} />
  ) : (
    <LoadingStateIcons/>
  );

  //}
  //if(isError){<h1>is error</h1>}
  return content;
};
export default EditAcademicYear;
