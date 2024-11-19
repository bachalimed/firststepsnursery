import React from 'react'
import DashboardStatsGrid from '../../Components/Shared/DashboardStatsGrid'
import PaymentPie from '../../Components/lib/PaymentPie'
import { Link, useLocation } from "react-router-dom";
import { MdOutlineBusinessCenter } from "react-icons/md";
import useAuth from "../../hooks/useAuth";
import AcademicYearsSelection from "../../Components/AcademicYearsSelection";

//   return (
//     <div className='flex flex-col gap-4'>
    
//       <DashboardStatsGrid />
//       <PaymentPie/>
      
//       </div>
//   )
// }


const Dashboard = () => {
  const location = useLocation();
  const Dashboard = {
    title: "Dashboard",
    icon: <MdOutlineBusinessCenter />,
    path: "/Dashboard",
    allowedRoles: [
      "Parent",
      "ContentManager",
      "Animator",
      "Academic",
      "Director",
      "Finance",
      "HR",
      "Desk",
      "Manager",
      "Admin",
    ],
  };


  // Define the tab data with paths and labels
  const tabs = [
    //{ label: 'New Assignment', path: '/academics/expenses/NewAnimatorsAssignmentForm' },
    { label: 'students', path: '/dashboard/studentsDash/' },
    { label: 'Admissions', path: '/dashboard/admissions/' },
    { label: 'enrolments', path: '/dashboard/enrolments/' },
    { label: 'Finances', path: '/dashboard/finances/' },
 
    
   
  ];
 // Function to determine if a tab is active based on the current path
 const isActive = (path) => location.pathname === path;

 // Render the component content
 return (
   <div className="flex bg-gray-300 p-1 items-center justify-start space-x-6">
     <AcademicYearsSelection />
       {tabs.map((tab) => (
       <Link key={tab.path} to={tab.path}>
           <li
          className={`list-none cursor-pointer px-4 py-2 border border-gray-400 rounded-md ${
            isActive(tab.path)
              ? "text-blue-500 border-blue-500 bg-blue-100"
              : "text-gray-800 hover:text-blue-500"
          }`}
           >
           {tab.label}
           </li>
       </Link>
       ))}
   </div>
   );
};
 

export default Dashboard;
