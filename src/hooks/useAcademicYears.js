import { useSelector } from 'react-redux'
import { currentAcademicYearsList,  } from "../features/AppSettings/Academics/academicYearsSlice"


const useAcademicYears = () => {
    const academicYears = useSelector(currentAcademicYearsList)
    let currentAcademicYear= ''
    let selectedAcademicYear= ''
   

    if (academicYears) {
        
        console.log('currentAcademicYearsList')
        console.log(currentAcademicYearsList)
        //const currentAcademicYear = academicYears.find(item => item.currentYear === "true")




        return { currentAcademicYear, academicYears, selectedAcademicYear}
    }

    return { currentAcademicYear: '', academicYears: [], selectedAcademicYear  }
}
export default useAcademicYears