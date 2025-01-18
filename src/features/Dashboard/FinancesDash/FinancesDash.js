import React,{useEffect} from "react";
// import { GrUserExpert } from "react-icons/gr";
 import DashboardFinancesTotalPaymentsModule from "./DashboardModules/DashboardFinancesTotalPaymentsModule";
import DashboardFinancesTotalExpensesModule from "./DashboardModules/DashboardFinancesTotalExpensesModule";
 import DashboardFinancesMonthlyPaymentsExpensesInvoicesModule from "./DashboardModules/DashboardFinancesMonthlyPaymentsExpensesInvoicesModule";
 import DashboardFinancesMonthlyExpenseCategoriesModule from "./DashboardModules/DashboardFinancesMonthlyExpenseCategoriesModule";
 import DashboardFinancesTotalPercentagesModule from "./DashboardModules/DashboardFinancesTotalPercentagesModule";

import Dashboard from "../Dashboard";
//a wrapper to format the stats
// const BoxWrapper=({children})=> {
// 	return <div className='bg-teal-100 rounded-sm p-4 flex-1 border border-gray-200 flex items-center '>
// 		{children} </div>
// }

const FinancesDashboardStatsGrid = () => {
 useEffect(() => {
    document.title = "Finances Dashboard";
  });


  return (
    <>
      <Dashboard />
      
      <div className=" gap-4 ">
      <div className="flex flex-col sm:flex-row gap-4 mt-4 mb-4 ml-4 mr-4 w-full">
        <DashboardFinancesTotalPaymentsModule />
        <DashboardFinancesTotalExpensesModule />
        <DashboardFinancesTotalPercentagesModule />
        
       
        {/* <DashboardfinancesNumberStats /> */}

        {/* <BoxWrapper >element of stats</BoxWrapper>
       <BoxWrapper >element of stats</BoxWrapper>
       <BoxWrapper >element of stats</BoxWrapper> */}
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 mt-4 mb-4 ml-4 mr-4 w-full">
        {/* <DashboardfinancesPerGradeModule />
        <DashboardfinancesPerSchoolModule />
        
       
        <DashboardfinancesPerFamilyModule /> */}
        {/* <DashboardfinancesNumberStats /> */}

        {/* <BoxWrapper >element of stats</BoxWrapper>
       <BoxWrapper >element of stats</BoxWrapper>
       <BoxWrapper >element of stats</BoxWrapper> */}
      </div>
      <div className="flex flex-col sm:flex-row gap-4 mt-4 mb-4 ml-4 mr-4 w-full">
        <DashboardFinancesMonthlyPaymentsExpensesInvoicesModule />
       
      </div>
      <div className="flex flex-col sm:flex-row gap-4 mt-4 mb-4 ml-4 mr-4 w-full">
        <DashboardFinancesMonthlyExpenseCategoriesModule />
       
      </div>
      </div>
      
    </>
  );
};

export default FinancesDashboardStatsGrid;
