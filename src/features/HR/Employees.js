import {useLocation, Link } from 'react-router-dom'
import AcademicYearsSelection from '../../Components/AcademicYearsSelection'

//we will  find the object corresponding to the page and extract the section tabs
const Employees = () => {
  const location = useLocation();

const employeesTabs= 
{title:"Employees",
  path:"/hr/employees/",
  allowedRoles:["Employee","Animator", "Academic", "Director", "HR", "Desk", "Manager", "Admin"]
  }

  
    // Define the tab data with paths and labels
    const tabs = [
      { label: 'Employees', path: '/hr/employees/' },
      { label: 'New Employee', path: '/hr/employees/newEmployee/' },
      { label: 'New blbls', path: '/hr/employeedddddds/' },
      
      ];
   // Function to determine if a tab is active based on the current path
   const isActive = (path) => location.pathname === path;

   // Render the component content
   return (
   <div className="flex bg-gray-300 p-1 items-center justify-start space-x-6">
       {tabs.map((tab) => (
       <Link key={tab.path} to={tab.path}>
           <li
           className={`list-none cursor-pointer ${
               isActive(tab.path) ? 'text-blue-500' : 'text-gray-800 hover:text-blue-500'
           }`}
           >
           {tab.label}
           </li>
       </Link>
       ))}
       <AcademicYearsSelection />
   </div>
   );
};


export default Employees