//example of stats for the dashbordm should be replaced by DB imports

import React from "react";
import { PiStudent } from "react-icons/pi";
import { useFinancesStats } from "../../../../hooks/useFinancesStats";

const DashboardFinancesTotalExpensesModule = () => {
  const { expensesStats } = useFinancesStats();

  // Destructure the required stats from studentsStats

  const { totalExpensesAmount = 0 } = expensesStats;

  return (
    <div
      div
      className="bg-gray-100 rounded-sm p-3 flex-1 border border-gray-300 flex items-center "
    >
      <div className="rounded-full h-12 w-12 flex items-center justify-center bg-sky-200">
        <PiStudent className="text-2xl" />
      </div>
      <div className="pl-4">
        <span className="text-sm text-gray-800 font-light">
          {" "}
          Total expenses
        </span>
        <div className="flex items-center">
          <strong className="text-xl text-gray-900 font-semi-bold">
            {" "}
           { Number(totalExpensesAmount).toFixed(2)}
          </strong>
          {/* <span className="pl-2 text-sm text-sky-700">
            {totalInvoicedAmount} invoiced{" "}
          </span> */}
        </div>
      </div>
    </div>
  );
};

export default DashboardFinancesTotalExpensesModule;
