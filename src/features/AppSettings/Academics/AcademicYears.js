// import { useGetAcademicYearsQuery, selectAllAcademicYears } from "../../../features/AppSettings/Academics/academicYearsApiSlice"
import { useSelector, useDispatch } from "react-redux"






const AcademicYears = () => {
const academicYears = useSelector(state=>state.academicYears)
//console.log(academicYears)




  return (
    <div>AcademicYears</div>
  )
}

export default AcademicYears