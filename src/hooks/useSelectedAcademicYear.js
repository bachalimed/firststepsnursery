// import { useSelector, useDispatch } from 'react-redux'
// import { useState , useEffect} from 'react'
// import { selectAllAcademicYears,  useGetAcademicYearsQuery } from "../features/AppSettings/AcademicsSet/AcademicYears/academicYearsApiSlice"
// import { setAcademicYears } from "../features/AppSettings/AcademicsSet/AcademicYears/academicYearsSlice"
// import currentAcademicYearsList  from "../features/AppSettings/AcademicsSet/AcademicYears/academicYearsSlice"


// export const useSelectedAcademicYear = () => {
//   const dispatch = useDispatch()
//   const academicYears = useSelector(selectAllAcademicYears)// instead of being inside academicyears selction, it is here in the hook
//   useEffect(()=>{
//     dispatch(setAcademicYears(academicYears))//dispatch list to state,this only shows tehn redux state not empty in the browser tools, check later if this is needed as the query updated the state in apislice
//   },[academicYears, dispatch])// added dispatch here
// //function to get the current year according to the date
//   // const getCurrentAcademicYear = () => {
//   //   const today = new Date() // Get today's date
//   //   const currentYear = today.getUTCFullYear() // Get the current year

//   //   // Define the academic year start and end dates
//   //   const startDate = new Date(Date.UTC(currentYear, 8, 1, 0, 0, 0)) // 1st September of the current year
//   //   const endDate = new Date(Date.UTC(currentYear + 1, 7, 31, 23, 59, 59, 999)) // 31st August of the next year

//   //   // Determine the academic year based on the current date
//   //   let academicYear
//   //   if (today >= startDate && today <= endDate) {
//   //     academicYear = `${currentYear}/${currentYear + 1}`
//   //   } else {
//   //     academicYear = `${currentYear - 1}/${currentYear}`
//   //   }
//   //   return academicYear
//   // }
// //const currentYear =  getCurrentAcademicYear()//this is current year

//     const selectedAcademicYear =  useSelector((state) => {
//       //const selectedId = state.academicYears.selectedYearId // Assuming `selectedYearId` is where you store the selected year ID in your state
//       const years = Object.values(state.academicYear?.entities || {})
//       return years.find(year => year.isSelected === true)
//     }
    
//   )
//     //console.log(selectedAcademicYear,' in the hook')
    
    
//   return selectedAcademicYear //|| { title: currentYear }
// }