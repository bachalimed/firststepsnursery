import React from "react";
// import { GrUserExpert } from "react-icons/gr";
 import DashboardFinancesTotalPaymentsModule from "./DashboardModules/DashboardFinancesTotalPaymentsModule";
import DashboardFinancesTotalExpensesModule from "./DashboardModules/DashboardFinancesTotalExpensesModule";
// import DashboardfinancesPerGradeModule from "./DashboardModules/DashboardfinancesPerGradeModule";
// import DashboardfinancesPerSchoolModule from "./DashboardModules/DashboardfinancesPerSchoolModule";
// import DashboardEnrolmentsPerMonthModule from "./DashboardModules/DashboardEnrolmentsPerMonthModule";
// import DashboardFamiliesTotalNumberModule from "./DashboardModules/DashboardFamiliesTotalNumberModule";
// import DashboardfinancesPerFamilyModule from "./DashboardModules/DashboardfinancesPerFamilyModule";
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
      <div className="flex gap-4 mt-4 mb-4 ml-4 mr-4 w-full">
        <DashboardFinancesTotalPaymentsModule />
        <DashboardFinancesTotalExpensesModule />
        {/* <DashboardFamiliesTotalNumberModule /> */}
       
        {/* <DashboardfinancesNumberStats /> */}

        {/* <BoxWrapper >element of stats</BoxWrapper>
       <BoxWrapper >element of stats</BoxWrapper>
       <BoxWrapper >element of stats</BoxWrapper> */}
      </div>
      
      <div className="flex gap-4 mt-4 mb-4 ml-4 mr-4 w-full">
        {/* <DashboardfinancesPerGradeModule />
        <DashboardfinancesPerSchoolModule />
        
       
        <DashboardfinancesPerFamilyModule /> */}
        {/* <DashboardfinancesNumberStats /> */}

        {/* <BoxWrapper >element of stats</BoxWrapper>
       <BoxWrapper >element of stats</BoxWrapper>
       <BoxWrapper >element of stats</BoxWrapper> */}
      </div>
      <div className="flex gap-4 mt-4 mb-4 ml-4 mr-4 w-full">
        {/* <DashboardEnrolmentsPerMonthModule /> */}
       
      </div>
      </div>
      
    </>
  );
};

export default DashboardStatsGrid;
