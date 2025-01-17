//example of stats for the dashbordm should be replaced by DB imports

import React from "react";
import { PiStudent } from "react-icons/pi";
import { useStudentsStats } from "../../../../hooks/useStudentsStats";
import { useSelector } from "react-redux";
import { IoFileTrayStackedOutline, IoSchoolOutline } from "react-icons/io5";

const DashboardStudentsAdmissionNumberModule = () => {

  const { studentsStats } = useStudentsStats();

  // Destructure the required stats from studentsStats
  const {
    studentsMatchingAcademicYear = 0,
    inactiveStudentsCount = 0,
    studentsWithAdmission = 0,
    activeStudentsWithAdmission=0,
    registeredStudents=0,
    studentGrades = {},
  } = studentsStats;
 
  
  return (
  
    <div
      
      className="bg-gray-100 rounded-sm p-3 flex-1 border border-gray-300 flex items-center "
    >
      <div className="rounded-full h-12 w-12 flex items-center justify-center bg-sky-200">
        <IoFileTrayStackedOutline className="text-2xl" />
      </div>
      <div className="pl-4">
        <span className="text-sm text-gray-800 font-light">
          {" "}
          Active/Inactive  Students' Admissions
        </span>
        <div className="flex items-center">
          <strong className="text-xl text-gray-700 font-semi-bold">
            {" "}
            {activeStudentsWithAdmission}/
            {Number(studentsWithAdmission)-Number(activeStudentsWithAdmission)}{" "}
          </strong>
          <span className="pl-2 text-sm text-red-600">
          +{registeredStudents} Regisered with no admission{" "}
          </span>
        </div>
      </div>
    </div>
   
   
  );
};

export default DashboardStudentsAdmissionNumberModule;
