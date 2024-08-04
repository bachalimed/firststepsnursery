import { useSelector } from 'react-redux'
import { selectAllAcademicYears,  useGetAcademicYearsQuery } from "../features/AppSettings/Academics/academicYearsApiSlice"


const useAcademicYears = () => {
    const { data, error, isLoading } = useGetAcademicYearsQuery()
    const academicYears = useSelector(selectAllAcademicYears)
    if (academicYears) {
        //here we will specify the academic years
        
        //this will come from the backend where it specidfies which is the current year
        const currentAcademicYear = academicYears.find(year=> year.currentYear===true)/////////////////
       
        console.log('currentAcademicYear')
       //console.log(currentAcademicYear)
        console.log('academicYears')
        //console.log(academicYears)

        return {  academicYears }
        //return {  academicYears, currentAcademicYear }
    }
    return { academicYears: [] , currentAcademicYear:[] }}
export default useAcademicYears
