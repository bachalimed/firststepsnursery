
import React from "react";
import { PiStudent } from "react-icons/pi";
import { useStudentsStats } from "../../../../hooks/useStudentsStats";
import { useSelector } from "react-redux";

import {
  PieChart,
  Pie,
  Cell,
  Legend,
  LabelList,
  ResponsiveContainer,
} from "recharts";

const DashboardStudentsPerSchoolModule = () => {

  const { studentsStats } = useStudentsStats();

  // Destructure the required stats from studentsStats
  const {
    studentsMatchingAcademicYear = 0,
    inactiveStudentsCount = 0,
    studentsWithAdmission = 0,
    studentGrades = {},
    studentSchools={},
  } = studentsStats;

  const COLORS = [
    "#020344",
    "#08215c",
    "#0f3f74",
    "#155e8d",
    "#1b7ca5",
    "#229abd",
    "#28b8d5",
    "#34b8d5",
  ];

  // Convert the studentGrades object into an array of objects for Pie chart
  const schoolsArray = Object.keys(studentSchools).map((key) => ({
    name: `${key}`,
    value: studentSchools[key],
  }));

  return (
    <div className="bg-gray-100 rounded-sm p-3 flex-1 border border-gray-300 flex items-center">
      <div className="pl-4 w-full h-full" style={{ minHeight: "300px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={schoolsArray}
              cx="50%" // Center the pie chart
              cy="50%" // Center the pie chart
              innerRadius={50}
              outerRadius={70}
              
              fill="#8884d8"
              paddingAngle={4}
              dataKey="value"
               stroke="none" // Remove the border color by setting stroke to none
            >
              {schoolsArray.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
              {/* Add labels to each slice using LabelList */}
              <LabelList
                dataKey="value" // Show the value of each slice
                position="left" // Position label at the center of each slice
                fill="#ffffff" // Label text color
                fontSize={16} // Label font size
              />
            </Pie>
            {/* Add Legend */}
            <Legend
              layout="horizontal"
              align="center"
              verticalAlign="top"
              iconType="circle"
              iconSize={10}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardStudentsPerSchoolModule;
