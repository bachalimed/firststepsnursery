import { Link, useLocation } from "react-router-dom";
import AcademicYearsSelection from "../../Components/AcademicYearsSelection";
import useAuth from "../../hooks/useAuth";
const StudentsSet = () => {
  const location = useLocation();
  const { isEmployee ,isParent,isContentManager,isAnimator,isAcademic,isFinance,isHR,isDesk , isDirector ,isManager , isAdmin  } = useAuth();
 
  // Define the tabs with their titles and paths
  const tabs = [
    (  isDirector||isManager || isAdmin) &&{
      title: "Student Documents List",
      path: "/settings/studentsSet/studentDocumentsListsList/",
    },
    ( isFinance|| isDirector||isManager || isAdmin) &&{ title: "Services", path: "/settings/studentsSet/services" },
   // { title: "Otherkjhhj", path: "/settings/studentsSet/" },
  ];

  // Function to determine if the tab is active based on the current path
  const isActive = (path) => location.pathname === path;


  return (
    <div className="flex bg-gray-300 p-3 px-4 md:px-4 items-center justify-start space-x-4">
      <AcademicYearsSelection style={{ display: isDirector || isManager || isAdmin ? 'block' : 'none' }} />
      {tabs.filter(Boolean) // Filter out null or undefined tabs
      .map((tab) => (
        <Link key={tab.path} to={tab.path}>
          <li
            className={`list-none cursor-pointer px-3 py-2 border border-gray-400  ${
              isActive(tab.path)
                ? "text-sky-700 border-sky-700 bg-gray-100"
                : "text-gray-800 hover:text-fuchsia-500 hover:border-fuchsia-500"
            }`}
          >
            {tab.title}
          </li>
        </Link>
      ))}
    </div>
  );
};

export default StudentsSet;
