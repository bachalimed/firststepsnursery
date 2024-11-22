
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

const DashboardStudentsPerGradeModule = () => {

  const { studentsStats } = useStudentsStats();

  // Destructure the required stats from studentsStats
  const {
    studentsMatchingAcademicYear = 0,
    inactiveStudentsCount = 0,
    studentsWithAdmission = 0,
    studentGrades = {},
  } = studentsStats;

  const COLORS = ["#ffed57",
    "#ffc100",
    "#ff9a00",
    "#ff7400",
    "#ff4d00",
    "#ff3d00",
    "#ff0000",
    
    "#ffc658",
    "#fcc658",
  ];

  // Convert the studentGrades object into an array of objects for Pie chart
  const gradesArray = Object.keys(studentGrades).map((key) => ({
    name: `Grade ${key}`,
    value: studentGrades[key],
  }));

  return (
    <div className="bg-gray-100 rounded-sm p-3 flex-1 border border-gray-300 flex items-center">
      <div className="pl-4 w-full h-full" style={{ minHeight: "300px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={gradesArray}
              cx="50%" // Center the pie chart
              cy="50%" // Center the pie chart
              innerRadius={50}
              outerRadius={70}
              
              fill="#8884d8"
              paddingAngle={4}
              dataKey="value"
              stroke="none" // Remove the border color by setting stroke to none
            >
              {gradesArray.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
              {/* Add labels to each slice using LabelList */}
              <LabelList
                dataKey="value" // Show the value of each slice
                position="inside" // Position label at the center of each slice
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

export default DashboardStudentsPerGradeModule;
