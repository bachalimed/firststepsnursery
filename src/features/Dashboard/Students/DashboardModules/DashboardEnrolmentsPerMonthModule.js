import React from "react";
import { useStudentsStats } from "../../../../hooks/useStudentsStats";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';

const DashboardEnrolmentsPerMonthModule = () => {
  const { enrolmentsStats } = useStudentsStats();

  // Destructure the required stats from enrolmentsStats
  const {
    monthlyStats = [], // Default to empty array if no data is available
  } = enrolmentsStats;

  // Collect all unique service types across all months
  const serviceTypes = Array.from(
    new Set(monthlyStats.flatMap((stat) => Object.keys(stat.serviceTypes)))
  );

  // Process data for the chart
  const chartData = monthlyStats.map((stat) => {
    // Create an object for each month containing the month, service types, and trends
    const serviceData = serviceTypes.reduce((acc, type) => {
      // If the service type exists for this month, use its value, otherwise set it to 0
      acc[type] = stat.serviceTypes[type] || 0;
      // Add the trend for each service type, if available
      acc[`${type}Trend`] = stat.serviceTypeTrends[type] || 0;
      return acc;
    }, {});

    return {
      month: stat.month,
      ...serviceData,
    };
  });

  // Define colors for each service type dynamically
  const COLORS = [
    "#f94144",
    "#3d0066",
    "#219ebc",
    "#ffb703",
    "#fb8500",
    "#8ecae6",
    "#023047",
  ];

  return (
    <div className="bg-gray-100 rounded-sm p-3 flex-1 border border-gray-300 flex items-center">
      <div className="pl-4 w-full h-full" style={{ minHeight: "300px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={chartData}
            margin={{
              top: 30, // Increased margin at the top for better visibility of labels
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

            {/* Render Bars for each service type dynamically */}
            {serviceTypes.map((type, index) => (
              <Bar
                key={type}
                dataKey={type}
                fill={COLORS[index % COLORS.length]}
                barSize={30} // Adjust bar size for better visual clarity
              >
                {/* Display the trend percentage above each bar */}
                <LabelList
                  dataKey={`${type}Trend`}
                  position="top"
                  formatter={(value) => `${value}%`}
                  style={{ fill: "#333" }} // Customize label style
                  offset={2} // Adjust the vertical offset of the trend label
                />
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardEnrolmentsPerMonthModule;
