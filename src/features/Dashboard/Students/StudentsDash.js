import React,{useEffect} from "react";
// import { GrUserExpert } from "react-icons/gr";
import DashboardStudentsTotalNumberModule from "./DashboardModules/DashboardStudentsTotalNumberModule";
import DashboardStudentsAdmissionNumberModule from "./DashboardModules/DashboardStudentsAdmissionNumberModule";
import DashboardStudentsPerGradeModule from "./DashboardModules/DashboardStudentsPerGradeModule";
import DashboardStudentsPerSchoolModule from "./DashboardModules/DashboardStudentsPerSchoolModule";
import DashboardEnrolmentsPerMonthModule from "./DashboardModules/DashboardEnrolmentsPerMonthModule";
import DashboardFamiliesTotalNumberModule from "./DashboardModules/DashboardFamiliesTotalNumberModule";
import DashboardStudentsPerFamilyModule from "./DashboardModules/DashboardStudentsPerFamilyModule";
import Dashboard from "../Dashboard";
//a wrapper to format the stats
// const BoxWrapper=({children})=> {
// 	return <div className='bg-teal-100 rounded-sm p-4 flex-1 border border-gray-200 flex items-center '>
// 		{children} </div>
// }

const StudentsDashboardStatsGrid = () => {

 useEffect(() => {
    document.title = "Students Dashboard";
  });


  return (
    <>
      <Dashboard />
      
      <div className=" gap-4 ">
      <div className="flex flex-col sm:flex-row gap-4 mt-4 mb-4 ml-4 mr-4 w-full">
        <DashboardStudentsTotalNumberModule />
        <DashboardStudentsAdmissionNumberModule />
        <DashboardFamiliesTotalNumberModule />
       
        {/* <DashboardStudentsNumberStats /> */}

        {/* <BoxWrapper >element of stats</BoxWrapper>
       <BoxWrapper >element of stats</BoxWrapper>
       <BoxWrapper >element of stats</BoxWrapper> */}
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 mt-4 mb-4 ml-4 mr-4 w-full">
        <DashboardStudentsPerGradeModule />
        <DashboardStudentsPerSchoolModule />
        
       
        <DashboardStudentsPerFamilyModule />
        {/* <DashboardStudentsNumberStats /> */}

        {/* <BoxWrapper >element of stats</BoxWrapper>
       <BoxWrapper >element of stats</BoxWrapper>
       <BoxWrapper >element of stats</BoxWrapper> */}
      </div>
      <div className="flex flex-col sm:flex-row gap-4 mt-4 mb-4 ml-4 mr-4 w-full">
        <DashboardEnrolmentsPerMonthModule />
       
      </div>
      </div>
      
    </>
  );
};

export default StudentsDashboardStatsGrid;
