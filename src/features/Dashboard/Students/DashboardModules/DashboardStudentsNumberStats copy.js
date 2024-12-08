// //example of stats for the dashbordm should be replaced by DB imports

// import React from "react";
// import { PiStudent } from "react-icons/pi";

// import { useSelector } from "react-redux";
// import {
//   selectCurrentAcademicYearId,
//   selectAcademicYearById,
//   selectAllAcademicYears,
// } from "../../../AppSettings/AcademicsSet/AcademicYears/academicYearsSlice";
// import { useGetStudentsStatsByYearQuery } from "../../../Students/StudentsAndParents/Students/studentsApiSlice";
// const DashboardStudentsNumberStats = () => {
//   //selected academicYears
//   const selectedAcademicYearId = useSelector(selectCurrentAcademicYearId); // Get the selected year ID
//   const selectedAcademicYear = useSelector((state) =>
//     selectAcademicYearById(state, selectedAcademicYearId)
//   ); // Get the full academic year object
//   const academicYears = useSelector(selectAllAcademicYears);
//   //query the students
//   const {
//     data: students, //the data is renamed students
//     isLoading: isStudentsLoading, 
//     isSuccess: isStudentsSuccess,
//     isError: isStudentsError,
//     error: studentsError,
//   } = useGetStudentsStatsByYearQuery(
//     {
//       criteria: "DashStudentsTotalNumberStats",
//       selectedYear: selectedAcademicYear?.title,
//       endpointName: "DashboardStudentsNumberStats",
//     } || {},
//     {
//       pollingInterval: 60000,
//       refetchOnFocus: true,
//       refetchOnMountOrArgChange: true,
//     }
//   );

//   const studentsStats = isStudentsSuccess ? students : {};

//   const {
//     studentsMatchingAcademicYear,
//     inactiveStudentsCount,
//     studentsWithAdmission,
//     studentGrades,
//   } = studentsStats;
//   // console.log(
//   //   studentsMatchingAcademicYear,
//   //   inactiveStudentsCount,
//   //   studentsWithAdmission,
//   //   studentGrades
//   // );
//   return (<>
//     <div
//       div
//       className="bg-teal-100 rounded-sm p-3 flex-1 border border-gray-200 flex items-center "
//     >
//       <div className="rounded-full h-12 w-12 flex items-center justify-center bg-sky-200">
//         <PiStudent className="text-2xl" />
//       </div>
//       <div className="pl-4">
//         <span className="text-sm text-gray-500 font-light">
//           {" "}
//           Total Students
//         </span>
//         <div className="flex items-center">
//           <strong className="text-xl text-gray-700 font-semi-bold">
//             {" "}
//             {studentsMatchingAcademicYear}
//           </strong>
//           <span className="pl-2 text-sm text-green-500">
//             {inactiveStudentsCount} inactive{" "}
//           </span>
//         </div>
//       </div>
//     </div>
//     <div
//       div
//       className="bg-teal-100 rounded-sm p-3 flex-1 border border-gray-200 flex items-center "
//     >
//       <div className="rounded-full h-12 w-12 flex items-center justify-center bg-sky-200">
//         <PiStudent className="text-2xl" />
//       </div>
//       <div className="pl-4">
//         <span className="text-sm text-gray-500 font-light">
//           {" "}
//           Admissions
//         </span>
//         <div className="flex items-center">
//           <strong className="text-xl text-gray-700 font-semi-bold">
//             {" "}
//             {studentsWithAdmission}
//           </strong>
          
//         </div>
//       </div>
//     </div>
//     <div
//       div
//       className="bg-teal-100 rounded-sm p-3 flex-1 border border-gray-200 flex items-center "
//     >
//       <div className="rounded-full h-12 w-12 flex items-center justify-center bg-sky-200">
//         <PiStudent className="text-2xl" />
//       </div>
//       <div className="pl-4">
//         <span className="text-sm text-gray-500 font-light">
//           {" "}
//           Admissions
//         </span>
//         <div className="flex items-center">
//           <strong className="text-xl text-gray-700 font-semi-bold">
//             {" "}
//             {studentsWithAdmission}
//           </strong>
          
//         </div>
//       </div>
//     </div>
//     </>
//   );
// };

// export default DashboardStudentsNumberStats;
