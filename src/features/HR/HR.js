import {useLocation, Link } from 'react-router-dom'
import AcademicYearsSelection from '../../Components/AcademicYearsSelection'

//we will  find the object corresponding to the page and extract the section tabs
const HR = () => {
  const location = useLocation();

const employeesTabs= 
{title:"Employees",
  path:"/hr/employees/employeesList/",
  allowedRoles:["Employee","Animator", "Academic", "Director", "HR", "Desk", "Manager", "Admin"]
  }

  
    // Define the tab data with paths and labels
    const tabs = [
      { label: 'Employees', path: '/hr/employees/employeesList/' },
      { label: 'Leaves', path: '/hr/leaves/leavesList/' },
      { label: 'PaySlips', path: '/hr/payslips/payslipsList/' },
   
     // { label: 'New blbls', path: '/hr/employees/employeedddddds/' },
      
      ];
   // Function to determine if a tab is active based on the current path
   const isActive = (path) => location.pathname === path;

   // Render the component content
   return (
   <div className="flex bg-gray-300 p-1 px-4 md:px-8 items-center justify-start space-x-4">
     <AcademicYearsSelection />
       {tabs.map((tab) => (
       <Link key={tab.path} to={tab.path}>
           <li
           className={`list-none cursor-pointer px-4 py-2 border border-gray-400 rounded-md ${
            isActive(tab.path)
              ? "text-sky-700 border-sky-500 bg-blue-100"
              : "text-gray-800 hover:text-fuchsia-500 hover:border-fuchsia-500"
          }`}
           >
           {tab.label}
           </li>
       </Link>
       ))}
   </div>
   );
};


export default HR