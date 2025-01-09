import React from "react";
import firststeps from '../../Data/firststeps.png'

import { Link, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import AcademicYearsSelection from "../../Components/AcademicYearsSelection";

const Dashboard = () => {
  const location = useLocation();

  const {
    isEmployee,
    isParent,
    isContentManager,
    isAnimator,
    isAcademic,
    isFinance,
    isHR,
    isDesk,
    isDirector,
    isManager,
    isAdmin,
  } = useAuth();

  // Define the tab data with paths and labels
  const tabs = [
    //{ label: 'New Assignment', path: '/academics/expenses/NewAnimatorsAssignmentForm' },
    (isAcademic || isDirector || isManager || isAdmin) && {
      label: "Students",
      path: "/dashboard/studentsDash/",
    },
    (isFinance || isDirector || isManager || isAdmin) && {
      label: "Finances",
      path: "/dashboard/financesDash/",
    },
    // (isHR || isDirector || isManager || isAdmin) && {
    //   label: "HR",
    //   path: "/dashboard/hrDash/",
    // },
    // (isAcademic || isDirector || isManager || isAdmin) && {
    //   label: "Admissions",
    //   path: "/dashboard/admissions/",
    // },
    // (isFinance || isAcademic || isDirector || isManager || isAdmin) && {
    //   label: "enrolments",
    //   path: "/dashboard/enrolments/",
    // },
    
  ];
  // Function to determine if a tab is active based on the current path
  const isActive = (path) => location.pathname === path;

  // Render the component content
  return (
    <>
    <div className="flex bg-gray-300 p-3 px-4 md:px-4 items-center justify-start space-x-4">
      {(isAdmin || isManager || isDirector) && <AcademicYearsSelection />}
      {tabs
        .filter(Boolean) // Filter out null or undefined tabs
        .map((tab) => (
          <Link key={tab.path} to={tab.path}>
            <li
              className={`list-none cursor-pointer px-3 py-2 border border-gray-400  ${
                isActive(tab.path)
                  ? "text-sky-700 border-sky-700 bg-gray-100"
                  : "text-gray-800 hover:text-fuchsia-500 hover:border-fuchsia-500"
              }`}
            >
              {tab.label}
            </li>
          </Link>
        ))}
    </div>
    {location.pathname === "/dashboard/" &&
    <div className="flex justify-center items-center bg-gray-300 py-4">
      <img
            src={firststeps}
            className=" rounded "
            alt="first steps nursery logo"
            
          />
    </div>}
    </>
  );
};

export default Dashboard;
