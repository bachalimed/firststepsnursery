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

const DashboardFinancesMonthlyPaymentsExpensesInvoicesModule = () => {
  const { invoicesStats, paymentsStats, expensesStats } = useFinancesStats();

  // Destructure the required stats
  const { totalExpensesAmount, monthlyExpenses = [] } = expensesStats;
  const { monthlyPayments = [], totalPaymentsAmount } = paymentsStats;
  const { totalInvoicesAmount, monthlyInvoices = [] } = invoicesStats;

  // Predefined month order for sorting
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

  // Combine data into a unified structure
  const combinedData = {};

  // Add invoices data
  monthlyInvoices.forEach(({ invoiceMonth, invoicesMonthlyTotal }) => {
    combinedData[invoiceMonth] = combinedData[invoiceMonth] || {
      month: invoiceMonth,
    };
    combinedData[invoiceMonth].invoices = parseFloat(
      invoicesMonthlyTotal.toFixed(2)
    );
  });

  // Add expenses data
  monthlyExpenses.forEach(({ expenseMonth, expensesMonthlyTotal }) => {
    combinedData[expenseMonth] = combinedData[expenseMonth] || {
      month: expenseMonth,
    };
    combinedData[expenseMonth].expenses = parseFloat(
      expensesMonthlyTotal.toFixed(2)
    );
  });

  // Add payments data
  monthlyPayments.forEach(({ paymentMonth, paymentsMonthlyTotal }) => {
    combinedData[paymentMonth] = combinedData[paymentMonth] || {
      month: paymentMonth,
    };
    combinedData[paymentMonth].payments = parseFloat(
      paymentsMonthlyTotal.toFixed(2)
    );
  });

  // Convert combinedData object to array and calculate additional metrics (Profit and Defaults)
  const chartData = Object.values(combinedData)
    .map((data) => {
      const invoices = data.invoices || 0;
      const expenses = data.expenses || 0;
      const payments = data.payments || 0;

      return {
        month: data.month,
        invoices,
        payments,
        expenses,
        profit: parseFloat(payments - expenses).toFixed(2), // Calculate profit
        defaults: parseFloat(invoices - payments).toFixed(2), // Calculate defaults
      };
    })
    .sort(
      (a, b) => MONTHS_ORDER.indexOf(a.month) - MONTHS_ORDER.indexOf(b.month)
    );

  // Split data for September to February and March to August
  const septToFebData = chartData.filter((data) =>
    ["September", "October", "November", "December", "January", "February"].includes(data.month)
  );

  const marchToAugData = chartData.filter((data) =>
    ["March", "April", "May", "June", "July", "August"].includes(data.month)
  );

  // Define colors for the bars
  const COLORS = ["#2a57a1", "#d0d61a", "#0927bd", "#1fc414", "#d61313"];

  // Chart rendering function
  const renderChart = (data, title) => (
    <div className="mb-8">
      <h3 className="text-center text-lg font-bold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
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

          <Bar dataKey="invoices" fill={COLORS[0]} name="Invoices" barSize={20}>
            <LabelList
              dataKey="invoices"
              position="top"
              formatter={(value) => `${value}`}
              style={{ fill: "#333", fontSize: "12px" }}
              offset={2}
            />
          </Bar>
          <Bar dataKey="payments" fill={COLORS[2]} name="Payments" barSize={20}>
            <LabelList
              dataKey="payments"
              position="top"
              formatter={(value) => `${value}`}
              style={{ fill: "#333", fontSize: "12px" }}
              offset={2}
            />
          </Bar>
          <Bar dataKey="expenses" fill={COLORS[1]} name="Expenses" barSize={20}>
            <LabelList
              dataKey="expenses"
              position="top"
              formatter={(value) => `${value}`}
              style={{ fill: "#333", fontSize: "12px" }}
              offset={2}
            />
          </Bar>
          <Bar dataKey="profit" fill={COLORS[3]} name="Profit" barSize={20}>
            <LabelList
              dataKey="profit"
              position="top"
              formatter={(value) => `${value}`}
              style={{ fill: "#333", fontSize: "12px" }}
              offset={2}
            />
          </Bar>
          <Bar dataKey="defaults" fill={COLORS[4]} name="Defaults" barSize={20}>
            <LabelList
              dataKey="defaults"
              position="top"
              formatter={(value) => `${value}`}
              style={{ fill: "#333", fontSize: "12px" }}
              offset={2}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <div className="bg-gray-100 rounded-sm p-3 flex-1 border border-gray-300">
      {renderChart(septToFebData, "September to February")}
      {marchToAugData.length > 0 && renderChart(marchToAugData, "March to August")}
    </div>
  );
};

export default DashboardFinancesMonthlyPaymentsExpensesInvoicesModule;
