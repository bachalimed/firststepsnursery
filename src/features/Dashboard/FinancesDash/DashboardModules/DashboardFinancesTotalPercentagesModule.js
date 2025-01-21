//example of stats for the dashbordm should be replaced by DB imports

import React from "react";
import { useFinancesStats } from "../../../../hooks/useFinancesStats";
import { CurrencySymbol } from "../../../../config/Currency";
import { VscPercentage } from "react-icons/vsc";

const DashboardFinancesTotalPercentagesModule = () => {
  const { paymentsStats, invoicesStats, expensesStats } = useFinancesStats();

  // Destructure the required stats from studentsStats
  const {
    totalPaymentsAmount = 0,

    // studentsWithAdmission = 0,
    // studentGrades = {},
  } = paymentsStats;
  const {
    totalInvoicesAmount,
    monthlyInvoices,
    // studentsWithAdmission = 0,
    // studentGrades = {},
  } = invoicesStats;
  const { totalExpensesAmount = 0 } = expensesStats;

  
  return (
    <div
      div
      className="bg-gray-100 rounded-sm p-3 flex-1 border border-gray-300 flex items-center "
    >
      <div className="rounded-full h-12 w-12 flex items-center justify-center bg-sky-300">
        <VscPercentage className="text-3xl" />
      </div>
      <div className="pl-4">
        <span className="text-sm text-gray-800 font-light">
          {" "}
          Profit-income{" "}
        </span>
        <div className="flex items-center">
          <strong className="text-xl text-gray-900 font-semi-bold">
            {(
              (100 *
                (Number(totalPaymentsAmount) - Number(totalExpensesAmount))) /
              Number(totalPaymentsAmount)
            ).toFixed(0)}{" "}
            %
          </strong>
          <span className="pl-2 text-sm text-sky-700">
            {" "}
            ({(
              (100 * Number(totalExpensesAmount)) /
              (Number(totalPaymentsAmount) - Number(totalExpensesAmount))
            ).toFixed(0)}
            % Expense-Profit)
          </span>
        </div>
      </div>
    </div>
  );
};

export default DashboardFinancesTotalPercentagesModule;
