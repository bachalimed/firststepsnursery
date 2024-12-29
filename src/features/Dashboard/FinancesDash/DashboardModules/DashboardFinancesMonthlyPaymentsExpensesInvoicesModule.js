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
    combinedData[invoiceMonth].invoices = invoicesMonthlyTotal;
  });

  // Add expenses data
  monthlyExpenses.forEach(({ expenseMonth, expensesMonthlyTotal }) => {
    combinedData[expenseMonth] = combinedData[expenseMonth] || {
      month: expenseMonth,
    };
    combinedData[expenseMonth].expenses = expensesMonthlyTotal;
  });

  // Add payments data
  monthlyPayments.forEach(({ paymentMonth, paymentsMonthlyTotal }) => {
    combinedData[paymentMonth] = combinedData[paymentMonth] || {
      month: paymentMonth,
    };
    combinedData[paymentMonth].payments = paymentsMonthlyTotal;
  });

  // Convert combinedData object to array and sort by MONTHS_ORDER
  const chartData = Object.values(combinedData)
    .map((data) => ({
      month: data.month,
      invoices: data.invoices || 0,
      expenses: data.expenses || 0,
      payments: data.payments || 0,
    }))
    .sort(
      (a, b) => MONTHS_ORDER.indexOf(a.month) - MONTHS_ORDER.indexOf(b.month)
    );

  // Define colors for the bars
  const COLORS = ["#f94144", "#219ebc", "#ffb703"];

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

            {/* Render bars for each dataset */}
            <Bar
              dataKey="invoices"
              fill={COLORS[0]}
              name="Invoices"
              barSize={20}
            >
              <LabelList
                dataKey="invoices"
                position="top"
                formatter={(value) => `${value}`}
                style={{ fill: "#333", fontSize: "12px" }}
                offset={2}
              />
            </Bar>
            <Bar
              dataKey="expenses"
              fill={COLORS[1]}
              name="Expenses"
              barSize={20}
            >
              <LabelList
                dataKey="expenses"
                position="top"
                formatter={(value) => `${value}`}
                style={{ fill: "#333", fontSize: "12px" }}
                offset={2}
              />
            </Bar>
            <Bar
              dataKey="payments"
              fill={COLORS[2]}
              name="Payments"
              barSize={20}
            >
              <LabelList
                dataKey="payments"
                position="top"
                formatter={(value) => `${value}`}
                style={{ fill: "#333", fontSize: "12px" }}
                offset={2}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardFinancesMonthlyPaymentsExpensesInvoicesModule;
