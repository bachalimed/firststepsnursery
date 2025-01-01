import { useSelector } from "react-redux";
import {
  selectCurrentAcademicYearId,
  selectAcademicYearById,
} from "../features/AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
import { useGetStudentsStatsByYearQuery } from "../features/Students/StudentsAndParents/Students/studentsApiSlice";
import { useGetEnrolmentsStatsByYearQuery } from "../features/Students/Enrolments/enrolmentsApiSlice"
import { useGetFamiliesStatsByYearQuery } from "../features/Students/StudentsAndParents/Families/familiesApiSlice"

export const useStudentsStats = () => {
  // Selected academic year
  const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
  const selectedAcademicYear = useSelector((state) =>
    selectAcademicYearById(state, selectedAcademicYearId)
  ); // Get the full academic year object

  // Query the students stats for the selected academic year
  const {
    data: students, //the data is renamed students
    // isLoading: isStudentsLoading,
    isSuccess: isStudentsSuccess,
    // isError: isStudentsError,
    // error: studentsError,
  } = useGetStudentsStatsByYearQuery(
    {
      criteria: "DashStudentsTotalNumberStats",
      selectedYear: selectedAcademicYear?.title,
      endpointName: "useStudentsStats",
    },
    {
      pollingInterval: 60000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );
  const {
    data: enrolments, //the data is renamed students
    // isLoading: isEnrolmentsLoading,
    isSuccess: isEnrolmentsSuccess,
    // isError: isEnrolmentsError,
    // error: enrolmentsError,
  } = useGetEnrolmentsStatsByYearQuery(
    {
      criteria: "enrolmentsTotalStats",
      selectedYear: selectedAcademicYear?.title,
      endpointName: "useStudentsStats",
    },
    {
      pollingInterval: 60000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );
  const {
    data: families, //the data is renamed students
    // isLoading: isFamiliesLoading,
    isSuccess: isFamiliesSuccess,
    // isError: isFamiliesError,
    // error: familiesError,
  } = useGetFamiliesStatsByYearQuery(
    {
      criteria: "familiesTotalStats",
      selectedYear: selectedAcademicYear?.title,
      endpointName: "useStudentsStats",
    },
    {
      pollingInterval: 60000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  
  // Return the stats or an empty object if not successful
  const studentsStats = isStudentsSuccess ? students : {};
  const enrolmentsStats = isEnrolmentsSuccess ? enrolments : {};
  const familiesStats = isFamiliesSuccess ? families : {};

  return {
    familiesStats,
    enrolmentsStats,
    studentsStats,
    selectedAcademicYear,
    
  };
};
