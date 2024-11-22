

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

const DashboardStudentsPerFamilyModule = () => {
  const { familiesStats, selectedAcademicYear } = useStudentsStats();

  // Destructure the required stats from studentsStats
  const { familiesChildren={},                
    familySituationCount={},            
    familiesWithStudentsInYear=""
    
   
  } = familiesStats;
console.log(familiesStats,'familiesStats')


  const COLORS = [
    "#2feaa8",
    "#20cbc1",
    "#11abda",
    "#0a9ce7",
    "#028cf3",
  
  ];


  
  // Convert the studentGrades object into an array of objects for Pie chart
  const familiesArray = Object.keys(familiesChildren).map((key) => ({
    name: `${key}`,
    value: familiesChildren[key],
  }));

  return (
    <div className="bg-gray-100 rounded-sm p-3 flex-1 border border-gray-300 flex items-center">
    <div className="pl-4 w-full h-full" style={{ minHeight: "300px" }}>
      <ResponsiveContainer width="100%" height="100%">
      <PieChart>
            <Pie
              data={familiesArray}
             
              cx="50%" // Center the pie chart
              cy="50%" // Center the pie chart
              innerRadius={50}
              outerRadius={70}
              
              fill="#8884d8"
              paddingAngle={4}
              dataKey="value"
               stroke="none" // Remove the border color by setting stroke to none
            >
              {familiesArray.map((entry, index) => (
                <Cell
                  key={`cell-${index} `}
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
              layout="vertical"
              align="center"
              verticalAlign="top"
              iconType="circle"
              iconSize={14}
            />
          </PieChart>
          
        </ResponsiveContainer>
      
      
      </div>
     {/* Title below the pie chart */}
    
      
     {`children per family: ${selectedAcademicYear?.title} `}
    </div>
  );
};

export default DashboardStudentsPerFamilyModule;
