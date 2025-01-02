import { Link, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import AcademicYearsSelection from "../../Components/AcademicYearsSelection";
const Sections = () => {
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
    (isAcademic || isDirector || isManager || isAdmin) && {
      label: "Sections",
      path: "/academics/sections/nurserySectionsList/",
    },
    //{ label: 'New Nursery Section ', path: '/academics/sections/newSection/' },
    (isAnimator || isDirector || isManager || isAdmin) && {
      label: "Assignment",
      path: "/academics/plannings/animatorsAssignments/",
    },
    (isAnimator || isAcademic || isDirector || isManager || isAdmin) && {
      label: "Planning",
      path: "/academics/plannings/sectionsPlannings/",
    },
    (isAnimator || isAcademic || isDirector || isManager || isAdmin) && {
      label: "Sites",
      path: "/academics/plannings/sitesPlannings/",
    },
    (isAnimator || isAcademic || isDirector || isManager || isAdmin) && {
      label: "Animators",
      path: "/academics/plannings/animatorsPlannings/",
    },
    (isAnimator || isAcademic || isDirector || isManager || isAdmin) && {
      label: "Classrooms",
      path: "/academics/plannings/classroomsPlannings/",
    },
    (isAnimator || isAcademic || isDirector || isManager || isAdmin) && {
      label: "My Planning",
      path: "/academics/plannings/myPlanning/",
    },
    (isAnimator || isAcademic || isDirector || isManager || isAdmin) && {
      label: "Sections By Schools",
      path: "/academics/sections/schoolSectionsList/",
    },
  ];
  // Function to determine if a tab is active based on the current path
  const isActive = (path) => location.pathname === path;

  // Render the component content
  return (
    <div className="flex bg-gray-300 p-3 px-4 md:px-4 items-center justify-start space-x-4 flex-wrap">
      {/* {(isAdmin || isManager || isDirector) && <AcademicYearsSelection />} */}
      <AcademicYearsSelection />
      <ul className="flex flex-wrap gap-4 sm:gap-x-4 sm:gap-y-0 w-full sm:w-auto ">
        {tabs
          .filter(Boolean) // Filter out null or undefined tabs
          .map((tab) => (
            <Link key={tab.path} to={tab.path}>
              <li
                className={`list-none cursor-pointer px-3 py-2 border border-gray-400  ${
                  isActive(tab.path)
                    ? "text-sky-700 border-sky-700 bg-gray-100"
                    : "text-gray-800 hover:bg-gray-100"
                }`}
              >
                {tab.label}
              </li>
            </Link>
          ))}
      </ul>
    </div>
  );
};

export default Sections;
