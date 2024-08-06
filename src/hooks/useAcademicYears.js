import { useSelector } from 'react-redux'
import { selectAllAcademicYears,  useGetAcademicYearsQuery } from "../features/AppSettings/Academics/academicYearsApiSlice"




const useAcademicYears = () => {
  const allAcademicYears = useSelector(state => selectAllAcademicYears(state))

const currentAcademicYear= allAcademicYears.filter({currentYear:true})
console.Log('urrentAcademicYear')
console.Log(currentAcademicYear)





    return {  allAcademicYears, currentAcademicYear }
}
export default useAcademicYears


