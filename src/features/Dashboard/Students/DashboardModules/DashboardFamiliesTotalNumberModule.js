//example of stats for the dashbordm should be replaced by DB imports

import React from "react";
import { PiStudent } from "react-icons/pi";
import { useStudentsStats } from "../../../../hooks/useStudentsStats";
import { useSelector } from "react-redux";
import { RiParentLine } from "react-icons/ri";

const DashboardFamiliesTotalNumberModule = () => {
  const { familiesStats } = useStudentsStats();

  // Destructure the required stats from studentsStats
  const {
    familiesChildren,
    familySituationCount,
    familiesWithStudentsInYear,
    familiesWithActiveStudentsInYear,
  } = familiesStats;
  //console.log(familiesStats,'familiesStats')

  return (
    <div
      div
      className="bg-gray-100 rounded-sm p-3 flex-1 border border-gray-300 flex items-center "
    >
      <div className="rounded-full h-12 w-12 flex items-center justify-center bg-sky-200">
        <RiParentLine className="text-2xl" />
      </div>
      <div className="pl-4">
        <span className="text-sm text-gray-800 font-light">
          {" "}
          Families with active/inactive students
        </span>
        <div className="flex items-center">
          <strong className="text-xl text-gray-900 font-semi-bold">
            {" "}
            {familiesWithActiveStudentsInYear}/
            {Number(familiesWithStudentsInYear)-Number(familiesWithActiveStudentsInYear)}
          </strong>
          <span className="pl-2 text-sm text-red-600">
            ({familySituationCount?.Joint} Joint,{" "}
          </span>
          <span className="pl-2 text-sm text-red-600">
            {familySituationCount?.Separated} Separated,{" "}
          </span>
          <span className="pl-2 text-sm text-red-600">
            {familySituationCount?.Orphan} Orphan)
          </span>
        </div>
      </div>
    </div>
  );
};

export default DashboardFamiliesTotalNumberModule;
