import React from "react";
import { useFinancesStats } from "../../../../hooks/useFinancesStats";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LabelList,
} from "recharts";

const DashboardFinancesMonthlyExpenseCategoriesModule = () => {
  const { expensesStats } = useFinancesStats();

  // Destructure the required stats from expensesStats
  const { monthlyExpenses = [] } = expensesStats;

  // Predefined month order
  const MONTHS_ORDER = [
   
    "September",
    "October",
    "November",
    "December",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
  ];

  // Combine data into a unified structure for the chart
  const combinedData = {};

  // Add expenses data with categories
  monthlyExpenses.forEach(({ expenseMonth, categories }) => {
    combinedData[expenseMonth] = combinedData[expenseMonth] || {
      month: expenseMonth,
    };

    categories.forEach(({ category, categoryTotal }) => {
      combinedData[expenseMonth][category] =
        (combinedData[expenseMonth][category] || 0) + categoryTotal;
    });
  });

  // Convert combinedData object to array and sort by month order
  const chartData = Object.values(combinedData).sort(
    (a, b) =>
      MONTHS_ORDER.indexOf(a.month) - MONTHS_ORDER.indexOf(b.month)
  );

  // Extract unique categories for dynamic bar rendering
  const uniqueCategories = [
    ...new Set(
      monthlyExpenses.flatMap(({ categories }) =>
        categories.map(({ category }) => category)
      )
    ),
  ];

  // Define colors for the bars (use a larger palette if needed)
  const COLORS = ["#f94144", "#219ebc", "#ffb703", "#fb8500", "#8ecae6"];

  return (
    <div className="bg-gray-100 rounded-sm p-3 flex-1 border border-gray-300 flex items-center">
      <div className="pl-4 w-full h-full" style={{ minHeight: "300px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={chartData}
            margin={{
              top: 30,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />

            {/* Dynamically render bars for each category */}
            {uniqueCategories.map((category, index) => (
              <Bar
                key={category}
                dataKey={category}
                fill={COLORS[index % COLORS.length]}
                name={category}
                barSize={20}
              >
                <LabelList
                  dataKey={category}
                  position="top"
                  formatter={(value) => `${value}`}
                  style={{
                    fill: "#333",
                    fontSize: "12px",
                  }}
                  offset={2}
                />
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardFinancesMonthlyExpenseCategoriesModule;
