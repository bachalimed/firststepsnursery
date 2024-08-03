import { useSelector } from 'react-redux'
import { currentAcademicYearsList,  } from "../features/AppSettings/Academics/academicYearsSlice"


const useAcademicYears = () => {
    const academicYears = useSelector(currentAcademicYearsList)
    let currentAcademicYear= ''
    let selectedAcademicYear= ''
   

    if (academicYears) {
        //here we will specify the academic years
        
        console.log('currentAcademicYearsList')
        console.log(typeof(currentAcademicYearsList))
        //const currentAcademicYear = academicYears.find(item => item.currentYear === "true")



        return { currentAcademicYear, academicYears, selectedAcademicYear}
    }

    return { currentAcademicYear: '', academicYears: [], selectedAcademicYear  }
}
export default useAcademicYears
