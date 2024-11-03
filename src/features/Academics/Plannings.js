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
    { label: 'By Sections', path: '/academics/plannings/sectionsPlannings' },
    { label: 'By Sites', path: "/academics/plannings/sitesPlannings" },
    { label: 'By Animators', path: "/academics/plannings/animatorsPlannings/" },
    { label: 'By Classrooms', path: "/academics/plannings/classroomsPlannings/" },
    { label: 'My Planning', path: "/academics/plannings/myPlanning/" },
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
           className={`list-none cursor-pointer ${
               isActive(tab.path) ? 'text-blue-500' : 'text-gray-800 hover:text-blue-500'
           }`}
           >
           {tab.label}
           </li>
       </Link>
       ))}
   </div>
   );
};
 

export default Plannings;
