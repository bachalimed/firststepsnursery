import { Link, useLocation } from "react-router-dom";
import { LuSchool } from "react-icons/lu";
import AcademicYearsSelection from "../../Components/AcademicYearsSelection";
const NurseryPlannings = () => {
  const location = useLocation();
  const NurseryPlanningsTabs = {
    title: "Nursery Plannings",
    icon: <LuSchool />,
    path: "/academics/nurseryPlannings",
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
    { label: 'Nursery Sections', path: "/academics/nurseryPlanning/nurserySections" },
    { label: 'Nursery Planning', path: '/academics/nurseryPlanning/' },
    { label: 'New blbls', path: "/academics/schoolPlanning/" },
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
 
export default NurseryPlannings;
