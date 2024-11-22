import React from "react";
// import { GrUserExpert } from "react-icons/gr";
import DashboardStudentsTotalNumberModule from "./DashboardModules/DashboardStudentsTotalNumberModule";
import DashboardStudentsAdmissionNumberModule from "./DashboardModules/DashboardStudentsAdmissionNumberModule";
import DashboardStudentsPerGradeModule from "./DashboardModules/DashboardStudentsPerGradeModule";
import DashboardStudentsPerSchoolModule from "./DashboardModules/DashboardStudentsPerSchoolModule";
import DashboardEnrolmentsPerMonthModule from "./DashboardModules/DashboardEnrolmentsPerMonthModule";
import Dashboard from "../Dashboard";
//a wrapper to format the stats
// const BoxWrapper=({children})=> {
// 	return <div className='bg-teal-100 rounded-sm p-4 flex-1 border border-gray-200 flex items-center '>
// 		{children} </div>
// }

const DashboardStatsGrid = () => {




  return (
    <>
      <Dashboard />
      
      <div className=" gap-4 ">
      <div className="flex gap-4 w-full">
        <DashboardStudentsTotalNumberModule />
        <DashboardStudentsAdmissionNumberModule />
        <DashboardStudentsAdmissionNumberModule />
       
        {/* <DashboardStudentsNumberStats /> */}

        {/* <BoxWrapper >element of stats</BoxWrapper>
       <BoxWrapper >element of stats</BoxWrapper>
       <BoxWrapper >element of stats</BoxWrapper> */}
      </div>
      
      <div className="flex gap-4 w-full">
        <DashboardStudentsPerGradeModule />
        <DashboardStudentsPerSchoolModule />
        
       
        <DashboardStudentsAdmissionNumberModule />
        {/* <DashboardStudentsNumberStats /> */}

        {/* <BoxWrapper >element of stats</BoxWrapper>
       <BoxWrapper >element of stats</BoxWrapper>
       <BoxWrapper >element of stats</BoxWrapper> */}
      </div>
      <div className="flex gap-4 w-full">
        <DashboardEnrolmentsPerMonthModule />
       
      </div>
      </div>
      
    </>
  );
};

export default DashboardStatsGrid;
