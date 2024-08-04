import { useSelector } from 'react-redux'
import { selectAllAcademicYears,  useGetAcademicYearsQuery } from "../features/AppSettings/Academics/academicYearsApiSlice"




const useAcademicYears = () => {

const {
    data: academicYears,//the data is renamed academicYears
          isLoading,//monitor several situations is loading...
          isSuccess,
          isError,
          error
  } = useGetAcademicYearsQuery('academicYearsList', {//this inside the brackets is using the listeners in store.js to update the data we use on multiple access devices
    pollingInterval: 60000,//will refetch data every 60seconds
    refetchOnFocus: true,//when we focus on another window then come back to the window ti will refetch data
    refetchOnMountOrArgChange: true//refetch when we remount the component
  })
  const allAcademicYears = useSelector(state => selectAllAcademicYears(state))
  //we look for current year in the allyears
  const currentAcademicYear = allAcademicYears.find(year => year.currentYear === true);

  console.log('currentAcademicYearr')
          console.log(currentAcademicYear)
          //console.log('allAcademicYears')
          //console.log(allAcademicYears)
  if (allAcademicYears) {

    return {  allAcademicYears }}
    else{
    return { allAcademicYears: [] , currentAcademicYear:[] }}}
export default useAcademicYears


