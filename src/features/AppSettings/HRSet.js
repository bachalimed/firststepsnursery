import { Link, useLocation } from "react-router-dom";
import AcademicYearsSelection from "../../Components/AcademicYearsSelection";

const HRSet = () => {
  const location = useLocation();

  const hRSetTabs = {
    title: "HR",
    path: "/settings/HRSet",
    allowedRoles: [
      "Employee",
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

  
  // Define the tabs with their titles and paths
  const tabs = [
    {
      title: "Employee Documents List",
      path: "/settings/HRSet/EmployeeDocumentsListsList",
    },
    //{ title: " Sectionjhgfhg", path: "/settings/HRSett/" },
    //{ title: "Otherkjhhj", path: "/settings/HRSet/" },
  ];

  // Function to determine if the tab is active based on the current path
  const isActive = (path) => location.pathname === path;

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
            {tab.title}
          </li>
        </Link>
      ))}
    </div>
  );
};

export default HRSet;
