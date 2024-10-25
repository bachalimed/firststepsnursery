import { Link, useLocation } from "react-router-dom";
import { MdOutlineBusinessCenter } from "react-icons/md";
import AcademicYearsSelection from "../../Components/AcademicYearsSelection";
const Plannings = () => {
  const location = useLocation();
  const schoolPlanningsTabs = {
    title: "Sections Plannings",
    icon: <MdOutlineBusinessCenter />,
    path: "/academics/plannings",
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
    { label: 'bySites', path: "/academics/plannings/sitesPlannings" },
    { label: 'bySections', path: '/academics/plannings/sectionsPlannings' },
    { label: 'New blbls', path: "/academics/plannings/blablsa/" },
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
 

export default Plannings;
