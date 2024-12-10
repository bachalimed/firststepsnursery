import { Link , useLocation} from "react-router-dom";
import { CiViewList } from "react-icons/ci";
import AcademicYearsSelection from "../../Components/AcademicYearsSelection";
const Sections = () => {
  const location = useLocation();
  const sectionsTabs = {
    title: "Sections",
    icon: <CiViewList />,
    path: "/academics/schoolPlannings",
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
    { label: 'Sections', path: "/academics/sections/nurserySectionsList/" },
    //{ label: 'New Nursery Section ', path: '/academics/sections/newSection/' },
    { label: 'Assignment', path: '/academics/plannings/animatorsAssignments/' },
    { label: 'Planning', path: '/academics/plannings/sectionsPlannings/' },
    { label: 'Sites', path: "/academics/plannings/sitesPlannings/" },
    { label: 'Animators', path: "/academics/plannings/animatorsPlannings/" },
    { label: 'Classrooms', path: "/academics/plannings/classroomsPlannings/" },
    { label: 'My Planning', path: "/academics/plannings/myPlanning/" },
    { label: 'Sections By Schools', path: "/academics/sections/schoolSectionsList/" },
    
  ];
  // Function to determine if a tab is active based on the current path
  const isActive = (path) => location.pathname === path;

  // Render the component content
  return (
    <div className="flex bg-gray-300 p-3 px-4 md:px-4 items-center justify-start space-x-4">
      <AcademicYearsSelection />
        {tabs.map((tab) => (
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
    );
 };
  


export default Sections;
