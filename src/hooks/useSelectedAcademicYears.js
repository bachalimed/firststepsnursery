import { useSelector } from 'react-redux'
import { selectAllAcademicYears,  useGetAcademicYearsQuery } from "../features/AppSettings/AcademicsSet/AcademicYears/academicYearsApiSlice"
import currentAcademicYearsList  from "../features/AppSettings/AcademicsSet/AcademicYears/academicYearsSlice"




export const useSelectedAcademicYear = () => {
//function to get the current year according to the date
  const getCurrentAcademicYear = () => {
    const today = new Date() // Get today's date
    const currentYear = today.getUTCFullYear() // Get the current year

    // Define the academic year start and end dates
    const startDate = new Date(Date.UTC(currentYear, 8, 1, 0, 0, 0)) // 1st September of the current year
    const endDate = new Date(Date.UTC(currentYear + 1, 7, 31, 23, 59, 59, 999)) // 31st August of the next year

    // Determine the academic year based on the current date
    let academicYear
    if (today >= startDate && today <= endDate) {
      academicYear = `${currentYear}/${currentYear + 1}`
    } else {
      academicYear = `${currentYear - 1}/${currentYear}`
    }
    return academicYear
  }
const currentYear =  getCurrentAcademicYear()//this is current year

    const selectedAcademicYear =  useSelector((state) => {
      //const selectedId = state.academicYears.selectedYearId // Assuming `selectedYearId` is where you store the selected year ID in your state
      const years = Object.values(state.academicYear?.entities || {})
      //console.log(selectedAcademicYear,' in the hook')
      return years.find(year => year.isSelected === true)
    }
    
    
    
    
  )
  return selectedAcademicYear || { title: currentYear }
}
