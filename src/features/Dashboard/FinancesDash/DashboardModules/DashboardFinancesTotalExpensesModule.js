import React from "react";
import { GiPayMoney } from "react-icons/gi";
import { useFinancesStats } from "../../../../hooks/useFinancesStats";
import { CurrencySymbol } from "../../../../config/Currency";

const DashboardFinancesTotalExpensesModule = () => {
  const { expensesStats } = useFinancesStats();

  // Destructure stats from expensesStats
  const { totalExpensesAmount = 0, monthlyExpenses = [] } = expensesStats;

  // Calculate the total for Salaries
  const totalSalaries = monthlyExpenses.reduce((total, expense) => {
    const salariesCategory = expense.categories.find(
      (category) => category.category === "Salaries"
    );
    return total + (salariesCategory ? salariesCategory.categoryTotal : 0);
  }, 0);

  return (
    <div className="bg-gray-100 rounded-sm p-3 flex-1 border border-gray-300 flex items-center">
      <div className="rounded-full h-12 w-12 flex items-center justify-center bg-red-200">
        <GiPayMoney className="text-4xl" />
      </div>
      <div className="pl-4">
        <span className="text-sm text-gray-800 font-light">
          Total Expenses ({CurrencySymbol})
        </span>
        <div className="flex items-center">
          <strong className="text-xl text-gray-900 font-semi-bold">
            {Number(totalExpensesAmount).toFixed(2)}
          </strong>
          <span className="pl-2 text-sm text-sky-700">
            ({totalSalaries.toFixed(2)} Total Salaries)
          </span>
        </div>
      </div>
    </div>
  );
};

export default DashboardFinancesTotalExpensesModule;
